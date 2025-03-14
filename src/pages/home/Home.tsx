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
  isSaved?: boolean;
  voteCount?: number;
  grade?: number; // Note du post
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Effet pour masquer les messages d'action après un délai
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => {
        setActionMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  useEffect(() => {
    // Fonction pour récupérer les posts et vérifier les favoris au chargement
    fetchPosts();
    fetchSavedPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosI.get('/api/posts');
      console.log("Réponse API Posts:", response.data);

      // Déterminer si la réponse contient un tableau ou si elle contient une propriété qui est un tableau
      let postsData: Post[] = [];

      if (Array.isArray(response.data)) {
        postsData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Vérification pour Posts avec P majuscule
        if (response.data.Posts && Array.isArray(response.data.Posts)) {
          postsData = response.data.Posts;
        }
        // Vérification pour posts avec p minuscule
        else if (response.data.posts && Array.isArray(response.data.posts)) {
          postsData = response.data.posts;
        }
        // Chercher une propriété qui pourrait contenir un tableau de posts
        else {
          const possiblePostsArray = Object.values(response.data).find(value => Array.isArray(value));
          if (possiblePostsArray) {
            postsData = possiblePostsArray;
          } else {
            // Si aucun tableau n'est trouvé, créer un tableau à partir de l'objet si possible
            console.warn("La réponse n'est pas un tableau, tentative de conversion:", response.data);
            const dataArray = [response.data].filter(item => item !== null && typeof item === 'object');
            postsData = dataArray;
          }
        }
      }

      // Vérifier si les posts ont le champ grade, sinon utiliser voteCount ou 0
      postsData = postsData.map(post => ({
        ...post,
        grade: post.grade !== undefined ? post.grade : (post.voteCount || 0)
      }));

      setPosts(postsData);
      setLoading(false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des posts:", error);
      setError(error.response?.data?.message || error.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  // Fonction pour vérifier quels posts sont déjà sauvegardés
  const fetchSavedPosts = async () => {
    try {
      const response = await axiosI.get('/api/posts/favorites');
      console.log("Réponse API Favoris:", response.data);

      let savedPosts: Post[] = [];

      // Extraire les posts sauvegardés selon le format de la réponse
      if (Array.isArray(response.data)) {
        savedPosts = response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (response.data.Posts && Array.isArray(response.data.Posts)) {
          savedPosts = response.data.Posts;
        } else if (response.data.posts && Array.isArray(response.data.posts)) {
          savedPosts = response.data.posts;
        } else {
          const possiblePostsArray = Object.values(response.data).find(value => Array.isArray(value));
          if (possiblePostsArray) {
            savedPosts = possiblePostsArray;
          }
        }
      }

      // Extraire les IDs des posts sauvegardés
      const savedPostIds = savedPosts.map(post => post.id);

      // Mettre à jour l'état des posts avec l'information des favoris
      setPosts(prevPosts => prevPosts.map(post => ({
        ...post,
        isSaved: savedPostIds.includes(post.id)
      })));

    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error);
      // Ne pas afficher d'erreur à l'utilisateur, car ce n'est pas une fonctionnalité critique
    }
  };

  // Fonction pour mettre à jour les posts après le filtrage
  const handlePostsFiltered = (filteredPosts: Post[]) => {
    console.log("Posts filtrés reçus dans Home:", filteredPosts);

    // Conserver l'état isSaved et grade des posts existants
    const updatedPosts = filteredPosts.map(newPost => {
      const existingPost = posts.find(p => p.id === newPost.id);
      return {
        ...newPost,
        isSaved: existingPost?.isSaved || false,
        grade: newPost.grade !== undefined ? newPost.grade : (existingPost?.grade || 0)
      };
    });

    setPosts(updatedPosts);

    // Afficher un message de confirmation
    setActionMessage({
      text: `${filteredPosts.length} posts trouvés`,
      type: 'success'
    });

    // Après le filtrage, revérifier les favoris
    setTimeout(fetchSavedPosts, 100);
  };

  // Fonction pour gérer la sauvegarde du post
  const handleSavePost = async (postId: number) => {
    try {
      // Trouver le post dans l'état actuel pour vérifier s'il est déjà sauvegardé
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.isSaved) {
        // Retirer des favoris
        await axiosI.post(`/api/posts/${postId}/unsave`);
        setActionMessage({ text: "Retiré des favoris", type: 'success' });
      } else {
        // Ajouter aux favoris
        await axiosI.post(`/api/posts/${postId}/save`);
        setActionMessage({ text: "Ajouté aux favoris", type: 'success' });
      }

      // Mettre à jour l'état local pour refléter le changement immédiatement
      setPosts(posts.map(p =>
          p.id === postId
              ? { ...p, isSaved: !p.isSaved }
              : p
      ));

    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde du post:", error);
      setActionMessage({
        text: "Impossible de modifier les favoris. Veuillez réessayer.",
        type: 'error'
      });
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
      <main>
        {/* Message d'action (feedback) */}
        {actionMessage && (
            <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg ${
                actionMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {actionMessage.text}
            </div>
        )}

        <Sidebar />
        <div className="content">
          <div className="content-header">
            <div className="content-header-actions">
              <Dropzone />
              {/* Passer le callback pour mettre à jour les posts au composant Sort */}
              <Sort onPostsFiltered={handlePostsFiltered} />
            </div>

            <h2 className="title-page">Cours populaires</h2>
          </div>

          <div className="tabs">
            <div className="tab-content active" id="populaires">
              {loading ? (
                  <p className="text-center py-8">Chargement des cours...</p>
              ) : error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center my-4">
                    <p>Erreur: {error}</p>
                    <button
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={fetchPosts}
                    >
                      Réessayer
                    </button>
                  </div>
              ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
                      <div className="course-card" key={post.id}>
                        <div className="vote-section">
                          <span className="vote-count">{post.grade !== undefined ? post.grade : 0}</span>
                        </div>
                        <div className="course-content">
                          <Link to={`/course/${post.id}`} style={{ textDecoration: "none" }}>
                            <div className="course-header">
                              <div className="course-meta">
                                <span className="category-tag">{post.category?.name || "Catégorie"}</span>
                                <span className="author">Posté par {post.user?.name || "Utilisateur"}</span>
                                <span className="text-gray-500 text-sm ml-2">
                                  {formatDate(post.created_at)}
                                </span>
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
                            <button
                                className={`btn-text ${post.isSaved ? 'text-blue-500' : ''}`}
                                onClick={() => handleSavePost(post.id)}
                                title={post.isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
                            >
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill={post.isSaved ? "currentColor" : "none"}
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
                  <div className="text-center py-8">
                    <p>Aucun cours disponible.</p>
                  </div>
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