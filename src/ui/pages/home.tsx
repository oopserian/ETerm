import { ServerIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useMemo } from "react"
import useHostStore from "@/stores/useHostStore"
import useTerminalStore from "@/stores/useTerminalStore";
import { toast } from "sonner";

export const Home = React.memo(() => {
    const { hosts, getHosts } = useHostStore();
    const hostList = useMemo(() => Object.values(hosts), [hosts]);

    useEffect(() => {
        getHosts();
    }, []);

    return (
        <div className="py-3 pr-3 flex flex-col gap-2">
            <p className="font-medium text-lg">服务器</p>
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
    )
});


const HostItem: React.FC<{ host: HostData }> = ({ host }) => {
    let { setTerminal } = useTerminalStore();
    const connectHost = async () => {
        try{
            let id = await window.host.connect(host);
            setTerminal({ id, host, status: 'connecting'});
        }catch(err:any){
            toast.error(err.message)
        }
    }

    return (
        <div onClick={connectHost} className="cursor-pointer flex items-center gap-2 w-full p-3 rounded-xl shadow-sm border border-zinc-200 bg-white hover:bg-zinc-50">
            <div className="size-8 p-1.5 bg-slate-600 rounded-lg text-white">
                <ServerIcon></ServerIcon>
            </div>
            <div className="flex flex-col">
                <p className="text-xs">{host.alias}</p>
                <div className="flex text-xs text-zinc-500">
                    <p>ssh</p>,
                    <p>{host.username}</p>
                </div>
            </div>
        </div>
    )
}