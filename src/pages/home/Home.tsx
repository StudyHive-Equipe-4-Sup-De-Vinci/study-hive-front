import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./home.css";
import Sidebar from "../../components/sidebar/sidebar.tsx";
import Sort from "../../components/sort/sort.tsx";
import Dropzone from "../../components/dropzone/dropzone.tsx";
import axiosI from "../../axiosInterceptor";

// Définir les interfaces pour typer correctement les données
interface User {
  id: number;
  name: string;
  registration_date: string;
  password: string;
  email: string;
  access_token: string;
  is_admin: boolean;
  profile_picture_link: string;
}

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content_link: string;
  description: string;
  user_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  category: Category;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les posts depuis l'API
    const fetchPosts = async () => {
      try {
        const response = await axiosI.get('/api/posts');
        // Vérifier la structure de la réponse et s'assurer que posts est un tableau
        console.log("Réponse API:", response.data);

        // Déterminer si la réponse contient un tableau ou si elle contient une propriété qui est un tableau
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // Chercher une propriété qui pourrait contenir un tableau de posts
          const possiblePostsArray = Object.values(response.data).find(value => Array.isArray(value));
          if (possiblePostsArray) {
            setPosts(possiblePostsArray);
          } else {
            // Si aucun tableau n'est trouvé, créer un tableau à partir de l'objet si possible
            console.warn("La réponse n'est pas un tableau, tentative de conversion:", response.data);
            const dataArray = [response.data].filter(item => item !== null && typeof item === 'object');
            setPosts(dataArray);
          }
        } else {
          // Si ce n'est pas un objet ou un tableau, initialiser avec un tableau vide
          console.error("Format de réponse inattendu:", response.data);
          setPosts([]);
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Erreur lors de la récupération des posts:", error);
        setError(error.response?.data?.message || error.message || "Une erreur est survenue");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
              {loading ? (
                  <p>Chargement des cours...</p>
              ) : error ? (
                  <p>Erreur: {error}</p>
              ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
                      <div className="course-card" key={post.id}>
                        <div className="vote-section">
                          <span className="vote-count">0</span> {/* À remplacer si vous avez un système de votes */}
                        </div>
                        <div className="course-content">
                          <Link to={`/course/${post.id}`} style={{ textDecoration: "none" }}>
                            <div className="course-header">
                              <div className="course-meta">
                                <span className="category-tag">{post.category.name}</span>
                                <span className="author">Posté par {post.user.name}</span>
                              </div>
                              <h3 className="course-title">
                                {post.title}
                              </h3>
                            </div>
                            <div className="course-description">
                              <p>{post.description}</p>
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
                              0 {/* À remplacer si vous avez un compteur de commentaires */}
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
                  ))
              ) : (
                  <p>Aucun cours disponible.</p>
              )}
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