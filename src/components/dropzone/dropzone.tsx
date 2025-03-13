import { useCallback, useState } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';

// Liste des matières disponibles
const MATIERES = [
    'Mathématiques',
    'Physique',
    'Chimie',
    'Informatique',
    'Biologie',
    'Histoire',
    'Géographie',
    'Langues',
    'Sciences Économiques',
    'Philosophie',
    'Arts'
];

interface FichierTelechargé extends File {
    preview: string;
}

export default function Dropzone() {
    // État pour stocker les fichiers avec leurs aperçus
    const [fichiers, setFichiers] = useState<FichierTelechargé[]>([]);

    // États pour le titre et la matière
    const [titre, setTitre] = useState<string>('');
    const [matiere, setMatiere] = useState<string>('');

    // État pour gérer le survol
    const [estSurvole, setEstSurvole] = useState(false);

    // Gérer le dépôt de fichiers
    const onDrop = useCallback((fichiersAcceptes: File[], rejetsDefichiers: FileRejection[]) => {
        if (fichiersAcceptes.length > 0) {
            // Créer des objets avec prévisualisations pour chaque fichier
            const fichiersAvecPreviews = fichiersAcceptes.map(fichier =>
                Object.assign(fichier, {
                    preview: fichier.type.startsWith('image/')
                        ? URL.createObjectURL(fichier)
                        : fichier.type === 'application/pdf'
                            ? '/pdf-icon.png'
                            : '/file-icon.png'
                })
            );

            // Ajouter les nouveaux fichiers à l'état
            setFichiers(fichiersPrecedents => [...fichiersPrecedents, ...fichiersAvecPreviews]);
        }

        if (rejetsDefichiers.length > 0) {
            console.log('Fichiers rejetés:', rejetsDefichiers);
            alert(`Certains fichiers ont été rejetés. Assurez-vous qu'ils respectent les critères (type et taille).`);
        }
    }, []);

    // Retirer un fichier de la liste
    const supprimerFichier = (fichier: FichierTelechargé) => {
        const nouveauxFichiers = [...fichiers];
        nouveauxFichiers.splice(nouveauxFichiers.indexOf(fichier), 1);
        setFichiers(nouveauxFichiers);

        // Libérer l'URL si c'est une image
        if (fichier.type.startsWith('image/')) {
            URL.revokeObjectURL(fichier.preview);
        }

        // Réinitialiser le titre et la matière si plus aucun fichier
        if (nouveauxFichiers.length === 0) {
            setTitre('');
            setMatiere('');
        }
    };

    const handlePublier = () => {
        // Validation du titre et de la matière
        if (!titre.trim()) {
            alert('Veuillez saisir un titre pour le cours');
            return;
        }

        if (!matiere) {
            alert('Veuillez sélectionner une matière');
            return;
        }

        if (fichiers.length > 0) {
            // Convertir les fichiers en base64 ou stocker leurs URLs
            const fichiersAStocquer = fichiers.map(async (fichier) => {
                // Si c'est une image ou un PDF, convertir en base64
                if (fichier.type.startsWith('image/') || fichier.type === 'application/pdf') {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({
                                nom: fichier.name,
                                type: fichier.type,
                                donnees: reader.result as string, // base64
                                taille: fichier.size,
                                titre: titre,
                                matiere: matiere
                            });
                        };
                        reader.readAsDataURL(fichier);
                    });
                }

                // Pour les autres types de fichiers
                return {
                    nom: fichier.name,
                    type: fichier.type,
                    donnees: URL.createObjectURL(fichier),
                    taille: fichier.size,
                    titre: titre,
                    matiere: matiere
                };
            });

            // Attendre que tous les fichiers soient convertis
            Promise.all(fichiersAStocquer).then((fichiersPrets) => {
                localStorage.setItem('fichiersTelechargés', JSON.stringify(fichiersPrets));
                window.location.href = '/course';
            });
        } else {
            alert('Veuillez télécharger au moins un fichier avant de publier.');
        }
    };

    // Configuration de Dropzone avec typage
    const optionsZoneDepot: DropzoneOptions = {
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf']
        },
        maxSize: 5242880, // 5 MB
        multiple: true
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone(optionsZoneDepot);

    return (
        <div className="space-y-4">
            {/* Zone de dépôt compacte qui s'agrandit au survol avec transition plus douce */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all duration-500 ease-in-out ${
                    estSurvole || isDragActive
                        ? 'p-8 bg-gray-50 border-blue-300'
                        : 'p-3 hover:border-blue-300'
                }`}
                onMouseEnter={() => setEstSurvole(true)}
                onMouseLeave={() => setEstSurvole(false)}
            >
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    estSurvole || isDragActive ? 'max-h-40 opacity-100' : 'max-h-8 opacity-100'
                }`}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="text-blue-500 text-center">Déposez les fichiers ici...</p>
                    ) : estSurvole ? (
                        <div className="text-center">
                            <p className="mb-2">Glissez-déposez des fichiers ici, ou cliquez pour les sélectionner</p>
                            <p className="text-sm text-gray-500">
                                (Uniquement les images et PDF, max 5 Mo)
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mr-2" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <span className="text-sm text-gray-500">Importer des fichiers</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Aperçu des fichiers */}
            {fichiers.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Fichiers sélectionnés</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {fichiers.map((fichier, index) => (
                            <div key={index}
                                 className="relative border rounded-lg overflow-hidden shadow-sm transition-transform duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                                {/* Aperçu du fichier */}
                                {fichier.type.startsWith('image/') ? (
                                    <img
                                        src={fichier.preview}
                                        alt={fichier.name}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                    </div>
                                )}

                                {/* Nom et taille du fichier */}
                                <div className="p-2">
                                    <p className="text-sm font-medium truncate" title={fichier.name}>
                                        {fichier.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(fichier.size / 1024).toFixed(0)} Ko
                                    </p>
                                </div>

                                {/* Bouton pour supprimer le fichier avec animation douce */}
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300 ease-in-out transform hover:scale-110"
                                    onClick={() => supprimerFichier(fichier)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>


                    {/* Section Titre et Matière - Affichée uniquement si des fichiers ont été importés */}
                    {fichiers.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm mt-4 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Titre du cours */}
                                <div>
                                    <label
                                        htmlFor="course-title"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Titre du cours
                                    </label>
                                    <input
                                        id="course-title"
                                        type="text"
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        placeholder="Entrez le titre de votre cours"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Sélection de la matière */}
                                <div>
                                    <label
                                        htmlFor="course-subject"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Matière
                                    </label>
                                    <select
                                        id="course-subject"
                                        value={matiere}
                                        onChange={(e) => setMatiere(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Sélectionnez une matière</option>
                                        {MATIERES.map((matiereOption) => (
                                            <option key={matiereOption} value={matiereOption}>
                                                {matiereOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Bouton Publier */}
                            {fichiers.length > 0 && (
                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={handlePublier}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                                    >
                                        Publier
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}