//Modulos
import express from "express";

import { errors } from "./api-novedades/connection/error.js";

import producto from "./api-novedades/routes/producto.js";
import categoria from "./api-novedades/routes/categoria.js";
import inicio from "./api-novedades/routes/inicio.js";
import persona from "./api-novedades/routes/persona.js";
import pedido from "./api-novedades/routes/pedido.js";

//Constantes
const app = express();
const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// RUTAS
app.use("/api/producto", producto);
app.use("/api/pedido", pedido);
app.use("/api/categoria", categoria);
app.use("/api/inicio", inicio);
app.use("/api/persona", persona);

app.use(errors);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
