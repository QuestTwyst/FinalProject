import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>QuestTwyst</h1>
      <p>Choose your path and create your own adventure.</p>

      <Link to="/login">Log In</Link>
      <Link to="/register">Create Account</Link>
    </main>
  );
}

export default Home;