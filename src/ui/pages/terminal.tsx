import '@xterm/xterm/css/xterm.css';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { Button } from '@/components/button/button';
import { TerminalSide } from '@/modules/terminal/side';
import { TerminalPane } from '@/modules/terminal/pane';
import React, { useEffect, useMemo, useState } from "react";
import useTerminalStore, { Position, TerminalData, View } from '@/stores/useTerminalStore';
import { IconTerminal2, IconLayoutSidebarRight, IconLayoutSidebarRightFilled, IconSitemap, IconSitemapFilled, IconCloudCode } from '@tabler/icons-react';

export function Terminal() {
    const { curTabId, tabs, updateTab } = useTerminalStore();
    const curTab = useMemo(() => tabs[curTabId], [curTabId, tabs]);
    const isBroadcast = useMemo(() => curTab?.broadcastIds.length, [curTab]);
    if (!curTab) return;
    const switchBroadcastInput = () => {
        if (!curTab.views) return;
        let broadcastIds = Object.keys(curTab.views).filter(key => key.indexOf('-') <= -1);
        if (isBroadcast) {
            broadcastIds = [];
        };
        updateTab(curTabId, {
            broadcastIds
        });
    };

    const switchSidebarVisible = () => {
        updateTab(curTabId, {
            sidebarVisible: !curTab.sidebarVisible
        })
    };

    return (
        <div className="flex flex-col gap-1 flex-1 w-full h-full py-1 pr-1">
            <div className="flex px-1 gap-1 w-full justify-end items-center">
                <Button onClick={switchBroadcastInput} variant="ghost" className="p-1.5">
                    {
                        isBroadcast ? <IconSitemapFilled /> : <IconSitemap />
                    }
                </Button>
                <Button onClick={switchSidebarVisible} variant="ghost" className="p-1.5">
                    {
                        curTab.sidebarVisible ? <IconLayoutSidebarRightFilled /> : <IconLayoutSidebarRight />
                    }
                </Button>
            </div>
            <div className="flex gap-1 w-full h-full overflow-hidden">
                <div className={cn("w-full h-full", curTab.sidebarVisible ? "w-[70%]" : "w-full")}>
                    <TerminalView />
                </div>
                <div className={cn("w-[30%]", curTab.sidebarVisible ? "block" : "hidden")}>
                    <TerminalSide />
                </div>
            </div>
        </div>
    )
};

export function TerminalView() {
    const { terminals, tabs, curTabId } = useTerminalStore();
    const [ViewComponent, setViewComponent] = useState<React.FC | null>(null);
    const views = useMemo(() => tabs[curTabId]?.views, [tabs, curTabId, terminals]);
    useEffect(() => {
        if (!curTabId) return;
        let NewComponent: React.FC | null = null;
        if (views) {
            const splitViews = Object.values(views).filter((view) => view.type);
            NewComponent = () => <SplitViews views={views} view={splitViews[0]} />;
        } else {
            NewComponent = () => <TerminalItem terminal={terminals[curTabId]} />;
        };
        setViewComponent(() => NewComponent);
    }, [views]);

    if (!curTabId || !ViewComponent) return null;

    return (
        <ViewComponent />
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
    let { id, name } = terminal;
    const { tabs, curTabId, curFocusTerm, setCurFocusTerm, updateTab } = useTerminalStore();
    const curTab = useMemo(() => tabs[curTabId], [curTabId, tabs]);
    const isBroadcast = useMemo(() => curTab.broadcastIds.includes(id), [curTab]);

    const bgColor = '#212121';

    const style = {
        ...props.style,
        ...(
            isBroadcast ? {
                borderColor: '#16a34a',
                padding: curFocusTerm == id ? '0' : '1px',
                borderWidth: curFocusTerm == id ? '2px' : '1px',
                borderStyle: curFocusTerm == id ? 'solid' : 'dashed'
            } : {
                padding: '1px',
            }
        )
    };

    const switchBroadcastStatus = () => {
        let curBroadcastIds = curTab.broadcastIds;
        let broadcastIds = isBroadcast ? curBroadcastIds.filter(i => i !== id) : [...curBroadcastIds, id];
        updateTab(curTabId, {
            broadcastIds
        });
    };

    return (
        <div onClick={() => setCurFocusTerm(id)} style={style} className="border rounded-lg w-full h-full">
            <div className="relative w-full h-full overflow-hidden">
                <div className="flex flex-col gap-2 w-full h-full rounded-md p-2 text-zinc-400" style={{ background: bgColor }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-xs un-drag-bar">
                            <IconCloudCode size={17} />
                            <p>{name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={switchBroadcastStatus} variant="ghost" className="hover:bg-black p-1.5">
                                {
                                    isBroadcast ? <IconSitemapFilled /> : <IconSitemap />
                                }
                            </Button>
                        </div>
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