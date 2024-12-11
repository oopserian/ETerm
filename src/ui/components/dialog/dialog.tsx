import { cn } from "@/lib/utils"
import React from "react"
import { IconX } from "@tabler/icons-react";

interface DialogProps {
    children: React.ReactNode;
    title: string;
    open?: boolean;
    onClose?: () => void;
    className?: string;
}

const Dialog: React.FC<DialogProps> = ({ children, title, className, open = false, onClose }) => {
    return (
        <div onClick={onClose} className={cn(
            'fixed w-full h-full top-0 left-0 bg-black/50 z-50 flex items-center justify-center',
            'opacity-0 pointer-events-none transition-[opacity]',
            className,
            { 'opacity-100 pointer-events-auto': open })}>
            <div onClick={(e) => e.stopPropagation()} className={cn(
                'rounded-xl w-full max-w-80 border border-zinc-200 bg-white shadow-sm',
                'translate-y-4 transition-[transform]',
                {'translate-y-0':open})}>
                <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200">
                    <p className="select-none text-sm">{title}</p>
                    <IconX onClick={onClose} className="w-4 h-4 cursor-pointer"/>
                </div>
                <div className="p-4 pt-3">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Dialog