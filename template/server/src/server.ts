import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import config from "./lib/config";
import router from "./lib/routes";
import authMiddleware from "./lib/middleware";
import Logs, { LogLevels } from "./lib/util/Logs";

const app = express();

(async () => {
    app.disable("x-powered-by");

    app.use(cors({ origin: config.permalink }));

    app.use(fileUpload({ createParentPath: true }));

    app.use(authMiddleware);

    app.use("/", router);

    app.listen(config.port, () => {
        Logs.addLog(`Server started on port: ${config.port}`, LogLevels.EVENT);
    });
})();
