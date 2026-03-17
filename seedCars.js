require("dotenv").config();
const mongoose = require("mongoose");
const Car = require("./models/carModel");

const carsData = [
  {
    carNumber: "KIA-001",
    capacity: 7,
    status: "available",
    pricePerDay: 80,
    features: ["White", "7 Seats", "SUV", "Modern"],
    imageUrl: "/uploads/kia_sorento.png"
  },
  {
    carNumber: "HYU-002",
    capacity: 7,
    status: "available",
    pricePerDay: 85,
    features: ["Deep Blue", "7 Seats", "SUV", "Premium"],
    imageUrl: "/uploads/hyundai_santa_fe.png"
  },
  {
    carNumber: "HON-003",
    capacity: 5,
    status: "available",
    pricePerDay: 50,
    features: ["Red", "5 Seats", "Sedan", "Sporty"],
    imageUrl: "/uploads/honda_civic.png"
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding...");
    
    // Clear existing (optional) or just upsert?
    // Let's just create them, allowing fails if already exists
    for(const data of carsData) {
        try {
            const existing = await Car.findOne({ carNumber: data.carNumber });
            if (existing) {
                Object.assign(existing, data);
                await existing.save();
                console.log(`Updated car: ${data.carNumber}`);
            } else {
                const car = new Car(data);
                await car.save();
                console.log(`Added car: ${data.carNumber}`);
            }
        } catch (err) {
            console.error(`Error adding ${data.carNumber}: ${err.message}`);
        }
    }
    
    console.log("Seeding complete!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
