import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
    console.log(res.body)
    res.status(200);
});

export default router;
