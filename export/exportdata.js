const fs = require("fs");
const path = require("path");
const __dir = path.resolve();
const csv = require("csv-parser");
const { connectToMongoDB } = require("../mongodb");
const {
  CUSTOMERS_COLLECTION,
  PRODUCTS_COLLECTION,
  ORDERS_COLLECTION,
} = require("../constants");

const exportCSVData = async () => {
  return new Promise((resolve, reject) => {
    const csvPath = `${__dir}/data.csv`;
    let data = [];
    const readStream = fs.createReadStream(csvPath).pipe(csv());
    readStream.on("data", async (row) => {
      console.log(row);
      data = [...data, row];
    });

    readStream.on("end", async () => {
      console.log("END");
      await insertData({ data });
      console.log("Data Imported");
      resolve("Success");
    });

    readStream.on("error", (err) => {
      console.log("[ERROR][exportCSVData]", err);
      reject("failed");
    });
  });
};

const insertData = async ({ data }) => {
  const db = await connectToMongoDB();
  const orderData = data.map((element) => {
    return {
      Order_ID: element["Order ID"],
      Product_ID: element["Product ID"],
      Customer_ID: element["Customer ID"],
      Region: element["Region"],
      Date_of_Sale: element["Date of Sale"],
      Quantity_Sold: Number(element["Quantity Sold"]) || 0,
      Discount: Number(element["Discount:"]) || 0,
      Shipping_Cost: Number(element["Shipping Cost"]) || 0,
      Payment_Method: element["Payment Method"],
    };
  });
  const customerData = data.map((element) => {
    return {
      Customer_ID: element["Customer ID"],
      Customer_Name: element["Customer Name"],
      Customer_Email: element["Customer Email"],
      Customer_Address: element["Customer Address"],
    };
  });
  const prodData = data.map((element) => {
    return {
      Products_ID: element["Customer ID"],
      Products_Name: element["Product Name"],
      Category: element["Shoes"],
      Unit_Price: Number(element["Unit Price"]),
    };
  });
  console.log(customerData.length);

  await db.collection(CUSTOMERS_COLLECTION).insertMany([...customerData]);
  await db.collection(PRODUCTS_COLLECTION).insertMany([...prodData]);
  await db.collection(ORDERS_COLLECTION).insertMany([...orderData]);
};

module.exports = {
  exportCSVData,
};
