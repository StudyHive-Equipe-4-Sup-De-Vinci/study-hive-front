import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStatus, useAuth } from "../../context/AuthContext";
import { authStatusToString } from "../../utils/enumToString";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { submitLogin } = useAuth();

  const submit = async () => {
    if (username && password) {
      const status = await submitLogin({ username, password });
      if (status != AuthStatus.OK) {
        setErrorMessage(authStatusToString(status));
        return;
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    navigate("/");
  };

  return (
    <div className="size-[670px] w-full flex items-center justify-center bg-white p-4 rounded-lg shadow-md">
      <div className="w-full max-w-sm">
        <h2 className="flex mb-10 text-2xl font-medium text-gray-800 text-center items-center justify-center">
          Connexion
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Email ou Pseudo"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
          )}

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Se connecter
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <a href="/signin" className="text-blue-500 hover:underline">
              Créer un compte
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
