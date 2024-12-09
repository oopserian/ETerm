import { CodeBracketIcon, PlusIcon, ServerStackIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CreateSSHDialog } from "./ssh";
import { Button } from "@/components/button/button";
import { NavLink, Route, Routes } from "react-router-dom";
import { TerminalNavs } from "./terminalNav";
import { Home } from "@/pages/home";
import { Snippet } from "@/pages/snippet";
import { Terminal } from "@/pages/terminal";

const routes = [
    {
        path: "/",
        icon: <ServerStackIcon />,
        title: "服务器",
        element: <Home />,
    },
    {
        path: "/terminal",
        icon: <ServerStackIcon />,
        title: "终端",
        element: <Terminal />,
        hide: true
    },
    {
        path: "/snippets",
        icon: <CodeBracketIcon />,
        title: "命令片段",
        element: <Snippet />
    }
]

export const Layout = () => {
    return (
        <div className="w-full h-[100vh] flex overflow-hidden bg-zinc-100">
            <Nav></Nav>
            <div className="w-full h-full flex flex-col overflow-hidden">
                <ViewRoutes></ViewRoutes>
            </div>
        </div>
    )
}

function ViewRoutes() {
    return (
        <Routes>
            {
                routes.map((route,index) => (
                    <Route key={index} path={route.path} element={route.element}></Route>
                ))
            }
        </Routes>
    )
}


const Nav = () => {

    return (
        <>
            <div className="py-2 px-3 flex flex-col gap-1 text-zinc-500 w-full max-w-48">
                {
                    routes.map((route, index) => (
                        !route.hide && <NavLink key={index} to={route.path} className={({ isActive }) => isActive ? "[&_button]:bg-white" : ""}>
                            <Button variant="ghost" className="w-full p-1 text-xs">
                                <div className="size-6 flex items-center justify-center">
                                    {route.icon}
                                </div>
                                <p>{route.title}</p>
                            </Button>
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