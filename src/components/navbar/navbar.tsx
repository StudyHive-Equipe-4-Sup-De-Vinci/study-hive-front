import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import "./navbar.css";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (): void => {
    // Si on ferme le menu, on retire l'écouteur d'événement
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else {
      // Si on ouvre le menu, on l'ouvre d'abord
      setIsDropdownOpen(true);

      // Puis on ajoute l'écouteur d'événement après un court délai
      setTimeout(() => {
        const closeMenuOnClickOutside = (event: Event): void => {
          // Vérifier si dropdownRef existe et si la cible du clic est à l'extérieur
          const target = event.target as HTMLElement;
          if (dropdownRef.current && !dropdownRef.current.contains(target)) {
            setIsDropdownOpen(false);
            document.removeEventListener("click", closeMenuOnClickOutside);
          }
        };

        document.addEventListener("click", closeMenuOnClickOutside);
      }, 0);
    }
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
                  to="/favorites"
                  className="menu-item"
                  style={{ textDecoration: "none" }}
                >
                  {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path
                                            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                    </svg>*/}
                  <span>Favoris</span>
                </Link>
                <Link
                  to="/login"
                  className="menu-item"
                  style={{ textDecoration: "none" }}
                >
                  {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>*/}
                  <span>Se connecter</span>
                </Link>
                <Link
                  to="/signin"
                  className="menu-item"
                  style={{ textDecoration: "none" }}
                >
                  {/*<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <line x1="19" y1="8" x2="19" y2="14"></line>
                                        <line x1="22" y1="11" x2="16" y2="11"></line>
                                    </svg>*/}
                  <span>S'inscrire</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
