const mongoose = require("mongoose");
const initData = require("./updated_data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const intiDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68286f56c723286b14e940a5",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initilized");
};

intiDB();
