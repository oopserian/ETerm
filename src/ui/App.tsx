import { TerminalDndContext } from "./modules/terminal/DndContext";
import { subscribeTerminalUpdate } from "./hooks/useSubscribeMain";
import { Layout } from "./layouts";

function App() {
  subscribeTerminalUpdate();
  return (
    <TerminalDndContext>
      <Layout />
    </TerminalDndContext>
  )
}

export default App
