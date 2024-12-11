import { cn } from "@/lib/utils"
import { HtmlHTMLAttributes } from "react"


export interface CardItemProps extends HtmlHTMLAttributes<HTMLElement> {
    icon: React.ReactNode,
    children: React.ReactNode,
}
export const CardItem: React.FC<CardItemProps> = ({ icon, children, ...props }) => {
    return (
        <div {...props} className={cn(
            "cursor-pointer flex items-center gap-2 w-full p-3 rounded-xl shadow-sm border border-zinc-200 bg-white hover:bg-zinc-50",
            props.className
        )}>
            <div className="size-8 p-1.5 flex items-center justify-center bg-slate-600 rounded-lg text-white">
                {icon}
            </div>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}