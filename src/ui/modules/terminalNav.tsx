import LoadingRing from "@/assets/loading-ring.svg";
import { Button } from "@/components/button/button";
import { cn } from "@/lib/utils";
import useTerminalStore, { TerminalTab } from "@/stores/useTerminalStore";
import { useDraggable } from "@dnd-kit/core";
import { CheckIcon, ServerIcon, XMarkIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import { ReactNode, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

interface NavItemForTerminalProp extends React.LinkHTMLAttributes<HTMLLinkElement> {
    id: string,
    tab: TerminalTab
}

export const TerminalNavs: React.FC = () => {
    const { tabs } = useTerminalStore();
    const tabKeysList = useMemo(() => Object.keys(tabs), [tabs]);

    return (
        <>
            {
                tabKeysList.map(key => (
                    <NavItemForTerminal key={key} id={key} tab={tabs[key]}></NavItemForTerminal>
                ))
            }
        </>
    )
}


export const NavItemForTerminal: React.FC<NavItemForTerminalProp> = ({ id, tab, ...prop }) => {
    const navigate = useNavigate();
    const { curTabId, terminals, deleteView, activeTab } = useTerminalStore();
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
    });

    const deleteTab = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        deleteView(id);
        if (curTabId == id) {
            activeTab('');
            navigate("/");
        };
    };

    const selectTab = () => {
        activeTab(id);
    };

    return (
        <NavLink onClick={selectTab} ref={setNodeRef} {...listeners} {...attributes} to={'/terminal'} className={({ isActive }) => cn(
            (isActive && curTabId == id) ? "[&_button]:bg-white" : ""
        )}>
            <Button variant="ghost" className={cn('w-full p-1 text-xs group', prop.className)}>
                <div className={cn('relative size-6 flex items-center justify-center rounded-md text-white bg-slate-600')}>
                    {terminals[id]?.status && <StatusBadge status={terminals[id]?.status} />}
                    {tab?.views ? <RectangleGroupIcon /> : <ServerIcon />}
                </div>
                <p className="text-nowrap text-ellipsis overflow-hidden flex-1 text-start">{tab?.name}</p>
                <Button as="div" onClick={(e) => deleteTab(e)} variant="ghost" className="opacity-0 size-6 p-1.5 justify-center group-hover:opacity-100 hover:bg-zinc-100">
                    <XMarkIcon />
                </Button>
            </Button>
        </NavLink>
    )
}

const StatusBadge: React.FC<{ status: TerminalStatus }> = ({ status }) => {
    const statusIcon: Record<Partial<TerminalStatus>, ReactNode> = {
        'closed': null,
        'connected': <CheckIcon />,
        'authFailed': null,
        'connecting': <img src={LoadingRing} />,
        'disconnect': null,
        'error': <p>!</p>,
        '': null
    };

    return (
        <div className={cn('absolute border-zinc-100 rounded-full p-0.5 -top-1 -left-1 size-3 text-[0.5rem] leading-[0.5rem] flex items-center justify-center border opacity-100 scale-100',
            { 'bg-blue-400': status == 'connecting' },
            { 'bg-lime-500 transition-[opacity,transform] duration-300 delay-500 opacity-0 scale-0': status == "connected" },
            { 'bg-red-500': status == "error" },
        )}>
            {statusIcon[status]}
        </div>
    );
}