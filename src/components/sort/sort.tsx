import { useState, useRef, useEffect } from 'react';
import './sort.css';
import axiosI from '../../axiosInterceptor';

// Interface pour les props du composant Sort
interface SortProps {
    onPostsFiltered?: (filteredPosts: any[]) => void; // Callback pour mettre à jour les posts dans le composant parent
}

export default function Sort({ onPostsFiltered }: SortProps) {
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // État pour suivre l'option de tri sélectionnée
    const [selectedSort, setSelectedSort] = useState('Populaires');

    // État pour gérer les chargements et les erreurs
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Effect pour appliquer le filtre par défaut au chargement du composant
    useEffect(() => {
        // Appliquer le tri par défaut (Populaires) au chargement initial
        applySort('Populaires');
    }, []);

    const toggleSortMenu = () => {
        if (showSortMenu) {
            setShowSortMenu(false);
        } else {
            setShowSortMenu(true);

            // Ajouter un gestionnaire d'événement pour les clics en dehors du menu
            setTimeout(() => {
                const handleClickOutside = (event: MouseEvent) => {
                    if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                        setShowSortMenu(false);
                        document.removeEventListener('click', handleClickOutside);
                    }
                };

                document.addEventListener('click', handleClickOutside);
            }, 0);
        }
    };

    // Fonction pour convertir l'option de tri sélectionnée en paramètre pour l'API
    const getSortParameter = (sortOption: string): string => {
        switch (sortOption) {
            case 'Plus récents':
                return 'newest';
            case 'Plus anciens':
                return 'oldest';
            case 'Populaires':
                return 'popular';
            case 'Mieux notés':
                return 'top_rated';
            default:
                return 'popular'; // Valeur par défaut
        }
    };

    // Fonction pour appliquer le tri
    const applySort = async (sortOption: string) => {
        try {
            setLoading(true);
            setError(null);

            const sortParam = getSortParameter(sortOption);

            // Appel à l'API avec le paramètre de tri
            const response = await axiosI.post('/api/posts/filtered', {
                sortBy: sortParam
            });

            console.log(`Posts triés par ${sortOption}:`, response.data);

            // Extraire les posts triés de la réponse
            let filteredPosts = [];

            if (Array.isArray(response.data)) {
                filteredPosts = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // Recherche des posts dans différentes propriétés possibles
                if (response.data.Posts && Array.isArray(response.data.Posts)) {
                    filteredPosts = response.data.Posts;
                } else if (response.data.posts && Array.isArray(response.data.posts)) {
                    filteredPosts = response.data.posts;
                } else {
                    // Recherche d'un tableau dans les propriétés de l'objet
                    const possiblePostsArray = Object.values(response.data).find(value => Array.isArray(value));
                    if (possiblePostsArray) {
                        filteredPosts = possiblePostsArray;
                    }
                }
            }

            // Mise à jour des posts dans le composant parent via le callback
            if (onPostsFiltered) {
                onPostsFiltered(filteredPosts);
            }

            setLoading(false);
        } catch (error) {
            console.error(`Erreur lors du tri par ${sortOption}:`, error);
            setError(`Impossible de trier les posts. Veuillez réessayer.`);
            setLoading(false);
        }
    };

    // Fonction pour gérer le clic sur une option
    const handleSortSelection = (sortOption: string) => {
        setSelectedSort(sortOption);
        setShowSortMenu(false);
        // Appliquer le tri
        applySort(sortOption);
    };

    return (
        <div className="sort-dropdown" ref={sortRef}>
            <button
                className={`ml-4 btn-primary ${loading ? 'opacity-75 cursor-wait' : ''}`}
                onClick={toggleSortMenu}
                disabled={loading}
            >
                {loading ? 'Chargement...' : `Trier: ${selectedSort}`}
            </button>

            {error && (
                <div className="text-red-500 text-sm mt-1 absolute">{error}</div>
            )}

            {showSortMenu && (
                <div className="sort-menu">
                    <div
                        className={`sort-item ${selectedSort === "Plus récents" ? "active" : ""}`}
                        onClick={() => handleSortSelection("Plus récents")}
                    >
                        Plus récents
                    </div>
                    <div
                        className={`sort-item ${selectedSort === "Plus anciens" ? "active" : ""}`}
                        onClick={() => handleSortSelection("Plus anciens")}
                    >
                        Plus anciens
                    </div>
                    <div
                        className={`sort-item ${selectedSort === "Populaires" ? "active" : ""}`}
                        onClick={() => handleSortSelection("Populaires")}
                    >
                        Populaires
                    </div>
                    <div
                        className={`sort-item ${selectedSort === "Mieux notés" ? "active" : ""}`}
                        onClick={() => handleSortSelection("Mieux notés")}
                    >
                        Mieux notés
                    </div>
                </div>
            )}
        </div>
    );
}