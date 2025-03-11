import './home.css';
import Navbar from '../../components/navbar/navbar.tsx';
import Sidebar from "../../components/sidebar/sidebar.tsx";

export default function Home() {
    return (
        <div className="container">
            <Navbar/>
            <main>
                <Sidebar/>
                <div className="content">
                    <div className="content-header">
                        <label htmlFor="file-upload" className="btn-primary">
                            Ajouter un cours
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            style={{display: 'none'}}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    console.log('Fichier sélectionné:', e.target.files[0].name);
                                }
                            }}
                        />
                        <h2 className="title-page">Cours populaires</h2>
                    </div>

                    <div className="tabs">
                        <div className="tab-list">
                            <button className="tab active" data-tab="populaires">Populaires</button>
                            <button className="tab" data-tab="recents">Récents</button>
                            <button className="tab" data-tab="meilleurs">Meilleurs</button>
                        </div>

                        <div className="tab-content active" id="populaires">
                            <div className="course-card">
                                <div className="vote-section">
                                    <button className="vote-btn up">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-chevron-up">
                                            <path d="m18 15-6-6-6 6"/>
                                        </svg>
                                    </button>
                                    <span className="vote-count">245</span>
                                    <button className="vote-btn down">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-chevron-down">
                                            <path d="m6 9 6 6 6-6"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="course-content">
                                    <div className="course-header">
                                        <div className="course-meta">
                                            <span className="category-tag">Informatique</span>
                                            <span className="author">Posté par Prof. Martin</span>
                                        </div>
                                        <h3 className="course-title">Introduction à la programmation Python</h3>
                                    </div>
                                    <div className="course-description">
                                        <p>Un cours complet pour débutants qui couvre les bases de la programmation avec
                                            Python.</p>
                                    </div>
                                    <div className="course-footer">
                                        <button className="btn-text">
                                            <span className="material-symbols-outlined">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round"
                                                    className="lucide lucide-message-square"><path
                                                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                                </svg>
                                            </span>
                                            32
                                        </button>
                                        <button className="btn-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-forward">
                                                <polyline points="15 17 20 12 15 7"/>
                                                <path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
                                            </svg>
                                        </button>
                                        <button className="btn-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-bookmark">
                                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="course-card">
                                <div className="vote-section">
                                    <button className="vote-btn up">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-chevron-up">
                                            <path d="m18 15-6-6-6 6"/>
                                        </svg>
                                    </button>
                                    <span className="vote-count">189</span>
                                    <button className="vote-btn down">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-chevron-down">
                                            <path d="m6 9 6 6 6-6"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="course-content">
                                    <div className="course-header">
                                        <div className="course-meta">
                                            <span className="category-tag">Mathématiques</span>
                                            <span className="author">Posté par Dr. Dubois</span>
                                        </div>
                                        <h3 className="course-title">Mathématiques avancées pour l'ingénierie</h3>
                                    </div>
                                    <div className="course-description">
                                        <p>Ce cours explore les concepts mathématiques essentiels pour les étudiants en
                                            ingénierie.</p>
                                    </div>
                                    <div className="course-footer">
                                        <button className="btn-text">
                                            <span className="material-symbols-outlined">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                     className="lucide lucide-message-square"><path
                                                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                            </span>
                                            24
                                        </button>
                                        <button className="btn-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-forward">
                                                <polyline points="15 17 20 12 15 7"/>
                                                <path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
                                            </svg>
                                        </button>
                                        <button className="btn-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-bookmark">
                                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="course-card">
                                <div className="vote-section">
                                    <button className="vote-btn up">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-chevron-up">
                                            <path d="m18 15-6-6-6 6"/>
                                        </svg>
                                    </button>
                                    <span className="vote-count">156</span>
                                    <button className="vote-btn down">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             className="lucide lucide-chevron-down">
                                            <path d="m6 9 6 6 6-6"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="course-content">
                                    <div className="course-header">
                                        <div className="course-meta">
                                            <span className="category-tag">Langues</span>
                                            <span className="author">Posté par Mme. Laurent</span>
                                        </div>
                                        <h3 className="course-title">Apprendre l'anglais des affaires</h3>
                                    </div>
                                    <div className="course-description">
                                        <p>Perfectionnez votre anglais professionnel avec ce cours pratique et
                                            complet.</p>
                                    </div>
                                    <div className="course-footer">
                                        <button className="btn-text">
                                            <span className="material-symbols-outlined"><svg
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                className="lucide lucide-message-square"><path
                                                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
                                            18
                                        </button>
                                        <button className="btn-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-forward">
                                                <polyline points="15 17 20 12 15 7"/>
                                                <path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
                                            </svg>
                                        </button>
                                        <button className="btn-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-bookmark">
                                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-content" id="recents">
                            {/* Contenu de l'onglet Récents */}
                        </div>

                        <div className="tab-content" id="meilleurs">
                            {/* Contenu de l'onglet Meilleurs */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
