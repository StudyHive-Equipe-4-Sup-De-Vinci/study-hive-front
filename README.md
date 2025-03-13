# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

### Variables pour l'intégration avec CleverCloud

1. **CLEVER_SSH_PRIVATE_KEY**  
   - **Description** : Clé privée SSH utilisée pour se connecter à l'instance CleverCloud.  
   - **Source** : Stockée dans les *secrets* de GitHub.

2. **CLEVER_TOKEN**  
   - **Description** : Token pour s'authentifier auprès de l'API de CleverCloud.  
   - **Source** : Stockée dans les *secrets* de GitHub.

3. **CLEVER_SECRET**  
   - **Description** : Secret associé au token pour l'authentification CleverCloud.  
   - **Source** : Stockée dans les *secrets* de GitHub.

4. **APP_ID**  
   - **Description** : ID de l'application sur CleverCloud pour l'environnement de production.  
   - **Source** : Stockée dans les *secrets* de GitHub.

### Explication des étapes de workflow

Le workflow est composé de deux jobs : `test` et `build-and-push`.

### Job 1: `test`
Ce job sert à tester l'application en local avant de déployer.

1. **Checkout du repo**  
   - L'étape utilise l'action `actions/checkout@v4` pour extraire le code source du repository.

2. **Installer Nodes**  
   - Cette étape met à jour le système et installe `nodejs` et `npm` (gestionnaire de paquets Node.js) pour préparer l'environnement à la construction de l'application.

3. **Build Package**  
   - Cette étape installe les dépendances du projet avec `npm install`.

4. **Start Server**  
   - Le serveur est démarré en utilisant la commande `npm start`.

5. **Test curl avec retry**  
   - Cette étape effectue une vérification de l'état du serveur via une requête HTTP (health check) sur le port `8080`. Elle tente jusqu'à 5 fois en cas d'échec, avec un délai de 5 secondes entre chaque tentative.

### Job 2: `build-and-push`
Une fois que les tests sont passés avec succès, ce job déploie l'application sur CleverCloud.

1. **Checkout du repo**  
   - L'étape utilise l'action `actions/checkout@v4` pour récupérer le code source.

2. **Install CleverCloud**  
   - Installe les outils CleverCloud en ajoutant la source de packages et en installant `clever-tools`.

3. **Ajouter la clé SSH pour CleverCloud**  
   - Cette étape ajoute la clé SSH nécessaire pour accéder au dépôt CleverCloud. La clé privée SSH est récupérée à partir des secrets de GitHub.

4. **Installer GIT**  
   - Installe `git` afin de pouvoir interagir avec le dépôt CleverCloud.

5. **Configurer Git pour GitHub Actions**  
   - Configure l'utilisateur GitHub Actions avec un e-mail et un nom générique pour les commits automatiques.

6. **Supprimer un éventuel fichier lock de Git**  
   - Si un fichier `index.lock` existe, il est supprimé pour éviter des problèmes avec le commit.

7. **Deploy GitHub**  
   - Ajoute un dépôt distant `clever` à l'aide de SSH et pousse le code vers CleverCloud en forçant la mise à jour sur la branche `master`.

8. **SET VENV**  
   - Cette étape permet de se connecter à CleverCloud en utilisant un token et un secret, puis lie l'application à l'environnement CleverCloud pour l'environnement de développement (`FRONT_PROD`). Enfin, elle redémarre l'application sur CleverCloud.

## Prérequis

Pour que ce processus fonctionne correctement, vous devez avoir configuré les secrets suivants dans votre repository GitHub :

- `CLEVER_SSH_PRIVATE_KEY`
- `CLEVER_TOKEN`
- `CLEVER_SECRET`
- `APP_ID`

Ces secrets sont utilisés pour sécuriser la connexion à votre application CleverCloud et pour automatiser le déploiement.

