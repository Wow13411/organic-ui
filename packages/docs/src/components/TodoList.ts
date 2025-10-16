import { state } from "organic-ui/reactivity"
import { div, button, For, p } from "organic-ui/components"

export function TodoList() {
  const [items, setItems] = state<string[]>(["Learn organic-ui", "Build something cool", "Ship it!"])
  const [nextId, setNextId] = state(items().length)

  const addItem = () => {
    setItems([...items(), `New task ${nextId()}`])
    setNextId(nextId() + 1)
  }

  const removeItem = (index: number) => {
    setItems(items().filter((_, i) => i !== index))
  }

  return div({
    style: {
      padding: "16px",
      fontFamily: "sans-serif"
    },
    children: [
      div({
        text: "Todo List",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "12px"
        }
      }),
      div({
        style: {
          marginBottom: "12px"
        },
        children: [
          For({
            each: items,
            children: (item, index) => div({
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px",
                background: "#f5f5f5",
                margin: "4px 0",
                borderRadius: "4px"
              },
              children: [
                div({
                  text: item,
                  style: { flex: "1" }
                }),
                button({
                  text: () => "Remove",
                  onClick: () => removeItem(index)
                })
              ]
            }),
            fallback: p({
              text: () => "No tasks yet. Add one to get started!",
              style: {
                color: "#999",
                fontStyle: "italic"
              }
            })
          })
        ]
      }),
      button({
        text: () => "Add Task",
        onClick: addItem
      })
    ]
  })
}
