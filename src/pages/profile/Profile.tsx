import { useState } from 'react';
import Return from "../../components/return/return.tsx";

export default function Profile() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="max-w-6xl mx-4 my-8 w-full mx-auto items-center justify-center rounded-lg shadow-md">
            <div className="content-header">
                <div className="content-header-actions">
                    <Return />
                </div>
                <h2 className="title-page">Profil</h2>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* En-tête du profil */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-10">
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-500 mb-4 sm:mb-0 sm:mr-6">
                            JW
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-white">John Wick</h1>
                            <p className="text-blue-100">john.wickh@example.com</p>
                            <p className="text-blue-100 mt-2">Membre depuis mars 2022</p>
                        </div>
                    </div>
                </div>

                {/* Navigation par onglets */}
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'profile'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'settings'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Paramètres
                        </button>
                    </nav>
                </div>

                {/* Contenu des onglets */}
                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>

                            <div className="flex justify-center w-full gap-6">
                                <div>
                                    <div className="w-full mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                        <input
                                            type="text"
                                            value="John Smith"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value="john.smith@example.com"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                        <input
                                            type="tel"
                                            placeholder="Ajouter un numéro de téléphone"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres du compte</h2>

                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Changer de mot de passe</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                                            <input
                                                type="password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                                            <input
                                                type="password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="text-right">
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                                                Mettre à jour
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900">Notifications</h3>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-700">Notifications par email</p>
                                                <p className="text-sm text-gray-500">Recevoir des emails sur les nouveaux cours</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-700">Notifications du site</p>
                                                <p className="text-sm text-gray-500">Recevoir des notifications sur le site</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-medium text-red-600">Supprimer le compte</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Une fois que vous supprimez votre compte, toutes vos données seront définitivement effacées.
                                    </p>
                                    <div className="mt-4">
                                        <button className="border border-red-500 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-md transition-colors">
                                            Supprimer mon compte
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}