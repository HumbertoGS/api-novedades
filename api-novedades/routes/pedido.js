import express from "express";

import Controllers from "../controllers/pedido.js";
import store from "../connection/dbposgres.js";
import response from "../connection/response.js";

//Constantes
const router = express.Router();
const Controller = Controllers(store());

router.post("/registrar", function (req, res, next) {
  Controller.insert(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.get("/pedido", function (req, res, next) {
  Controller.getPedido()
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.post("/pedido/detalle", function (req, res, next) {
  Controller.getPedidoDetalle(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

export default router;
