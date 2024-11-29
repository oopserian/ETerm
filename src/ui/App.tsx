import LoadingRing from "@/assets/loading-ring.svg";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { CodeBracketIcon, PlusIcon, ServerStackIcon, ServerIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { ReactNode, useEffect, useMemo, useState } from "react";
import { CreateSSHDialog } from "./modules/ssh";
import { Home } from "./pages/home";
import { Term } from "./pages/terminal";
import { Snippet } from "./pages/snippet";
import { Button } from "./components/button/button";
import useTerminalStore from "./stores/useTerminalStore";
import { cn } from "./lib/utils";

function App() {
  const { updateTerminal } = useTerminalStore();
  useEffect(() => {
    const unsub = window.terminal.subscribeUpdate((res) => {
      updateTerminal(res.id, res)
    })
    return () => {
      unsub();
    }
  }, [])


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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { terminals, curTerminal, deleteTerminal } = useTerminalStore();
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

  const statusIcon: Record<Partial<TerminalStatus>, ReactNode> = {
    'closed': null,
    'connected': <CheckIcon />,
    'authFailed': null,
    'connecting': <img src={LoadingRing} />,
    'disconnect': null,
    'error': <p>!</p>,
    '': null
  }

  const deleteTerm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, termId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTerminal(termId);
    if(curTerminal?.id == termId){
      navigate("/");
    };
  }

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
              <Button variant="ghost" className="w-full p-1 text-xs">
                <div className="size-6 flex items-center justify-center">
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
              <Button variant="ghost" className="w-full p-1 text-xs group">
                <div className={cn('relative size-6 flex items-center justify-center rounded-md text-white bg-slate-600')}>
                  <div className={cn('absolute border-zinc-100 rounded-full p-0.5 -top-1 -left-1 size-3 text-[0.5rem] leading-[0.5rem] flex items-center justify-center border opacity-100 scale-100',
                    { 'bg-blue-400': term.status == 'connecting' },
                    { 'bg-lime-500 transition-[opacity,transform] duration-300 delay-500 opacity-0 scale-0': term.status == "connected" },
                    { 'bg-red-500': term.status == "error" },
                  )}>
                    {statusIcon[term.status]}
                  </div>
                  <ServerIcon />
                </div>
                <p className="text-nowrap text-ellipsis overflow-hidden flex-1 text-start">{term.host?.alias}</p>
                <Button onClick={(e) => deleteTerm(e, term.id)} variant="ghost" className="opacity-0 size-6 p-1.5 justify-center group-hover:opacity-100 hover:bg-zinc-100">
                  <XMarkIcon />
                </Button>
              </Button>
            </NavLink>
          ))
        }
      </div>
    </>
  )
};

export default App
