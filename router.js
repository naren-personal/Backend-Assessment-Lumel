const exportDataController = require("./export/controller");
const { getTotalRevenByProduct } = require("./revenue/revenue");
const { getTopQtyBySold } = require("./toprows/topquty");

const router = require("express").Router();

router.get("/exportdata", exportDataController);

router.get("/revenue/byproduct", getTotalRevenByProduct);

router.get("/top/qtybysold", getTopQtyBySold);

module.exports = router;
