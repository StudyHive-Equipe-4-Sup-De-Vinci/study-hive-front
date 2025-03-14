import { BrowserRouter } from "react-router-dom";
import AppRoot from "./AppRoute";
import Navbar from "./components/navbar/navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <div className="container">
            <Navbar />
            <AppRoot />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
