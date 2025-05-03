// Total Revenue by Product

const { ORDERS_COLLECTION, PRODUCTS_COLLECTION } = require("../constants");
const { connectToMongoDB } = require("../mongodb");

const getTotalRevenByProduct = async (req, res) => {
  try {
    const data = await dbAggregate();
    res.status(200).json({ revenue: data });
  } catch (error) {
    console.log("[ERROR][getTotalRevenByProd]", error);
    res.status(400).json({ message: "Failed to fetch revenue" });
  }
};

const dbAggregate = async () => {
  const agg = [
    {
      $lookup: {
        from: PRODUCTS_COLLECTION,
        localField: "Products_ID",
        foreignField: "Product_ID",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $addFields: {
        item_revenue: {
          $multiply: [
            { $subtract: ["$product.Unit_Price", "$Discount"] },
            "$Quantity_Sold",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$Product_ID",
        product_name: { $first: "$product.Products_Name" },
        totalRevenue: { $sum: "$item_revenue" },
        totalQuantity: { $sum: "$Quantity_Sold" },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ];

  const db = await connectToMongoDB();
  const result = await db
    .collection(ORDERS_COLLECTION)
    .aggregate([...agg])
    .toArray();
  return result;
};

module.exports = {
  getTotalRevenByProduct,
};
