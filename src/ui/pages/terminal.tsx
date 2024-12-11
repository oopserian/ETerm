import '@xterm/xterm/css/xterm.css';
import React, { useEffect, useState } from "react";
import useTerminalStore, { Position, TerminalData, View } from '@/stores/useTerminalStore';
import { ServerIcon } from '@heroicons/react/24/outline';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { TerminalPane } from '@/components/terminal/terminal';

export function Terminal() {
    const { terminals, tabs, curTabId } = useTerminalStore();
    const [ViewComponent, setViewComponent] = useState<React.FC | null>(null);

    useEffect(() => {
        if (!curTabId) return;
        let views = tabs[curTabId]?.views;
        let NewComponent: React.FC | null = null;
        if (views) {
            const splitViews = Object.values(views).filter((view) => view.type);
            NewComponent = () => <SplitViews views={views} view={splitViews[0]} />;
        } else {
            NewComponent = () => <TerminalItem terminal={terminals[curTabId]} />;
        };

        setViewComponent(() => NewComponent);
    }, [curTabId, tabs, terminals]);

    if (!curTabId || !ViewComponent) return null;

    return (
        <div className="flex gap-2 flex-1 w-full h-full py-1 pr-1">
            <div className="w-full h-full">
                <ViewComponent />
            </div>
        </div>
    );
};

interface SplitViewsProps extends React.HtmlHTMLAttributes<HTMLElement> {
    views: Record<string, View>
    view: View
}

const SplitViews: React.FC<SplitViewsProps> = ({ views, view, ...props }) => {
    const { terminals } = useTerminalStore();

    if (!view.views) {
        return (
            <TerminalItem style={props.style} terminal={terminals[view.id]} />
        );
    };

    let style = view.type == 'x' ? {
        width: (100 * view.rate!) + '%'
    } : {
        height: (100 * view.rate!) + '%'
    };

    const renderView = (cviews: string[]) => (
        <div style={props.style} className={cn("flex gap-1 h-full w-full overflow-hidden", {
            'flex-col': view.type === 'y',
            'flex-row': view.type === 'x',
        }, props.className)}>
            {cviews?.map((id: string) => (
                views[id] && <SplitViews key={id} style={style} views={views} view={views[id]} />
            ))}
        </div>
    );

    return renderView(view.views)
};

interface TerminalItemProps extends React.HtmlHTMLAttributes<HTMLElement> {
    terminal: TerminalData
}

const TerminalItem: React.FC<TerminalItemProps> = ({ terminal, ...props }) => {
    const { curFocusTerm, setCurFocusTerm } = useTerminalStore();
    let { id, name } = terminal;
    const bgColor = '#212121';
    
    const style = {
        ...props.style,
        borderColor: bgColor,
        borderStyle: curFocusTerm == id ? 'solid' : 'dashed'
    };

    return (
        <div onClick={()=>setCurFocusTerm(id)} style={style} className="p-0.5 border rounded-lg w-full h-full">
            <div className="relative w-full h-full overflow-hidden">
                <div className="flex flex-col gap-2 w-full h-full rounded-md p-2" style={{ background: bgColor }}>
                    <div className="flex items-center gap-2 text-white text-sm opacity-70 un-drag-bar">
                        <ServerIcon className="size-4" />
                        <p>{name}</p>
                    </div>
                    <TerminalPane id={id} bgColor={bgColor}></TerminalPane>
                </div>
                <DropWrap position="bottom" dropId={id}></DropWrap>
                <DropWrap position="top" dropId={id}></DropWrap>
                <DropWrap position="left" dropId={id}></DropWrap>
                <DropWrap position="right" dropId={id}></DropWrap>
            </div>
        </div>
    )
};


const DropWrap: React.FC<{ position: Position, dropId: string }> = ({ position, dropId }) => {
    const { curTabId } = useTerminalStore();
    const { isOver, setNodeRef } = useDroppable({
        data: {
            tabId: curTabId,
            dropId: dropId,
            position
        },
        id: `Droppable-${dropId}-${position}`
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