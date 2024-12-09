import React from "react";
import { cn } from "@/lib/utils"

type Variant = 'default' | 'secondary' | 'danger' | 'outline' | 'link' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    className?: string,
    variant?: Variant
    size?: Size,
    as?: keyof JSX.IntrinsicElements;
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'default', size = 'md', as = 'button', ...props }) => {
    const variantMapping: Record<Variant, string> = {
        default: 'bg-zinc-900 text-white shadow border hover:bg-zinc-900/90',
        secondary: 'bg-zinc-100 text-zinc-900 shadow border hover:bg-zinc-100/50',
        danger: 'bg-red-500 text-white shadow',
        outline: 'border text-zinc-900 hover:bg-zinc-50',
        link: 'text-blue-500 underline',
        ghost: 'hover:bg-white'
    };

    const sizeMapping: Record<Size, string> = {
        sm: 'py-0.5 px-2 text-xs',
        md: 'py-1.5 px-3.5 text-sm',
        lg: 'py-2 px-4 text-md font-medium'
    };

    const Component = as as any;

    return (
        <Component type='button' {...props} className={cn(
            '[&_svg]:size-4 flex gap-1 items-center cursor-pointer outline-none w-auto rounded-md',
            variantMapping[variant],
            sizeMapping[size],
            className)}>
            {children}
        </Component>
    )
}