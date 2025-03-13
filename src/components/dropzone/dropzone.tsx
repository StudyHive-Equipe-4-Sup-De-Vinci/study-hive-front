import {useCallback, useState} from 'react';
import {useDropzone, FileRejection, DropzoneOptions} from 'react-dropzone';

interface FileWithPreview extends File {
    preview: string;
}

export default function Dropzone() {
    // État pour stocker les fichiers avec leurs aperçus
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    // État pour gérer le survol
    const [isHovered, setIsHovered] = useState(false);

    // Gérer le dépôt de fichiers
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (acceptedFiles.length > 0) {
            // Créer des objets avec prévisualisations pour chaque fichier
            const filesWithPreviews = acceptedFiles.map(file =>
                Object.assign(file, {
                    preview: file.type.startsWith('image/')
                        ? URL.createObjectURL(file)
                        : file.type === 'application/pdf'
                            ? '/pdf-icon.png'
                            : '/file-icon.png'
                })
            );

            // Ajouter les nouveaux fichiers à l'état
            setFiles(prevFiles => [...prevFiles, ...filesWithPreviews]);
        }

        if (fileRejections.length > 0) {
            console.log('Fichiers rejetés:', fileRejections);
            alert(`Certains fichiers ont été rejetés. Assurez-vous qu'ils respectent les critères (type et taille).`);
        }
    }, []);

    // Retirer un fichier de la liste
    const removeFile = (file: FileWithPreview) => {
        const newFiles = [...files];
        newFiles.splice(newFiles.indexOf(file), 1);
        setFiles(newFiles);

        // Libérer l'URL si c'est une image
        if (file.type.startsWith('image/')) {
            URL.revokeObjectURL(file.preview);
        }
    };

    // Configuration de Dropzone avec typage
    const dropzoneOptions: DropzoneOptions = {
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf']
        },
        maxSize: 5242880, // 5 MB
        multiple: true
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone(dropzoneOptions);

    return (
        <div className="space-y-4">
            {/* Zone de dépôt compacte qui s'agrandit au survol avec transition plus douce */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all duration-500 ease-in-out ${
                    isHovered || isDragActive
                        ? 'p-8 bg-gray-50 border-blue-300'
                        : 'p-3 hover:border-blue-300'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isHovered || isDragActive ? 'max-h-40 opacity-100' : 'max-h-8 opacity-100'
                }`}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="text-blue-500 text-center">Déposez les fichiers ici...</p>
                    ) : isHovered ? (
                        <div className="text-center">
                            <p className="mb-2">Glissez-déposez des fichiers ici, ou cliquez pour les sélectionner</p>
                            <p className="text-sm text-gray-500">
                                (Uniquement les images et PDF, max 5MB)
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
            {files.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Fichiers sélectionnés</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {files.map((file, index) => (
                            <div key={index}
                                 className="relative border rounded-lg overflow-hidden shadow-sm transition-transform duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                                {/* Aperçu du fichier */}
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={file.preview}
                                        alt={file.name}
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
                                    <p className="text-sm font-medium truncate" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>

                                {/* Bouton pour supprimer le fichier avec animation douce */}
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300 ease-in-out transform hover:scale-110"
                                    onClick={() => removeFile(file)}
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
                </div>
            )}
        </div>
    );
}