const { Contact } = require("../models/contacts");

const getAll = async (req, res) => {
   try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const { _id: owner } = req.user;
      const contacts = await Contact.find({ owner }, "-createdAt, -updatedAt", {
         skip,
         limit,
      }).populate("owner", "name email");
      res.status(200).json(contacts);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
};

const getOne = async (req, res) => {
   try {
      const contactId = req.params.contactId;
      const contact = await Contact.findById(contactId);

      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
};

const add = async (req, res) => {
   try {
      const { _id: owner } = req.user;
      const createdContact = await Contact.create({ ...req.body, owner });
      res.status(201).json(createdContact);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

const update = async (req, res) => {
   try {
      const contactId = req.params.contactId;
      const body = req.body;
      const contact = await Contact.findByIdAndUpdate(contactId, body, {
         new: true,
      });
      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
};

const updateFavorite = async (req, res) => {
   try {
      const contactId = req.params.contactId;
      const body = req.body;
      const contact = await Contact.findByIdAndUpdate(contactId, body, {
         new: true,
      });
      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
};

const deleteOne = async (req, res) => {
   try {
      const contactId = req.params.contactId;
      await Contact.findByIdAndRemove(contactId);
      res.status(200).json({ message: "Contact was successfully deleted" });
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
};

module.exports = {
   getAll,
   getOne,
   add,
   update,
   updateFavorite,
   deleteOne,
};
