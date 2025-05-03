const exportDataController = require("./export/controller");
const { getTotalRevenByProduct } = require("./revenue/revenue");

const router = require("express").Router();

router.get("/exportdata", exportDataController);

router.get("/revenue/byproduct", getTotalRevenByProduct);

module.exports = router;
