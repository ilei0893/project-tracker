import "./App.css";
import "./styles/auth.css";
import "./styles/nav.css";
import "./styles/project.css";
import "./styles/modal.css";
import Kanban from "./components/Kanban.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  return (
    <>
      <Navbar />
      <Kanban />
    </>
  );
}

export default App;
