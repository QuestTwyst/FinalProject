import { Routes, Route } from 'react-router-dom';
import StoryIntro from './components/StoryIntro';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StoryIntro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
    </Routes>
  );
}

export default App;