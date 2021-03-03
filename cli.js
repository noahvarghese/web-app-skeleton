#!/usr/bin/env node

import createWebAppTemplate from "./src/web-app-template";
import frontend, {
    name
} from "./cli/args";

createWebAppTemplate(name, frontend);