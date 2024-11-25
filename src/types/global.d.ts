import { ssh, common, terminal } from "@main/preload";

declare global {
    interface Window {
        ssh: typeof ssh
        common: typeof common
        terminal: typeof terminal
    }
}