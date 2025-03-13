import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStatus, useAuth } from "../../context/AuthContext";
import { authStatusToString } from "../../utils/enumToString";

export default function Signin() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { submitRegister } = useAuth();

  const submit = async () => {
    if (name && email && password) {
      const status = await submitRegister({ email, name, password });
      if (status != AuthStatus.OK) {
        setErrorMessage(authStatusToString(status));
        return;
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }
    navigate("/login");
  };

  return (
    <div className="size-[670px] w-full flex items-center justify-center bg-white p-4 rounded-lg shadow-md">
      <div className="w-full max-w-sm">
        <h2 className="flex mb-10 text-2xl font-medium text-gray-800 text-center items-center justify-center">
          Inscription
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Pseudo"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              S'inscrire
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <a href="/login" className="text-blue-500 hover:underline">
              Déjà un compte ? Se connecter
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
