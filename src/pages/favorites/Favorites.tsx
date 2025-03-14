import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./favorites.css";
import Sort from "../../components/sort/sort.tsx";
import Dropzone from "../../components/dropzone/dropzone.tsx";
import Return from "../../components/return/return.tsx";
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
    voteCount?: number; // Optionnel, si disponible dans votre API
    grade?: number; // Ajout du grade comme dans les autres composants
}

export default function MyWorksheets() {
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
        const fetchFavoritePosts = async () => {
            try {
                const response = await axiosI.get('/api/posts/favorites');
                console.log("Réponse API:", response.data);

                let postsData: Post[] = [];

                // Vérifier d'abord si Posts (majuscule) existe
                if (response.data && response.data.Posts && Array.isArray(response.data.Posts)) {
                    postsData = response.data.Posts;
                    console.log("Posts favoris mis à jour:", response.data.Posts);
                }
                // Ensuite vérifier si posts (minuscule) existe
                else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
                    postsData = response.data.posts;
                    console.log("Posts favoris mis à jour:", response.data.posts);
                }
                // Si aucun des deux n'existe, vérifier si la réponse elle-même est un tableau
                else if (Array.isArray(response.data)) {
                    postsData = response.data;
                    console.log("Posts favoris mis à jour (format tableau):", response.data);
                }
                else {
                    console.error("Format de réponse inattendu:", response.data);
                    postsData = [];
                }

                // S'assurer que chaque post a un grade (utiliser voteCount si grade n'existe pas)
                postsData = postsData.map(post => ({
                    ...post,
                    grade: post.grade !== undefined ? post.grade : (post.voteCount || 0)
                }));

                setPosts(postsData);
                setLoading(false);
            } catch (error: any) {
                console.error("Erreur lors de la récupération des posts favoris:", error);
                if (error.response && error.response.status === 401) {
                    console.error("Erreur d'authentification. Vérifiez le token et le middleware d'authentification.");
                }
                setError(error.response?.data?.message || error.message || "Une erreur est survenue");
                setLoading(false);
            }
        };

        fetchFavoritePosts();
    }, []);

    console.log("Posts favoris dans le rendu:", posts);

    // Fonction pour retirer un post des favoris
    const handleRemoveFromFavorites = async (postId: number) => {
        try {
            await axiosI.post(`/api/posts/${postId}/unsave`);
            // Mise à jour locale de l'état pour refléter le changement immédiatement
            setPosts(posts.filter(post => post.id !== postId));
            setActionMessage({ text: "Retiré des favoris", type: 'success' });
        } catch (error: any) {
            console.error("Erreur lors du retrait des favoris:", error);
            setActionMessage({
                text: "Impossible de retirer ce post des favoris. Veuillez réessayer.",
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

            <div className="favoris-content">
                <div className="content-header">
                    <div className="content-header-actions">
                        <Return />
                        <Dropzone />
                        <Sort />
                    </div>
                    <h2 className="title-page">Mes favoris</h2>
                </div>

                <div className="tabs">
                    <div className="tab-content active" id="populaires">
                        {loading ? (
                            <p className="text-center py-8">Chargement des cours favoris...</p>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center my-4">
                                <p>Erreur: {error}</p>
                            </div>
                        ) : posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <div className="course-card" key={post.id}>
                                    <div className="vote-section">
                                        <span className="vote-count">{post.grade || 0}</span>
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
                                                <h3 className="course-title">{post.title}</h3>
                                            </div>
                                            <div className="course-description">
                                                <p>{post.description}</p>
                                            </div>
                                        </Link>
                                        <div className="course-footer">
                                            <button
                                                className="btn-text text-blue-500"
                                                onClick={() => handleRemoveFromFavorites(post.id)}
                                                title="Retirer des favoris"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
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
                                <p>Aucun cours favori trouvé.</p>
                                <p className="mt-2 text-gray-500">
                                    Ajoutez des cours à vos favoris en cliquant sur l'icône de marque-page.
                                </p>
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