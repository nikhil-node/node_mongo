const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection successful");
  });

const app = require("./app");

const port = process.env.PORT || 3002;
app.listen(port, "localhost", () => {
  console.log("App server is running...");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
});
