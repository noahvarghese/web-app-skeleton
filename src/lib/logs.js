export const LogLevels = {
    EVENT: 0,
    ERROR: 1,
    WARN: 2,
    DEBUG: 3,
    LOG: 4,
    MESSAGE: 5,
}

// interface LogData {
//     prefix: string;
//     consoleFunction: (message: string) => void;
// }

const emptyLogData = () => ({
    prefix: "",
    // tslint:disable-next-line: no-empty
    consoleFunction: () => {},
});

const createLogData = (intialValues) => {
    return Object.assign(emptyLogData(), intialValues);
};

export default class Logs {
    // static logLevel = Number(process.env.LOG_LEVEL);

    static getLogData = (logLevel) => {
        switch (logLevel) {
            case LogLevels.EVENT:
                return createLogData({
                    prefix: "[ EVENT ]: ",
                    consoleFunction: console.log,
                });
            case LogLevels.ERROR:
                return createLogData({
                    prefix: "[ ERROR ]: ",
                    consoleFunction: console.error,
                });
            case LogLevels.WARN:
                return createLogData({
                    prefix: "[ WARNING ]: ",
                    consoleFunction: console.warn,
                });
            case LogLevels.DEBUG:
                return createLogData({
                    prefix: "[ DEBUG ]: ",
                    consoleFunction: console.debug,
                });
            case LogLevels.LOG:
                return createLogData({
                    prefix: "[ LOG ]: ",
                    consoleFunction: console.log,
                });
            case LogLevels.MESSAGE:
                return createLogData({
                    prefix: "[ MESSAGE ]: ",
                    consoleFunction: console.info,
                });
            default:
                throw new Error(
                    "Log level passed in does match log levels set."
                );
        }
    };

    static addLog = (message, logLevel) => {
        // if (logLevel <= Logs.logLevel) {
        try {
            const {
                prefix,
                consoleFunction
            } = Logs.getLogData(logLevel);

            consoleFunction(prefix + message);
        } catch (e) {
            console.error(e.message);
        }
        // }
    };
}