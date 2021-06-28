import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import ChromeTabsClz, { TabProperties } from "./chrome-tabs";

export type Listeners = {
  onTabActivated?: (tabId: string) => void;
  onTabClosed?: (tabId: string) => void;
  onTabReorder?: (tabId: string, fromIdex: number, toIndex: number) => void;
};

const ChromeTabsWrapper = forwardRef<HTMLDivElement, any>((props, ref) => {
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

export function useChromeTabs(listeners: Listeners) {
  const ref = useRef<HTMLDivElement>(null);
  const chromeTabsRef = useRef<ChromeTabsClz | null>(null);

  useEffect(() => {
    const chromeTabs = new ChromeTabsClz();
    chromeTabsRef.current = chromeTabs;
    chromeTabs.init(ref.current as HTMLDivElement);
  }, []);

  // activated
  useEffect(() => {
    const listener = ({ detail }: any) => {
      const tabEle = detail.tabEl as HTMLDivElement;
      const tabId = tabEle.getAttribute("data-tab-id") as string;
      listeners.onTabActivated?.(tabId);
    };
    const ele = chromeTabsRef.current?.el;
    ele?.addEventListener("tabClick", listener);
    return () => {
      ele?.removeEventListener("tabClick", listener);
    };
  }, [listeners.onTabActivated]);

  useEffect(() => {
    const ele = chromeTabsRef.current?.el;
    const listener = ({ detail }: any) => {
      const { tabEl: tabEle, originIndex, destinationIndex } = detail;
      const tabId = tabEle.getAttribute("data-tab-id") as string;
      listeners.onTabReorder?.(tabId, originIndex, destinationIndex);
    };
    ele?.addEventListener("tabReorder", listener);
    return () => {
      ele?.removeEventListener("tabReorder", listener);
    };
  }, [listeners.onTabReorder]);

  useEffect(() => {
    const ele = chromeTabsRef.current?.el;
    const listener = ({ detail }: any) => {
      const tabEle = detail.tabEl as HTMLDivElement;
      const tabId = tabEle.getAttribute("data-tab-id") as string;
      listeners.onTabClosed?.(tabId);
    };
    ele?.addEventListener("tabClose", listener);
    return () => {
      ele?.removeEventListener("tabClose", listener);
    };
  }, [listeners.onTabClosed]);

  const addTab = useCallback((tab: TabProperties) => {
    chromeTabsRef.current?.addTab(tab);
  }, []);

  const removeTab = useCallback((tabId: string) => {
    const ele = ref.current?.querySelector(
      `[data-tab-id="${tabId}"]`
    ) as HTMLDivElement;
    if (ele) {
      chromeTabsRef.current?.removeTab(ele);
    }
  }, []);

  const activeTab = useCallback((tabId: string) => {
    const ele = ref.current?.querySelector(
      `[data-tab-id="${tabId}"]`
    ) as HTMLDivElement;
    if (ele) {
      chromeTabsRef.current?.setCurrentTab(ele);
    }
  }, []);

  const updateTab = useCallback((tabId: string, tab: TabProperties) => {
    const ele = ref.current?.querySelector(
      `[data-tab-id="${tabId}"]`
    ) as HTMLDivElement;
    if (ele) {
      chromeTabsRef.current?.updateTab(ele, { ...tab });
    } else {
      chromeTabsRef.current?.addTab(tab);
    }
  }, []);

  const ChromeTabs = useCallback(() => {
    return <ChromeTabsWrapper ref={ref} />;
  }, []);

  return {
    ChromeTabs,
    addTab,
    updateTab,
    removeTab,
    activeTab,
  };
}
