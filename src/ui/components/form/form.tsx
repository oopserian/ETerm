import { cn } from "@/lib/utils";

interface FormItemProps {
    children: React.ReactNode;
    title: string;
    className?: string;
}

export const FormItem: React.FC<FormItemProps> = ({ children, title, className }) => {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <p className="text-sm font-medium">{title}</p>
            <div className="">
                {children}
            </div>
        </div>
    )
}

export const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
    return (
        <input {...props} className={cn('w-full border shadow-sm rounded-md px-3 py-1 focus-visible:outline-none', props.className)} />
    )
}