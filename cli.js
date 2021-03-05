#!/usr/bin/env node

import createWebAppTemplate from "./src/web-app-skeleton.js";
import frontend, {
    name
} from "./src/args.js";

(async () => {
    await createWebAppTemplate(name, frontend);
})();