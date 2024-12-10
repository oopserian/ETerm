import React, { useEffect, useRef } from "react";
import { Terminal as Xterm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

export const TerminalPane: React.FC<{ id: string, bgColor: string }> = ({ id, bgColor }) => {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    
    const createTerm = () => {
        const fitAddon = new FitAddon();
        let t = new Xterm({
            fontSize: 14,
            theme: {
                background: bgColor
            }
        });

        t.loadAddon(fitAddon);
        t.open(terminalRef.current!);

        // TODO setTimeout临时处理xterm的dimensions报错
        setTimeout(() => fitAddon.fit(), 0);

        t.onData((command) => {
            window.terminal.input({
                id,
                command
            });
        });

        window.terminal.getSessionLogs(id!).then(logs => {
            t.write(logs);
        });

        return t;
    };

    useEffect(() => {
        const terminal = createTerm();
        const unSub = window.terminal.subscribeOutput((data) => {
            if (data.id == id) {
                terminal.write(data.data)
            }
        });

        return () => {
            terminal.dispose();
            unSub();
        };
    }, []);

    return (
        <div className="w-full h-full overflow-hidden" ref={terminalRef}></div>
    )
};