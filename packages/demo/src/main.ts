import { render } from "organic-ui/renderer"
import { App1 } from "./App1.js"
import { App2 } from "./App2.js"
import { App3 } from "./App3.js"
import { App4 } from "./App4.js"

const root = document.getElementById("root")!

render(App1, root)

render(App2, root)

render(App3, root)

render(App4, root)
