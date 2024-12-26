import useTerminalStore, { Position } from "@/stores/useTerminalStore";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, useSensor, useSensors } from "@dnd-kit/core"
import { useState } from "react";
import { NavItemForTerminal } from "./Navs";

interface DndContextProps {
    children: React.ReactNode;
}

export const TerminalDndContext = ({ children }: DndContextProps) => {
    const [dragId, setDragId] = useState<string | null>(null);
    const { splitView } = useTerminalStore();

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 15 }
        })
    );

    const handleDragStart = ({ active }: DragStartEvent) => {
        setDragId(active.id as string);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over?.data.current) return;

        const dropData = over.data.current as {
            tabId: string;
            dropId: string;
            position: Position;
        };

        if (active.id === dropData.tabId) return;

        splitView(dropData.tabId, active.id as string, dropData.dropId, dropData.position);
        setDragId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {children}
            <TerminalDragOverlay activeId={dragId} />
        </DndContext>
    );
};

const TerminalDragOverlay: React.FC<{ activeId: string | number | null }> = ({ activeId }) => {
    const { tabs } = useTerminalStore();
    return (
        <DragOverlay>
            {
                activeId ?
                    <NavItemForTerminal
                        className="bg-zinc-100 pointer-events-none shadow-sm"
                        id={'1'}
                        tab={tabs[activeId]} /> : null
            }
        </DragOverlay>
    )
};