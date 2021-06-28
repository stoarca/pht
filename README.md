# React Chrome Tabs

## Usage

1. use hooks
   
```js
import { useChromeTabs } from "@sinm/react-chrome-tabs";

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
```

2. use component

```js
import { Tabs } from '@sinm/react-chrome-tabs';
<Tabs tabs={tabs} onTabActivated={}>
```
