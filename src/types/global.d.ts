import { ssh } from "@main/preload";

declare global {
    interface Window {
        ssh: typeof ssh
    }
}