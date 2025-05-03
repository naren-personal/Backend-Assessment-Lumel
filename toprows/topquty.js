const { PRODUCTS_COLLECTION, ORDERS_COLLECTION } = require("../constants");
const { connectToMongoDB } = require("../mongodb");

const dbAggregateQty = async () => {
  const startDate = new Date("2020-01-01");
  const endDate = new Date("2025-01-31");
  const limit = 5;
  const agg = [
    {
      $match: {
        Date_of_Sale: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$Product_ID",
        totalQuantity: { $sum: "$Quantity_Sold" },
      },
    },
    {
      $sort: { totalQuantity: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: PRODUCTS_COLLECTION,
        localField: "Products_ID",
        foreignField: "Product_ID",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $project: {
        product_id: "$Product_ID",
        product_name: "$productInfo.Products_Name",
        category: "$productInfo.Category",
        totalQuantity: 1,
        _id: 0,
      },
    },
  ];
  const db = await connectToMongoDB();
  const result = await db
    .collection(ORDERS_COLLECTION)
    .aggregate([...agg])
    .toArray();
  console.log(result);
};

const getTopQtyBySold = async (req, res) => {
  try {
    const data = await dbAggregateQty();
    res.status(200).json({ revenue: data });
  } catch (error) {
    console.log("[ERROR][getTotalRevenByProduct]", error);
    res.status(400).json({ message: "Failed to fetch revenue" });
  }
};

module.exports = {
  getTopQtyBySold,
};
