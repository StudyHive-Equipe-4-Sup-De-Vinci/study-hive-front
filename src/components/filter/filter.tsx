import {useState, useRef} from 'react';
import './filter.css';

export default function Filter() {
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="sort-dropdown" ref={sortRef}>
            <button className="btn-primary" onClick={toggleSortMenu}>
                Trier
            </button>
            {showSortMenu && (
                <div className="sort-menu">
                    <div className="sort-item" onClick={() => setShowSortMenu(false)}>Plus récents
                    </div>
                    <div className="sort-item" onClick={() => setShowSortMenu(false)}>Plus anciens
                    </div>
                    <div className="sort-item" onClick={() => setShowSortMenu(false)}>Populaires
                    </div>
                    <div className="sort-item" onClick={() => setShowSortMenu(false)}>Mieux notés
                    </div>
                </div>
            )}
        </div>
    );
}