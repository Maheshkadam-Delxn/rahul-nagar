import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const MONGODB_URI = process.env.MONGODB_URI;

async function fixDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    await db.collection("associatemembers").updateMany({}, { $unset: { email: "" } });

    console.log("✅ Successfully removed email field from all documents.");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating database:", error);
    mongoose.connection.close();
  }
}

fixDatabase();
