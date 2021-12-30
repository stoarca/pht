import { Story } from "@storybook/react";
import "../css/chrome-tabs.css";

import { ChromeNav } from "../src/index";

export default {
  title: "Example/ChromeNav",
  component: ChromeNav,
};

export const BasicExample = () => { return <ChromeNav/>; };
