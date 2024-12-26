import { IconTerminal2, IconPlus, IconX, IconEdit } from "@tabler/icons-react";
import React, { useEffect, useMemo } from "react"
import useHostStore from "@/stores/useHostStore"
import useTerminalStore from "@/stores/useTerminalStore";
import { CardItem } from "@/components/card/card";
import { Button } from "@/components/ui/button";
import { SSHConfigDialog } from "@/modules/ssh/ConfigDialog";
import { EmptyList } from "@/components/empty/empty";
import { toast } from "sonner";

export const Home = () => {
    const { hosts, getHosts } = useHostStore();
    const hostList = useMemo(() => Object.values(hosts), [hosts]);

    useEffect(() => {
        getHosts();
    }, []);

    return (
        <>
            <div className="py-3 pr-3 flex flex-col gap-2 w-full h-full">
                <div className="flex justify-between">
                    <p className="font-medium text-lg">服务器</p>
                    <SSHConfigDialog>
                        <Button variant="default" size="sm">
                            <IconPlus></IconPlus>
                            <p>添加服务器</p>
                        </Button>
                    </SSHConfigDialog>
                </div>
                {
                    hostList.length ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
                            {
                                hostList.length ? (
                                    hostList.map((item) => (
                                        <HostItem key={item.id} host={item}></HostItem>
                                    ))
                                ) : ''
                            }
                        </div>) : <EmptyList></EmptyList>
                }
            </div>
        </>
    )
};


const HostItem: React.FC<{ host: HostData }> = ({ host }) => {
    let { addTab } = useTerminalStore();
    const { getHosts } = useHostStore();

    const connectHost = async () => {
        try {
            let id = await window.host.connect(host);
            addTab({
                id,
                name: host.alias,
                host,
                status: 'connecting'
            });
        } catch (err: any) {
            toast(err.message);
        }
    };

    const deleteHost = async (e: any) => {
        e.stopPropagation();
        await window.host.delete(host.id!);
        getHosts();
    };

    return (
        <CardItem className="group" onClick={connectHost} icon={<IconTerminal2 />}>
            <div className="flex justify-between items-center w-full">
                <div>
                    <p className="text-xs">{host.alias}</p>
                    <div className="flex text-xs text-zinc-500">
                        <p>ssh</p>,
                        <p>{host.username}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <SSHConfigDialog initialData={host}>
                        <Button variant="ghost" size="icon">
                            <IconEdit></IconEdit>
                        </Button>
                    </SSHConfigDialog>
                    <Button onClick={deleteHost} variant="ghost" size="icon">
                        <IconX></IconX>
                    </Button>
                </div>
            </div>
        </CardItem>
    )
}