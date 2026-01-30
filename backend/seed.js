import mongoose from "mongoose";
import Business from "./src/models/Business.js";
import { MenuItem } from "./src/models/MenuItem.js";
import { User } from "./src/models/User.js";
import { Review } from "./src/models/Review.js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Business.deleteMany({});
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    // 1. SEED USERS (Increased to 7 users to accommodate 7 reviews per business)
    const salt = await bcrypt.genSalt(10);
    const hashedDefaultPassword = await bcrypt.hash("password123", salt);

    const usersToInsert = [
      {
        name: "Abebe Kebede",
        email: "abebe@aau.edu.et",
        passwordHash: hashedDefaultPassword,
        university: "AAU",
        dormitory: "5K Dorm, Block 4",
        yearOfStudy: "3rd Year",
        avatar: "https://i.pravatar.cc/150?u=abebe",
        role: "user",
      },
      {
        name: "Selamawit Tekle",
        email: "selam@aau.edu.et",
        passwordHash: hashedDefaultPassword,
        university: "AAU",
        dormitory: "4K Dorm, Block 2",
        yearOfStudy: "2nd Year",
        avatar: "https://i.pravatar.cc/150?u=selam",
        role: "user",
      },
      {
        name: "Dawit Yohannes",
        email: "dawit@aau.edu.et",
        passwordHash: hashedDefaultPassword,
        university: "AAU",
        dormitory: "6K Dorm, Block 12",
        yearOfStudy: "4th Year",
        avatar: "https://i.pravatar.cc/150?u=dawit",
        role: "user",
      },
      {
        name: "Eden Tadesse",
        email: "eden@aau.edu.et",
        passwordHash: hashedDefaultPassword,
        university: "AAU",
        dormitory: "5K Dorm, Block 1",
        yearOfStudy: "1st Year",
        avatar: "https://i.pravatar.cc/150?u=eden",
        role: "user",
      },
      {
        name: "Samuel Bekele",
        email: "samuel@aau.edu.et",
        passwordHash: hashedDefaultPassword,
        university: "AAU",
        dormitory: "4K Dorm, Block 5",
        yearOfStudy: "3rd Year",
        avatar: "https://i.pravatar.cc/150?u=samuel",
        role: "user",
      },
      {
        name: "Hanna Girma",
        email: "hanna@aau.edu.et",
        passwordHash: hashedDefaultPassword,
        university: "AAU",
        dormitory: "6K Dorm, Block 8",
        yearOfStudy: "5th Year",
        avatar: "https://i.pravatar.cc/150?u=hanna",
        role: "user",
      },
      {
        name: "Kirubel Wubet",
        email: "kirubel@aau.edu.et",
        passwordHash: hashedDefaultPassword,
        university: "AAU",
        dormitory: "5K Dorm, Block 3",
        yearOfStudy: "4th Year",
        avatar: "https://i.pravatar.cc/150?u=kirubel",
        role: "user",
      },
    ];
    const createdUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Seeded ${createdUsers.length} Users`);

    const businessesToInsert = [
      {
        name: "DESTA CAFE",
        slug: "desta-cafe",
        category: "on-campus",
        description: "Great coffee and sandwiches! Student favorite spot.",
        isFeatured: false,
        rating: { average: 4.5, count: 42 },
        location: { address: "5K Campus, Building A" },
        image: [
          {
            url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
            isPrimary: true,
          },
        ],
        hours: { openTime: "07:00 AM", closeTime: "09:00 PM" },
      },
      {
        name: "123FASTFOOD",
        slug: "123fastfood",
        category: "delivery",
        description: "Fast delivery and tasty burgers. Open late for students.",
        isFeatured: true,
        rating: { average: 4.2, count: 31 },
        location: { address: "Near 6K Gate" },
        image: [
          {
            url: "https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c",
            isPrimary: true,
          },
        ],
        hours: { openTime: "10:00 AM", closeTime: "11:00 PM" },
      },
      {
        name: "CHRISTINA CAFE",
        slug: "christina-cafe",
        category: "on-campus",
        description: "Best traditional Ethiopian food on campus.",
        isFeatured: true,
        rating: { average: 4.8, count: 56 },
        location: { address: "4K Student Center" },
        image: [
          {
            url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            isPrimary: true,
          },
        ],
        hours: { openTime: "08:00 AM", closeTime: "08:00 PM" },
      },
      {
        name: "SLEEK DELIVERY",
        slug: "sleek-delivery",
        category: "delivery",
        description: "Reliable delivery service for all campuses.",
        isFeatured: true,
        rating: { average: 4.3, count: 28 },
        location: { address: "Multiple campuses" },
        image: [
          {
            url: "https://images.unsplash.com/photo-1548695607-9c73430ba065",
            isPrimary: true,
          },
        ],
        hours: { openTime: "09:00 AM", closeTime: "10:00 PM" },
      },
      {
        name: "MILLENNIUM CAFE",
        slug: "millennium-cafe",
        category: "off-campus",
        description: "Perfect for quick lunches between classes.",
        isFeatured: true,
        rating: { average: 4.0, count: 19 },
        location: { address: "Across from 5K Main Gate" },
        image: [
          {
            url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
            isPrimary: true,
          },
        ],
        hours: { openTime: "07:30 AM", closeTime: "07:00 PM" },
      },
      {
        name: "RED SEA RESTAURANT",
        slug: "red-sea-restaurant",
        category: "off-campus",
        description: "Friendly staff and great prices. Popular for groups.",
        isFeatured: true,
        rating: { average: 4.6, count: 47 },
        location: { address: "Saris Area" },
        image: [
          {
            url: "https://images.unsplash.com/photo-1692911634014-a1446191fb7c",
            isPrimary: true,
          },
        ],
        hours: { openTime: "11:00 AM", closeTime: "10:00 PM" },
      },
    ];
    const createdBus = await Business.insertMany(businessesToInsert);
    console.log(`✅ Seeded ${createdBus.length} Businesses`);

    const generateMenuItems = (businessId, busName) => {
      const templates = [
        {
          name: "Beyaynetu",
          price: 120,
          cat: "main",
          images: [
            "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1635356513473-ba58066f7734?q=80&w=800",
            "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800",
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
          ],
        },
        {
          name: "Doro Wot",
          price: 180,
          cat: "main",
          images: [
            "https://images.unsplash.com/photo-1606312440539-748e523362a3?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
            "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800",
            "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=800",
          ],
        },
        {
          name: "Special Shiro",
          price: 90,
          cat: "fasting",
          images: [
            "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?q=80&w=800",
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
          ],
        },
        {
          name: "Beef Tibs",
          price: 200,
          cat: "main",
          images: [
            "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800",
            "https://images.unsplash.com/photo-1529692236671-f1f6e9460272?q=80&w=800",
            "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=800",
          ],
        },
        {
          name: "Avocado Juice",
          price: 60,
          cat: "drinks",
          images: [
            "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1525385133375-842c683efec5?q=80&w=800",
            "https://images.unsplash.com/photo-1610632380989-680fe40816c6?q=80&w=800",
            "https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=800",
          ],
        },
        {
          name: "Ful Medames",
          price: 85,
          cat: "breakfast",
          images: [
            "https://images.unsplash.com/photo-1593584785033-9c7627d03544?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?q=80&w=800",
            "https://images.unsplash.com/photo-1509482560494-4126f8225994?q=80&w=800",
            "https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=800",
          ],
        },
        {
          name: "Club Sandwich",
          price: 110,
          cat: "fast-food",
          images: [
            "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1567234665766-47402d1ef247?q=80&w=800",
            "https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=800",
            "https://images.unsplash.com/photo-1619860860774-1e2e17ae4c81?q=80&w=800",
          ],
        },
        {
          name: "Special Spris",
          price: 50,
          cat: "drinks",
          images: [
            "https://images.unsplash.com/photo-1623065422902-30a2ad299dd4?q=80&w=800", // Primary
            "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=800",
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
            "https://images.unsplash.com/photo-1536816579748-4fcb33e1d72b?q=80&w=800",
          ],
        },
      ];
      return templates.map((t) => ({
        business: businessId,
        name: `${t.name} - ${busName}`,
        description: `Delicious ${t.name} prepared fresh daily at ${busName}. Best quality ingredients and authentic taste.`,
        price: t.price,
        currency: "ETB",
        category: t.cat,
        // Convert the array of strings to the object structure expected by the updated model
        images: t.images.map((url, index) => ({
          url,
          alt: `${t.name} from ${busName} - View ${index + 1}`,
          isPrimary: index === 0,
        })),
        rating: { average: 4.5, count: 2 },
        isAvailable: true,
        isPopular: Math.random() > 0.5,
      }));
    };
    let allMenuItems = [];
    createdBus.forEach((bus) => {
      allMenuItems = [...allMenuItems, ...generateMenuItems(bus._id, bus.name)];
    });
    await MenuItem.insertMany(allMenuItems);
    console.log(`✅ Seeded ${allMenuItems.length} Menu Items`);

    // 4. SEED REVIEWS (7 reviews per business using 7 unique users)
    const reviewTexts = [
      "The food was absolutely amazing! Will definitely come back. The food was absolutely amazing! Will definitely come back. The food was absolutely amazing! Will definitely come back. The food was absolutely amazing! Will definitely come back.",
      "A bit crowded during lunch hours, but the taste is worth the wait.",
      "Most affordable and clean place on campus. Recommended!",
      "I love their juices. Fresh and healthy.",
      "The service was a bit slow, but the staff is very friendly.",
      "My go-to spot for late-night studying and snacks.",
      "Great variety of Ethiopian dishes. Authentic taste!",
    ];

    const foodComments = [
      "Absolutely delicious, the spices were perfect!",
      "Best version of this dish I've had on campus.",
      "Portion size was great for the price.",
      "A bit too spicy for me, but very authentic flavor.",
    ];

    const allReviews = [];
    createdBus.forEach((bus) => {
      // Create exactly 7 reviews per business, each from a different user
      createdUsers.forEach((user, index) => {
        allReviews.push({
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
          body: reviewTexts[index % reviewTexts.length],
          business: bus._id,
          user: user._id,
          isApproved: true,
        });
      });
    });

    // --- B: NEW LOGIC: 2 REVIEWS PER MENU ITEM ---
    const insertedMenuItems = await MenuItem.find({});

    insertedMenuItems.forEach((menuItem) => {
      // 1. Create a copy of the users array and shuffle it
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());

      // 2. Pick the first 2 users from the shuffled list
      // This guarantees user[0] is NOT the same as user[1]
      const selectedUsers = shuffledUsers.slice(0, 2);

      selectedUsers.forEach((user) => {
        allReviews.push({
          rating: Math.floor(Math.random() * 2) + 4,
          body: foodComments[Math.floor(Math.random() * foodComments.length)],
          business: menuItem.business,
          menuItem: menuItem._id,
          user: user._id,
          isApproved: true,
        });
      });
    });

    // Final insertion
    await Review.create(allReviews);

    console.log(`✅ Seeded ${allReviews.length} Total Reviews`);
    console.log(`   - ${createdBus.length * 7} General Business Reviews`);
    console.log(`   - ${insertedMenuItems.length * 2} Food Item Reviews`);
    console.log("Database successfully synced!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
