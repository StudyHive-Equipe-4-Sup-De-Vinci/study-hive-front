import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoot from "./AppRoute";
import Navbar from "./components/navbar/navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container">
          <Navbar />
          <AppRoot />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
