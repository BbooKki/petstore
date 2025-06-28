import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
import mongoose from "mongoose";
import server from "./app";

//MONGOOSE IS GOOD FOR SCHEMAS AND SYNTAX
mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then((data) => {
    //TCP doimiy ulanish, HTTP bir mart ulanish
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3003;
    server.listen(PORT, function () {
      console.log(`The server is running successfully on port ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => console.log("ERROR on connection MongoDB", err));

// CLUSTER - DATABASE - COLLECTION - DOCUMENT - DATASET
