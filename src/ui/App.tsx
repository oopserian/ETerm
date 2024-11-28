import { Routes, Route, NavLink } from "react-router-dom";
import { CodeBracketIcon, PlusIcon, ServerStackIcon, ServerIcon } from "@heroicons/react/24/outline"
import { useEffect, useMemo, useState } from "react";
import { CreateSSHDialog } from "./modules/ssh";
import { Home } from "./pages/home";
import { Term } from "./pages/terminal";
import { Snippet } from "./pages/snippet";
import { Button } from "./components/button/button";
import useTerminalStore from "./stores/useTerminalStore";
import { cn } from "./lib/utils";

function App() {
  const {updateTerminal} = useTerminalStore();
  useEffect(()=>{
    const unsub = window.terminal.subscribeUpdate((res)=>{
      updateTerminal(res.id, res)
    })
    return () => {
      unsub();
    }
  },[])


  return (
    <div className="w-full h-[100vh] flex overflow-hidden bg-zinc-100">
      <Navs></Navs>
      <div className="w-full h-full flex flex-col overflow-hidden">
        <ViewRoute></ViewRoute>
      </div>
    </div>
  )
}

function ViewRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/terminal/:id" element={<Term />}></Route>
      <Route path="/snippets" element={<Snippet />}></Route>
    </Routes>
  )
}


const Navs = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { terminals } = useTerminalStore();
  const terminalList = useMemo(() => Object.values(terminals), [terminals]);

  const navs = [
    {
      path: "/",
      icon: <ServerStackIcon />,
      title: "服务器"
    },
    {
      path: "/snippets",
      icon: <CodeBracketIcon />,
      title: "命令片段"
    }
  ];

  return (
    <>
      <CreateSSHDialog open={isOpen} onclose={() => setIsOpen(false)}></CreateSSHDialog>
      <div className="py-2 px-3 flex flex-col gap-1 text-zinc-500 w-full max-w-40">
        <Button variant="outline" onClick={() => setIsOpen(true)} className="bg-white px-3 py-2 text-xs">
          <PlusIcon></PlusIcon>
          <p>添加服务器</p>
        </Button>
        {
          navs.map((nav, index) => (
            <NavLink key={index} to={nav.path} className={({ isActive }) => isActive ? "[&_button]:bg-white" : ""}>
              <Button variant="ghost" className="w-full px-3 py-2 text-xs">
                <div className="size-5  flex items-center justify-center">
                  {nav.icon}
                </div>
                <p>{nav.title}</p>
              </Button>
            </NavLink>
          ))
        }
        {
          terminalList.map(term => (
            <NavLink key={term.id} to={'/terminal/' + term.id} className={({ isActive }) => isActive ? "[&_button]:bg-white" : ""}>
              <Button variant="ghost" className="w-full px-3 py-2 text-xs">
                <div className={cn('size-5 flex items-center justify-center rounded-md',
                  {'text-white bg-slate-600':(term.status == "connected")}
                )}>
                  <ServerIcon />
                </div>
                <p className="text-nowrap text-ellipsis overflow-hidden">{term.host.alias}</p>
              </Button>
            </NavLink>
          ))
        }
      </div>
    </>
  )
};

export default App
