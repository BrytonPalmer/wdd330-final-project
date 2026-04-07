import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                apod: "apod.html",
                epic: "epic.html",
            }
        }
    }
})