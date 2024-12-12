import React, { useEffect, useMemo, useRef, useState } from "react";
import { Terminal as Xterm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import useTerminalStore from "@/stores/useTerminalStore";
import { debounce } from "@/lib/utils";

export const TerminalPane: React.FC<{ id: string, bgColor: string }> = ({ id, bgColor }) => {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const { curFocusTerm, curTabId, tabs, setCurFocusTerm } = useTerminalStore();
    const curTab = useMemo(() => tabs[curTabId], [curTabId, tabs]);
    const isBroadcast = useMemo(() => curTab.broadcastIds.includes(id), [curTab, curFocusTerm])
    const [terminal, setTerminal] = useState<Xterm>();

    const autoFocus = () => {
        if (curFocusTerm == id) {
            terminal?.focus();
        };
    };

    const createTerm = () => {
        const fitAddon = new FitAddon();
        let t = new Xterm({
            fontSize: 14,
            scrollback: 1000,
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
                ids: isBroadcast ? curTab.broadcastIds : [id],
                command
            });
        });

        window.terminal.getSessionLogs(id!).then(logs => {
            t.write(logs);
        });

        return {
            terminal: t,
            fitAddon
        };
    };

    useEffect(() => {
        let { terminal, fitAddon } = createTerm();
        setTerminal(terminal);
        autoFocus();

        const resize = debounce(() => fitAddon.fit(), 300);
        window.addEventListener('resize', resize);

        terminal.element?.addEventListener('focusin', () => {
            setCurFocusTerm(id);
        });

        const unSub = window.terminal.subscribeOutput((data) => {
            if (data.id == id) {
                terminal.write(data.data)
            }
        });

        return () => {
            terminal.dispose();
            unSub();
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => {
        autoFocus();
    }, [curFocusTerm]);

    return (
        <div className="w-full h-full overflow-hidden" ref={terminalRef}></div>
    )
};