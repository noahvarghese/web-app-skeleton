#!/usr/bin/env node

import createWebAppTemplate from "../index";
import frontend, {
    name
} from "./args/index";

createWebAppTemplate(name, frontend);