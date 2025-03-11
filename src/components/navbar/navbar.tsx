import './navbar.css';

export default function Navbar() {
    return (
        <header>
            <div className="header-content">
                <div className="logo" onClick={() => window.location.href = '/'}>
                    <span className="material-symbols-outlined">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round" className="lucide lucide-book"><path
                            d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                        </svg>
                    </span>
                    <h1>Study Hive</h1>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher des cours..."
                    />
                    <button className="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round" className="search-icon">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
                <div className="auth-buttons">
                    <button className="btn-outline">
                        Se connecter
                    </button>
                    <button className="btn-primary">S'inscrire</button>
                </div>
            </div>
        </header>
    )
}