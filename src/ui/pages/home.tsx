import { ServerIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
export function Home() {
    const [hosts, setHosts] = useState<sshData[]>([]);

    const getSSH = async () => {
        let res = await window.ssh.get();
        setHosts(Object.values(res));
    };

    useEffect(() => {
        getSSH();
    }, []);

    return (
        <div className="py-3 flex flex-col gap-2">
            <p className="font-medium text-lg">服务器</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
                {
                    hosts.length ? (
                        hosts.map((item) => (
                            <HostItem key={item.id} data={item}></HostItem>
                        ))
                    ) : ''
                }
            </div>
        </div>
    )
}


const HostItem: React.FC<{ data: sshData }> = ({ data }) => {
    return (
        <div className="cursor-pointer flex items-center gap-2 w-full p-3 rounded-xl shadow-sm border border-zinc-200 bg-white hover:bg-zinc-50">
            <div className="size-8 p-1.5 bg-slate-600 rounded-lg text-white">
                <ServerIcon></ServerIcon>
            </div>
            <div className="flex flex-col">
                <p className="text-xs">{data.alias}</p>
                <div className="flex text-xs text-zinc-500">
                    <p>ssh</p>,
                    <p>{data.username}</p>
                </div>
            </div>
        </div>
    )
}