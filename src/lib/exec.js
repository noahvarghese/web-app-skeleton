import {
    exec
} from "child_process";
import Logs, {
    LogLevels
} from "./Logs";

export default (cmd, outputToNull = true) => {
    return new Promise((resolve, reject) => {
        exec(`${cmd} ${outputToNull ? "> /dev/null 2>&1" : ""}`, (error, stdout, stderr) => {
            if (error) {
                Logs.addLog(error, LogLevels.ERROR);
                reject(false);
            }

            if (stderr) {
                Logs.addLog(stderr, LogLevels.ERROR);
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