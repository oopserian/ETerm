import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TerminalNavs } from "@/modules/terminal/Navs";
import { routes } from "@/routes";
import { IconBrandGithub } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

export const SideNav = () => {
    return (
        <>
            <div className="py-2 px-3 pt-14 flex flex-col gap-1 text-zinc-500 w-full max-w-48">
                {
                    routes.map((route, index) => (
                        !route.hide &&
                        <NavLink key={index} to={route.path} className={
                            ({ isActive }) => cn(
                                buttonVariants({
                                    variant: isActive ? "default" : "ghost",
                                    size: 'sm'
                                }),
                                'justify-start')
                        }>
                            <i>{route.icon}</i>
                            <p>{route.title}</p>
                        </NavLink>
                    ))
                }
                <div className="flex flex-col gap-1 flex-1 overflow-auto">
                    <TerminalNavs></TerminalNavs>
                </div>
                <div 
                    className="flex items-center gap-1 py-1 cursor-pointer hover:text-zinc-400 transition-colors"
                    onClick={() => window.common.openExternalUrl('https://github.com/oopserian/ETerm')}
                    title="访问 GitHub 仓库"
                >
                    <IconBrandGithub size={20}></IconBrandGithub>
                </div>
            </div>
        </>
    )
};