const mongoose = require("mongoose");
const { config } = require("../config/secret.js");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb+srv://${config.mongoUsername}:${config.mongoPassword}@cluster0.wxfjt.mongodb.net/toysDb`
  );
  console.log("db connected...");
}
