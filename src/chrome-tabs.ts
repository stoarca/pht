import Draggabilly from "draggabilly";
import { tabSvg, newTabSvg, noFaviconSvg } from './svgs';

const TAB_CONTENT_MARGIN = 9;
const TAB_CONTENT_OVERLAP_DISTANCE = 1;

const TAB_OVERLAP_DISTANCE =
  TAB_CONTENT_MARGIN * 2 + TAB_CONTENT_OVERLAP_DISTANCE;

const TAB_CONTENT_MIN_WIDTH = 24;
const TAB_CONTENT_MAX_WIDTH = 240;

const TAB_SIZE_SMALL = 84;
const TAB_SIZE_SMALLER = 60;
const TAB_SIZE_MINI = 48;
const TAB_NEW_BUTTON_AREA = 90;

const noop = (_: any) => {};

const closest = (value: number, array: number[]) => {
  let closest = Infinity;
  let closestIndex = -1;

  array.forEach((v, i) => {
    if (Math.abs(value - v) < closest) {
      closest = Math.abs(value - v);
      closestIndex = i;
    }
  });

  return closestIndex;
};

const tabTemplate = `
<div class="chrome-tab">
  <div class="chrome-tab-dividers"></div>
  <div class="chrome-tab-background">
    ${tabSvg}
  </div>
  <div class="chrome-tab-content">
    <div class="chrome-tab-favicon"></div>
    <div class="chrome-tab-title"></div>
    <div class="chrome-tab-drag-handle"></div>
    <div class="chrome-tab-close"></div>
  </div>
</div>
`;

const newTabButtonTemplate = `
<div class="new-tab-button-wrapper">
  <button class="new-tab-button">
    ${newTabSvg}
  </button>
</div>
`;

const noFaviconSvgUrl = 'data:image/svg+xml;base64,' + btoa(noFaviconSvg);

const defaultTabProperties = {
  title: "New tab",
  favicon: false,
};

export type TabProperties = typeof defaultTabProperties & {
  id: string;
  active?: boolean;
  favicon?: boolean | string;
};

let instanceId = 0;

class ChromeTabs {
  el!: HTMLElement;
  styleEl!: HTMLStyleElement;
  instanceId?: number;
  draggabillies: Draggabilly[];
  isDragging: any;
  draggabillyDragging: any;

  constructor() {
    this.draggabillies = [];
  }

  init(el: HTMLElement) {
    this.el = el;

    this.instanceId = instanceId;
    this.el.setAttribute("data-chrome-tabs-instance-id", this.instanceId + "");
    instanceId += 1;

    this.setupCustomProperties();
    this.setupStyleEl();
    this.setupEvents();
    this.layoutTabs();
    this.setupNewTabButton();
    this.setupDraggabilly();
  }

  emit(eventName: string, data: any) {
    this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  setupCustomProperties() {
    this.el.style.setProperty(
      "--tab-content-margin",
      `${TAB_CONTENT_MARGIN}px`
    );
  }

  setupStyleEl() {
    this.styleEl = document.createElement("style");
    this.el.appendChild(this.styleEl);
  }

  setupEvents() {
    window.addEventListener("resize", (_) => {
      this.cleanUpPreviouslyDraggedTabs();
      this.layoutTabs();
    });

    this.el.addEventListener("click", (event) => {
      let target = <HTMLElement> event.target;
      if (target.classList.contains("new-tab-button"))
        this.addTab()
    })

    this.tabEls.forEach((tabEl) => this.setTabCloseEventListener(tabEl));
  }

  get tabEls() {
    return Array.prototype.slice.call(this.el.querySelectorAll(".chrome-tab"));
  }

  get tabContentEl() {
    return <HTMLElement> this.el.querySelector(".chrome-tabs-content")!;
  }

  get tabContentWidths() {
    const numberOfTabs = this.tabEls.length;
    const tabsContentWidth = this.el!.clientWidth - TAB_NEW_BUTTON_AREA;
    const tabsCumulativeOverlappedWidth =
      (numberOfTabs - 1) * TAB_CONTENT_OVERLAP_DISTANCE;
    const targetWidth =
      (tabsContentWidth -
        2 * TAB_CONTENT_MARGIN +
        tabsCumulativeOverlappedWidth) /
      numberOfTabs;
    const clampedTargetWidth = Math.max(
      TAB_CONTENT_MIN_WIDTH,
      Math.min(TAB_CONTENT_MAX_WIDTH, targetWidth)
    );
    const flooredClampedTargetWidth = Math.floor(clampedTargetWidth);
    const totalTabsWidthUsingTarget =
      flooredClampedTargetWidth * numberOfTabs +
      2 * TAB_CONTENT_MARGIN -
      tabsCumulativeOverlappedWidth;
    const totalExtraWidthDueToFlooring =
      tabsContentWidth - totalTabsWidthUsingTarget;

    // TODO - Support tabs with different widths / e.g. "pinned" tabs
    const widths: number[] = [];
    let extraWidthRemaining = totalExtraWidthDueToFlooring;
    for (let i = 0; i < numberOfTabs; i += 1) {
      const extraWidth =
        flooredClampedTargetWidth < TAB_CONTENT_MAX_WIDTH &&
        extraWidthRemaining > 0
          ? 1
          : 0;
      widths.push(flooredClampedTargetWidth + extraWidth);
      if (extraWidthRemaining > 0) extraWidthRemaining -= 1;
    }

    return widths;
  }

  get tabContentPositions() {
    const positions: number[] = [];
    const tabContentWidths = this.tabContentWidths;

    let position = TAB_CONTENT_MARGIN;
    tabContentWidths.forEach((width, i) => {
      const offset = i * TAB_CONTENT_OVERLAP_DISTANCE;
      positions.push(position - offset);
      position += width;
    });

    return positions;
  }

  get tabPositions() {
    const positions: number[] = [];

    this.tabContentPositions.forEach((contentPosition) => {
      positions.push(contentPosition - TAB_CONTENT_MARGIN);
    });

    return positions;
  }

  layoutTabs() {
    const tabContentWidths = this.tabContentWidths;
    let tabsLen = this.tabEls.length

    this.tabEls.forEach((tabEl, i) => {
      const contentWidth = tabContentWidths[i];
      const width = contentWidth + 2 * TAB_CONTENT_MARGIN;

      tabEl.style.width = width + "px";
      tabEl.removeAttribute("is-small");
      tabEl.removeAttribute("is-smaller");
      tabEl.removeAttribute("is-mini");

      if (contentWidth < TAB_SIZE_SMALL) tabEl.setAttribute("is-small", "");
      if (contentWidth < TAB_SIZE_SMALLER) tabEl.setAttribute("is-smaller", "");
      if (contentWidth < TAB_SIZE_MINI) tabEl.setAttribute("is-mini", "");
    });

    let styleHTML = "";
    this.tabPositions.forEach((position, i) => {
      styleHTML += `
            .chrome-tabs[data-chrome-tabs-instance-id="${
              this.instanceId
            }"] .chrome-tab:nth-child(${i + 1}) {
              transform: translate3d(${position}px, 0, 0)
            }
          `;
    });
    this.styleEl.innerHTML = styleHTML;

    if (this.el.offsetWidth - this.tabContentEl.offsetWidth >
        TAB_NEW_BUTTON_AREA + (TAB_CONTENT_MARGIN / 2) || tabsLen < 5) {
      this.tabContentEl.style.width = `${
          (this.tabEls[0] ? this.tabEls[0].offsetWidth * tabsLen : 0) -
          (tabsLen > 0 ? ((tabsLen * TAB_CONTENT_MARGIN * 2) - TAB_CONTENT_MIN_WIDTH + TAB_CONTENT_MARGIN) : 0) 
        }px`;
      this.tabContentEl.nextElementSibling?.classList.remove('overflow-shadow');
    } else {
      this.tabContentEl.nextElementSibling?.classList.add('overflow-shadow');
    }
  }

  createNewTabEl() {
    const div = document.createElement("div");
    div.innerHTML = tabTemplate;
    return div.firstElementChild;
  }

  addTab(
    tabProperties?: TabProperties,
    { animate = true, background = false } = {}
  ) {
    const tabEl = this.createNewTabEl() as HTMLElement;
    tabEl.oncontextmenu = (event) => {
      this.emit("contextmenu", { tabEl, event });
    };
    if (animate) {
      tabEl.classList.add("chrome-tab-was-just-added");
      setTimeout(
        () => tabEl.classList.remove("chrome-tab-was-just-added"),
        500
      );
    }

    tabProperties = Object.assign({}, defaultTabProperties, tabProperties);
    this.tabContentEl.appendChild(tabEl);
    this.setTabCloseEventListener(tabEl);
    this.updateTab(tabEl, tabProperties);
    this.emit("tabAdd", { tabEl });
    if (!background) this.setCurrentTab(tabEl);
    this.cleanUpPreviouslyDraggedTabs();
    this.layoutTabs();
    this.setupDraggabilly();
    return tabEl;
  }

  setTabCloseEventListener(tabEl: HTMLElement) {
    tabEl.querySelector(".chrome-tab-close")!.addEventListener("click", (_) => {
      _.stopImmediatePropagation();
      this.removeTab(tabEl);
      this.emit("tabClose", { tabEl });
    });
  }

  get activeTabEl() {
    return this.el.querySelector(".chrome-tab[active]");
  }

  hasActiveTab() {
    return !!this.activeTabEl;
  }

  setCurrentTab(tabEl: HTMLElement) {
    const activeTabEl = this.activeTabEl;
    if (activeTabEl === tabEl) return;
    if (activeTabEl) activeTabEl.removeAttribute("active");
    tabEl.setAttribute("active", "");
    this.emit("activeTabChange", { tabEl });
  }

  removeTab(tabEl: HTMLElement) {
    if (tabEl === this.activeTabEl) {
      if (tabEl.nextElementSibling) {
        this.setCurrentTab(tabEl.nextElementSibling as HTMLElement);
      } else if (tabEl.previousElementSibling) {
        this.setCurrentTab(tabEl.previousElementSibling as HTMLElement);
      }
    }
    tabEl.parentNode!.removeChild(tabEl);
    this.emit("tabRemove", { tabEl });
    this.cleanUpPreviouslyDraggedTabs();
    this.layoutTabs();
    this.setupDraggabilly();
  }

  updateTab(tabEl: HTMLElement, tabProperties: TabProperties) {
    tabEl.querySelector(".chrome-tab-title")!.textContent = tabProperties.title;

    const faviconEl = tabEl.querySelector(".chrome-tab-favicon") as HTMLElement;
    if (tabProperties.favicon) {
      faviconEl!.style!.backgroundImage = `url('${tabProperties.favicon}')`;
      faviconEl?.removeAttribute("hidden");
    } else {
      faviconEl!.style!.backgroundImage = `url('${noFaviconSvgUrl}')`;
      faviconEl?.removeAttribute("hidden");
    }

    if (tabProperties.id) {
      tabEl.setAttribute("data-tab-id", tabProperties.id);
    }
  }

  cleanUpPreviouslyDraggedTabs() {
    this.tabEls.forEach((tabEl) =>
      tabEl.classList.remove("chrome-tab-was-just-dragged")
    );
  }

  setupDraggabilly() {
    const tabEls = this.tabEls;
    const tabPositions = this.tabPositions;

    if (this.isDragging) {
      this.isDragging = false;
      this.el.classList.remove("chrome-tabs-is-sorting");
      this.draggabillyDragging.element.classList.remove(
        "chrome-tab-is-dragging"
      );
      this.draggabillyDragging.element.style.transform = "";
      this.draggabillyDragging.dragEnd();
      this.draggabillyDragging.isDragging = false;
      // Prevent Draggabilly from updating tabEl.style.transform in later frames
      this.draggabillyDragging.positionDrag = noop;
      this.draggabillyDragging.destroy();
      this.draggabillyDragging = null;
    }

    this.draggabillies.forEach((d) => d.destroy());

    tabEls.forEach((tabEl, originalIndex) => {
      const originalTabPositionX = tabPositions[originalIndex];
      const draggabilly = new Draggabilly(tabEl, {
        axis: "x",
        handle: ".chrome-tab-drag-handle",
        containment: this.tabContentEl,
      });

      this.draggabillies.push(draggabilly);

      draggabilly.on("pointerDown", (_) => {
        this.setCurrentTab(tabEl);
        this.emit("tabClick", { tabEl });
      });

      draggabilly.on("dragStart", (_) => {
        this.isDragging = true;
        this.draggabillyDragging = draggabilly;
        tabEl.classList.add("chrome-tab-is-dragging");
        this.el.classList.add("chrome-tabs-is-sorting");
        this.emit("dragStart", {});
      });

      draggabilly.on("dragEnd", (_) => {
        this.isDragging = false;
        const finalTranslateX = parseFloat(tabEl.style.left);
        tabEl.style.transform = `translate3d(0, 0, 0)`;
        this.emit("dragEnd", {});

        // Animate dragged tab back into its place
        requestAnimationFrame((_) => {
          tabEl.style.left = "0";
          tabEl.style.transform = `translate3d(${finalTranslateX}px, 0, 0)`;

          requestAnimationFrame((_) => {
            tabEl.classList.remove("chrome-tab-is-dragging");
            this.el.classList.remove("chrome-tabs-is-sorting");

            tabEl.classList.add("chrome-tab-was-just-dragged");

            requestAnimationFrame((_) => {
              tabEl.style.transform = "";

              this.layoutTabs();
              this.setupDraggabilly();
            });
          });
        });
      });

      draggabilly.on("dragMove", (event, pointer, moveVector) => {
        // Current index be computed within the event since it can change during the dragMove
        const tabEls = this.tabEls;
        const currentIndex = tabEls.indexOf(tabEl);

        const currentTabPositionX = originalTabPositionX + moveVector.x;
        const destinationIndexTarget = closest(
          currentTabPositionX,
          tabPositions
        );
        const destinationIndex = Math.max(
          0,
          Math.min(tabEls.length, destinationIndexTarget)
        );

        if (currentIndex !== destinationIndex) {
          this.animateTabMove(tabEl, currentIndex, destinationIndex);
        }
      });
    });
  }

  animateTabMove(
    tabEl: HTMLElement,
    originIndex: number,
    destinationIndex: number
  ) {
    if (destinationIndex < originIndex) {
      tabEl!.parentNode!.insertBefore(tabEl, this.tabEls[destinationIndex]);
    } else {
      tabEl!.parentNode!.insertBefore(tabEl, this.tabEls[destinationIndex + 1]);
    }
    this.emit("tabReorder", { tabEl, originIndex, destinationIndex });
    this.layoutTabs();
  }

  setupNewTabButton() {
    this.tabContentEl.insertAdjacentHTML('afterend', newTabButtonTemplate)
    this.layoutTabs()
  }
}

export default ChromeTabs;
