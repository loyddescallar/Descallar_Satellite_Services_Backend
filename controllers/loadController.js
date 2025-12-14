const {
  addLoadHistory,
  getLoadHistoryByUser,
  getAllLoadHistory
} = require("../models/loadModel");

async function addLoad(req, res) {
  try {
    const { accountNumber, loadAmount, description } = req.body;
    if (!accountNumber || !loadAmount) {
      return res.status(400).json({ error: "accountNumber and loadAmount are required" });
    }

    const id = await addLoadHistory({
      user_id: req.user.id,
      accountNumber,
      loadAmount,
      description
    });

    return res.status(201).json({ message: "Load history recorded", id });
  } catch (err) {
    console.error("ADD LOAD ERROR", err);
    return res.status(500).json({ error: "Server error adding load history" });
  }
}

async function getMyLoadHistory(req, res) {
  try {
    const history = await getLoadHistoryByUser(req.user.id);
    return res.json({ history });
  } catch (err) {
    console.error("GET MY LOAD HISTORY ERROR", err);
    return res.status(500).json({ error: "Server error fetching load history" });
  }
}

async function getAllLoadHistoryController(req, res) {
  try {
    const history = await getAllLoadHistory();
    return res.json({ history });
  } catch (err) {
    console.error("GET ALL LOAD HISTORY ERROR", err);
    return res.status(500).json({ error: "Server error fetching load history" });
  }
}

module.exports = {
  addLoad,
  getMyLoadHistory,
  getAllLoadHistoryController
};
