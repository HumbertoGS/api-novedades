
//Modulos
import express from "express";

import categoria from "./api-novedades/routes/categoria.js"
import login from "./api-novedades/routes/login.js"

//Constantes
const app = express();
const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

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
app.use("/api/categoria", categoria);
app.use("/api/login", login);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
