import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import Favorites from "./pages/favorites/Favorites.tsx";
import Lesson from "./pages/lesson/Lesson.tsx";
import Login from "./pages/login/Login";
import Signin from "./pages/signing/Signin.tsx";
import HealthCheck from "./pages/health-check/HealthCheck.tsx";

const AppRoot = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signin" element={<Signin />} />
      {/* <Route path="/profile" element={<Profile/>} /> // CECI EST UN EXEMPLE DE COMMENT IMPLEMENTER UNE PAGE*/}
      <Route path="*" element={<>404</>} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/lesson" element={<Lesson />} />
      <Route path="/health_check" element={<HealthCheck />} />
    </Routes>
  );
};
export default AppRoot;
