import '@xterm/xterm/css/xterm.css';
import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useParams } from 'react-router-dom';

export function Term() {
    return (
        <>
            <div className="flex-1 w-full h-full py-1 pr-1 overflow-auto">
                <TerminalCom></TerminalCom>
            </div>
        </>
    )
}


const TerminalCom: React.FC = () => {
    const { id } = useParams();

    const bgColor = '#212121';
    const terminalRef = useRef<HTMLDivElement | null>(null);

    const createTerm = () => {
        const fitAddon = new FitAddon();
        let term = new Terminal({
            fontSize: 14,
            theme: {
                background: bgColor
            }
        });

        term.loadAddon(fitAddon);
        term.open(terminalRef.current!);
        // fitAddon.fit();

        term.onData((command) => {
            window.terminal.input({
                id: id!,
                command
            });
        });

        window.terminal.getSessionLogs(id!).then(logs=>{
            term.write(logs);
        });

        window.terminal.subscribeOutput((data) => {
            term.write(data.data)
        });

        return term;
    }

    useEffect(() => {
        let term = createTerm();
        return () => {
            term.dispose();
        }
    }, [id]);

    return (
        <div ref={terminalRef} className="w-full h-full rounded-lg overflow-hidden p-2" style={{ background: bgColor }}></div>
    )
}