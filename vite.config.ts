import { defineConfig, normalizePath } from "vite";
import { developmentAssets } from "./src/site/context.ts";

export default defineConfig({
  appType: "custom",
  server: { allowedHosts: ["terminal.local"] },
  plugins: [
    {
      name: "scarp-typescript-pages",
      configureServer(server) {
        return () => {
          server.middlewares.use(async (request, response, next) => {
            try {
              const path = new URL(request.url ?? "/", "http://localhost")
                .pathname;
              const renderer = (await server.ssrLoadModule(
                "/src/site/render.tsx",
              )) as typeof import("./src/site/render.tsx");
              const result = await renderer.renderRequest(
                path,
                developmentAssets,
              );
              if (!result) {
                if (request.headers.accept?.includes("text/html")) {
                  const missing = await renderer.renderRequest(
                    "/404.html",
                    developmentAssets,
                  );
                  if (missing) {
                    response.statusCode = 404;
                    response.setHeader("Content-Type", missing.contentType);
                    response.end(
                      await server.transformIndexHtml(path, missing.body),
                    );
                    return;
                  }
                }
                next();
                return;
              }
              response.statusCode = result.status;
              response.setHeader("Content-Type", result.contentType);
              response.end(
                result.contentType.startsWith("text/html")
                  ? await server.transformIndexHtml(path, result.body)
                  : result.body,
              );
            } catch (error) {
              next(error instanceof Error ? error : new Error(String(error)));
            }
          });
        };
      },
      handleHotUpdate(context) {
      if (/\/src\/.*\.(tsx?|srp|stdout|css)$/.test(normalizePath(context.file))) {
          context.server.ws.send({ type: "full-reload" });
        }
      },
    },
  ],
});
