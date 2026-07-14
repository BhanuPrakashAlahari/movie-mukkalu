const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const MONGODB_URI = process.env.MONGODB_URI;

const MOVIES_TO_SEED = [
  
  {
    dateId: "27",
    name: "Kushi",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243294/kushi_ffkvjj.jpg",
    time: "10:00 AM",
    slug: "10-00-AM",
    status: "Available",
    trailer: "https://youtu.be/KFHXCvvxL1U?si=CO7Z2NQ_j7GIVhrk"
  },
  {
    dateId: "27",
    name: "Kanchana",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243228/kanchana_rgz5fg.jpg",
    time: "1:00 PM",
    slug: "01-00-PM",
    status: "Available",
    trailer: "https://youtu.be/p078qlaiypw?si=hXlEdvz6uFwh3FAI"
  },
  {
    dateId: "27",
    name: "Ganga",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774967255/ganga_wjqbap.jpg",
    time: "4:00 PM",
    slug: "04-00-PM",
    status: "Available",
    trailer: "https://youtu.be/ijxDgjbH37E?si=F9M7j1IaWanim4Vy"
  },
  
  {
    dateId: "28",
    name: "Orange",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412256/WhatsApp_Image_2026-03-24_at_03.27.51_xlxu8j.jpg",
    time: "10:00 AM",
    slug: "10-00-AM",
    status: "Available",
    trailer: "https://youtu.be/_FrmfC5_Pv8?si=Q_T6i3Vrq9XXjLP0"
  },
  {
    dateId: "28",
    name: "Ee Nagaraniki Emaindhi",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.30.56_cuxavb.jpg",
    time: "1:00 PM",
    slug: "01-00-PM",
    status: "Available",
    trailer: "https://youtu.be/0-ra4l54MSg?si=3IBcOdpsZednLenL"
  },
  
  {
    dateId: "29",
    name: "Darling",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.29.31_fqchqx.jpg",
    time: "10:00 AM",
    slug: "10-00-AM",
    status: "Available",
    trailer: "https://youtu.be/sRu1hiOz2jI?si=aHCbZxE2ZjNONheU"
  },
  {
    dateId: "29",
    name: "Arjun Reddy",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/arjun_reddy_ex4bav.jpg",
    time: "1:00 PM",
    slug: "01-00-PM",
    status: "Available",
    trailer: "https://youtu.be/aozErj9NqeE?si=3l0akzmDj5UYNupY"
  },
  {
    dateId: "29",
    name: "Masoodha",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774716746/masoodha_l6xw95.jpg",
    time: "4:00 PM",
    slug: "04-00-PM",
    status: "Available",
    trailer: "https://youtu.be/5iwdHPO1EJk?si=GAjVRGDsNpAYQKkP"
  },
  
  {
    dateId: "30",
    name: "Gita Govindham",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774839377/gitagovindham_phnbhc.jpg",
    time: "10:00 AM",
    slug: "10-00-AM-01-00-PM",
    status: "Available",
    trailer: "https://youtu.be/qHqWRCxhcOk?si=oLKatMW6hTFe3FrM"
  },
  {
    dateId: "30",
    name: "Salaar",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243229/salaar_khs9kg.jpg",
    time: "1:00 PM",
    slug: "01-00-PM-04-00-PM",
    status: "Available",
    trailer: "https://youtu.be/4GPvYMKtrtI?si=V17JBA-JsEXyXtgj"
  },
  {
    dateId: "30",
    name: "Sita Ramam",
    poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774855159/SITARAMAM_cga0bh.jpg",
    time: "4:00 PM",
    slug: "04-00-PM-07-00-PM",
    status: "Available",
    trailer: "https://youtu.be/Ljk6tGZ1l3A?si=4W-jAziR165uAUSi"
  }
];

async function seedMovies() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in backend environment variables.');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for movie seeding...');

    
    const deleteResult = await Movie.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing movies from the database.`);

    
    const insertResult = await Movie.insertMany(MOVIES_TO_SEED);
    console.log(`Successfully seeded ${insertResult.length} movies into the database.`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding movies:', err);
    process.exit(1);
  }
}

seedMovies();
