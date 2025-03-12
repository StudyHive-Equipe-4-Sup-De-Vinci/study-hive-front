import {useState} from 'react';
import Dropzone from "../../components/dropzone/dropzone.tsx";
import Sort from "../../components/sort/sort.tsx";
import Return from "../../components/return/return.tsx";

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
            authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
            content: "Ce cours est vraiment très bien expliqué, merci beaucoup pour le partage !",
            timestamp: "Il y a 2 heures",
            likes: 5,
            isLiked: false
        },
        {
            id: 2,
            author: "Thomas Martin",
            authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
            content: "J'ai une question concernant le chapitre 3, est-ce que quelqu'un pourrait m'expliquer comment résoudre l'exercice sur les matrices ?",
            timestamp: "Il y a 5 heures",
            likes: 2,
            isLiked: true
        }
    ]);

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
            authorAvatar: "https://randomuser.me/api/portraits/lego/1.jpg", // Avatar par défaut pour l'utilisateur
            content: newComment,
            timestamp: "À l'instant",
            likes: 0,
            isLiked: false
        };

        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    // Fonction pour gérer l'ajout/suppression de like
    const handleLike = (commentId: number) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked
                };
            }
            return comment;
        }));
    };

    return (
        <div className="w-full mx-auto">
            <div className="content-header">
                <div className="content-header-actions">
                    <Return/>
                    <Dropzone/>
                    <Sort/>
                </div>
            </div>

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

                {/* Contenu principal */}
                <div className="flex-1">
                    {/* Auteur du cours */}
                    <div className="p-4 flex items-center">
                        <img
                            src="https://randomuser.me/api/portraits/men/88.jpg"
                            alt="Avatar du professeur"
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <div>
                            <h3 className="text-lg font-medium">Prof. Alexandre Bernard</h3>
                            <p className="text-gray-500 text-sm">Posté le 12 mars 2024 • Mathématiques</p>
                        </div>
                    </div>

                    {/* Titre du cours */}
                    <div className="px-4 pb-2">
                        <h2 className="text-2xl font-bold">Introduction aux équations différentielles</h2>
                    </div>

                    {/* Image principale du cours */}
                    <div className="w-full">
                        <img
                            src="https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
                            alt="Mathématiques"
                            className="w-full h-64 object-cover"
                        />
                    </div>

                    {/* Contenu du cours */}
                    <div className="p-4">
                        <p className="text-gray-800 mb-4">
                            Dans ce cours, nous allons explorer les fondamentaux des équations différentielles et leurs
                            applications
                            dans divers domaines scientifiques. Nous commencerons par une introduction aux concepts de
                            base,
                            puis
                            nous étudierons les méthodes de résolution des équations différentielles du premier ordre.
                        </p>
                        <p className="text-gray-800 mb-4">
                            Les équations différentielles sont des outils mathématiques essentiels en physique,
                            ingénierie,
                            biologie et économie.
                            Elles nous permettent de modéliser des systèmes dynamiques et de prédire leur évolution dans
                            le
                            temps.
                        </p>

                        {/* Points clés du cours */}
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Points clés :</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Définition et classification des équations différentielles</li>
                                <li>Méthodes de résolution : séparation des variables, facteur intégrant</li>
                                <li>Équations différentielles linéaires du premier ordre</li>
                                <li>Applications en sciences physiques et ingénierie</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section d'engagement (likes, commentaires) */}
                    <div className="border-t border-gray-100 px-4 py-2">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span>{comments.length} commentaires</span>
                        </div>

                        <div className="flex border-t border-gray-100 pt-2">
                            <button
                                className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded">
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
                                className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded">
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
                                    <button
                                        className={`mr-3 ${comment.isLiked ? 'text-blue-500 font-medium' : ''}`}
                                        onClick={() => handleLike(comment.id)}
                                    >
                                        J'aime
                                    </button>
                                    <span>{comment.timestamp}</span>
                                    {comment.likes > 0 && (
                                        <div className="ml-auto flex items-center">
                                            <span
                                                className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center mr-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3"
                                                     viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                                                </svg>
                                            </span>
                                            <span>{comment.likes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}