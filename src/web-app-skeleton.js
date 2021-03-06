import fs from "fs";
import fse from "fs-extra";
import os from "os";
import {
    getInstalledPath
} from "get-installed-path";
import exec from "./lib/exec.js"
import Logs, {
    LogLevels
} from "./lib/logs.js";
import server from "./types/server.js";
import test from "./types/test.js";

const homeDir = os.homedir();

const createWebAppTemplate = async (name, frontend) => {

    globalThis.modulePath = await getInstalledPath("web-app-skeleton");;
    globalThis.projectPath = process.cwd() + "/" + name;

    if (fs.existsSync(globalThis.projectPath)) {
        Logs.addLog(`Directory ${globalThis.projectPath} already exists.`, LogLevels.ERROR);
        return;
    }

    Logs.addLog(`Creating web app - ${name}`, LogLevels.LOG);
    await exec(`mkdir ${name}`);

    await attemptGlobalPackageInstalls(frontend.basePackage.name);

    let moved = false;
    if (frontend.name.toLowerCase() === "vue") {
        if (fs.existsSync(homeDir + "/.vuerc")) {
            moved = true;
            fse.moveSync(homeDir + "/.vuerc", homeDir + "/.oldvuerc");
        } else {
            fs.copyFileSync(globalThis.modulePath + "/src/config/.vuerc", homeDir + "/.vuerc");
        }
    }

    await createFrontend(frontend);

    fs.unlinkSync(homeDir + "/.vuerc");
    if (moved) {
        fse.moveSync(homeDir + "/.oldvuerc", homeDir + "/.vuerc");
    }

    updateFrontendPort(frontend);
    updateServiceFiles(name);
    await createProject(server);
    await createProject(test);
    fse.copySync(globalThis.modulePath + "/template/", globalThis.projectPath);
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

const updateFrontendPort = (frontend) => {
    let port;
    if (frontend.basePackage.name.toLowerCase() === "react") {
        port = 3000;
    } else {
        port = 8080;
    }

    const portFilePath = globalThis.modulePath + "/template/server/src/lib/routes/dev.ts";
    let fileContents = fs.readFileSync(portFilePath).toString();
    fileContents = fileContents.replace("[PORT]", port);
    fs.writeFileSync(portFilePath, fileContents);
    // need to format somehow
}

const updateServiceFiles = (projectName) => {
    const files = [globalThis.modulePath + "/template/services/node-test.service", globalThis.modulePath + "/template/services/node-test.service", globalThis.modulePath + "/template/services/node.service"];
    files.forEach((file, index) => {
        let contents = fs.readFileSync(file).toString();
        if (index === 0) {
            projectName = "test." + projectName;
        }
        contents = contents.replace("[PROJECTNAME]", projectName);
        fs.writeFileSync(file, contents);
    });

    const localService = globalThis.modulePath + "/template/services/node-local.service";
    let contents = fs.readFileSync(localService).toString();
    contents = contents.replace("[PROJECTPATH]", globalThis.projectPath + "/" + projectName);
    fs.writeFileSync(localService, contents);
};

const attemptGlobalPackageInstalls = async (globalPackage) => {
    let exists;
    try {
        const empty = (await exec(`npm list --depth 1 --global ${globalPackage} | grep empty`, false, false));
        exists = !(empty ? empty.length > 0 : false);
    } catch (e) {
        exists = true;
    }

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

    const projectPath = globalThis.projectPath + "/client";

    Logs.addLog("Scaffolding frontend.", LogLevels.LOG);

    // requries user input maybe
    await exec(`cd ${globalThis.projectPath} && ${frontend.basePackage.cmd} ${frontend.basePackage.options}`, false);


    const {
        dependencies,
        devDependencies
    } = getTypesAndPackages(frontend.dependencies);

    Logs.addLog("Installing frontend dependencies.", LogLevels.LOG);
    await installDependencies(projectPath, dependencies);
    Logs.addLog("Installing frontend types.", LogLevels.LOG);
    await installDependencies(projectPath, devDependencies, true);
    Logs.addLog("Installing frontend development dependencies.", LogLevels.LOG);
    await installDependencies(projectPath, frontend.devDependencies.join(" "), true);
    fs.rmdirSync(projectPath + "/.git", {
        recursive: true
    });
}

const createProject = async (project) => {
    const projectPath = globalThis.projectPath + "/" + project.name;

    Logs.addLog(`Creating ${project.name} folder.`, LogLevels.LOG);


    await exec(`cd ${globalThis.projectPath} && mkdir ${project.name}`);
    Logs.addLog(`Initializing package.json for ${project.name}.`, LogLevels.LOG);
    await initNpm(projectPath);

    const packageJSON = JSON.parse(fs.readFileSync(projectPath + "/package.json"));
    packageJSON.scripts = {};

    const scripts = project.scripts;

    if (Array.isArray(scripts)) {
        scripts.forEach((script) => {
            packageJSON.scripts[script.key] = script.value;
        });
    }

    fs.writeFileSync(projectPath + "/package.json", JSON.stringify(packageJSON));

    const {
        dependencies,
        devDependencies
    } = getTypesAndPackages(project.dependencies);

    Logs.addLog(`Installing ${project.name} dependencies.`, LogLevels.LOG);
    await installDependencies(projectPath, dependencies);
    Logs.addLog(`Installing ${project.name} types.`, LogLevels.LOG);
    await installDependencies(projectPath, devDependencies, true);
    Logs.addLog(`Installing ${project.name} development dependencies.`, LogLevels.LOG);
    await installDependencies(projectPath, project.devDependencies.join(" "), true);

    Logs.addLog(`Setting up typescript for ${project.name}.`, LogLevels.LOG);
    await initTypescript(projectPath);
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

const installDependencies = async (projPath, dependencies, dev = false) => {
    if (typeof dependencies !== "string") {
        throw new Error("Not a string");
    }

    await exec(`cd ${projPath} && npm i ${dev ? "-D" : ""} ${dependencies}`, false);
    return;
}

const initNpm = async (projPath) => await exec(`cd ${projPath} && npm init -y`);
const initTypescript = async (projPath) => {
    await exec(`cd ${projPath} && ./node_modules/.bin/tsc --init`);

    fs.copyFileSync(globalThis.modulePath + "/src/config/tsconfig.json", projPath + "/tsconfig.json");
    fs.copyFileSync(globalThis.modulePath + "/src/config/.eslintrc.js", projPath + "/.eslintrc.js");
    fs.copyFileSync(globalThis.modulePath + "/src/config/.eslintignore", projPath + "/.eslintignore");
}

export default createWebAppTemplate