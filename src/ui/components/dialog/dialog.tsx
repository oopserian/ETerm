import { cn } from "@/lib/utils"
import React from "react"
import { XMarkIcon } from "@heroicons/react/24/solid";

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
            'opacity-0 pointer-events-none',
            className,
            { 'opacity-100 pointer-events-auto': open })}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl w-full max-w-80 border border-zinc-200">
                <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200">
                    <p className="text-sm">{title}</p>
                    <XMarkIcon onClick={onClose} className="w-4 h-4"></XMarkIcon>
                </div>
                <div className="p-4 pt-3">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Dialog