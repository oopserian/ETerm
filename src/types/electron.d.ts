interface HostData {
    id?: string,
    host: string,
    port: string,
    username: string,
    password: string,
    password_iv?: string,
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
        params: [data: HostData],
        result: void
    },
    connectHost: {
        params: [data: HostData],
        result: Promise<string>
    },
    getHost: {
        params: [],
        result: Record<string,HostData>
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
    },
    terminalUpdate:{
        params: [{id:string, status:TerminalStatus}],
        result: void
    },
    getTerminalSessionLog:{
        params: [id: string],
        result: string
    }
}