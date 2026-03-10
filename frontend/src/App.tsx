import "./App.css";
import "./styles/auth.css";
import "./styles/nav.css";
import "./styles/project.css";
import "./styles/modal.css";
import Kanban from "./components/Kanban.tsx";
import Navbar from "./components/Navbar.tsx";
import { ToastContainer, Bounce } from "react-toastify";
function App() {
  return (
    <>
      <Navbar />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        aria-label={"toast"}
      />
      <Kanban />
    </>
  );
}

export default App;
