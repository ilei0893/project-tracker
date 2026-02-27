import { Link } from "react-router";

export default function Login() {
  function login() {}
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
