import { Router } from "express";

export class ServerRoutes {
  static get routes() {
    const router = Router();

    router.get("/", (req, res) => res.send("hola"));

    return router;
  }
}
