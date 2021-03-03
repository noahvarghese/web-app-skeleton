#!/usr/bin/env node

import createWebAppTemplate from "./src/web-app-template";
import frontend, {
    name
} from "./src/args";

createWebAppTemplate(name, frontend);