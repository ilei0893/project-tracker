import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { authClient } from "../client";

export default function Register() {
  const navigate = useNavigate();
  const [passwordMismatch, setpasswordMismatch] = useState(false);

  async function register(formData: FormData) {
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;
    if (password !== passwordConfirmation) {
      setpasswordMismatch(true);
      return;
    }
    try {
      await authClient.register(
        formData.get("email") as string,
        password,
        passwordConfirmation,
      );
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  }

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
            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
            ></input>
          </div>
          {passwordMismatch ? (
            <span style={{ color: "red" }}>Passwords do not match</span>
          ) : (
            ""
          )}
          <button>Register</button>

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
