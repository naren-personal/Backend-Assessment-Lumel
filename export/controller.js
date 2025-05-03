const { exportCSVData } = require("./exportdata");

const exportDataController = async (req, res) => {
  try {
    await exportCSVData();
    res.status(201).json({ message: "Data Exported Successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to Export" });
  }
};

module.exports = exportDataController;
