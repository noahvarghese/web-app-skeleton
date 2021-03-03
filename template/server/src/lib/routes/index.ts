import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import devRouter from "./dev";
import apiRouter from "./api";

dotenv.config();
const dev: boolean = JSON.parse(process.env.DEV!);

const router = express.Router();

if (dev) {
    // redirect root requests to vue
    router.use("/", devRouter);
} else {
    const viewsPath = path.join(__dirname, "../../..", "views");
    router.use(express.static(viewsPath));

    router.all("/", (_: Request, res: Response) => {
        res.sendFile(path.join(viewsPath, "index.html"));
    });
}

router.use("/api", apiRouter);

export default router;
