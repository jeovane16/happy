import { Router } from "express";
import OrphanagesController from "./controller/OrphanagesController";

const routes = Router();

routes.get("/orphanages", OrphanagesController.read);

routes.get("/orphanages/:id", OrphanagesController.show);

routes.post("/orphanages", OrphanagesController.create);

export default routes;