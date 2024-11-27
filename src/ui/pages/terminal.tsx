import 'xterm/css/xterm.css';
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { useParams } from 'react-router-dom';
import useTerminalStore, { TerminalData } from '@/stores/useTerminalStore';

export function Term() {
    const { id } = useParams();
    const { terminals } = useTerminalStore();
    let terminal = terminals[id!];
    return (
        <>
            <div className="flex-1 w-full h-full py-1 pr-1 overflow-auto">
                {
                    terminal && (<TerminalCom data={terminal}></TerminalCom>)
                }
            </div>
        </>
    )
}


const TerminalCom: React.FC<{ data: TerminalData }> = ({ data }) => {
    const { id } = useParams();

    const bgColor = '#212121';
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const createTerm = (data: TerminalData) => {
        let { id, host } = data;
        window.host.connect(host);
        const term = new Terminal({
            cursorBlink: true, // 设置光标闪烁
            fontSize: 14,
            theme: {
                background: bgColor
            }
        });

        window.terminal.subscribeOutput((data) => {
            term.write(data.data)
        })

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current!);
        fitAddon.fit();

        term.onData((command) => {
            window.terminal.input({
                id,
                command
            });
        })
        return term
    }

    useEffect(() => {
        let term = createTerm(data)
        return () => {
            term.dispose();
        }
    }, [id]);

    return (
        <div ref={terminalRef} className="w-full h-full rounded-lg overflow-hidden p-2" style={{ background: bgColor }}></div>
    )
}

// function TabBar() {
//     return (
//         <div className="flex px-2 py-1 pb-0 gap-1">
//             <div className="cursor-pointer flex items-center gap-2 text-xs rounded-md px-3 py-2 hover:bg-white">
//                 <p>我的终端机器</p>
//                 <XMarkIcon className="w-4 h-4"></XMarkIcon>
//             </div>
//             <div className="cursor-pointer flex items-center gap-2 text-xs rounded-md px-3 py-2 hover:bg-white">
//                 <p>我的终端机器</p>
//                 <XMarkIcon className="w-4 h-4"></XMarkIcon>
//             </div>
//         </div>
//     )
// }
