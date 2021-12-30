# React Chrome Tabs

## Usage

1. use hooks
   
```js
import { useChromeTabs } from "react-chrome-tabs";

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
        New tab
      </button>
    </div>
  );
}
```

2. use component

```js
import { Tabs } from 'react-chrome-tabs';
<Tabs tabs={tabs} onTabActivated={}>
```
