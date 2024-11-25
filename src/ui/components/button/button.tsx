import React from "react";
import { cn } from "@/lib/utils"

type Variant = 'default' | 'secondary' | 'danger' | 'outline' | 'link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    className?: string,
    variant?: Variant
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'default', ...props }) => {
    const variantMapping: Record<Variant, string> = {
        default: 'w-full cursor-pointer text-sm bg-zinc-900 text-white py-2 rounded-md shadow hover:bg-zinc-900/80',
        secondary: 'w-full cursor-pointer text-sm bg-gray-200 text-zinc-900 py-2 rounded-md shadow hover:bg-gray-200/80',
        danger: 'w-full cursor-pointer text-sm bg-red-500 text-white py-2 rounded-md shadow',
        outline: 'w-full cursor-pointer text-sm border text-zinc-900 py-2 rounded-md shadow-sm hover:bg-zinc-100',
        link: 'cursor-pointer text-sm text-blue-500 underline py-2 rounded-md',
    };

    return (
        <button type="button" {...props} className={cn('[&_svg]:size-4 flex gap-1 items-center justify-center',className, variantMapping[variant])}>
            {children}
        </button>
    )
}