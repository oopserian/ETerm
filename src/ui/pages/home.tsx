import { IconTerminal2, IconPlus } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react"
import useHostStore from "@/stores/useHostStore"
import useTerminalStore from "@/stores/useTerminalStore";
import { toast } from "sonner";
import { CardItem } from "@/components/card/card";
import { Button } from "@/components/ui/button";
import { CreateSSHDialog } from "@/modules/ssh";

export const Home = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { hosts, getHosts } = useHostStore();
    const hostList = useMemo(() => Object.values(hosts), [hosts]);

    useEffect(() => {
        getHosts();
    }, []);

    return (
        <>
            <CreateSSHDialog open={isOpen} onclose={() => setIsOpen(false)}></CreateSSHDialog>
            <div className="py-3 pr-3 flex flex-col gap-2">
                <div className="flex justify-between">
                    <p className="font-medium text-lg">服务器</p>
                    <Button variant="default" size="sm" onClick={() => setIsOpen(true)}>
                        <IconPlus></IconPlus>
                        <p>添加服务器</p>
                    </Button>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
                    {
                        hostList.length ? (
                            hostList.map((item) => (
                                <HostItem key={item.id} host={item}></HostItem>
                            ))
                        ) : ''
                    }
                </div>
            </div>
        </>
    )
};


const HostItem: React.FC<{ host: HostData }> = ({ host }) => {
    let { addTab } = useTerminalStore();

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
            toast.error(err.message)
        }
    }

    return (
        <CardItem onClick={connectHost} icon={<IconTerminal2 />}>
            <p className="text-xs">{host.alias}</p>
            <div className="flex text-xs text-zinc-500">
                <p>ssh</p>,
                <p>{host.username}</p>
            </div>
        </CardItem>
    )
}