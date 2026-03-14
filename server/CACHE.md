# AI lesson cache (file-based)

Responses from the AI lesson pipeline are stored on disk so that:

- **Restarts**: Cache survives server restarts.
- **Deploy**: You can bundle the `cache/` folder with your app (e.g. on Railway) so live users get instant lesson load without waiting for the AI.
- **Local testing**: Run lessons locally once to fill the cache; same keys on production (or in a pre-warmed bundle) serve from cache.

## Where

- **Directory**: `./cache` at project root (override with env **`CACHE_DIR`**, e.g. `/data/cache` on Railway).
- **Layout**: `cache/intro/`, `cache/objectives/`, `cache/steps/`, `cache/lesson/`, `cache/validation/` — one JSON file per key (key is hashed for the filename).

## Pre-warming (recommended before deploy)

1. Start the server: `npm run server`
2. Run the warm script: `npm run warm-cache`  
   It POSTs intro, objectives, and full lesson for each entry in **`scripts/lessons-to-warm.json`**.
3. Edit `scripts/lessons-to-warm.json` to add your track/lesson titles and indices so all important lessons are cached.
4. Either:
   - **Commit** `cache/` (remove `cache` from `.gitignore` if you want it in the repo), or
   - **Copy** `cache/` into your Docker image / deploy artifact so it’s available at runtime.

## Railway / hosted env

- Set **`CACHE_DIR`** to a path that is persisted (e.g. a volume), or leave default and include `cache/` in the image after running `warm-cache` in CI or locally and copying the folder into the build.
- Same app (UI + server + cache dir) then serves cached responses to users without calling the AI again for those lessons.
