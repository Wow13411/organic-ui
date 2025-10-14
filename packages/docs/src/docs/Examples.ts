import { div } from "organic-ui/components"
import { Counter } from "../components/Counter.js"
import { Accordion } from "../components/Accordion.js"
import { TodoList } from "../components/TodoList.js"
import { HtmlDemo } from "../components/HtmlDemo.js"
import { Metronome } from "../components/Metronome.js"
import { ExampleTabs } from "../components/ExampleTabs.js"

import counterCode from "../components/Counter.ts?raw"
import accordionCode from "../components/Accordion.ts?raw"
import htmlDemoCode from "../components/HtmlDemo.ts?raw"
import todoListCode from "../components/TodoList.ts?raw"
import metronomeCode from "../components/Metronome.ts?raw"

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
        id: "counter",
        text: "Counter",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      ExampleTabs({
        preview: () => Counter({ label: "Clicks" }),
        code: counterCode
      }),
      
      div({
        id: "accordion",
        text: "Accordion",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "40px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      ExampleTabs({
        preview: () => div({
          children: [
            Accordion({
              title: "What is organic-ui?",
              content: () => "A lightweight reactive UI framework with fine-grained reactivity."
            }),
            Accordion({
              title: "How does reactivity work?",
              content: () => "Uses signals pattern with getter/setter functions that track dependencies."
            })
          ]
        }),
        code: accordionCode
      }),
      
      div({
        id: "html-demo",
        text: "HTML Component Demo",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "40px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      ExampleTabs({
        preview: () => HtmlDemo(),
        code: htmlDemoCode
      }),
      
      div({
        id: "todo-list",
        text: "Todo List",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "40px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      ExampleTabs({
        preview: () => TodoList(),
        code: todoListCode
      }),
      
      div({
        id: "metronome",
        text: "Metronome (Effect Cleanup)",
        style: {
          fontSize: "24px",
          fontWeight: "600",
          marginTop: "40px",
          marginBottom: "15px",
          color: "#2c3e50"
        }
      }),
      ExampleTabs({
        preview: () => Metronome(),
        code: metronomeCode
      })
    ]
  })
}
