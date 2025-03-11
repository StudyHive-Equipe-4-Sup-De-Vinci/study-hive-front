import { Route, Routes } from "react-router-dom";

const AppRoot = () => {
  return (
    <Routes>
      <Route path="/" element={<></>} />
      {/* <Route path="/profile" element={<Profile/>} /> // CECI EST UN EXEMPLE DE COMMENT IMPLEMENTER UNE PAGE*/}
      <Route path="*" element={<>404</>} />
    </Routes>
  );
};
export default AppRoot;
