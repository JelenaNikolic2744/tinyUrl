import Router from "express";
import { findPopular, shortUrl, url } from "./controllers/shortUrl.js"

const router = Router();

router.get("/popularUrl", findPopular)
router.post("/shortUrl", shortUrl);
router.get("/:url", url);


export { router };
