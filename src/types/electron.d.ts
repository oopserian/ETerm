interface hostData {
    id?: string,
    host: string,
    port: string,
    username: string,
    password: string,
    password_iv?: string,
    alias: string
}

type EventPayloadMapping = {
    saveHost: {
        params: [data: hostData],
        result: void
    },
    connectHost: {
        params: [data: hostData],
        result: Promise<string>
    },
    getHost: {
        params: [],
        result: Record<string,hostData>
    },
    decryptPassword: {
        params: [password: string, iv: string],
        result: string
    },
    terminalInput: {
        params: [{ id: string, command: string }],
        result: void
    },
    terminalOutput: {
        params: [{ id: string, data: any }],
        result: void
    }
}