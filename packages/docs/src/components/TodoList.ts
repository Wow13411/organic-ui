import { state } from "organic-ui/reactivity"
import { div, button, For, p } from "organic-ui/components"

interface TodoItem {
  id: number
  text: string
}

export function TodoList() {
  const [items, setItems] = state<TodoItem[]>([
    { id: 0, text: "Learn organic-ui" },
    { id: 1, text: "Build something cool" },
    { id: 2, text: "Ship it!" }
  ])
  const [nextId, setNextId] = state(3)

  const addItem = () => {
    const id = nextId()
    setItems([...items(), { id, text: `New task ${id}` }])
    setNextId(id => id + 1)
  }

  const removeItem = (id: number) => {
    setItems(items().filter(item => item.id !== id))
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
            key: (item, _index) => item.id,
            children: (item) => div({
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
                  text: item.text,
                  style: { flex: "1" }
                }),
                button({
                  text: "Remove",
                  onClick: () => removeItem(item.id)
                })
              ]
            }),
            fallback: p({
              text: "No tasks yet. Add one to get started!",
              style: {
                color: "#999",
                fontStyle: "italic"
              }
            })
          })
        ]
      }),
      button({
        text: "Add Task",
        onClick: addItem
      })
    ]
  })
}
