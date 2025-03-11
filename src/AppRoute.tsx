import { Route, Routes } from "react-router-dom";

const AppRoot = () => {
  return (
    <Routes>
      <Route path="/" element={<></>} />
      {/* <Route path="/" element={<Home/>} /> // CECI EST UN EXEMPLE DE COMMENT IMPLEMENTER UNE PAGE*/}
      <Route path="*" element={<>404</>} />
    </Routes>
  );
};
export default AppRoot;
