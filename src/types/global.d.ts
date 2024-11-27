import { host, common, terminal } from "@main/preload";

declare global {
    interface Window {
        host: typeof host
        common: typeof common
        terminal: typeof terminal
    }
}