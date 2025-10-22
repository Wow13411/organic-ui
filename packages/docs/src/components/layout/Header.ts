import { div, img, button, a } from "organic-ui/components"
import { ThemeToggle } from "../ThemeToggle.js"
import type { Theme } from "../../utils/themeManager.js"

export interface HeaderProps {
  onMenuClick: () => void
  onSearchClick: () => void
  theme: () => Theme
  onThemeToggle: () => void
}

export function Header({ onMenuClick, onSearchClick, theme, onThemeToggle }: HeaderProps) {
  return div({
    class: "fixed top-0 left-0 right-0 z-1001 flex items-center justify-between px-4 md:px-6 gap-4 border-b h-14 bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800",
    children: [
      // Left: Menu button (mobile) + Logo + Title
      div({
        class: "flex items-center gap-4",
        children: [
          button({
            text: "☰",
            onClick: onMenuClick,
            class: "md:hidden px-2.5 py-1.5 rounded transition-all duration-150 border bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          }),
          a({
            href: "#intro",
            class: "flex items-center gap-2.5 no-underline transition-opacity duration-150 hover:opacity-70",
            children: [
              img({
                src: "logo.svg",
                alt: "organic-ui logo",
                width: 28,
                height: 28,
                class: "rounded-lg"
              }),
              div({
                text: "organic-ui",
                class: "text-base font-semibold text-slate-900 dark:text-slate-50"
              })
            ]
          })
        ]
      }),
      
      // Center: Search button
      button({
        class: "flex items-center gap-2.5 px-3 py-1.5 border rounded cursor-pointer transition-all duration-150 text-sm h-9 bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-500 hover:text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-slate-300 md:min-w-[200px]",
        onClick: onSearchClick,
        children: [
          div({
            text: "🔍",
            class: "text-sm"
          }),
          div({
            text: "Search...",
            class: "hidden md:block flex-1 text-left"
          }),
          div({
            text: "⌘K",
            class: "hidden md:block text-xs px-1.5 py-0.5 rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400"
          })
        ]
      }),
      
      // Right: Theme toggle + GitHub link
      div({
        class: "flex items-center gap-4",
        children: [
          ThemeToggle({
            theme,
            onToggle: onThemeToggle
          }),
          a({
            href: "https://github.com/pavi2410/organic-ui",
            target: "_blank",
            rel: "noopener noreferrer",
            class: "hidden md:inline-block px-3 py-1.5 text-sm font-medium rounded transition-all duration-150 bg-blue-600 text-white hover:bg-blue-700",
            text: "GitHub"
          })
        ]
      })
    ]
  })
}
