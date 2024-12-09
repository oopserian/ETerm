import { host, common, terminal, commandSnippet } from "@main/preload";

declare global {
    interface Window {
        host: typeof host
        common: typeof common
        terminal: typeof terminal
        commandSnippet: typeof commandSnippet
    }
}