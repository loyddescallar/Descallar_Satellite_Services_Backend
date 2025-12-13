// controllers/messageController.js
const { createMessage, getMessages } = require("../models/messageModel");
const { getTypingStatus } = require("../utils/typingStore");

async function sendMessageController(req, res) {
  try {
    const { id } = req.params; // ticket_id
    const { message } = req.body;

    const sender_role = req.user.role;
    const sender_id = req.user.id;

    // Attachment handling
    const attachment = req.file ? req.file.filename : null;
    const attachment_type = req.file ? req.file.mimetype : null;

    // Reject ONLY if both message AND attachment are missing
    if ((!message || message.trim() === "") && !attachment) {
      return res
        .status(400)
        .json({ error: "Message or attachment is required." });
    }

    const msgId = await createMessage({
      ticket_id: id,
      sender_id,
      sender_role,
      message: message || null,
      attachment,
      attachment_type
    });

    return res.json({ message: "Message sent", id: msgId });
  } catch (err) {
    console.error("SEND MESSAGE ERROR", err);
    return res.status(500).json({ error: "Server error sending message" });
  }
}

async function getMessagesController(req, res) {
  try {
    const { id } = req.params;
    const messages = await getMessages(id);
    const typing = getTypingStatus(id);

    return res.json({
      messages,
      typing
    });
  } catch (err) {
    console.error("GET MESSAGES ERROR", err);
    return res.status(500).json({ error: "Server error fetching messages" });
  }
}

module.exports = {
  sendMessageController,
  getMessagesController
};
