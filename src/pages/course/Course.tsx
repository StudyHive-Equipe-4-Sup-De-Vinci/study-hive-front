import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Dropzone from "../../components/dropzone/dropzone.tsx";
import Sort from "../../components/sort/sort.tsx";
import Return from "../../components/return/return.tsx";
import { getPost } from "../../api/posts.ts";
import { useParams, useNavigate } from "react-router-dom";
import axiosI from "../../axiosInterceptor";

// Liste des matières disponibles
const MATIERES = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "Informatique",
  "Biologie",
  "Histoire",
  "Géographie",
  "Langues",
  "Sciences Économiques",
  "Philosophie",
  "Arts",
];

export type Post = {
  id: number;
  title: string;
  content_link: string;
  description: string;
  category_id: number;
  category: { id: number; name: string };
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  voteCount?: number;
  grade?: number; // Ajouter cette ligne
  user?: {
    id: number;
    name: string;
    registration_date: string;
    profile_picture_link: string;
  };
  created_at?: string;
};

// Mapping des matières vers les IDs de catégories
const MATIERE_TO_CATEGORY_ID: Record<string, number> = {
  "Mathématiques": 1,
  "Physique": 2,
  "Chimie": 3,
  "Informatique": 4,
  "Biologie": 5,
  "Histoire": 6,
  "Géographie": 7,
  "Langues": 8,
  "Sciences Économiques": 9,
  "Philosophie": 10,
  "Arts": 11,
};

// Mapping inverse des IDs de catégories vers les matières
const CATEGORY_ID_TO_MATIERE: Record<number, string> = Object.entries(MATIERE_TO_CATEGORY_ID)
    .reduce((acc, [key, value]) => {
      acc[value] = key;
      return acc;
    }, {} as Record<number, string>);

// Interface pour les commentaires du post
interface Comment {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

/*export type Post = {
  id: number;
  title: string;
  content_link: string;
  description: string;
  category_id: number;
  category: { id: number; name: string };
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  voteCount?: number;
  user?: {
    id: number;
    name: string;
    registration_date: string;
    profile_picture_link: string;
  };
  created_at?: string;
};*/

export default function Course() {
  // État pour les fichiers importés
  const [post, setPost] = useState<Post | null>(null);

  // État pour le mode modification
  const [estEnModeModification, setEstEnModeModification] = useState(false);

  // États pour le formulaire de modification
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMatiere, setEditMatiere] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  // État pour le chargement de la modification
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État pour les votes du post
  const [, setPostVotes] = useState(0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  // État pour sauvegarde
  const [isSaved, setIsSaved] = useState(false);

  // État pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // État pour les nouveaux commentaires
  const [newComment, setNewComment] = useState("");

  // État pour les commentaires existants
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Marie Dupont",
      authorAvatar: "/assets/profiles/user1.jpg",
      content:
          "Ce cours est vraiment très bien expliqué, merci beaucoup pour le partage !",
      timestamp: "Il y a 2 heures",
      likes: 5,
      isLiked: false,
    },
    {
      id: 2,
      author: "Thomas Martin",
      authorAvatar: "/assets/profiles/user2.jpg",
      content:
          "J'ai une question concernant le chapitre 3, est-ce que quelqu'un pourrait m'expliquer comment résoudre l'exercice sur les matrices ?",
      timestamp: "Il y a 5 heures",
      likes: 2,
      isLiked: true,
    },
  ]);

  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Référence au modal d'édition pour la gestion des clics à l'extérieur
  const editModalRef = useRef<HTMLDivElement>(null);

  // Configuration de la dropzone pour la modification
  const { getRootProps: getEditRootProps, getInputProps: getEditInputProps, acceptedFiles: editAcceptedFiles } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
    noClick: estEnModeModification, // Désactiver le clic quand le mode modification est actif
    noKeyboard: estEnModeModification, // Désactiver le clavier quand le mode modification est actif
  });

  // Effet pour gérer les fichiers déposés en mode modification
  useEffect(() => {
    if (editAcceptedFiles.length > 0) {
      setEditFile(editAcceptedFiles[0]);
    }
  }, [editAcceptedFiles]);

  // Gestionnaire d'événements pour les clics en dehors du modal d'édition
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (estEnModeModification && editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
        setEstEnModeModification(false);
      }
    }

    // Ajouter l'événement après un court délai pour éviter qu'il ne se déclenche immédiatement
    const timer = setTimeout(() => {
      if (estEnModeModification) {
        document.addEventListener("mousedown", handleClickOutside);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [estEnModeModification]);

  // Effet pour masquer les messages d'action après un délai
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => {
        setActionMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Récupération des données depuis l'API
  useEffect(() => {
    retrievePost();
    checkIfSaved();
  }, [courseId]);

  const retrievePost = async () => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    try {
      const postData = await getPost({ id: courseId });
      if (postData) {
        setPost(postData);

        // Initialiser les états à partir des données du post
        if (postData.isLiked) {
          setUserVote("up");
        } else if (postData.isDisliked) {
          setUserVote("down");
        }

        setIsSaved(postData.isSaved || false);
        setPostVotes(postData.voteCount || 0);

        // Initialiser les valeurs du formulaire d'édition
        setEditTitle(postData.title);
        setEditDescription(postData.description);

        // Trouver la matière correspondant à l'ID de catégorie
        const matiere = CATEGORY_ID_TO_MATIERE[postData.category_id] || "";
        setEditMatiere(matiere);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du post:", error);
      setError("Impossible de charger le cours. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  // Vérification si le post est sauvegardé
  const checkIfSaved = async () => {
    if (!courseId) return;

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

      // Vérifier si le post actuel est dans la liste des favoris
      const isCurrentPostSaved = savedPosts.some(post => post.id === Number(courseId));
      setIsSaved(isCurrentPostSaved);

    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error);
      // Ne pas afficher d'erreur à l'utilisateur, car ce n'est pas une fonctionnalité critique
    }
  };

  // Fonction pour gérer les votes (like/dislike)
  const handlePostVote = async (voteType: "up" | "down") => {
    if (!courseId) return;

    try {
      if (userVote === voteType) {
        // Annuler le vote actuel
        if (voteType === "up") {
          await axiosI.post(`/api/posts/${courseId}/unlike`);
          setActionMessage({ text: "J'aime retiré", type: 'success' });
        } else {
          await axiosI.post(`/api/posts/${courseId}/undislike`);
          setActionMessage({ text: "Je n'aime pas retiré", type: 'success' });
        }

        // Mise à jour de l'UI
        setPostVotes(prevVotes => prevVotes + (voteType === "up" ? -1 : 1));
        setUserVote(null);
      } else {
        // Si l'utilisateur avait déjà voté, annuler d'abord ce vote
        if (userVote !== null) {
          if (userVote === "up") {
            await axiosI.post(`/api/posts/${courseId}/unlike`);
          } else {
            await axiosI.post(`/api/posts/${courseId}/undislike`);
          }
        }

        // Ajouter le nouveau vote
        if (voteType === "up") {
          await axiosI.post(`/api/posts/${courseId}/like`);
          setActionMessage({ text: "J'aime ajouté", type: 'success' });
        } else {
          await axiosI.post(`/api/posts/${courseId}/dislike`);
          setActionMessage({ text: "Je n'aime pas ajouté", type: 'success' });
        }

        // Mise à jour de l'UI
        const voteDifference = userVote === null
            ? voteType === "up" ? 1 : -1
            : voteType === "up" ? 2 : -2;

        setPostVotes(prevVotes => prevVotes + voteDifference);
        setUserVote(voteType);
      }

    } catch (error) {
      console.error(`Erreur lors du vote ${voteType}:`, error);
      setActionMessage({
        text: `Impossible de ${voteType === "up" ? "liker" : "disliker"} ce post.`,
        type: 'error'
      });
    }
  };

  // Fonction pour gérer la sauvegarde du post
  const handleSavePost = async () => {
    if (!courseId) return;

    try {
      if (isSaved) {
        await axiosI.post(`/api/posts/${courseId}/unsave`);
        setActionMessage({ text: "Retiré des favoris", type: 'success' });
      } else {
        await axiosI.post(`/api/posts/${courseId}/save`);
        setActionMessage({ text: "Ajouté aux favoris", type: 'success' });
      }

      // Mise à jour de l'UI
      setIsSaved(!isSaved);

      // Si le post est maintenant sauvegardé et qu'il n'a pas d'ID user ou category, le rafraîchir
      if (!isSaved && post && (!post.user || !post.category)) {
        await retrievePost();
      }

    } catch (error) {
      console.error("Erreur lors de la sauvegarde du post:", error);
      setActionMessage({
        text: isSaved
            ? "Impossible de retirer des favoris."
            : "Impossible d'ajouter aux favoris.",
        type: 'error'
      });
    }
  };

  // Fonction pour ajouter un nouveau commentaire
  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj: Comment = {
      id: comments.length + 1,
      author: "Vous",
      authorAvatar: "/assets/profiles/you.jpg",
      content: newComment,
      timestamp: "À l'instant",
      likes: 0,
      isLiked: false,
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  // Fonction pour passer en mode modification
  const handleModifier = () => {
    if (post) {
      setEditTitle(post.title);
      setEditDescription(post.description);
      const matiere = CATEGORY_ID_TO_MATIERE[post.category_id] || "";
      setEditMatiere(matiere);
      setEditFile(null);
    }
    setEstEnModeModification(true);
  };

  // Fonction pour soumettre les modifications
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId || !post) return;

    // Validation des données
    if (!editTitle.trim()) {
      setActionMessage({ text: "Le titre est obligatoire", type: 'error' });
      return;
    }

    if (!editMatiere) {
      setActionMessage({ text: "Veuillez sélectionner une matière", type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Création du FormData pour l'envoi du fichier et des données
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('description', editDescription);

      // Récupérer l'ID de catégorie correspondant à la matière
      const category_id = MATIERE_TO_CATEGORY_ID[editMatiere] || post.category_id;
      formData.append('category_id', category_id.toString());

      // Ajouter le fichier si présent
      if (editFile) {
        formData.append('file', editFile);
      }

      // Envoyer les modifications à l'API
      const response = await axiosI.put(`/api/posts/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Post mis à jour avec succès:", response.data);

      // Mettre à jour l'état local avec les nouvelles données
      retrievePost();

      // Fermer le mode modification
      setEstEnModeModification(false);

      // Afficher un message de succès
      setActionMessage({ text: "Cours mis à jour avec succès", type: 'success' });

    } catch (error: any) {
      console.error("Erreur lors de la modification du post:", error);
      setActionMessage({
        text: error.response?.data?.message || "Impossible de modifier le cours",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour annuler la modification
  const handleCancelEdit = () => {
    setEstEnModeModification(false);
  };

  // Fonction pour naviguer vers les favoris
  const goToFavorites = () => {
    navigate('/favorites');
  };

  // Formatage de la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Affichage d'erreur et de chargement
  if (loading) {
    return (
        <div className="w-full mx-auto mb-6 p-4 text-center">
          <p>Chargement du cours...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full mx-auto mb-6 p-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button
                className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={retrievePost}
            >
              Réessayer
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="w-full mx-auto mb-6">
        {/* Message d'action (feedback) */}
        {actionMessage && (
            <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg ${
                actionMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {actionMessage.text}
            </div>
        )}

        <div className="content-header">
          <div className="content-header-actions">
            <Return />
            <Dropzone />
            <Sort />
          </div>
        </div>

        {/* Modal de modification */}
        {estEnModeModification && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div ref={editModalRef} className="bg-white p-6 rounded-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4">Modifier le cours</h2>

                <form onSubmit={handleSubmitEdit} className="space-y-4">
                  {/* Titre */}
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du cours*
                    </label>
                    <input
                        id="edit-title"
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isSubmitting}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                        id="edit-description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                    />
                  </div>

                  {/* Matière */}
                  <div>
                    <label htmlFor="edit-matiere" className="block text-sm font-medium text-gray-700 mb-1">
                      Matière*
                    </label>
                    <select
                        id="edit-matiere"
                        value={editMatiere}
                        onChange={(e) => setEditMatiere(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isSubmitting}
                    >
                      <option value="">Sélectionnez une matière</option>
                      {MATIERES.map((matiere) => (
                          <option key={matiere} value={matiere}>
                            {matiere}
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* Zone de dépôt de fichier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fichier (optionnel)
                    </label>
                    <div
                        {...getEditRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <input {...getEditInputProps()} disabled={isSubmitting} />
                      <div className="text-center">
                        <p className="text-gray-500 mb-1">
                          {editFile
                              ? editFile.name
                              : "Glissez-déposez un nouveau fichier ici, ou cliquez pour sélectionner"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {editFile
                              ? `Taille: ${Math.round(editFile.size / 1024)} Ko`
                              : "(Facultatif - Uniquement les images et PDF)"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded text-white ${
                            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        } transition-colors flex items-center`}
                        disabled={isSubmitting}
                    >
                      {isSubmitting && (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      )}
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Métadonnées du cours */}
        {post && (
            <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {post.category?.name || "Catégorie"}
                </span>
                    <span className="text-gray-500 text-sm">
                  {formatDate(post.created_at)}
                </span>
                  </div>

                  <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                  <p className="text-gray-600 mb-4">{post.description}</p>

                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-1">Par</span>
                    <span className="font-medium">{post.user?.name || "Utilisateur inconnu"}</span>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* En-tête du cours avec système de vote Reddit */}
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden flex">
          {/* Système de vote sur le côté gauche */}
          <div className="flex flex-col items-center justify-around mx-3 my-4 bg-gray-50 border-r border-gray-100">
            <button
                className={`p-1 h-full rounded-md hover:bg-gray-200 ${
                    userVote === "up" ? "text-green-500" : "text-gray-400"
                }`}
                onClick={() => handlePostVote("up")}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <span className="my-1 font-medium text-gray-800">
    {post?.grade || 0}
  </span>
            <button
                className={`p-1 h-full rounded-md hover:bg-gray-200 ${
                    userVote === "down" ? "text-blue-500" : "text-gray-400"
                }`}
                onClick={() => handlePostVote("down")}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Contenu principal - Fichiers importés */}
          <div className="flex-1 p-4">
            {!post ? (
                <div className="text-center text-gray-500 mt-10">
                  Aucun fichier téléchargé
                </div>
            ) : (
                <div className="w-full mb-4">
                  <iframe
                      src={post.content_link}
                      width="100%"
                      height="600"
                      title={post.title}
                      className="border-none"
                  />
                </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-2">
          <div className="flex border-t border-gray-100 pt-2">
            <button
                className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded"
                onClick={handleModifier}
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
                  className="lucide lucide-file-pen-line mr-1"
              >
                <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                <path d="M8 18h1" />
              </svg>
              Modifier
            </button>

            <button
                className={`flex-1 flex items-center justify-center py-2 ${
                    isSaved ? "text-blue-500" : "text-gray-600"
                } hover:bg-gray-50 rounded`}
                onClick={handleSavePost}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill={isSaved ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {isSaved ? "Sauvegardé" : "Sauvegarder"}
            </button>

            <button
                className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded"
                onClick={goToFavorites}
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
                  className="lucide lucide-bookmark mr-1"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Voir les favoris
            </button>
          </div>
        </div>

        {/* Section des commentaires */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium mb-4">Commentaires</h3>

          {/* Zone de saisie de commentaire */}
          <div className="flex space-x-3 mb-6">
            <img
                src="https://randomuser.me/api/portraits/lego/1.jpg"
                alt="Votre avatar"
                className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 relative">
              <input
                  type="text"
                  className="w-full bg-gray-100 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Écrivez un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
                  onClick={handleAddComment}
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Liste des commentaires */}
          <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                      src={comment.authorAvatar}
                      alt={`Avatar de ${comment.author}`}
                      className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{comment.timestamp}</span>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}