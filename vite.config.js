import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    build: {
        rollupOptions: {
            input: {
                main: "public/index.html",
                apod: "public/apod.html",
                epic: "public/epic.html",
                favorites: "public/favorites.html",
            }
        }
    }
})