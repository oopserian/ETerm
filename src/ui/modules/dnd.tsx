import useTerminalStore from "@/stores/useTerminalStore";
import { DndContext as DndKitContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, useSensor, useSensors } from "@dnd-kit/core"
import { useState } from "react";
import { NavItemForTerminal } from "./terminalNav";

export const DndContextTerminal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dragId, setDragId] = useState<number | string | null>(null);
    const { terminals, updateTerminal } = useTerminalStore();
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 15
        }
    });

    const sensors = useSensors(mouseSensor);

    const handleDragStart = (event: DragStartEvent) => {
        setDragId(event.active.id)
    };

    const handleDragEnd = (event: DragEndEvent) => {
        let dragData = event.active;
        let dropData = event.over?.data.current;
        if (dragData.id == dropData?.id) return;
        console.log(terminals)
        console.log(dragData)
        console.log(dropData)
        // updateTerminal(event.over?.id,)
        setDragId(null)
    };

    return (
        <DndKitContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {children}
            <TerminalDragOverlay activeId={dragId}></TerminalDragOverlay>
        </DndKitContext>
    )
};


const TerminalDragOverlay: React.FC<{ activeId: string | number | null }> = ({ activeId }) => {
    const { terminals } = useTerminalStore();
    return (
        <DragOverlay>
            {activeId ? (<NavItemForTerminal className="bg-zinc-100 pointer-events-none shadow-sm" id={'1'} data={terminals[activeId]}></NavItemForTerminal>) : null}
        </DragOverlay>
    )
};