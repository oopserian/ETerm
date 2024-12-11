import { Button } from "@/components/button/button"
import { IconCode, IconPalette, IconHistoryToggle } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"
export const TerminalSide: React.FC = () => {
    return (
        <div className="p-1 w-full h-full flex flex-col gap-2 overflow-hidden">
            <div className="bg-gray-200 rounded-lg p-1 grid grid-cols-3 gap-1">
                <Button className="justify-center" variant="secondary">
                    <IconCode />
                </Button>
                <Button className="justify-center" variant="ghost">
                    <IconHistoryToggle />
                </Button>
                <Button className="justify-center" variant="ghost">
                    <IconPalette />
                </Button>
            </div>
            <div className="w-full h-full overflow-auto">
                <Commands />
            </div>
        </div>
    )
}

export const Commands: React.FC = () => {
    const [commandSnippets, setCommandSnippets] = useState<Record<string, CommandSnippetData>>({});
    const commandList = useMemo(() => Object.values(commandSnippets), [commandSnippets])

    const getCommands = async () => {
        let data = await window.commandSnippet.get();
        setCommandSnippets(data);
    };

    useEffect(() => {
        getCommands();
    }, []);

    return (
        <div className="flex flex-col gap-1">
            {
                commandList.map(item => (
                    <CommandItem key={item.id} data={item}></CommandItem>
                ))
            }
        </div>
    )
}

export const CommandItem: React.FC<{ data: CommandSnippetData }> = ({ data }) => {
    return (
        <div className="group p-3 text-sm flex flex-col gap-0.5 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between gap-2 h-5">
                <p className=" text-ellipsis whitespace-nowrap overflow-hidden">{data.name || data.des || data.command}</p>
                <div className="gap-1 whitespace-nowrap hidden group-hover:flex">
                    <Button size="sm" variant="secondary">运行</Button>
                    <Button size="sm" variant="secondary">粘贴</Button>
                </div>
            </div>
            <div className="text-sm text-black/50 leading-4">{data.des || data.command}</div>
        </div>
    )
}