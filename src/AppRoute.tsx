import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home.tsx"
import Favorites from "./pages/favorites/Favorites.tsx"
import Lesson from "./pages/lesson/Lesson.tsx"

const AppRoot = () => {
  return (
    <Routes>
      <Route path="/" element={<></>} />
      {/* <Route path="/profile" element={<Profile/>} /> // CECI EST UN EXEMPLE DE COMMENT IMPLEMENTER UNE PAGE*/}
      <Route path="*" element={<>404</>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/favorites" element={<Favorites/>} />
      <Route path="/lesson" element={<Lesson/>} />

    </Routes>
  );
};
export default AppRoot;
