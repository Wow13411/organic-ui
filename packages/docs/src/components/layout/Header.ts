import { div, img, button } from "organic-ui/components"

export interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return div({
    className: "docs-header",
    children: [
      button({
        text: () => "☰",
        onClick: onMenuClick,
        className: "mobile-menu-button"
      }),
      div({
        className: "header-content",
        children: [
          img({
            src: "logo.svg",
            alt: "organic-ui logo",
            width: 32,
            height: 32,
            className: "header-logo"
          }),
          div({
            text: "organic-ui",
            className: "header-title"
          })
        ]
      })
    ]
  })
}
