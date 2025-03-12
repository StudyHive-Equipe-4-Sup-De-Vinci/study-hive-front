import {useState, useRef} from 'react';
import './sort.css';

export default function Sort() {
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // État pour suivre l'option de tri sélectionnée
    const [selectedSort, setSelectedSort] = useState('Populaires');

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

    // Fonction pour gérer le clic sur une option
    const handleSortSelection = (sortOption: string) => {
        setSelectedSort(sortOption);
        setShowSortMenu(false);
        // Ici vous pouvez ajouter la logique pour trier réellement les éléments
    };

    return (
        <div className="sort-dropdown" ref={sortRef}>
            <button className="btn-primary" onClick={toggleSortMenu}>
                Trier: {selectedSort}
            </button>
            {showSortMenu && (
                <div className="sort-menu">
                    <div className="sort-item" onClick={() => handleSortSelection("Plus récents")}>
                        Plus récents
                    </div>
                    <div className="sort-item" onClick={() => handleSortSelection("Plus anciens")}>
                        Plus anciens
                    </div>
                    <div className="sort-item" onClick={() => handleSortSelection("Populaires")}>
                        Populaires
                    </div>
                    <div className="sort-item" onClick={() => handleSortSelection("Mieux notés")}>
                        Mieux notés
                    </div>
                </div>
            )}
        </div>
    );
}