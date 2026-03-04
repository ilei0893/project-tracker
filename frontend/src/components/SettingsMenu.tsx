import { authClient } from "../client";
import { useNavigate } from "react-router";
import { clearRefreshToken } from "../auth";
export default function SettingsMenu({
  settingsHidden,
}: {
  settingsHidden: boolean;
}) {
  const navigate = useNavigate();
  async function logout() {
    await authClient.logout();
    clearRefreshToken();
    navigate("/login");
  }
  return (
    settingsHidden && (
      <div className="settings-menu">
        <ul>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      </div>
    )
  );
}
