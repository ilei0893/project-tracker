export default function Register() {
  function register() {}
  return (
    <div className="auth-container">
      <div className="auth-content">
        <form action={register} className="auth-form">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email"></input>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password"></input>
          </div>
          <div>
            <label htmlFor="password-confirmation">Confirm Password</label>
            <input
              id="password-confirmation"
              name="password-confirmation"
            ></input>
          </div>

          <button>Register</button>
        </form>
      </div>
    </div>
  );
}
