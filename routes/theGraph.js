const express = require('express');
const router = express.Router();

const controller = require("../controllers/TheGraphController");

router.get("/", controller.querySubgraph);

module.exports = router;
