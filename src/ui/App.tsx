import { Routes, Route, NavLink } from "react-router-dom";
import { PlusIcon, ServerStackIcon } from "@heroicons/react/24/outline"
import { useState } from "react";
import { CreateSSHDialog } from "./modules/ssh";
import { Home } from "./pages/home";
import { Term } from "./pages/term";
import { Button } from "./components/button/button";

function App() {
  return (
    <div className="w-full h-[100vh] flex overflow-hidden bg-zinc-100">
      <SideBar></SideBar>
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
      <Route path="/terminal" element={<Term />}></Route>
    </Routes>
  )
}


function SideBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <CreateSSHDialog open={isOpen} onclose={() => setIsOpen(false)}></CreateSSHDialog>
      <div className="py-2 px-3 flex flex-col gap-1 text-zinc-500 w-full max-w-40">
        <Button variant="outline" onClick={() => setIsOpen(true)} className="bg-white px-3 py-2 text-xs">
          <PlusIcon></PlusIcon>
          <p>添加服务器</p>
        </Button>
        <NavLink to="/">
          <Button variant="ghost" className="w-full px-3 py-2 text-xs">
            <div className="size-4">
              <ServerStackIcon></ServerStackIcon>
            </div>
            <p>服务器</p>
          </Button>
        </NavLink>
        {/* <NavLink to="/terminal">
          <Button variant="ghost" className="w-full px-3 py-2 text-xs">
            <div className="size-4">
              <RectangleGroupIcon></RectangleGroupIcon>
            </div>
            <p>多控</p>
          </Button>
        </NavLink> */}
      </div>
    </>
  )
}

export default App
