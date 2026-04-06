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

    // Create admin users
    const admins = [
      {
        name: "Aman Shah",
        email: process.env.ADMIN_EMAIL || "amanshah.dev@gmail.com",
        password: process.env.ADMIN_PASSWORD || "Admin@123456",
        role: "admin",
      },
      {
        name: "Aman Shah II",
        email: process.env.ADMIN_EMAIL_2 || "admin2@amanshah.dev",
        password: process.env.ADMIN_PASSWORD_2 || "Admin@654321",
        role: "admin",
      },
    ];

    const createdAdmins = await User.create(admins);
    createdAdmins.forEach((admin) =>
      console.log(`👤 Admin created: ${admin.email}`),
    );

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
    console.log(`\nAdmin credentials:`);
    createdAdmins.forEach((admin) => {
      const defaultPassword =
        admin.email === (process.env.ADMIN_EMAIL || "amanshah.dev@gmail.com")
          ? process.env.ADMIN_PASSWORD || "Admin@123456"
          : process.env.ADMIN_PASSWORD_2 || "Admin@654321";
      console.log(`  Email: ${admin.email}\n  Password: ${defaultPassword}`);
    });
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDB();
