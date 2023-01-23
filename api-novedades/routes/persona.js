import express from "express";
import Controllers from "../controllers/persona.js";
import store from "../connection/dbposgres.js";
import response from "../connection/response.js";

//Constantes
const router = express.Router();
const Controller = Controllers(store());

router.post("/buscar", function (req, res, next) {
  Controller.buscarDatos(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

export default router;
