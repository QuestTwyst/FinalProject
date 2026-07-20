import { Link } from "react-router-dom";

function Login() {
  return (
    <main>
      <h2>Log In</h2>

      <form>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />

        <button type="submit">Log In</button>
      </form>

      <Link to="/">Return Home</Link>
    </main>
  );
}

export default Login;