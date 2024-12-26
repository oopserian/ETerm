import { Button } from "@/components/ui/button"
import { CardItem } from "@/components/card/card"
import React, { useEffect, useMemo } from "react";
import { IconCode, IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { EmptyList } from "@/components/empty/empty";
import { SnippetConfigDialog } from "@/modules/snippet/ConfigDialog";
import { useSnippetStore } from "@/stores/useSnippetStore";

export const Snippet = () => {
    const { snippets, getSnippets } = useSnippetStore();
    const snippetList = useMemo(() => Object.values(snippets), [snippets]);
    useEffect(() => {
        getSnippets();
    }, []);
    return (
        <>
            <div className="py-3 pr-3 flex flex-col gap-2 w-full h-full">
                <div className="flex justify-between">
                    <p className="font-medium text-lg">命令片段</p>
                    <SnippetConfigDialog onSuccess={getSnippets}>
                        <Button variant="default" size="sm" className="justify-center">
                            <IconPlus />
                            <p>新增片段</p>
                        </Button>
                    </SnippetConfigDialog>
                </div>
                {
                    snippetList.length ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
                            {
                                snippetList.map(item => (
                                    <SnippetItem key={item.id} data={item}></SnippetItem>
                                ))
                            }
                        </div>) : <EmptyList></EmptyList>
                }
            </div>
        </>
    )
};


export const SnippetItem: React.FC<{ data: CommandSnippetData }> = ({ data }) => {
    const { getSnippets } = useSnippetStore();
    const del = async (e:any) => {
        e.stopPropagation();
        window.commandSnippet.delete(data.id);
        getSnippets();
    };

    return (
        <CardItem className="group" icon={<IconCode />}>
            <div className="flex justify-between items-center w-full">
                <div>
                    <p className="text-xs">{data.name}</p>
                    <div className="flex text-xs text-zinc-500">
                        <p>{data.des || data.command}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <SnippetConfigDialog onSuccess={getSnippets} initialData={data}>
                        <Button variant="ghost" size="icon">
                            <IconEdit></IconEdit>
                        </Button>
                    </SnippetConfigDialog>
                    <Button onClick={del} variant="ghost" size="icon">
                        <IconX></IconX>
                    </Button>
                </div>
            </div>
        </CardItem>
    )
}