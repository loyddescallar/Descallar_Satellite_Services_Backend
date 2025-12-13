// controllers/customerController.js
const {
  findByAccountIdOrCca,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../models/userModel");

/**
 * GET /api/customers/:accountId
 * accountId can be either accountNumber or ccaNumber
 * Accessible to any authenticated user (user or admin)
 */
async function getCustomerByAccount(req, res) {
  try {
    const { accountId } = req.params;

    // Look up user by accountNumber OR ccaNumber
    const user = await findByAccountIdOrCca(accountId);

    if (!user) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // 🔹 We ONLY return basic user info now – no load history,
    // because that table was removed.
    return res.json({
      user: {
        id: user.id,
        accountName: user.accountName,
        accountNumber: user.accountNumber,
        ccaNumber: user.ccaNumber,
        address: user.address,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("GET CUSTOMER ERROR", err);
    return res
      .status(500)
      .json({ error: "Server error fetching customer" });
  }
}

/**
 * Admin: list all customers
 * GET /api/customers
 */
async function listCustomers(req, res) {
  try {
    const customers = await getAllUsers();
    return res.json({ customers });
  } catch (err) {
    console.error("LIST CUSTOMERS ERROR", err);
    return res
      .status(500)
      .json({ error: "Server error listing customers" });
  }
}

/**
 * Admin: create customer
 * POST /api/customers
 */
async function createCustomerController(req, res) {
  try {
    const { accountName, accountNumber, ccaNumber, address, phone, role } =
      req.body;

    if (!accountName || !accountNumber || !ccaNumber) {
      return res.status(400).json({
        error:
          "accountName, accountNumber, and ccaNumber are required",
      });
    }

    const id = await createUser({
      accountName,
      accountNumber,
      ccaNumber,
      address: address || "",
      phone: phone || "",
      role: role || "user",
    });

    return res.status(201).json({ message: "Customer created", id });
  } catch (err) {
    console.error("CREATE CUSTOMER ERROR", err);
    return res
      .status(500)
      .json({ error: "Server error creating customer" });
  }
}

/**
 * Admin: update customer
 * PUT /api/customers/id/:id
 */
async function updateCustomerController(req, res) {
  try {
    const { id } = req.params;
    const { accountName, accountNumber, ccaNumber, address, phone, role } =
      req.body;

    if (!accountName || !accountNumber || !ccaNumber) {
      return res.status(400).json({
        error:
          "accountName, accountNumber, and ccaNumber are required",
      });
    }

    await updateUser(id, {
      accountName,
      accountNumber,
      ccaNumber,
      address: address || "",
      phone: phone || "",
      role: role || "user",
    });

    return res.json({ message: "Customer updated" });
  } catch (err) {
    console.error("UPDATE CUSTOMER ERROR", err);
    return res
      .status(500)
      .json({ error: "Server error updating customer" });
  }
}

/**
 * Admin: delete customer
 * DELETE /api/customers/id/:id
 */
async function deleteCustomerController(req, res) {
  try {
    const { id } = req.params;
    await deleteUser(id);
    return res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error("DELETE CUSTOMER ERROR", err);
    return res
      .status(500)
      .json({ error: "Server error deleting customer" });
  }
}

module.exports = {
  getCustomerByAccount,
  listCustomers,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
};
