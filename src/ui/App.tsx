import { CommandLineIcon, PlusIcon, RectangleGroupIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { useEffect, useRef, useState } from "react";
import Dialog from "./components/dialog/dialog";
import { FormItem, FormInput } from "./components/form/form";
import { Button } from "./components/button/button"

function App() {

  useEffect(() => {
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
      <Dialog title="添加终端" open={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={(e) => console.log(e)}>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <FormItem title="IP">
                <FormInput></FormInput>
              </FormItem>
              <FormItem className="flex-1" title="端口">
                <FormInput></FormInput>
              </FormItem>
            </div>
            <FormItem title="用户名">
              <FormInput></FormInput>
            </FormItem>
            <FormItem title="密码">
              <FormInput type="password"></FormInput>
            </FormItem>
            <div className="flex gap-2">
              <Button onClick={() => setIsOpen(false)} variant="secondary">取消</Button>
              <Button type="submit">保存</Button>
            </div>
          </div>
        </form>
      </Dialog>

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
