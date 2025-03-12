import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import "./navbar.css";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else {
      setIsDropdownOpen(true);

      // Ajouter un gestionnaire d'événement pour les clics en dehors du menu
      setTimeout(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
            document.removeEventListener('click', handleClickOutside);
          }
        };

        document.addEventListener('click', handleClickOutside);
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
                className="lucide lucide-book"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              </svg>
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
                      to="/login"
                      className="menu-item"
                      style={{ textDecoration: "none" }}
                      onClick={handleLinkClick}
                  >
                    <span>Se connecter</span>
                  </Link>
                  {/*<Link
                      to="/signin"
                      className="menu-item"
                      style={{ textDecoration: "none" }}
                      onClick={handleLinkClick}
                  >
                    <span>S'inscrire</span>
                  </Link>*/}
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
