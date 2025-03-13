import {useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import Dropzone from "../../components/dropzone/dropzone.tsx";
import Sort from "../../components/sort/sort.tsx";
import Return from "../../components/return/return.tsx";

interface FichierTelechargé {
    nom: string;
    type: string;
    donnees: string; // Chaîne base64 ou URL
    taille: number;
}

interface Comment {
    id: number;
    author: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
}

export default function Course() {
    // État pour les fichiers importés
    const [fichiers, setFichiers] = useState<FichierTelechargé[]>([]);

    // État pour le mode modification
    const [estEnModeModification, setEstEnModeModification] = useState(false);

    // État pour les votes du post
    const [postVotes, setPostVotes] = useState(42);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

    // État pour les nouveaux commentaires
    const [newComment, setNewComment] = useState('');

    // État pour les commentaires existants
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            author: "Marie Dupont",
            authorAvatar: "/assets/profiles/user1.jpg",
            content: "Ce cours est vraiment très bien expliqué, merci beaucoup pour le partage !",
            timestamp: "Il y a 2 heures",
            likes: 5,
            isLiked: false
        },
        {
            id: 2,
            author: "Thomas Martin",
            authorAvatar: "/assets/profiles/user2.jpg",
            content: "J'ai une question concernant le chapitre 3, est-ce que quelqu'un pourrait m'expliquer comment résoudre l'exercice sur les matrices ?",
            timestamp: "Il y a 5 heures",
            likes: 2,
            isLiked: true
        }
    ]);

    // Configuration de la dropzone pour la modification
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    // Effet pour gérer les fichiers déposés en mode modification
    useEffect(() => {
        if (estEnModeModification && acceptedFiles.length > 0) {
            const fichier = acceptedFiles[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const nouveauFichier: FichierTelechargé = {
                    nom: fichier.name,
                    type: fichier.type,
                    donnees: reader.result as string,
                    taille: fichier.size
                };

                // Remplacer le premier fichier ou ajouter si aucun fichier n'existe
                setFichiers(fichiersPrecedents =>
                    fichiersPrecedents.length > 0
                        ? [nouveauFichier, ...fichiersPrecedents.slice(1)]
                        : [nouveauFichier]
                );

                // Sortir du mode modification
                setEstEnModeModification(false);
            };

            reader.readAsDataURL(fichier);
        }
    }, [acceptedFiles, estEnModeModification]);

    // Récupération des fichiers depuis localStorage
    useEffect(() => {
        const fichiersStockes = localStorage.getItem('fichiersTelechargés');
        if (fichiersStockes) {
            try {
                const fichiersParsed = JSON.parse(fichiersStockes);
                console.log('Fichiers chargés:', fichiersParsed);
                setFichiers(fichiersParsed);
            } catch (error) {
                console.error('Erreur de lecture des fichiers:', error);
            }
        }
    }, []);

    // Fonction pour voter sur le post
    const handlePostVote = (voteType: 'up' | 'down') => {
        if (userVote === voteType) {
            // Annuler le vote actuel
            setPostVotes(postVotes + (voteType === 'up' ? -1 : 1));
            setUserVote(null);
        } else {
            // Changer de vote ou voter pour la première fois
            setPostVotes(postVotes +
                (userVote === null ? (voteType === 'up' ? 1 : -1) :
                    (voteType === 'up' ? 2 : -2)));
            setUserVote(voteType);
        }
    };

    // Fonction pour ajouter un nouveau commentaire
    const handleAddComment = () => {
        if (newComment.trim() === '') return;

        const newCommentObj: Comment = {
            id: comments.length + 1,
            author: "Vous",
            authorAvatar: "/assets/profiles/you.jpg",
            content: newComment,
            timestamp: "À l'instant",
            likes: 0,
            isLiked: false
        };

        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    // Fonction de téléchargement
    const handleDownload = () => {
        if (fichiers.length > 0) {
            const premierFichier = fichiers[0];
            const lien = document.createElement('a');
            lien.href = premierFichier.donnees;
            lien.download = premierFichier.nom;
            document.body.appendChild(lien);
            lien.click();
            document.body.removeChild(lien);
        }
    };

    // Fonction pour passer en mode modification
    const handleModifier = () => {
        setEstEnModeModification(true);
    };

    return (
        <div className="w-full mx-auto mb-6">
            <div className="content-header">
                <div className="content-header-actions">
                    <Return/>
                    <Dropzone/>
                    <Sort/>
                </div>
            </div>

            {/* Mode modification */}
            {estEnModeModification && (
                <div {...getRootProps()}
                     className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full">
                        <input {...getInputProps()} />
                        <p className="text-center text-gray-600 mb-4">
                            Glissez et déposez un fichier ici, ou cliquez pour sélectionner
                        </p>
                        <p className="text-center text-sm text-gray-500">
                            (Images et PDFs uniquement)
                        </p>
                    </div>
                </div>
            )}

            {/* En-tête du cours avec système de vote Reddit */}
            <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden flex">
                {/* Système de vote sur le côté gauche */}
                <div
                    className="flex flex-col items-center justify-around mx-3 my-4 bg-gray-50 border-r border-gray-100">
                    <button
                        className={`p-1 h-full rounded-md hover:bg-gray-200 ${userVote === 'up' ? 'text-green-500' : 'text-gray-400'}`}
                        onClick={() => handlePostVote('up')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
                        </svg>
                    </button>
                    <span className="my-1 font-medium text-gray-800">{postVotes}</span>
                    <button
                        className={`p-1 h-full rounded-md hover:bg-gray-200 ${userVote === 'down' ? 'text-blue-500' : 'text-gray-400'}`}
                        onClick={() => handlePostVote('down')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                </div>

                {/* Contenu principal - Fichiers importés */}
                <div className="flex-1 p-4">
                    {fichiers.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            Aucun fichier téléchargé
                        </div>
                    ) : (
                        fichiers.map((fichier, index) => (
                            <div key={index} className="w-full mb-4">
                                {fichier.type.startsWith('image/') ? (
                                    <img
                                        src={fichier.donnees}
                                        alt={fichier.nom}
                                        className="w-full object-contain max-h-screen"
                                    />
                                ) : fichier.type === 'application/pdf' ? (
                                    <iframe
                                        src={fichier.donnees}
                                        width="100%"
                                        height="600"
                                        title={fichier.nom}
                                        className="border-none"
                                    />
                                ) : (
                                    <div className="text-center text-gray-500 mt-10">
                                        Prévisualisation non disponible pour ce type de fichier
                                    </div>
                                )}
                            </div>
                        ))
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round" className="lucide lucide-file-pen-line mr-1">
                            <path
                                d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/>
                            <path
                                d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
                            <path d="M8 18h1"/>
                        </svg>
                        Modifier
                    </button>

                    <button
                        className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                        Sauvegarder
                    </button>

                    <button
                        className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded"
                        onClick={handleDownload}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round" className="lucide lucide-download mr-1">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" x2="12" y1="15" y2="3"/>
                        </svg>
                        Télécharger
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
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
                            onClick={handleAddComment}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
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