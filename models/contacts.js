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
      owner: {
         type: Schema.Types.ObjectId,
         ref: "user",
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
