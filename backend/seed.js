/**
 * seed.js — Database seeder for development.
 *
 * WHAT: Creates an admin user and sample projects in MongoDB.
 *
 * HOW:  Run with `node seed.js` after setting up .env.
 *       Clears existing data and inserts fresh seed records.
 *
 * WHY:  Provides realistic data to develop and test against
 *       without manually entering everything via the admin panel.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Project = require("./models/Project");
const Contact = require("./models/Contact");

const sampleProjects = [];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected for seeding");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Contact.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create admin user
    const admin = await User.create({
      name: "Aman Shah",
      email: process.env.ADMIN_EMAIL || "amanshah.dev@gmail.com",
      password: process.env.ADMIN_PASSWORD || "Admin@123456",
      role: "admin",
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create sample projects
    await Project.insertMany(sampleProjects);
    console.log(`🚀 ${sampleProjects.length} projects seeded`);

    // Create a sample contact message
    await Contact.create({
      name: "Visitor",
      email: "visitor@example.com",
      subject: "Inquiry",
      message: "Thank you for visiting my portfolio!",
    });
    console.log("📧 Sample contact message created");

    console.log("\n✨ Database seeded successfully!");
    console.log(
      `\nAdmin credentials:\n  Email: ${admin.email}\n  Password: ${process.env.ADMIN_PASSWORD || "Admin@123456"}`,
    );
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDB();
