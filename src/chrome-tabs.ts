import Draggabilly from "draggabilly";

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
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36"><path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"/></symbol><symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36"><use xlink:href="#chrome-tab-geometry-left"/></symbol><clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0"/></clipPath></defs><svg width="52%" height="100%"><use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry"/></svg><g transform="scale(-1, 1)"><svg width="52%" height="100%" x="-100%" y="0"><use xlink:href="#chrome-tab-geometry-right" width="214" height="36" class="chrome-tab-geometry"/></svg></g></svg>
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
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect x="2" y="11" width="20" height="2"/>
        <rect x="11" y="2" width="2" height="20"/>
      </svg>
    </button>
  </div>
  `;

const noFaviconLocalUrl = 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" fill="#888888" viewBox="0 0 24 24"><path d="M13.144 8.171c-.035-.066.342-.102.409-.102.074.009-.196.452-.409.102zm-2.152-3.072l.108-.031c.064.055-.072.095-.051.136.086.155.021.248.008.332-.014.085-.104.048-.149.093-.053.066.258.075.262.085.011.033-.375.089-.304.171.096.136.824-.195.708-.176.225-.113.029-.125-.097-.19-.043-.215-.079-.547-.213-.68l.088-.102c-.206-.299-.36.362-.36.362zm13.008 6.901c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12s5.372-12 12-12c6.627 0 12 5.373 12 12zm-8.31-5.371c-.006-.146-.19-.284-.382-.031-.135.174-.111.439-.184.557-.104.175.567.339.567.174.025-.277.732-.063.87-.025.248.069.643-.226.211-.381-.355-.13-.542-.269-.574-.523 0 0 .188-.176.106-.166-.218.027-.614.786-.614.395zm6.296 5.371c0-1.035-.177-2.08-.357-2.632-.058-.174-.189-.312-.359-.378-.256-.1-1.337.597-1.5.254-.107-.229-.324.146-.572.008-.12-.066-.454-.515-.605-.46-.309.111.474.964.688 1.076.201-.152.852-.465.992-.038.268.804-.737 1.685-1.251 2.149-.768.694-.624-.449-1.147-.852-.275-.211-.272-.66-.55-.815-.124-.07-.693-.725-.688-.813l-.017.166c-.094.071-.294-.268-.315-.321 0 .295.48.765.639 1.001.271.405.416.995.748 1.326.178.178.858.914 1.035.898.193-.017.803-.458.911-.433.644.152-1.516 3.205-1.721 3.583-.169.317.138 1.101.113 1.476-.029.433-.37.573-.693.809-.346.253-.265.745-.556.925-.517.318-.889 1.353-1.623 1.348-.216-.001-1.14.36-1.261.007-.094-.256-.22-.45-.353-.703-.13-.248-.015-.505-.173-.724-.109-.152-.475-.497-.508-.677-.002-.155.117-.626.28-.708.229-.117.044-.458.016-.656-.048-.354-.267-.646-.53-.851-.389-.299-.188-.537-.097-.964 0-.204-.124-.472-.398-.392-.564.164-.393-.44-.804-.413-.296.021-.538.209-.813.292-.346.104-.7-.082-1.042-.125-1.407-.178-1.866-1.786-1.499-2.946.037-.19-.114-.542-.048-.689.158-.352.48-.747.762-1.014.158-.15.361-.112.547-.229.287-.181.291-.553.572-.781.4-.325.946-.318 1.468-.388.278-.037 1.336-.266 1.503-.06 0 .038.191.604-.019.572.433.023 1.05.749 1.461.579.211-.088.134-.736.567-.423.262.188 1.436.272 1.68.069.15-.124.234-.93.052-1.021.116.115-.611.124-.679.098-.12-.044-.232.114-.425.025.116.055-.646-.354-.218-.667-.179.131-.346-.037-.539.107-.133.108.062.18-.128.274-.302.153-.53-.525-.644-.602-.116-.076-1.014-.706-.77-.295l.789.785c-.039.025-.207-.286-.207-.059.053-.135.02.579-.104.347-.055-.089.09-.139.006-.268 0-.085-.228-.168-.272-.226-.125-.155-.457-.497-.637-.579-.05-.023-.764.087-.824.11-.07.098-.13.201-.179.311-.148.055-.287.126-.419.214l-.157.353c-.068.061-.765.291-.769.3.029-.075-.487-.171-.453-.321.038-.165.213-.68.168-.868-.048-.197 1.074.284 1.146-.235.029-.225.046-.487-.313-.525.068.008.695-.246.799-.36.146-.168.481-.442.724-.442.284 0 .223-.413.354-.615.131.053-.07.376.087.507-.01-.103.445.057.489.033.104-.054.684-.022.594-.294-.1-.277.051-.195.181-.253-.022.009.34-.619.402-.413-.043-.212-.421.074-.553.063-.305-.024-.176-.52-.061-.665.089-.115-.243-.256-.247-.036-.006.329-.312.627-.241 1.064.108.659-.735-.159-.809-.114-.28.17-.509-.214-.364-.444.148-.235.505-.224.652-.476.104-.178.225-.385.385-.52.535-.449.683-.09 1.216-.041.521.048.176.124.104.324-.069.19.286.258.409.099.07-.092.229-.323.298-.494.089-.222.901-.197.334-.536-.374-.223-2.004-.672-3.096-.672-.236 0-.401.263-.581.412-.356.295-1.268.874-1.775.698-.519-.179-1.63.66-1.808.666-.065.004.004-.634.358-.681-.153.023 1.247-.707 1.209-.859-.046-.18-2.799.822-2.676 1.023.059.092.299.092-.016.294-.18.109-.372.801-.541.801-.505.221-.537-.435-1.099.409l-.894.36c-1.328 1.411-2.247 3.198-2.58 5.183-.013.079.334.226.379.28.112.134.112.712.167.901.138.478.479.744.74 1.179.154.259.41.914.329 1.186.108-.178 1.07.815 1.246 1.022.414.487.733 1.077.061 1.559-.217.156.33 1.129.048 1.368l-.361.093c-.356.219-.195.756.021.982 1.818 1.901 4.38 3.087 7.22 3.087 5.517 0 9.989-4.472 9.989-9.989zm-11.507-6.357c.125-.055.293-.053.311-.22.015-.148.044-.046.08-.1.035-.053-.067-.138-.11-.146-.064-.014-.108.069-.149.104l-.072.019-.068.087.008.048-.087.106c-.085.084.002.139.087.102z"/></svg>`);

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

    this.el.addEventListener("click", ({ target }) => {
      if (target.classList.contains("new-tab-button"))
        this.addTab()
    })

    this.tabEls.forEach((tabEl) => this.setTabCloseEventListener(tabEl));
  }

  get tabEls() {
    return Array.prototype.slice.call(this.el.querySelectorAll(".chrome-tab"));
  }

  get tabContentEl() {
    return this.el.querySelector(".chrome-tabs-content")!;
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
    const widths = [];
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
      this.tabContentEl.nextElementSibling.classList.remove('overflow-shadow');
    } else {
      this.tabContentEl.nextElementSibling.classList.add('overflow-shadow');
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
      faviconEl!.style!.backgroundImage = `url('${noFaviconLocalUrl}')`;
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
