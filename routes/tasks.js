var express = require("express");
var fs = require('fs');
var router = express.Router();
//var executer = require('../services/executer')
var writer = require('../services/writer')


//borro el último diagrama generado
router.get("/image", function (req, res) {
  fs.unlink('./diagrama.png', (err) => {
    if (err) {
      throw err;
    }
    console.log("File is deleted.");
  });
});


//recibo el diagrama
router.post("/task", function (req, res) {
  var body = req.body;
  console.log(body);
  if (!body) {
    res.status(400);
    res.json({
      error: "Bad Data"
    });
  } else {
    let i;
    for (i = 0; i < body.diagrams.length; i++) {
      let parametros = body.diagrams[i].params;
      body.diagrams[i].params = parametros.split(',').map(Number);
    }
    writer.createFile(body);
    //executer.runFile();
  }
});


module.exports = router;
