import express from "express";
import Controllers from "../controllers/categoria.js";
import store from "../connection/dbposgres.js";
import response from "../connection/response.js";

//Constantes
const router = express.Router();
const Controller = Controllers(store());

router.get("/", function (req, res, next) {
  Controller.get()
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
});

export default router;
