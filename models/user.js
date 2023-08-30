const { Schema, model } = require("mongoose");

const userShema = Schema(
   {
      password: {
         type: String,
         required: [true, "Set password for user"],
         minLength: [6, "Password should be at least 6 characters!"],
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      },
      subscription: {
         type: String,
         enum: ["starter", "pro", "business"],
         default: "starter",
      },
      token: String,
   },
   { versionKey: false, timestaps: true }
);

userShema.post("save", (error, data, next) => {
   error.status = 400;
   next();
});

const User = model("user", userShema);

module.exports = { User };
