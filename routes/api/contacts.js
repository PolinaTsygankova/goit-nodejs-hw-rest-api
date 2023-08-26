const express = require("express");
const { Contact, schemas } = require("../../models/contacts");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", async (req, res, next) => {
   try {
      const contacts = await Contact.find();
      res.status(200).json(contacts);
   } catch (error) {
      return console.log(error.message);
   }
});

router.get("/:contactId", isValidId, async (req, res, next) => {
   try {
      const contactId = req.params.contactId;
      const contact = await Contact.findById(contactId);

      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
});

router.post("/", async (req, res, next) => {
   try {
      const { error } = schemas.addSchema(req.body);

      if (error) {
         throw new Error();
      }

      const { name, email, phone } = req.body;
      const createdContact = await Contact.create({ name, email, phone });
      res.status(201).json(createdContact);
   } catch (error) {
      res.status(400).json({ message: "Missing required name field" });
   }
});

router.put("/:contactId", async (req, res, next) => {
   try {
      const { error } = schemas.addSchema.validate(req.body);

      if (error) {
         res.status(400).json({ message: "Missing fields" });
      }

      const contactId = req.params.contactId;
      const body = req.body;
      const contact = await Contact.findByIdAndUpdate(contactId, body, {
         new: true,
      });
      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
   try {
      const { error } = schemas.updateFavoriteSchema.validate(req.body);

      if (error) {
         res.status(400).json({ message: "Missing field favorite" });
      }

      const contactId = req.params.contactId;
      const body = req.body;
      const contact = await Contact.findByIdAndUpdate(contactId, body, {
         new: true,
      });
      res.status(200).json(contact);
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
});

router.delete("/:contactId", async (req, res, next) => {
   try {
      const contactId = req.params.contactId;
      const deletedContact = await Contact.findByIdAndRemove(contactId);
      if (!deletedContact) {
         throw new Error();
      }

      res.status(200).json({ message: "Contact deleted" });
   } catch (error) {
      res.status(404).json({ message: "Not found" });
   }
});

module.exports = router;
