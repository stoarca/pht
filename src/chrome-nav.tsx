import React, { useCallback } from 'react';

import { arrowSvg, reloadSvg } from './svgs';

export type NavProps = {
  onBack?: (tabId: string) => void;
  onForward?: (tabId: string) => void;
  onReload?: (tabId: string) => void;
  onUserChangedUrl?: (tabId: string) => void;
};

const arrowSvgUrl = 'data:image/svg+xml;base64,' + btoa(arrowSvg);
const reloadSvgUrl = 'data:image/svg+xml;base64,' + btoa(reloadSvg);

const NavButton = ({children, ...rest}) => {
  return (
    <div className="nav-aligner" {...rest}>
      <div className="nav-aligner"></div>
      {children}
    </div>
  );
};

const handleFocus = (event) => {
  event.target.select();
};

const ChromeNav = ({
  onBack,
  onForward,
  onReload,
  onUserChangedUrl,
}: NavProps) => {
  const handleSubmit = useCallback((event) => {
    return onUserChangedUrl && onUserChangedUrl('asdf');
  }, [onUserChangedUrl]);
  return (
    <div className="chrome-nav">
      <NavButton onBack={onBack}>
        <img className="nav-button back" src={arrowSvgUrl}/>
      </NavButton>
      <NavButton onForward={onForward}>
        <img className="nav-button forward" src={arrowSvgUrl}/>
      </NavButton>
      <NavButton onReload={onReload}>
        <img className="nav-button reload" src={reloadSvgUrl}/>
      </NavButton>
      <form className="urlbar-wrapper" onSubmit={handleSubmit}>
        <input className="urlbar" type="textbox" onFocus={handleFocus}/>
      </form>
    </div>
  );
};

export default ChromeNav;

