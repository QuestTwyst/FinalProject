import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import StoryIntro from './components/StoryIntro';
import StoryLibrary from './components/StoryLibrary';
import StoryReader from './components/StoryReader';
import About from './components/About';
import Login from './pages/Login.jsx';
import CreateAccount from './components/CreateAccount.jsx';

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
    </Routes>
  );
}

export default App;