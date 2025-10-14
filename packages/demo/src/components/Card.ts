import { div, p } from "organic-ui/components";
import type { Renderable } from "organic-ui/types";

export function Card({ title, child }: { title: string; child: Renderable }) {
  return div({
    style: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "12px",
      margin: "8px 0",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
    },
    children: [
      p({ text: () => title }),
      child
    ]
  })
}