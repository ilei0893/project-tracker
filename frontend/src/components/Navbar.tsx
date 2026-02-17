import logo from "../assets/project-tracker-logo.svg";

export default function Navbar() {
  return (
    <nav className="nav">
      <a className="nav__logo" href="#">
        <img src={logo}></img>
      </a>
      <button className="nav__profile-icon">yo</button>
    </nav>
  );
}
