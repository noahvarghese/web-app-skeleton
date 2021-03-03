#!/usr/bin/node

import createWebAppTemplate from "../index";
import frontend, {
    name
} from "./args/index";

createWebAppTemplate(name, frontend);