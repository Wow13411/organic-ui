export interface Renderable {
    mount(parent: HTMLElement): void
    unmount(): void
}