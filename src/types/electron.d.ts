interface sshData {
    id: string,
    port: string,
    ip: string,
    alias: string,
    password: string
}

type EventPayloadMapping = {
    saveSSHData: {
        params: [data: sshData],
        result: void
    },
    getSSHData: {
        params: [],
        result: sshData[]
    }
}