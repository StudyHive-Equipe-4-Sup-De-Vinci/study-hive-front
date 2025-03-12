import { Link } from "react-router-dom";
import "./home.css";
import Sidebar from "../../components/sidebar/sidebar.tsx";
import Sort from "../../components/sort/sort.tsx";
import Dropzone from "../../components/dropzone/dropzone.tsx"

export default function Home() {
  return (
    <main>
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <div className="content-header-actions">
            <Dropzone />
            <Sort />
          </div>

          <h2 className="title-page">Cours populaires</h2>
        </div>

        <div className="tabs">
          <div className="tab-content active" id="populaires">
            <div className="course-card">
              <div className="vote-section">
                <span className="vote-count">245</span>
              </div>
              <div className="course-content">
                <Link to="/course" style={{ textDecoration: "none" }}>
                  <div className="course-header">
                    <div className="course-meta">
                      <span className="category-tag">Informatique</span>
                      <span className="author">Posté par Prof. Martin</span>
                    </div>
                    <h3 className="course-title">
                      Introduction à la programmation Python
                    </h3>
                  </div>
                  <div className="course-description">
                    <p>
                      Un cours complet pour débutants qui couvre les bases de la
                      programmation avec Python.
                    </p>
                  </div>
                </Link>
                <div className="course-footer">
                  <button className="btn-text">
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
                        className="lucide lucide-message-square"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    32
                  </button>
                  <button className="btn-text">
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
                      className="lucide lucide-forward"
                    >
                      <polyline points="15 17 20 12 15 7" />
                      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
                    </svg>
                  </button>
                  <button className="btn-text">
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
                      className="lucide lucide-bookmark"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="vote-section">
                <span className="vote-count">189</span>
              </div>
              <div className="course-content">
                <Link to="/course" style={{ textDecoration: "none" }}>
                  <div className="course-header">
                    <div className="course-meta">
                      <span className="category-tag">Mathématiques</span>
                      <span className="author">Posté par Dr. Dubois</span>
                    </div>
                    <h3 className="course-title">
                      Mathématiques avancées pour l'ingénierie
                    </h3>
                  </div>
                  <div className="course-description">
                    <p>
                      Ce cours explore les concepts mathématiques essentiels
                      pour les étudiants en ingénierie.
                    </p>
                  </div>
                </Link>
                <div className="course-footer">
                  <button className="btn-text">
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
                        className="lucide lucide-message-square"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    24
                  </button>
                  <button className="btn-text">
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
                      className="lucide lucide-forward"
                    >
                      <polyline points="15 17 20 12 15 7" />
                      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
                    </svg>
                  </button>
                  <button className="btn-text">
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
                      className="lucide lucide-bookmark"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="vote-section">
                <span className="vote-count">156</span>
              </div>
              <div className="course-content">
                <Link to="/course" style={{ textDecoration: "none" }}>
                  <div className="course-header">
                    <div className="course-meta">
                      <span className="category-tag">Langues</span>
                      <span className="author">Posté par Mme. Laurent</span>
                    </div>
                    <h3 className="course-title">
                      Apprendre l'anglais des affaires
                    </h3>
                  </div>
                  <div className="course-description">
                    <p>
                      Perfectionnez votre anglais professionnel avec ce cours
                      pratique et complet.
                    </p>
                  </div>
                </Link>
                <div className="course-footer">
                  <button className="btn-text">
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
                        className="lucide lucide-message-square"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    18
                  </button>
                  <button className="btn-text">
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
                      className="lucide lucide-forward"
                    >
                      <polyline points="15 17 20 12 15 7" />
                      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
                    </svg>
                  </button>
                  <button className="btn-text">
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
                      className="lucide lucide-bookmark"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
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
  );
}
