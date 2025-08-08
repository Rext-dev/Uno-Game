import { Router } from "express";
import * as AuthController from "../controllers/auth-controller.js";
import { validateBody } from "../middlewares/validation-middleware.js";
import { validateJWT } from "../middlewares/auth-middleware.js";
import { loginPlayerSchema } from "../schemas/player-schemas.js";
import { accessTokenSchema } from "../schemas/auth-schema.js";

const router = Router();

router.post("/login", validateBody(loginPlayerSchema), AuthController.login);
router.get("/user", validateJWT(accessTokenSchema), AuthController.getUser);
router.post("/logout", validateJWT(accessTokenSchema), AuthController.logout);

export default router;
