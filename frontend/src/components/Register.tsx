import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { authClient } from "../client";

export default function Register() {
  const navigate = useNavigate();
  const [passwordMismatch, setpasswordMismatch] = useState(false);
  const [firstNameError, setfirstNameError] = useState("");
  const [lastNameError, setlastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setformError] = useState("");

  async function register(formData: FormData) {
    try {
      await authClient.register(
        formData.get("email") as string,
        formData.get("firstName") as string,
        formData.get("lastName") as string,
        formData.get("password") as string,
        formData.get("passwordConfirmation") as string,
      );
      navigate("/login");
    } catch (e) {
      if (e instanceof Error) {
        setformError(e.message);
      } else {
        const errors = e as Record<string, string[]>;
        const fieldLabels: Record<string, string> = {
          first_name: "First Name",
          last_name: "Last Name",
          email: "Email",
          password: "Password",
        };
        const formatErrors = (key: string) =>
          errors[key]?.map((msg) => `${fieldLabels[key]} ${msg}`).join(", ");
        if (errors.first_name) setfirstNameError(formatErrors("first_name")!);
        if (errors.last_name) setlastNameError(formatErrors("last_name")!);
        if (errors.email) setEmailError(formatErrors("email")!);
        if (errors.password) setPasswordError(formatErrors("password")!);
      }
    }
  }

  function handleConfirmationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formData = new FormData(e.target.form!);
    const password = formData.get("password") as string;
    setpasswordMismatch(e.target.value !== password);
  }

  return (
    <div
      className="auth-container"
      style={{ minHeight: "700px", height: "700px" }}
    >
      <div className="auth-content">
        <h3>Register</h3>
        <form action={register} className="auth-form">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" type="text" name="firstName"></input>
            {firstNameError && <span className="error">{firstNameError}</span>}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" type="text" name="lastName"></input>
            {lastNameError && <span className="error">{lastNameError}</span>}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email"></input>
            {emailError && <span className="error">{emailError}</span>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password"></input>
            {passwordError && <span className="error">{passwordError}</span>}
          </div>
          <div>
            <label htmlFor="passwordConfirmation">Confirm Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              onChange={handleConfirmationChange}
            ></input>
          </div>
          {passwordMismatch && (
            <span className="error">Passwords do not match</span>
          )}
          {formError && <span className="error">{formError}</span>}
          <button>Register</button>

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
