interface sshData {
    id?: string,
    host: string,
    port: string,
    username: string,
    password: string,
    password_iv?: string,
    alias: string
}

type EventPayloadMapping = {
    saveSSH: {
        params: [data: sshData],
        result: void
    },
    connectSSH: {
        params: [data: sshData],
        result: void
    },
    getSSH: {
        params: [],
        result: Record<string,sshData>
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