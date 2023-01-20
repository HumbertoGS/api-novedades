import express from "express";
import Controllers from "../controllers/login.js";
import store from "../connection/dbposgres.js";
import response from "../connection/response.js";

//Constantes
const router = express.Router();
const Controller = Controllers(store());

router.post("/negocio", function (req, res, next) {
  Controller.LoginNegocio(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.post("/acceso", function (req, res, next) {
  Controller.AccesoMenu(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

export default router;
