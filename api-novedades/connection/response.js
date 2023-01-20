export default {
  success: function (req, res, datos, status, message = "") {
    let statusCode = status || 200;
    let statusMessage = datos || "";

    res.status(status).send({
      error: false,
      codigo: statusCode,
      datos: statusMessage,
      mensaje: message,
    });
  },
};