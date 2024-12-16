import LoadingRing from "@/assets/loading-ring.svg";
import { cn } from "@/lib/utils";
import useTerminalStore, { TerminalTab } from "@/stores/useTerminalStore";
import { useDraggable } from "@dnd-kit/core";
import { ReactNode, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IconLayoutBoardSplit, IconTerminal2, IconX, IconCheck } from "@tabler/icons-react";
import { buttonVariants, Button } from "@/components/ui/button";

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


export const NavItemForTerminal: React.FC<NavItemForTerminalProp> = ({ id, tab }) => {
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
            buttonVariants({
                variant: isActive && curTabId == id ? "default" : "ghost",
                size: 'sm'
            }), 'justify-start group'
        )}>
            <div className="relative">
                {terminals[id]?.status && <StatusBadge status={terminals[id]?.status} />}
                {tab?.views ? <IconLayoutBoardSplit /> : <IconTerminal2 />}
            </div>
            <p className="text-nowrap text-ellipsis overflow-hidden flex-1 text-start">{tab?.name}</p>
            <Button asChild onClick={(e) => deleteTab(e)} variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                <IconX />
            </Button>
        </NavLink>
    )
}

const StatusBadge: React.FC<{ status: TerminalStatus }> = ({ status }) => {
    const statusIcon: Record<Partial<TerminalStatus>, ReactNode> = {
        'closed': null,
        'connected': <IconCheck />,
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