import {
    exec
} from "child_process";
import Logs, {
    LogLevels
} from "./logs.js";

export default (cmd, outputToNull = true, showError = true) => {
    return new Promise((resolve, reject) => {
        exec(`${cmd} ${outputToNull ? "> /dev/null 2>&1" : ""}`, (error, stdout, stderr) => {
            if (error) {
                Logs.addLog(error, LogLevels.ERROR);
                reject(false);
            }

            if (stderr) {
                if (showError) {
                    Logs.addLog(stderr, LogLevels.ERROR);
                }
                reject(false);
            }

            if (outputToNull) {
                resolve(true);
            } else {
                resolve(stdout);
            }
        });
    });
}