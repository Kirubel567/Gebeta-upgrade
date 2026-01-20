import mongoose from 'mongoose';
import Business from './src/models/Business.js';
import {MenuItem} from './src/models/MenuItem.js'; // Ensure this path is correct
import 'dotenv/config';

const createSlug = (name) => name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

const businesses = [
  { name: "Student Center Cafeteria", category: "on-campus", isFeatured: true, rating: { average: 3.5, count: 10 } },
  { name: "Burger Dash", category: "delivery", isFeatured: true, rating: { average: 4.8, count: 20 } },
  { name: "Green Garden", category: "off-campus", isFeatured: false, rating: { average: 4.2, count: 15 } },
  { name: "Night Owl Pizza", category: "delivery", isFeatured: false, rating: { average: 3.9, count: 30 } },
  { name: "Campus Coffee", category: "on-campus", isFeatured: true, rating: { average: 4.5, count: 50 } },
  { name: "Dorm Bites", category: "on-campus", isFeatured: false, rating: { average: 3.0, count: 5 } },
  { name: "Sushi Station", category: "delivery", isFeatured: false, rating: { average: 4.7, count: 12 } },
  { name: "The Grill House", category: "off-campus", isFeatured: true, rating: { average: 4.1, count: 25 } },
  { name: "Pasta Express", category: "delivery", isFeatured: false, rating: { average: 3.8, count: 18 } },
  { name: "Library Lounge", category: "on-campus", isFeatured: false, rating: { average: 4.0, count: 22 } },
  { name: "Taco Truck", category: "off-campus", isFeatured: false, rating: { average: 4.6, count: 40 } },
  { name: "Waffle World", category: "on-campus", isFeatured: true, rating: { average: 4.9, count: 100 } },
].map(b => ({ ...b, slug: createSlug(b.name), location: { address: "Sample Address" } }));

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected...");

    await Business.deleteMany({});
    await MenuItem.deleteMany({});

    const createdBusinesses = await Business.insertMany(businesses);
    console.log(`Inserted ${createdBusinesses.length} businesses.`);

    // Create Menu Items for the first business (Student Center)
    const menuItems = [
      { name: "Classic Burger", price: 5.99, isPopular: true, business: createdBusinesses[0]._id },
      { name: "French Fries", price: 2.50, isPopular: false, business: createdBusinesses[0]._id },
      { name: "Soda", price: 1.50, isPopular: false, business: createdBusinesses[0]._id }
    ];
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);

    console.log("✅ Seeding Complete!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
runSeed();