import { Button, buttonVariants } from "@/components/ui/button";
import { NavLink, Route, Routes } from "react-router-dom";
import { TerminalNavs } from "./terminal/nav";
import { Home } from "@/pages/home";
import { Snippet } from "@/pages/snippet";
import { Terminal } from "@/pages/terminal";
import { IconServer2, IconCode, IconTerminal2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const routes = [
    {
        path: "/",
        icon: <IconServer2 />,
        title: "服务器",
        element: <Home />,
    },
    {
        path: "/terminal",
        icon: <IconTerminal2 />,
        title: "终端",
        element: <Terminal />,
        hide: true
    },
    {
        path: "/snippets",
        icon: <IconCode />,
        title: "命令片段",
        element: <Snippet />
    }
]

export const Layout = () => {
    return (
        <>
            <DragBar></DragBar>
            <div className="w-full h-[100vh] flex overflow-hidden bg-zinc-100">
                <Nav></Nav>
                <div className="w-full h-full flex flex-col overflow-hidden">
                    <ViewRoutes></ViewRoutes>
                </div>
            </div>
        </>
    )
}

export const DragBar = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-10 regin drag-bar pointer-events-none"></div>
    )
}

function ViewRoutes() {
    return (
        <Routes>
            {
                routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element}></Route>
                ))
            }
        </Routes>
    )
}


const Nav = () => {
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
            </div>
        </>
    )
};