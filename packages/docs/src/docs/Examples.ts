import { div } from "organic-ui/components"
import { Counter } from "../components/Counter.js"
import { Accordion } from "../components/Accordion.js"
import { TodoList } from "../components/TodoList.js"
import { HtmlDemo } from "../components/HtmlDemo.js"
import { Metronome } from "../components/Metronome.js"
import { MemoExample } from "../components/MemoExample.js"
import { ExampleTabs } from "../components/ExampleTabs.js"
import "./docs.css"

import counterCode from "../components/Counter.ts?raw"
import accordionCode from "../components/Accordion.ts?raw"
import htmlDemoCode from "../components/HtmlDemo.ts?raw"
import todoListCode from "../components/TodoList.ts?raw"
import metronomeCode from "../components/Metronome.ts?raw"
import memoExampleCode from "../components/MemoExample.ts?raw"

export function Examples() {
  return div({
    children: [
      div({
        text: "Examples",
        className: "docs-page-title"
      }),
      
      div({
        id: "counter",
        text: "Counter",
        className: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => Counter({ label: "Clicks" }),
        code: counterCode
      }),
      
      div({
        id: "accordion",
        text: "Accordion",
        className: "docs-section-title"
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
        className: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => HtmlDemo(),
        code: htmlDemoCode
      }),
      
      div({
        id: "todo-list",
        text: "Todo List",
        className: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => TodoList(),
        code: todoListCode
      }),
      
      div({
        id: "metronome",
        text: "Metronome (Effect Cleanup)",
        className: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => Metronome(),
        code: metronomeCode
      }),
      
      div({
        id: "memo-example",
        text: "Memo (Computed Values)",
        className: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => MemoExample(),
        code: memoExampleCode
      })
    ]
  })
}
