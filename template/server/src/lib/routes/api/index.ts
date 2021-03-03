import express, { Request, Response } from "express";
import User from "../../models/user";
import { createUserOptions } from "../../types/user-options";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
    res.send("HIII");
});

router.post("/signUp", (req, res) => {
    // const user : User = new User(req.body.id, req.body.name);
    const user = new User(createUserOptions({ id: 1 }));
    user.read();
});
export default router;
