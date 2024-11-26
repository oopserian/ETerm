import { CommandLineIcon, PlusIcon, RectangleGroupIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { useEffect, useRef, useState } from "react";
import { CreateSSHDialog } from "./modules/ssh";

function App() {
  useEffect(() => {
    window.terminal.subscribeOutput((data) => {
      console.log(data);
    })
    const fetchData = async () => {
      let res = await window.ssh.get();
      console.log(res);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[100vh] flex overflow-hidden">
      <SideBar></SideBar>
      <div className="w-full h-full flex flex-col bg-white overflow-hidden">
        <TabBar></TabBar>
        <TerminalCom></TerminalCom>
      </div>
    </div>
  )
}

function TerminalCom() {
  const bgColor = '#212121';
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true, // 设置光标闪烁
      fontSize: 14,
      theme: {
        background: bgColor
      }
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current!);
    fitAddon.fit();
    for (let i = 0; i < 100; i++) {
      term.writeln('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' + i);
    }

    term.onData((data) => {
      window.terminal.input({
        id: '123',
        command: data
      });
    })

    return () => {
      term.dispose();
    }
  }, []);

  return (
    <div ref={terminalRef} className="flex-1 w-full" style={{ background: bgColor }}></div>
  )
}

function TabBar() {
  return (
    <div className="flex p-2 gap-1 border-b border-gray-200">
      <div className="cursor-pointer flex items-center gap-2 text-xs rounded-md px-3 py-2 hover:bg-zinc-100">
        <p>我的终端机器</p>
        <XMarkIcon className="w-4 h-4"></XMarkIcon>
      </div>
      <div className="cursor-pointer flex items-center gap-2 text-xs rounded-md px-3 py-2 hover:bg-gray-100">
        <p>我的终端机器</p>
        <XMarkIcon className="w-4 h-4"></XMarkIcon>
      </div>
    </div>
  )
}


function SideBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <CreateSSHDialog open={isOpen} onclose={() => setIsOpen(false)}></CreateSSHDialog>
      <div className="p-3 flex flex-col gap-2 bg-zinc-100 text-zinc-500 border-gray-200 border-r">
        <button onClick={() => setIsOpen(true)} className="w-6 h-6 p-1 mb-4 bg-white border-gray-200 border border-solid rounded-md">
          <PlusIcon></PlusIcon>
        </button>
        <button className="w-6 h-6 p-1 rounded-md hover:bg-gray-200">
          <CommandLineIcon></CommandLineIcon>
        </button>
        <button className="w-6 h-6 p-1 rounded-md hover:bg-gray-200">
          <RectangleGroupIcon></RectangleGroupIcon>
        </button>
      </div>
    </>
  )
}

export default App
