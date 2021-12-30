import { Story } from "@storybook/react";
import "../css/chrome-tabs.css";

import { ChromeHeader } from "../src/index";

export default {
  title: "Example/ChromeHeader",
  component: ChromeHeader,
};

export const BasicExample = (args) => { return <ChromeHeader {...args}/>; };
BasicExample.args = {
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
