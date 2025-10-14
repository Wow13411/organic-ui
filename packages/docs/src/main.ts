import { render } from "organic-ui/renderer"
import { DocsApp } from "./DocsApp.js"

const root = document.getElementById("root")!

render(() => [DocsApp()], root)
