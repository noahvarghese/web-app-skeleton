#!/usr/bin/env node

import createWebAppTemplate from "..";
import frontend, {
    name
} from "./args";

createWebAppTemplate(name, frontend);