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

router.post("/actualizar", function (req, res, next) {
  Controller.actualizarDatos(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.get("/buscarEmpleado", function (req, res, next) {
  Controller.buscarDatosEmpleados()
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.post("/registrarEmpleado", function (req, res, next) {
  Controller.registrarEmpleado(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.post("/cambiarEstado", function (req, res, next) {
  Controller.cambiarEstado(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

export default router;
