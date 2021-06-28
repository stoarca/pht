import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import "../css/chrome-tabs.css";

import { useChromeTabs } from "../src/index";

function Example() {
  const [tabs, setTabs] = useState([]);
  const { ChromeTabs, addTab, updateTab, removeTab } = useChromeTabs({
    onTabActivated: (tabId) => {
      console.log('active:', tabId);
    },
    onTabReorder: (tabId, fromIndex, toIndex) => {},
    onTabClosed: (tabId) => {

    },
  });
  return (
    <div>
      <ChromeTabs />
      <button
        onClick={() =>
          addTab({ id: `id-${Date.now()}`, title: `页签`, favicon: false })
        }
      >
        添加
      </button>
    </div>
  );
}

export default {
  title: "Example/ChromeTabs",
  component: Example,
} as Meta;

const Template: Story<ChromeTabsProps> = (args) => {
  return <Example {...args} />;
};

export const ChromeTab = Template.bind({});

ChromeTab.args = {
  tabs: [{ title: "测试", active: true }],
};
