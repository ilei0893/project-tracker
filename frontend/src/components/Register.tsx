import { Link } from "react-router";

export default function Register() {
  function register() {}
  return (
    <div className="auth-container">
      <div className="auth-content">
        <h3>Register</h3>
        <form action={register} className="auth-form">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email"></input>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password"></input>
          </div>
          <div>
            <label htmlFor="password-confirmation">Confirm Password</label>
            <input
              id="password-confirmation"
              type="password"
              name="password-confirmation"
            ></input>
          </div>
          <button>Register</button>

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
