import React from "react";
import { cn } from "@/lib/utils"

type Variant = 'default' | 'secondary' | 'danger' | 'outline' | 'link' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    className?: string,
    variant?: Variant
    as?: keyof JSX.IntrinsicElements;
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'default', as = 'button', ...props }) => {
    const variantMapping: Record<Variant, string> = {
        default: 'w-full text-sm bg-zinc-900 text-white py-2 rounded-md shadow border hover:bg-zinc-900/90',
        secondary: 'w-full text-sm bg-zinc-100 text-zinc-900 py-2 rounded-md shadow border hover:bg-zinc-100/50',
        danger: 'w-full text-sm bg-red-500 text-white py-2 rounded-md shadow',
        outline: 'w-full text-sm border text-zinc-900 py-2 rounded-md shadow-sm hover:bg-zinc-50',
        link: 'text-sm text-blue-500 underline py-2 rounded-md',
        ghost: 'rounded-md hover:bg-white'
    };

    const Component = as as any;

    return (
        <Component type='button' {...props} className={cn('[&_svg]:size-4 flex gap-2 items-center cursor-pointer', variantMapping[variant], className)}>
            {children}
        </Component>
    )
}