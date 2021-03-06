#!/usr/bin/env node

import createWebAppTemplate from "./src/web-app-skeleton.js";
import frontend, {
    name
} from "./src/args.js";
import exec from "./src/lib/exec.js";
import Logs, {
    LogLevels
} from "./src/lib/logs.js";

(async () => {
    const version = await exec("npm -v", false);
    let success = false;
    if (typeof version === "string") {
        const versionNumbers = version.split(".");
        try {
            if (Number(versionNumbers[0]) >= 7) {
                await createWebAppTemplate(name, frontend);
                let success = false;
                return;
            }
        } catch (_) {}
    }

    if (!success) {
        Logs.addLog("NPM version must be 7.x or greater.", LogLevels.ERROR);
    }
})();