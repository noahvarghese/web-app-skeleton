import yargs from "yargs";
import react from "../../types/react";
import vue from "../../types/vue";

const argv = yargs.options({
    "f": {
        alias: "frontend",
        describe: "Choose between React or Vue for frontend.",
        type: "string",
        nargs: 1,
        default: "React"
    },
    "n": {
        alias: "name",
        describe: "Project name, can also be a path to the desired project name.",
        type: "string",
        nargs: 1,
    }
}).help().argv;

if (!argv.n) {
    throw new Error("Please specify a project name or path with project name");
}


const frontendName = argv.f.toLowerCase();
let frontend;

switch (frontendName) {
    case "react":
        frontend = react;
        break;
    case "vue":
        frontend = vue;
        break;
    default:
        throw new Error("Currently only supports Vue and React.");
}

export default frontend;
export const name = argv.n;