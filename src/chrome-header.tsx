import React from 'react';

import ChromeNav, { NavProps } from './chrome-nav';
import { Tabs, TabsProps } from './component';

const ChromeHeader = ({
  tabs,
  onTabActivated,
  onTabClosed,
  onTabReorder,
  onContextMenu,
  onBack,
  onForward,
  onReload,
  onUserChangedUrl,
}: TabsProps & NavProps) => {
  return (
    <div>
      <Tabs {...{tabs, onTabActivated, onTabClosed, onTabReorder, onContextMenu}}/>
      <ChromeNav {...{onBack, onForward, onReload, onUserChangedUrl}}/>
    </div>
  );
}

export default ChromeHeader;
