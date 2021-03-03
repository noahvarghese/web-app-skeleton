import fs from "fs";
import fse from "fs-extra";
import {
    getInstalledPath
} from "get-installed-path";
import exec from "./lib/exec.js"
import Logs, {
    LogLevels
} from "./lib/logs.js";
import server from "./types/server.js";
import test from "./types/test.js";
import path from "path";

const __dirname = await getInstalledPath("web-app-template");


const createWebAppTemplate = async (name, frontend) => {

    // globalThis.modulePath = require.resolve("web-app-template");
    globalThis.projectPath = process.cwd() + "/" + name;

    console.log(__dirname);
    console.log(process.cwd());
    console.log(globalThis.modulePath);
    console.log(globalThis.projectPath);

    Logs.addLog(`Creating web app - ${name}`, LogLevels.LOG);
    await exec(`mkdir ${name}`);
    await createFrontend(frontend);
    await createProject(server);
    await createProject(test);
    Logs.addLog(`Setup of ${name} complete.`, LogLevels.LOG);
}

const globalPackageInstall = async (packageName, sudo = false) => {
    if (packageName) {
        const success = await exec(`${sudo ? "sudo " : ""}npm i -g ${packageName}`);

        if (!success) {
            const error = `Unable to install ${packageName}.`;
            Logs.addLog(error, LogLevels.ERROR);
            throw new Error(error);
        }
    } else {
        throw new Error("No package provided.");
    }
}

const attemptGlobalPackageInstalls = async (globalPackage) => {
    const exists = (await exec(`npm list --depth 1 --global ${globalPackage} | grep empty`, false)).length > 0;

    if (!exists) {

        Logs.addLog(`Package: ${globalPackage} not found, attempting to install.`, LogLevels.WARN);

        try {
            await globalPackageInstall(globalPackage);
        } catch (_) {
            Logs.addLog(`Retrying install of ${globalPackage} with sudo.`, LogLevels.MESSAGE);
            try {
                await globalPackageInstall(globalPackage, true);
            } catch (error) {
                Logs.addLog(error, LogLevels.ERROR);
                throw new Error(error);
            }
        }
    }
}

const createFrontend = async (frontend) => {

    await attemptGlobalPackageInstalls(frontend.basePackage.name);

    Logs.addLog("Scaffolding frontend.", LogLevels.LOG);

    // requries user input maybe
    await exec(`cd ${globalThis.projectPath} && ${frontend.basePackage.cmd} ${frontend.basePackage.options}`, false);


    const {
        dependencies,
        devDependencies
    } = getTypesAndPackages(frontend.dependencies);

    Logs.addLog("Installing frontend dependencies.", LogLevels.LOG);
    installDependencies(dependencies);
    Logs.addLog("Installing frontend types.", LogLevels.LOG);
    installDependencies(devDependencies, true);
    Logs.addLog("Installing frontend development dependencies.", LogLevels.LOG);
    installDependencies(frontend.devDependencies.join(" "), true);


    // TODO change port in server/src/config/index.ts file when serving the vue or react development server
}

const createProject = async (project) => {
    Logs.addLog(`Creating ${project.name} folder.`, LogLevels.LOG);


    await exec(`mkdir ${project.name} && cd ${project.name}`);
    await initNpm();

    // TODO copy scripts to new package.json

    const {
        dependencies,
        devDependencies
    } = getTypesAndPackages(project.dependencies);

    await installDependencies(dependencies);
    await installDependencies(devDependencies, true);
    await installDependencies(project.devDependencies.join(" "), true);

    await initTypescript();

};

const getTypesAndPackages = (packagesArray) => {
    if (Array.isArray(packagesArray)) {
        const dependencies = packagesArray.map((pkg) => pkg.package).join(" ");
        const devDependencies = packagesArray.map((pkg) => pkg.types).filter((type) => type != null).join(" ");

        return {
            dependencies,
            devDependencies
        };
    }
    throw new Error("Not an array");
}

const installDependencies = async (dependencies, dev = false) => {
    if (typeof dependencies !== "string") {
        throw new Error("Not a string");
    }

    await exec(`npm i ${dev ? "-D" : ""} ${dependencies}`, false);
    return;
}

const initNpm = async () => await exec("npm init -y");
const initTypescript = async (folderName) => {
    await exec("./node_modules/.bin/tsc --init");
    await exec("./node_modules/.bin/tslint --init");

    fs.copyFileSync(globalThis.modulePath + "/src/config/tsconfig.json", globalThis.projectPath + "/" + folderName + "/tsconfig.json");
    fs.copyFileSync(globalThis.modulePath + "/src/config/tslint.json", globalThis.projectPath + "/" + folderName + "/tslint.json");
}

export default createWebAppTemplate