import React, { useCallback, useEffect, useRef } from "react";
import { Listeners, useChromeTabs } from "./hooks";
import isEqual from "lodash.isequal";
import { TabProperties } from "./chrome-tabs";

export type TabsProps = Listeners & {
  tabs: TabProperties[];
};

export function Tabs({
  tabs,
  onTabActivated,
  onTabClosed,
  onTabReorder,
}: TabsProps) {
  const tabsRef = useRef<TabProperties[]>([]);

  const { ChromeTabs, addTab, activeTab, removeTab, updateTab } = useChromeTabs(
    {
      onTabClosed: (tabId) => {
        tabsRef.current = tabsRef.current.filter((tab) => tab.id !== tabId);
        onTabClosed?.(tabId);
      },
      onTabReorder: (tabId, fromIndex, toIndex) => {
        const [dest] = tabsRef.current.splice(fromIndex, 1);
        tabsRef.current.splice(toIndex, 0, dest);
        onTabReorder?.(tabId, fromIndex, toIndex);
      },
      onTabActivated: (tabId) => {
        tabsRef.current = tabsRef.current.map((tab) => ({
          ...tab,
          active: tab.id === tabId,
        }));
        onTabActivated?.(tabId);
      },
    }
  );

  useEffect(() => {
    if (!isEqual(tabsRef.current, tabs)) {
      const retainTabs = tabsRef.current.slice(tabs.length);
      retainTabs.forEach((tab) => {
        removeTab(tab.id);
      });

      (tabs as TabProperties[]).forEach((tab, index) => {
        const currentTab = tabsRef.current[index];
        if (!currentTab) {
          addTab(tab);
        } else if (tab.id === currentTab.id) {
          updateTab(currentTab.id, tab);
        } else {
          removeTab(tab.id);
          updateTab(currentTab.id, tab);
        }
      });

      tabs
        .filter((tab) => tab.active)
        .forEach((tab) => {
          activeTab(tab.id);
        });

      tabsRef.current = tabs;
    }
  }, [tabs]);
  return <ChromeTabs />;
}
