import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import "../css/chrome-tabs.css";

import { Tabs, TabsProps, useChromeTabs } from "../src/index";

export default {
  title: "Example/ChromeTabs",
  component: Tabs,
} as Meta;

const Template: Story<TabsProps> = (args) => {
  return <Tabs {...args} />;
};

export const ChromeTab = Template.bind({});

ChromeTab.args = {
  tabs: [{ id: "abc", title: "测试", active: true }],
};
