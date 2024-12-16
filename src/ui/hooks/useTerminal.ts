export const termService = {
    getSessionLogs(id: string): Promise<string> {
        return window.terminal.getSessionLogs(id);
    },
    close(ids: string[]) {
        window.terminal.delete(ids);
    },
    input(ids: string[], command: string) {
        window.terminal.input({ ids, command });
    },
    updateSize(id: string, cols: number, rows: number) {
        window.terminal.setWindowSize(id, { cols, rows });
    },
    onOutput(callback: (data: { id: string, data: any }) => void) {
        return window.terminal.subscribeOutput((data) => callback(data));
    }
}