import { Route, Routes } from "react-router-dom";
import Error404 from "./pages/Error404.tsx";
import Home from "./pages/home/Home.tsx";
import Favorites from "./pages/favorites/Favorites.tsx";
import Course from "./pages/course/Course.tsx";
import Login from "./pages/login/Login";
import Signin from "./pages/signing/Signin.tsx";
import Profile from "./pages/profile/Profile.tsx";
import MyWorksheets from "./pages/myWorksheets/MyWorksheets.tsx";
import HealthCheck from "./pages/health-check/HealthCheck.tsx";

const AppRoot = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="/profile" element={<Profile/>} /> // CECI EST UN EXEMPLE DE COMMENT IMPLEMENTER UNE PAGE*/}
      <Route path="*" element={<Error404 />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/course" element={<Course />} />
      <Route path="/myWorksheets" element={<MyWorksheets />} />
      <Route path="/lesson" element={<Lesson />} />
      <Route path="/health_check" element={<HealthCheck />} />
    </Routes>
  );
};
export default AppRoot;
