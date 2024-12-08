import { Position, View } from "@/stores/useTerminalStore";

interface CreateSplitView {
    id: string,
    views?: Record<string, View>,
    parentViewId?: string,
    dragId: string,
    dropId: string,
    position: Position
}

export const createSplitView = ({ id, views = {}, parentViewId, dragId, dropId, position }: CreateSplitView): Record<string, View> => {
    const splitId = `split-${id}`;
    const newViewRate = 0.5;
    const splitType: View['type'] = ['left', 'right'].includes(position) ? 'x' : 'y';
    const splitViews: View['views'] = ['left', 'top'].includes(position) ? [dragId, dropId] : [dropId, dragId];
    
    if (views && parentViewId) {
        views[splitId] = {
            id: splitId,
            pView: parentViewId,
            type: splitType,
            rate: newViewRate,
            views: splitViews,
        };

        views[parentViewId].views = views[parentViewId].views?.map((view) =>
            view === dropId ? splitId : view
        ) as [string, string];

        views[dragId] = { id: dragId, pView: splitId };
        views[dropId] = { id: dropId, pView: splitId };
    } else {
        views = {
            [splitId]: {
                id: splitId,
                type: splitType,
                rate: newViewRate,
                views: splitViews,
            },
            [dragId]: { id: dragId, pView: splitId },
            [dropId]: { id: dropId, pView: splitId },
        };
    }

    return views;
};