import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT || 5001;

const dataBaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    app.listen(port, () => {
      console.log(`Server is running Port : ${port}`);
    });
    console.log(`🟢  MongoDB Connecting Successfully ✅`);
  } catch (err) {
    console.log("🔴 Mongodb Connection Error  ❌", err);
  }
};

dataBaseConnection();
