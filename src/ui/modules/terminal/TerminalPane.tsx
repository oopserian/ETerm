import React, { useEffect, useMemo, useRef, useState } from "react";
import { Terminal as Xterm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from '@xterm/addon-webgl';
import useTerminalStore from "@/stores/useTerminalStore";
import { debounce } from "@/lib/utils";
import { termService } from "@/hooks/useTerminal";

export const TerminalPane: React.FC<{ id: string, bgColor: string }> = ({ id, bgColor }) => {
    const { curFocusTerm, curTabId, tabs, setCurFocusTerm } = useTerminalStore();
    const curTab = useMemo(() => tabs[curTabId], [curTabId, tabs]);
    const isBroadcast = useMemo(() => curTab.broadcastIds.includes(id), [curTab, curFocusTerm])
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const [terminal, setTerminal] = useState<Xterm>();

    const autoFocus = () => {
        if (curFocusTerm == id) {
            terminal?.focus();
        };
    };

    const createTerm = () => {
        const fitAddon = new FitAddon();
        const webglAddon = new WebglAddon();
        let t = new Xterm({
            fontSize: 12,
            lineHeight: 1,
            scrollback: 1000,
            theme: {
                background: bgColor
            }
        });

        t.loadAddon(fitAddon);
        t.open(terminalRef.current!);
        t.loadAddon(webglAddon);

        t.onResize(({ cols, rows }) => termService.updateSize(id, cols, rows));

        // TODO setTimeout临时处理xterm的dimensions报错
        setTimeout(() => fitAddon.fit(), 0);

        termService.getSessionLogs(id).then(logs => t.write(logs));

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

        const unSub = termService.onOutput((data) => {
            if (data.id == id) {
                terminal.write(data.data)
            }
        })

        return () => {
            terminal.dispose();
            unSub();
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => {
        autoFocus();
    }, [curFocusTerm]);

    useEffect(() => {
        const termDataHandler = terminal?.onData((command) => {
            let ids = isBroadcast ? curTab.broadcastIds : [id];
            termService.input(ids, command);
        });

        return () => {
            termDataHandler && termDataHandler.dispose();
        };
    }, [curTab, terminal])

    return (
        <div className="w-full h-full overflow-hidden terminal-scroll" ref={terminalRef}></div>
    )
};