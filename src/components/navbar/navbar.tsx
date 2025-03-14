import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import "./navbar.css";
import { LoginState, useAuth } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userInfo, logout } = useAuth();

  const isLoggedIn = userInfo?.state === LoginState.LOGGED_IN;

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else {
      setIsDropdownOpen(true);

      // Ajouter un gestionnaire d'événement pour les clics en dehors du menu
      setTimeout(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
              dropdownRef.current &&
              !dropdownRef.current.contains(event.target as Node)
          ) {
            setIsDropdownOpen(false);
            document.removeEventListener("click", handleClickOutside);
          }
        };

        document.addEventListener("click", handleClickOutside);
      }, 0);
    }
  };

  // Fonction pour fermer le menu après avoir cliqué sur un lien
  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  return (
      <header>
        <div className="header-content">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="logo">
            <span className="material-symbols-outlined">
              <img src={Logo} alt="logo" width="70" height="70" className="" />
            </span>
              <h1>Study Hive</h1>
            </div>
          </Link>
          <div className="search-container">
            <input
                type="text"
                className="search-input"
                placeholder="Rechercher des cours..."
            />
            <button className="search-button">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="search-icon"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <div className="auth-buttons">
            {isLoggedIn ? (
                // Afficher le menu déroulant du profil si l'utilisateur est connecté
                <div className="profile-dropdown" ref={dropdownRef}>
                  <button className="profile-button" onClick={toggleDropdown}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </button>

                  {isDropdownOpen && (
                      <div className="dropdown-menu">
                        <Link
                            to="/profile"
                            className="menu-item"
                            style={{ textDecoration: "none" }}
                            onClick={handleLinkClick}
                        >
                          <span>Profil</span>
                        </Link>
                        <Link
                            to="/myWorksheets"
                            className="menu-item"
                            style={{ textDecoration: "none" }}
                            onClick={handleLinkClick}
                        >
                          <span>Mes fiches</span>
                        </Link>
                        <Link
                            to="/favorites"
                            className="menu-item"
                            style={{ textDecoration: "none" }}
                            onClick={handleLinkClick}
                        >
                          <span>Favoris</span>
                        </Link>
                        <Link
                            to="/"
                            className="menu-item"
                            style={{ textDecoration: "none" }}
                            onClick={logout}
                        >
                          <span>Se déconnecter</span>
                        </Link>
                      </div>
                  )}
                </div>
            ) : (
                // Afficher seulement le bouton "Se connecter" si l'utilisateur n'est pas connecté
                <Link
                    to="/login"
                    className="login-button"
                    style={{ textDecoration: "none" }}
                >
                  <button className="btn-primary">
                    Se connecter
                  </button>
                </Link>
            )}
          </div>
        </div>
      </header>
  );
}