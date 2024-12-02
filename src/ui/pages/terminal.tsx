import '@xterm/xterm/css/xterm.css';
import React, { useEffect, useMemo, useRef } from "react";
import { Terminal as Xterm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useParams } from 'react-router-dom';
import useTerminalStore from '@/stores/useTerminalStore';
import { ServerIcon } from '@heroicons/react/24/outline';
import { useDroppable } from '@dnd-kit/core';

export function Terminal() {
    return (
        <>
            <div className="flex gap-2 flex-1 w-full h-full py-1 pr-1 overflow-auto">
                <SplitWrap></SplitWrap>
            </div>
        </>
    )
}

const SplitWrap: React.FC = () => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'TerminalDroppable'
    })

    const style = {
        opacity: isOver ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex gap-2 flex-1 w-full h-full py-1 pr-1 overflow-auto">
            <TerminalItem></TerminalItem>
        </div>
    )
}

const TerminalItem: React.FC = () => {
    const { id } = useParams();
    const { setCurTerminal, terminals } = useTerminalStore();
    const terminalData = useMemo(() => terminals[id!], [id, terminals]);
    if (!terminalData) return;

    const bgColor = '#212121';
    const terminalRef = useRef<HTMLDivElement | null>(null);

    const createTerm = () => {
        const fitAddon = new FitAddon();
        let term = new Xterm({
            fontSize: 14,
            theme: {
                background: bgColor
            }
        });

        term.loadAddon(fitAddon);
        term.open(terminalRef.current!);

        // TODO setTimeout临时处理xterm的dimensions报错
        setTimeout(() => fitAddon.fit(), 0);

        term.onData((command) => {
            window.terminal.input({
                id: id!,
                command
            });
        });

        window.terminal.getSessionLogs(id!).then(logs => {
            term.write(logs);
        });

        window.terminal.subscribeOutput((data) => {
            term.write(data.data)
        });

        return term;
    }

    useEffect(() => {
        let term = createTerm();
        setCurTerminal(id!);
        return () => {
            term.dispose();
        }
    }, [id]);

    return (
        <div className="flex flex-col gap-2 w-full h-full rounded-lg overflow-hidden p-2" style={{ background: bgColor }}>
            <div className="flex items-center gap-2 text-white text-sm opacity-70">
                <ServerIcon className="size-4" />
                <p>{terminalData.host.alias}</p>
            </div>
            <div className="flex-1 bg-inherit [&_terminal]:h-full" ref={terminalRef}></div>
        </div>
    )
}