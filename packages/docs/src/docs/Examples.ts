import { div } from "organic-ui/components"
import { Counter } from "../components/Counter.js"
import { Accordion } from "../components/Accordion.js"
import { TodoList } from "../components/TodoList.js"

export function Examples() {
  return div({
    children: [
      div({
        text: "Examples",
        style: {
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#2c3e50"
        }
      }),
      
      div({
        text: "Counter",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      Counter({ label: "Clicks" }),
      
      div({
        text: "Accordion",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "40px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      Accordion({
        title: "What is organic-ui?",
        content: () => "A lightweight reactive UI framework with fine-grained reactivity."
      }),
      Accordion({
        title: "How does reactivity work?",
        content: () => "Uses signals pattern with getter/setter functions that track dependencies."
      }),
      
      div({
        text: "Todo List",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "40px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      TodoList()
    ]
  })
}
