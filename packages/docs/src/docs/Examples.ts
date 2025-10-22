import { div } from "organic-ui/components"
import { Counter } from "../components/Counter.js"
import { Accordion } from "../components/Accordion.js"
import { TodoList } from "../components/TodoList.js"
import { HtmlDemo } from "../components/HtmlDemo.js"
import { Metronome } from "../components/Metronome.js"
import { MemoExample } from "../components/MemoExample.js"
import { ExampleTabs } from "../components/ExampleTabs.js"

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
        class: "docs-page-title"
      }),
      
      div({
        id: "counter",
        text: "Counter",
        class: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => Counter({ label: "Clicks" }),
        code: counterCode
      }),
      
      div({
        id: "accordion",
        text: "Accordion",
        class: "docs-section-title"
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
        class: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => HtmlDemo(),
        code: htmlDemoCode
      }),
      
      div({
        id: "todo-list",
        text: "Todo List",
        class: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => TodoList(),
        code: todoListCode
      }),
      
      div({
        id: "metronome",
        text: "Metronome (Effect Cleanup)",
        class: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => Metronome(),
        code: metronomeCode
      }),
      
      div({
        id: "memo-example",
        text: "Memo (Computed Values)",
        class: "docs-section-title"
      }),
      ExampleTabs({
        preview: () => MemoExample(),
        code: memoExampleCode
      })
    ]
  })
}
