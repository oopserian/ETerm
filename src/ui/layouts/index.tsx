import { Views } from "@/routes"
import { SideNav } from "./compontents/SideNav"
import { WindowDragbar } from "./compontents/WindowDragbar"

export const Layout = () => {
    return (
        <>
            <WindowDragbar></WindowDragbar>
            <div className="w-full h-[100vh] flex overflow-hidden bg-zinc-100">
                <SideNav></SideNav>
                <div className="w-full h-full flex flex-col overflow-hidden">
                    <Views></Views>
                </div>
            </div>
        </>
    )
}