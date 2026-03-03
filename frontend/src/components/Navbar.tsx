import logo from "../assets/project-tracker-logo.svg";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const user = useUser();
  return (
    <nav className="nav">
      <a className="nav__logo" href="#">
        <img src={logo}></img>
      </a>
      <button className="nav__profile-icon">{user?.firstName[0]}</button>
    </nav>
  );
}
