// controllers/ticketController.js
const {
  createTicket,
  getTicketsByUser,
  getAllTickets,
  updateTicketStatus,
  getTicketById,
  deleteTicket
} = require("../models/ticketModel");

async function createTicketController(req, res) {
  try {
    const { category, subject } = req.body;

    if (!category || !subject) {
      return res.status(400).json({ error: "category and subject are required" });
    }

    const id = await createTicket({
      user_id: req.user.id,
      category,
      subject
    });

    return res.status(201).json({ message: "Ticket created", id });
  } catch (err) {
    console.error("CREATE TICKET ERROR", err);
    return res.status(500).json({ error: "Server error creating ticket" });
  }
}

async function getMyTicketsController(req, res) {
  try {
    const tickets = await getTicketsByUser(req.user.id);
    return res.json({ tickets });
  } catch (err) {
    console.error("GET MY TICKETS ERROR", err);
    return res.status(500).json({ error: "Server error fetching tickets" });
  }
}

async function getAllTicketsController(req, res) {
  try {
    const tickets = await getAllTickets();
    return res.json({ tickets });
  } catch (err) {
    console.error("GET ALL TICKETS ERROR", err);
    return res.status(500).json({ error: "Server error fetching tickets" });
  }
}

async function getTicketByIdController(req, res) {
  try {
    const { id } = req.params;
    const ticket = await getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.json({ ticket });
  } catch (err) {
    console.error("GET TICKET ERROR", err);
    return res.status(500).json({ error: "Server error fetching ticket" });
  }
}

async function updateTicketStatusController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    await updateTicketStatus(id, status);

    return res.json({ message: "Ticket status updated" });
  } catch (err) {
    console.error("UPDATE STATUS ERROR", err);
    return res.status(500).json({ error: "Server error updating status" });
  }
}

async function deleteTicketController(req, res) {
  try {
    const { id } = req.params;

    await deleteTicket(id);

    return res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error("DELETE TICKET ERROR", err);
    return res.status(500).json({ error: "Server error deleting ticket" });
  }
}

module.exports = {
  createTicketController,
  getMyTicketsController,
  getAllTicketsController,
  updateTicketStatusController,
  getTicketByIdController,
  deleteTicketController
};
