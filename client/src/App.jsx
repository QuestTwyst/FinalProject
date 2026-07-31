import { Navigate, Route, Routes } from "react-router-dom";
import { useGlobalClickSound } from "./utils/useGlobalClickSound";
import ToastContainer from "./components/ToastContainer";
import { usePersistentDisableOnSubmit } from "./utils/usePersistentDisableOnSubmit";
import StoryIntro from "./components/StoryIntro";
import StoryLibrary from "./components/StoryLibrary";
import StoryReader from "./components/StoryReader";
import StoryCreator from "./components/StoryCreator";
import About from "./components/About";
import Login from "./pages/Login.jsx";
import CreateAccount from "./components/CreateAccount.jsx";
import Profile from "./components/Profile";
import PasswordReset from "./components/PasswordReset.jsx";

function AuthenticatedRoute({ children }) {
  const authToken = localStorage.getItem("authToken");

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
  } catch (error) {
    console.error("Unable to read the logged-in user:", error);
  }

  // Anyone must be logged in before creating a story.
  if (!authToken || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Both regular users and administrators may create stories.
  return children;
}


function App() {
  useGlobalClickSound();
  usePersistentDisableOnSubmit();

  return (
    <>
      <ToastContainer />
    <Routes>
      <Route path="/" element={<StoryIntro />} />
      <Route path="/intro" element={<StoryIntro />} />
      <Route path="/library" element={<StoryLibrary />} />
      <Route path="/stories/:storyId" element={<StoryReader />} />

      <Route
        path="/create"
        element={
          <AuthenticatedRoute>
            <StoryCreator />
          </AuthenticatedRoute>
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
    </>
  );
}

export default App;