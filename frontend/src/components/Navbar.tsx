import { useState } from "react";
import logo from "../assets/project-tracker-logo.svg";
import { useUser } from "../context/UserContext";
import SettingsMenu from "./SettingsMenu";

export default function Navbar() {
  const [settingsHidden, setSettingsHidden] = useState(false);

  const user = useUser();
  function handleClick() {
    setSettingsHidden((hidden) => !hidden);
  }
  return (
    <nav className="nav">
      <a className="nav__logo" href="#">
        <img src={logo}></img>
      </a>
      <div>
        <button onClick={handleClick} className="nav__profile-icon">
          {user?.firstName[0]}
        </button>
        <SettingsMenu settingsHidden={settingsHidden} />
      </div>
    </nav>
  );
}
