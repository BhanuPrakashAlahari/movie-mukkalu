export const MOVIES_DATA = {
  29: [],
  30: [
    {
      name: "Gita Govindham",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774839377/gitagovindham_phnbhc.jpg",
      time: '10:00 AM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/qHqWRCxhcOk?si=oLKatMW6hTFe3FrM"
    },
    {
      name: "Salaar",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243229/salaar_khs9kg.jpg",
      time: '1:00 PM',
      slug: '01-00-PM-04-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/4GPvYMKtrtI?si=V17JBA-JsEXyXtgj"
    },
    {
      name: "Durandhar",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774840120/WhatsApp_Image_2026-03-30_at_08.34.35_ym5rdd.jpg",
      time: '4:00 PM',
      slug: '04-00-PM-07-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/BKOVzHcjEIo?si=Xjau6hKQgL4NCjBI"
    }
  ]
};

export const ALL_POSTERS = Object.values(MOVIES_DATA).flat().map(movie => movie.poster);
