const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "../models/contacts.json");

const listContacts = async () => {
   const allContacts = await fs.readFile(contactsPath);
   return JSON.parse(allContacts);
};

const getContactById = async (contactId) => {
   const allContacts = await listContacts();
   const contact = allContacts.find((item) => item.id === contactId);

   return contact || null;
};

const addContact = async ({ name, email, phone }) => {
   const allContacts = await listContacts();

   const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
   };

   allContacts.push(newContact);
   await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
   return newContact;
};

const updateContact = async (contactId, body) => {
   const allContacts = await listContacts();
   const updateIndex = allContacts.findIndex((item) => item.id === contactId);

   if (updateIndex === -1) {
      return null;
   }

   const contact = allContacts[updateIndex];
   const updatedContact = { ...contact, id: contactId, ...body };
   allContacts[updateIndex] = updatedContact;
   await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
   return updatedContact;
};

const removeContact = async (contactId) => {
   const allContacts = await listContacts();
   const contactIndex = allContacts.findIndex((item) => item.id === contactId);

   if (contactIndex === -1) {
      return null;
   } else {
      const removedContact = allContacts.splice(contactIndex, 1);
      await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
      console.log(removedContact);
      return removedContact[0];
   }
};

module.exports = {
   listContacts,
   getContactById,
   removeContact,
   addContact,
   updateContact,
};
