import axiosI from "../axiosInterceptor";
import { Post } from "../pages/course/Course";

/**
 * Envoie un fichier et crée un nouveau post
 * @param file - Le fichier à télécharger
 * @param title - Le titre du post
 * @param description - La description du post (optionnel)
 * @param category_id - L'ID de la catégorie (optionnel, par défaut: 1)
 */
export async function sendFile({
                                 file,
                                 title,
                                 description = "test description",
                                 category_id = 1,
                               }: {
  file: File;
  title: string;
  description?: string;
  category_id?: number;
}) {
  // Créer un FormData pour envoyer les données multipart
  const formData = new FormData();

  // Ajouter les données au formData
  formData.append("file", file);
  formData.append("title", title);
  formData.append("category_id", category_id.toString());
  formData.append("description", description);

  try {
    // Faire la requête POST avec le bon chemin d'API
    const response = await axiosI.post("/api/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du fichier:", error);
    throw error;
  }
}

/**
 * Récupère un post par son ID
 * @param id - L'ID du post à récupérer
 * @returns Le post ou null si non trouvé
 */
export async function getPost({ id }: { id: string | number }): Promise<Post | null> {
  try {
    const response = await axiosI.get(`/api/posts/${id}`);

    // Vérifier le format de la réponse
    if (response.data.message && response.data.post) {
      return response.data.post;
    } else if (response.data && !response.data.message) {
      // Si la réponse contient directement les données du post
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
    return null;
  }
}

/**
 * Récupère tous les posts
 */
export async function getPosts() {
  try {
    const response = await axiosI.get('/api/posts');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    throw error;
  }
}

/**
 * Supprime un post
 * @param id - L'ID du post à supprimer
 */
export async function deletePost(id: number) {
  try {
    const response = await axiosI.delete(`/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    throw error;
  }
}