import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import "../css/chrome-tabs.css";

import { ChromeTabs, ChromeTabsProps } from "../src/index";

export default {
  title: "Example/ChromeTabs",
  component: ChromeTabs,
} as Meta;

const Template: Story<ChromeTabsProps> = (args: ChromeTabsProps) => {
  return <ChromeTabs {...args} />;
};

export const ChromeTab = Template.bind({});

ChromeTab.args = {
  tabs: [{ title: "测试", active: true }],
};
