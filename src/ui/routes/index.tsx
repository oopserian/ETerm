import { Home } from "@/pages/home";
import { Snippet } from "@/pages/snippet";
import { Terminal } from "@/pages/terminal";
import { IconCode, IconServer2, IconTerminal2 } from "@tabler/icons-react";
import { Route, Routes } from "react-router-dom";

export const routes = [
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
];

export const Views = () => {
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