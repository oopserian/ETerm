import { DndContextTerminal } from "./modules/dnd";
import { subscribeTerminalUpdate } from "./hooks/useSubscribeMain";
import { Layout } from "./modules/layout";

function App() {
  subscribeTerminalUpdate();
  return (
    <DndContextTerminal>
      <Layout/>
    </DndContextTerminal>
  )
}

export default App
