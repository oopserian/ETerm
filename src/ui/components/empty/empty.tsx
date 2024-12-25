import { IconInfoTriangle } from "@tabler/icons-react"

export const EmptyList:React.FC = () => {
    return (
        <div className="flex-1 w-full h-full flex flex-col gap-1 items-center justify-center text-zinc-400">
            <IconInfoTriangle size={20}/>
            <p className="text-sm">暂无数据</p>
        </div>
    )
}