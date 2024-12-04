import '@xterm/xterm/css/xterm.css';
import React, { useEffect, useMemo, useRef } from "react";
import { Terminal as Xterm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useParams } from 'react-router-dom';
import useTerminalStore, { Position, TerminalData, TerminalView } from '@/stores/useTerminalStore';
import { ServerIcon } from '@heroicons/react/24/outline';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

export function Terminal() {
    return (
        <>
            <div className="flex gap-2 flex-1 w-full h-full py-1 pr-1 overflow-auto">
                {/* 10 x 10 */}
                <div className="w-full h-full grid grid-cols-10 grid-rows-10">
                    <SplitWrap></SplitWrap>
                </div>
            </div>
        </>
    )
}

const SplitWrap: React.FC = () => {
    const { id } = useParams();
    const { views } = useTerminalStore();
    const view = useMemo(() => views[id!], [id, views]);

    if (!view) return;

    let style = {
        gridArea: view.area.map(num => num + 1).join('/')
    };

    return (
        <div style={style} className="relative flex gap-2 flex-1 w-full h-full overflow-auto">
            <TerminalItem terminal={view.terminal}></TerminalItem>
        </div>
    )
}


const TerminalItem: React.FC<{ terminal: TerminalData }> = ({ terminal }) => {
    let { id } = terminal;
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
                id,
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
        return () => {
            term.dispose();
        }
    }, [id]);

    return (
        <div className="relative w-full h-full">
            <div className="flex flex-col gap-2 w-full h-full rounded-lg overflow-hidden p-2" style={{ background: bgColor }}>
                <div className="flex items-center gap-2 text-white text-sm opacity-70">
                    <ServerIcon className="size-4" />
                    <p>{terminal.name}</p>
                </div>
                <div className="flex-1 bg-inherit [&_terminal]:h-full" ref={terminalRef}></div>
            </div>
            <DropWrap position="bottom"></DropWrap>
            <DropWrap position="top"></DropWrap>
            <DropWrap position="left"></DropWrap>
            <DropWrap position="right"></DropWrap>
        </div>
    )
}


const DropWrap: React.FC<{ position: Position }> = ({ position }) => {
    const { id } = useParams();
    const { isOver, setNodeRef } = useDroppable({
        data: {
            id,
            position
        },
        id: 'TerminalDroppable-' + position
    });
    const trigger: Record<Position, string> = {
        top: 'top-0 left-0 w-full h-1/3',
        left: 'left-0 top-0 w-1/2 h-full',
        right: 'right-0 top-0 w-1/2 h-full',
        bottom: 'left-0 bottom-0 w-full h-1/3',
    };
    const style: Record<Position, string> = {
        top: 'top-0 left-0 w-full h-1/2',
        left: 'left-0 top-0 w-1/2 h-full',
        right: 'right-0 top-0 w-1/2 h-full',
        bottom: 'left-0 bottom-0 w-full h-1/2',
    };
    return (
        <div className={cn("absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity")} style={{ opacity: isOver ? 1 : 0 }}>
            <div className={cn("absolute border-green-400 bg-green-400/50 border-2 rounded-md", style[position])}></div>
            <div className={cn("absolute", trigger[position])} ref={setNodeRef}></div>
        </div>
    )
}