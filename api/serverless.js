// api/writeFile.js
const fs = require("fs/promises");

module.exports = async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    await fs.writeFile("data.json", data);
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving data" });
  }
};
