const express = require("express");
const { schemas } = require("../../models/contacts");
const {
   getAll,
   getOne,
   add,
   update,
   updateFavorite,
   deleteOne,
} = require("../../controllers/contacts");
const isValidId = require("../../middlewares/isValidId");
const validateBody = require("../../middlewares/validateBody");
const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", isValidId, getOne);

router.post("/", validateBody(schemas.addSchema), add);

router.put("/:contactId", validateBody(schemas.addSchema), update);

router.patch(
   "/:contactId/favorite",
   isValidId,
   validateBody(schemas.updateFavoriteScheme),
   updateFavorite
);

router.delete("/:contactId", isValidId, deleteOne);

module.exports = router;
