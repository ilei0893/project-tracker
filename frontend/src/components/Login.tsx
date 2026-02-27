import { Link, useNavigate } from "react-router";
import { authClient } from "../client.ts";

export default function Login() {
  const navigate = useNavigate();
  async function login(formData: FormData) {
    try {
      const res = await authClient.login(
        formData.get("email") as string,
        formData.get("password") as string,
      );
      sessionStorage.setItem("token", res.token);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <div className="auth-container">
      <div className="auth-content">
        <h3>Login</h3>
        <form action={login} className="auth-form">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email"></input>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password"></input>
          </div>

          <button>Login</button>
        </form>
        <a href="#" rel="noopener" target="_blank">
          Forgot my password
        </a>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
