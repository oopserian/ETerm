import useTerminalStore from "@/stores/useTerminalStore";

export const subscribeTerminalUpdate = (): () => void => {
    const { updateTerminal } = useTerminalStore();
    const unsub = window.terminal.subscribeUpdate((res) => {
        updateTerminal(res.id, res);
    });
    return unsub
}