import './sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="categories-card">
                <h3>Catégories</h3>
                <ul className="category-list">
                    <li><a href="#" className="active">Tous les cours</a></li>
                    <li><a href="#">Informatique</a></li>
                    <li><a href="#">Mathématiques</a></li>
                    <li><a href="#">Sciences</a></li>
                    <li><a href="#">Langues</a></li>
                    <li><a href="#">Arts</a></li>
                </ul>
            </div>
        </div>
    )
};