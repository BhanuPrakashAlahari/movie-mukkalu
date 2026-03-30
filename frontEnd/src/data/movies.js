export const MOVIES_DATA = {
  29: [],
  30: [
    {
      name: "Gita Govindham",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774839377/gitagovindham_phnbhc.jpg",
      time: '10:00 AM',
      slug: '10-00-AM-01-00-PM',
      status: 'Bookings closed!',
      trailer: "https://youtu.be/qHqWRCxhcOk?si=oLKatMW6hTFe3FrM"
    },
    {
      name: "Salaar",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243229/salaar_khs9kg.jpg",
      time: '1:00 PM',
      slug: '01-00-PM-04-00-PM',
      status: 'Bookings closed!',
      trailer: "https://youtu.be/4GPvYMKtrtI?si=V17JBA-JsEXyXtgj"
    },
    {
      name: "Sita Ramam",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774855159/SITARAMAM_cga0bh.jpg",
      time: '4:00 PM',
      slug: '04-00-PM-07-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/Ljk6tGZ1l3A?si=4W-jAziR165uAUSi"
    }
  ]
};

export const ALL_POSTERS = Object.values(MOVIES_DATA).flat().map(movie => movie.poster);
