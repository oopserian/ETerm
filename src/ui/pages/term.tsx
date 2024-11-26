import 'xterm/css/xterm.css';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

export function Term() {
    return (
        <>
            <div className="flex-1 w-full h-full py-1 pr-1 overflow-auto">
                <TerminalCom></TerminalCom>
            </div>
        </>
    )
}


function TerminalCom() {
    const bgColor = '#212121';
    const terminalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            let res = await window.ssh.get();
            Object.keys(res).forEach(key => {
                createTerm(res[key])
            })
        };

        const createTerm = (data: sshData) => {
            console.log(data);
            window.ssh.connect(data);
            const term = new Terminal({
                cursorBlink: true, // 设置光标闪烁
                fontSize: 14,
                theme: {
                    background: bgColor
                }
            });

            window.terminal.subscribeOutput((data) => {
                console.log(data)
                term.write(data.data)
            })

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);
            term.open(terminalRef.current!);
            fitAddon.fit();

            term.onData((command) => {
                window.terminal.input({
                    id: data.id!,
                    command
                });
            })

            return () => {
                term.dispose();
            }
        }

        fetchData();
    }, []);

    return (
        <div ref={terminalRef} className="w-full h-full rounded-lg overflow-hidden p-2" style={{ background: bgColor }}></div>
    )
}

function TabBar() {
    return (
        <div className="flex px-2 py-1 pb-0 gap-1">
            <div className="cursor-pointer flex items-center gap-2 text-xs rounded-md px-3 py-2 hover:bg-white">
                <p>我的终端机器</p>
                <XMarkIcon className="w-4 h-4"></XMarkIcon>
            </div>
            <div className="cursor-pointer flex items-center gap-2 text-xs rounded-md px-3 py-2 hover:bg-white">
                <p>我的终端机器</p>
                <XMarkIcon className="w-4 h-4"></XMarkIcon>
            </div>
        </div>
    )
}
