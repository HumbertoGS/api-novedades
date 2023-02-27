import express from "express";
import Controllers from "../controllers/inicio.js";
import store from "../connection/dbposgres.js";
import response from "../connection/response.js";

//Constantes
const router = express.Router();
const Controller = Controllers(store());

router.post("/login", function (req, res, next) {
  Controller.LoginNegocio(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.post("/registro", function (req, res, next) {
  Controller.registroPersona(req.body)
    .then((data) => {
      response.success(req, res, data.datos, 200, data.message);
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
