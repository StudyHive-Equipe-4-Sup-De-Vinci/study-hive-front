import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(env.VITE_BACKEND_URL),
    },

    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0", // ✅ Permet à Clever Cloud d'écouter sur toutes les interfaces
      port: 8080,
      allowedHosts: ["app-67d861fe-061f-4753-8e0b-c14b4cdd3973.cleverapps.io"],
    },
  };
});
