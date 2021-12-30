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
  tabs: [{
    id: "1",
    title: "Google",
    active: false,
    favicon: 'https://www.google.com/favicon.ico',
  }, {
    id: "2",
    title: "CNN",
    active: false,
    favicon: 'https://www.cnn.com/favicon.ico',
  }, {
    id: "3",
    title: "Yahoo! News",
    active: true,
    favicon: false,
  }],
};
