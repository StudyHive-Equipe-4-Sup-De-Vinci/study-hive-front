import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.BACKEND_URL": JSON.stringify(env.BACKEND_URL),
    },

    plugins: [react(), tailwindcss()],
    server: { port: Number(env.PORT) },
  };
});
