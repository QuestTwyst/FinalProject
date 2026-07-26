import { Routes, Route } from "react-router-dom";
import StoryIntro from "./components/StoryIntro";
import StoryLibrary from "./components/StoryLibrary";
import StoryReader from "./components/StoryReader";
import About from "./components/About";
import Login from "./pages/Login.jsx";
import CreateAccount from "./components/CreateAccount.jsx";
import Profile from "./components/Profile";
import PasswordReset from "./components/PasswordReset.jsx"; // or PasswordReset.jsx if that's the filename

function App() {
  return (
    <Routes>
      <Route path="/" element={<StoryIntro />} />
      <Route path="/intro" element={<StoryIntro />} />
      <Route path="/library" element={<StoryLibrary />} />
      <Route path="/stories/:storyId" element={<StoryReader />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/profile" element={<Profile />} />
      

      {/* Changed to match Login.jsx */}
      <Route path="/password-reset" element={<PasswordReset />} />
    </Routes>
  );
}

export default App;