import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./myWorksheets.css";
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
    voteCount?: number;
    isSaved?: boolean;
}

export default function MyWorksheets() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

    // ID de l'utilisateur actuel (à récupérer depuis un contexte d'authentification dans une application réelle)
    const currentUserId = getCurrentUserId();

    // Fonction pour récupérer l'ID de l'utilisateur connecté
    function getCurrentUserId(): number {
        // Dans une application réelle, vous récupéreriez l'ID de l'utilisateur depuis votre système d'authentification
        // Par exemple, depuis un token JWT décodé ou un contexte utilisateur

        // Pour cet exemple, nous allons récupérer un ID factice depuis le localStorage
        // ou utiliser une valeur par défaut si aucun ID n'est trouvé
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                if (userData && userData.id) {
                    return userData.id;
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
        }

        // Valeur par défaut si aucun ID n'est trouvé
        return 1; // Remplacer par la méthode appropriée pour votre application
    }

    // Effet pour masquer les messages d'action après un délai
    useEffect(() => {
        if (actionMessage) {
            const timer = setTimeout(() => {
                setActionMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [actionMessage]);

    // Effet pour récupérer les posts et vérifier l'état des favoris au chargement
    useEffect(() => {
        fetchUserPosts();
        checkSavedPosts();
    }, []);

    // Fonction pour récupérer les posts créés par l'utilisateur
    const fetchUserPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Utilisation de la route correcte avec l'ID de l'utilisateur
            const response = await axiosI.get(`/api/posts/user/${currentUserId}`);
            console.log("Réponse API posts utilisateur:", response.data);

            // Traitement de la réponse selon sa structure
            let postsData: Post[] = [];

            if (Array.isArray(response.data)) {
                postsData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // Vérification pour différentes structures possibles
                if (response.data.Posts && Array.isArray(response.data.Posts)) {
                    postsData = response.data.Posts;
                } else if (response.data.posts && Array.isArray(response.data.posts)) {
                    postsData = response.data.posts;
                } else {
                    // Recherche d'un tableau dans les propriétés de l'objet
                    const possiblePostsArray = Object.values(response.data).find(value => Array.isArray(value));
                    if (possiblePostsArray) {
                        postsData = possiblePostsArray;
                    }
                }
            }

            setPosts(postsData);
        } catch (error: any) {
            console.error("Erreur lors de la récupération des posts de l'utilisateur:", error);
            setError(error.response?.data?.message || error.message || "Une erreur est survenue");
            setActionMessage({
                text: "Impossible de récupérer vos fiches de cours",
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour vérifier quels posts sont sauvegardés
    const checkSavedPosts = async () => {
        try {
            // Récupérer la liste des favoris
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
                text: "Impossible de modifier les favoris",
                type: 'error'
            });
        }
    };

    // Fonction pour supprimer un post
    const handleDeletePost = async (postId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette fiche de cours ?")) {
            return;
        }

        try {
            await axiosI.delete(`/api/posts/${postId}`);

            // Mettre à jour l'état local pour supprimer le post de la liste
            setPosts(posts.filter(post => post.id !== postId));

            setActionMessage({
                text: "Fiche de cours supprimée avec succès",
                type: 'success'
            });
        } catch (error: any) {
            console.error("Erreur lors de la suppression du post:", error);
            setActionMessage({
                text: "Impossible de supprimer cette fiche de cours",
                type: 'error'
            });
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
                    <h2 className="title-page">Mes fiches de cours</h2>
                </div>

                <div className="tabs">
                    <div className="tab-content active" id="populaires">
                        {loading ? (
                            <div className="text-center py-8">
                                <p>Chargement de vos fiches de cours...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center my-4">
                                <p>Erreur: {error}</p>
                                <button
                                    className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={fetchUserPosts}
                                >
                                    Réessayer
                                </button>
                            </div>
                        ) : posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <div className="course-card" key={post.id}>
                                    <div className="vote-section">
                                        <span className="vote-count">{post.voteCount || 0}</span>
                                    </div>
                                    <div className="course-content">
                                        <Link to={`/course/${post.id}`} style={{ textDecoration: "none" }}>
                                            <div className="course-header">
                                                <div className="course-meta">
                                                    <span className="category-tag">{post.category?.name || "Catégorie"}</span>
                                                    <span className="author">Posté par {post.user?.name || "Vous"}</span>
                                                </div>
                                                <h3 className="course-title">{post.title}</h3>
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
                                                0
                                            </button>
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
                                            <button
                                                className="btn-text text-red-500"
                                                onClick={() => handleDeletePost(post.id)}
                                                title="Supprimer cette fiche"
                                            >
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
                                                    className="lucide lucide-trash-2"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    <line x1="10" x2="10" y1="11" y2="17" />
                                                    <line x1="14" x2="14" y1="11" y2="17" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p>Vous n'avez pas encore créé de fiches de cours.</p>
                                <Link to="/create-post" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                    Créer une fiche de cours
                                </Link>
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