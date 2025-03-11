import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoot from "./AppRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoot />
      </BrowserRouter>
    </>
  );
}

export default App;
