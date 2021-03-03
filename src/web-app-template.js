import fs from "fs";
import fse from "fs-extra";
import exec from "./lib/exec"
import Logs, {
    LogLevels
} from "./lib/logs";
import server from "./types/server";
import test from "./types/test";


const createWebAppTemplate = async (name, frontend) => {

    globalThis.modulePath = __dirname;
    globalThis.projectPath = process.cwd() + name;

    console.log(__dirname);
    console.log(process.cwd());
    console.log(globalThis.modulePath);
    console.log(globalThis.projectPath);

    Logs.addLog(`Creating web app ${name}`, LogLevels.LOG);
    await exec(`mkdir ${name} && cd ${name}`);
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

    // requries user input
    await exec(`${frontend.basePackage.cmd} ${frontend.basePackage.options} && cd ${globalThis.projectPath}/client`, false);


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

    await exec("cd ..");

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

    installDependencies(dependencies);
    installDependencies(devDependencies, true);
    installDependencies(project.devDependencies.join(" "), true);

    await initTypescript();

    await exec("cd ..");
};

const getTypesAndPackages = (packagesArray) => {
    if (Array.isArray(packagesArray)) {
        const dependencies = packagesArray.map((package) => package.package).join(" ");
        const devDependencies = packagesArray.map((package) => package.types).filter((type) => type != null).join(" ");

        return {
            dependencies,
            devDependencies
        };
    }
    throw new Error("Not an array");
}

const installDependencies = (dependencies, dev = false) => {
    if (Array.isArray(dependencies)) {
        dependencies.forEach(async (dep) => await exec(`npm i ${dev ? "-D" : ""} ${dep}`));
        return;
    }
    throw new Error("Not an array");
}

const initNpm = async () => await exec("npm init -y");
const initTypescript = async (folderName) => {
    await exec("./node_modules/.bin/tsc --init");
    await exec("./node_modules/.bin/tslint --init");

    fs.copyFileSync(globalThis.modulePath + "/src/config/tsconfig.json", globalThis.projectPath + "/" + folderName + "/tsconfig.json");
    fs.copyFileSync(globalThis.modulePath + "/src/config/tslint.json", globalThis.projectPath + "/" + folderName + "/tslint.json");
}

export default createWebAppTemplate