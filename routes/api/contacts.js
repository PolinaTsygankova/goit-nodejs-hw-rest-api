const express = require("express");
const Joi = require("joi");
const {
   listContacts,
   getContactById,
   addContact,
   removeContact,
   updateContact,
} = require("../../models/contacts");

const schema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().required(),
   phone: Joi.string().required(),
});

const router = express.Router();

router.get("/", async (req, res, next) => {
   try {
      const contacts = await listContacts();
      res.status(200).json(contacts);
   } catch (error) {
      return console.log(error.message);
   }
});

router.get("/:contactId", async (req, res, next) => {
   try {
      const contactId = req.params.contactId;
      const contact = await getContactById(contactId);
      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
});

router.post("/", async (req, res, next) => {
   try {
      const { error } = schema.validate(req.body);

      if (error) {
         throw new Error();
      }

      const { name, email, phone } = req.body;
      const createdContact = await addContact({ name, email, phone });
      res.status(201).json(createdContact);
   } catch (error) {
      res.status(400).json({ message: "Missing required name field" });
   }
});

router.put("/:contactId", async (req, res, next) => {
   try {
      const { error } = schema.validate(req.body);

      if (error) {
         res.status(400).json({ message: "missing fields" });
      }

      const contactId = req.params.contactId;
      const body = req.body;
      const contact = await updateContact(contactId, body);
      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
});

router.delete("/:contactId", async (req, res, next) => {
   try {
      const contactId = req.params.contactId;
      const deletedContact = await removeContact(contactId);
      if (!deletedContact) {
         throw new Error();
      }

      res.status(200).json({ message: "contact deleted" });
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
});

module.exports = router;
