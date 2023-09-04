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
const validateToken = require("../../middlewares/validateToken");
const router = express.Router();

router.get("/", validateToken, getAll);

router.get("/:contactId", validateToken, isValidId, getOne);

router.post("/", validateToken, validateBody(schemas.addSchema), add);

router.put(
   "/:contactId",
   validateToken,
   validateBody(schemas.addSchema),
   update
);

router.patch(
   "/:contactId/favorite",
   validateToken,
   isValidId,
   validateBody(schemas.updateFavoriteScheme),
   updateFavorite
);

router.delete("/:contactId", validateToken, isValidId, deleteOne);

module.exports = router;
