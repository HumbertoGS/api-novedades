import express from "express";
import multer from "multer";

import Controllers from "../controllers/producto.js";
import store from "../connection/dbposgres.js";
import response from "../connection/response.js";

//Constantes
const router = express.Router();
const Controller = Controllers(store());

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", function (req, res, next) {
  Controller.get(req.query)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
})

router.post("/", function (req, res, next) {
  Controller.consultaDatos(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
})

// router.post("/insert", upload.single("imagen"), function (req, res, next) {
router.post("/insert", function (req, res, next) {
  Controller.insert(req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

router.post("/reporte", function (req, res, next) {
  Controller.reporte(req.body)
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
