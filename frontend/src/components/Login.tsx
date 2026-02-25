export default function Login() {
  function login() {}
  return (
    <div className="auth-container">
      <div className="auth-content">
        <form action={login} className="auth-form">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email"></input>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password"></input>
          </div>

          <button>Login</button>
        </form>
        <a href="#" rel="noopener" target="_blank">
          Forgot my password
        </a>
        <a href="#" rel="noopener" target="_blank">
          Sign up
        </a>
      </div>
    </div>
  );
}
