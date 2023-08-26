const { Contact } = require("../models/contacts");

const getAll = async (req, res) => {
   try {
      const contacts = await Contact.find();
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
      const createdContact = await Contact.create(req.body);
      res.status(201).json(createdContact);
   } catch (error) {
      res.status(400).json({ message: "Missing required name field" });
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
