import React, {
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import ChromeTabsJS, { TabProperties } from "./chrome-tabs";

export interface ChromeTabsProps {
  tabs: TabProperties[];
  style?: CSSProperties;
  onTabsChange(
    tabs: TabProperties[],
    detail: {
      reason: "close" | "reorder" | "active";
      tab: TabProperties;
      originIndex?: number;
      destIndex?: number;
    }
  ): void;
}

export const ChromeTabs = memo<ChromeTabsProps>((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<ChromeTabsJS>();
  const onChangeRef = useRef(props.onTabsChange);

  const map = useMemo(() => {
    return new Map<HTMLElement, TabProperties>();
  }, []);

  useEffect(() => {
    onChangeRef.current = props.onTabsChange;
  }, [props.onTabsChange]);

  const updateTabs = useCallback((tabs: TabProperties[]) => {
    const chromeTabs = tabsRef.current!;
    const tabEls = chromeTabs.tabEls;

    tabEls.forEach((ele, index) => {
      const tab = tabs[index];
      if (tab) {
        chromeTabs.updateTab(ele, tab);
        map.set(ele, tab);
        if (tab.active) {
          chromeTabs.setCurrentTab(ele);
        }
      } else {
        chromeTabs.removeTab(ele);
        map.delete(ele);
      }
    });

    // console.log(tabs);
    tabs.slice(tabEls.length).forEach((tab) => {
      const ele = chromeTabs.addTab(tab, { background: true });
      map.set(ele, tab);
      if (tab.active) {
        chromeTabs.setCurrentTab(ele);
      }
    });
  }, []);

  useEffect(() => {
    const chromeTabs = new ChromeTabsJS();
    chromeTabs.init(ref.current!);
    tabsRef.current = chromeTabs;
    chromeTabs.el.addEventListener("activeTabChange", ({ detail }: any) => {
      const tabEl = detail.tabEl;
      const tabEls = [...chromeTabs.tabEls];
      const newTabs = tabEls
        .map((el) => {
          return { ...map.get(el)!, active: el === tabEl }!;
        })
        .filter((tab) => !!tab);
      onChangeRef.current(newTabs, { reason: "active", tab: map.get(tabEl)! });
    });
    // chromeTabs.el.addEventListener("tabClick", ({ detail }: any) => {
    //   const tabEl = detail.tabEl;
    //   const tabEls = [...chromeTabs.tabEls];
    //   const newTabs = tabEls
    //     .map((el) => {
    //       return { ...map.get(el)!, active: el === tabEl }!;
    //     })
    //     .filter((tab) => !!tab);
    //   onChangeRef.current(newTabs, { reason: "active", tab: map.get(tabEl)! });
    // });

    chromeTabs.el.addEventListener("tabClose", ({ detail }: any) => {
      const tabEl = detail.tabEl;
      const tabEls = [...chromeTabs.tabEls];
      const index = tabEls.indexOf(tabEl);
      tabEls.splice(index, 1);
      const newTabs = tabEls.map((el) => map.get(el)!).filter((tab) => !!tab);
      onChangeRef.current(newTabs, { reason: "close", tab: map.get(tabEl)! });
      // props.onTabsChange([...props.tabs])
    });

    chromeTabs.el.addEventListener("tabReorder", ({ detail }: any) => {
      const tabEl = detail.tabEl;
      const tabEls = [...chromeTabs.tabEls];
      const newTabs = tabEls.filter((tab) => !!tab);
      onChangeRef.current(newTabs, { reason: "reorder", tab: map.get(tabEl)! });
    });
  }, []);

  useEffect(() => {
    updateTabs(props.tabs);
  }, [props.tabs]);

  return (
    <div
      ref={ref}
      className="chrome-tabs"
      style={{ "--tab-content-margin": "9px" } as CSSProperties}
    >
      <div className="chrome-tabs-content"></div>
    </div>
  );
});
