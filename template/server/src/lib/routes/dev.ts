import express, { Request, Response } from "express";

const router = express.Router();

router.all("/", (_: Request, res: Response) => {
    res.redirect("http://localhost:8080");
});

export default router;
