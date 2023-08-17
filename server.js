const app = require("./app");
const mongoose = require("mongoose");
const DB_HOST =
   "mongodb+srv://PolinaTs:KLU5gHlEqB91TOy7@cluster0.ueow4ph.mongodb.net/contacts_app?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);

mongoose
   .connect(DB_HOST)
   .then(() => app.listen(3000))
   .catch((error) => {
      console.log(error.message);
      process.exit(1);
   });
