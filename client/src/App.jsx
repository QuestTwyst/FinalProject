import { Navigate, Route, Routes } from "react-router-dom";
import StoryIntro from "./components/StoryIntro";
import StoryLibrary from "./components/StoryLibrary";
import StoryReader from "./components/StoryReader";
import StoryCreator from "./components/StoryCreator";
import About from "./components/About";
import Login from "./pages/Login.jsx";
import CreateAccount from "./components/CreateAccount.jsx";
import Profile from "./components/Profile";
import PasswordReset from "./components/PasswordReset.jsx";

function AdminRoute({ children }) {
  const authToken = localStorage.getItem("authToken");

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
  } catch (error) {
    console.error("Unable to read the logged-in user:", error);
  }

  // Not logged in
  if (!authToken || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but not an administrator
  if (currentUser.role !== "admin") {
    return <Navigate to="/library" replace />;
  }

  // Logged-in administrator
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<StoryIntro />} />
      <Route path="/intro" element={<StoryIntro />} />
      <Route path="/library" element={<StoryLibrary />} />
      <Route path="/stories/:storyId" element={<StoryReader />} />

      <Route
        path="/create"
        element={
          <AdminRoute>
            <StoryCreator />
          </AdminRoute>
        }
      />

      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/create-account"
        element={<CreateAccount />}
      />
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/password-reset"
        element={<PasswordReset />}
      />
    </Routes>
  );
}

export default App;