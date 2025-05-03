const express = require("express");
const app = express();
const mainRouter = require("./router");

app.use(express.json());
app.use(mainRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

app.listen(3001, () => {
  console.log("[Server Running on 3001]");
});
