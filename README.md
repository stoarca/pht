# React Chrome Tabs

## Usage

```js
import ChromeTabs from "@sinm/react-chrome-tabs";

function YourComponent() {
  const [tabs, setTabs] = useState({ id: "id", title: "title" });
  return <ChromeTabs onChange={(newTabs, reason) => {
      if (reason.type === 'close') {
          // ...
      }
      setTabs(newTabs);
  }}>
}
```
