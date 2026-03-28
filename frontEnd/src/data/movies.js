export const MOVIES_DATA = {
  29: [
    {
      name: "Darling",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.29.31_fqchqx.jpg",
      time: '10:00 AM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/t8HVxmysPC4?si=WtSwJtp8_c-V659T"
    },
    {
      name: "Arjun Reddy",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.31.47_t58oxx.jpg",
      time: '1:00 PM',
      slug: '01-00-PM-04-00-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=aozErj9NqeE"
    },
    {
      name: "Masoodha",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774716746/masoodha_l6xw95.jpg",
      time: '4:00 PM',
      slug: '04-00-PM-07-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/5iwdHPO1EJk?si=cBxzFAVz4F3OsEjL"
    }
  ],
  30: []
};

export const ALL_POSTERS = Object.values(MOVIES_DATA).flat().map(movie => movie.poster);
