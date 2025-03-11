import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStatus, useAuth } from "../../context/AuthContext";
import { authStatusToString } from "../../utils/enumToString";
import "./signin.css";

function Signin() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { submitRegister } = useAuth();

  const submit = async () => {
    if (userName && password) {
      const status = await submitRegister({ userName, password });

      if (status != AuthStatus.OK) {
        setErrorMessage(authStatusToString(status));
        return;
      }
    }
    navigate("/");
  };
  return (
    <>
      <div className="signinBox">
        <div>Connexion</div>
        <div>
          <input
            className="form__input"
            autoFocus
            type="text"
            placeholder="Email ou Pseudo"
            onChange={(e) => {
              const value = e.target.value;
              if (value != "") setUserName(value);
            }}
          />
        </div>
        <div>
          <input
            className="form__input"
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => {
              const value = e.target.value;
              if (value != "") setPassword(value);
            }}
          />
        </div>
        <div>
          <button
            className="signinButton"
            type="submit"
            onClick={() => submit()}
          >
            Se connecter
          </button>
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      </div>
    </>
  );
}

export default Signin;
