interface HostData {
    id: string,
    host: string,
    port: string,
    username: string,
    password: string,
    password_iv: string,
    alias: string
}

type TerminalStatus = 'connecting'
    | 'connected'
    | 'disconnect'
    | 'authFailed'
    | 'closed'
    | 'error'
    | ''

type EventPayloadMapping = {
    saveHost: {
        params: [data: Partial<HostData>],
        result: void
    },
    connectHost: {
        params: [data: HostData],
        result: Promise<string>
    },
    deleteHost: {
        params: [id: string],
        result: void
    },
    getHost: {
        params: [],
        result: Record<string, HostData>
    },
    updateHost: {
        params: [id: string, data: Partial<HostData>],
        result: void
    },
    decryptPassword: {
        params: [password: string, iv: string],
        result: string
    },
    terminalInput: {
        params: [{ ids: string[], command: string }],
        result: void
    },
    terminalOutput: {
        params: [{ id: string, data: any }],
        result: void
    },
    terminalUpdate: {
        params: [{ id: string, status: TerminalStatus }],
        result: void
    },
    terminalDelete: {
        params: [ids: string[]],
        result: void
    }
    setTerminalWindowSize: {
        params: [id: string, data: { rows: number, cols: number, width?: number, height?: number }],
        result: void
    }
    getTerminalSessionLog: {
        params: [id: string],
        result: string
    },
    createCommand: {
        params: [data: Partial<CommandSnippetData>],
        result: void
    },
    updateCommand: {
        params: [id: number, data: Partial<CommandSnippetData>],
        result: void
    },
    deleteCommand:{
        params: [id: number],
        result: void
    },
    getCommand: {
        params: [],
        result: Record<number, CommandSnippetData>
    },
    openExternalUrl: {
        params: [url: string],
        result: void
    }
}