const { Schema, model } = require("mongoose");
const Joi = require("joi");

const addSchema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().required(),
   phone: Joi.string().required(),
   favorite: Joi.boolean(),
});

const updateFavoriteScheme = Joi.object({
   favorite: Joi.boolean().required(),
});

const schemas = {
   addSchema,
   updateFavoriteScheme,
};

const contactShema = Schema(
   {
      name: {
         type: String,
         required: [true, "Set name for contact"],
      },
      email: {
         type: String,
      },
      phone: {
         type: String,
      },
      favorite: {
         type: Boolean,
         default: false,
      },
   },
   { versionKey: false, timestaps: true }
);

contactShema.post("save", (error, data, next) => {
   error.status = 400;
   next();
});

const Contact = model("contact", contactShema);

module.exports = { Contact, schemas };

// const fs = require("fs/promises");
// const path = require("path");
// const { nanoid } = require("nanoid");

// const contactsPath = path.join(__dirname, "../models/contacts.json");

// const listContacts = async () => {
//    const allContacts = await fs.readFile(contactsPath);
//    return JSON.parse(allContacts);
// };

// const getContactById = async (contactId) => {
//    const allContacts = await listContacts();
//    const contact = allContacts.find((item) => item.id === contactId);

//    return contact || null;
// };

// const addContact = async ({ name, email, phone }) => {
//    const allContacts = await listContacts();

//    const newContact = {
//       id: nanoid(),
//       name,
//       email,
//       phone,
//    };

//    allContacts.push(newContact);
//    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
//    return newContact;
// };

// const updateContact = async (contactId, body) => {
//    const allContacts = await listContacts();
//    const updateIndex = allContacts.findIndex((item) => item.id === contactId);

//    if (updateIndex === -1) {
//       return null;
//    }

//    const contact = allContacts[updateIndex];
//    const updatedContact = { ...contact, id: contactId, ...body };
//    allContacts[updateIndex] = updatedContact;
//    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
//    return updatedContact;
// };

// const removeContact = async (contactId) => {
//    const allContacts = await listContacts();
//    const contactIndex = allContacts.findIndex((item) => item.id === contactId);

//    if (contactIndex === -1) {
//       return null;
//    }

//    const removedContact = allContacts.splice(contactIndex, 1);
//    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
//    return removedContact[0];
// };

// module.exports = {
// listContacts,
// getContactById,
// removeContact,
// addContact,
// updateContact,
// };
