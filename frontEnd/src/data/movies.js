export const MOVIES_DATA = {
  27: [
    {
      name: "They call him OG",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243228/og_poster_uehnou.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Pokiri",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243228/pokiri_aakknd.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Fast Filling'
    },
    {
      name: "Kanchana",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243228/kanchana_rgz5fg.jpg",
      time: '4:30 PM - 7:00 PM',
      slug: '04-30-PM-07-00-PM',
      status: 'Available'
    }
  ],
  28: [
    {
      name: "Darling",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/darling_c8mplf.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Kushi",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243294/kushi_ffkvjj.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Fast Filling'
    },
    {
      name: "Sanam Teri Kasam",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774271335/sanamteri_kasam_cepzmk.jpg",
      time: '4:30 PM - 7:30 PM',
      slug: '04-30-PM-07-30-PM',
      status: 'Available'
    }
  ],
  29: [
    {
      name: "Aashiqui 2",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774271335/aashiqi_2_xgwqv5.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Nuvvostanante Nenoddantana",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774271335/nuvvasta_eso88h.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Available'
    },
    {
      name: "Rangasthalam",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243230/rangastalam_bpvcyk.jpg",
      time: '4:30 PM - 7:00 PM',
      slug: '04-30-PM-07-00-PM',
      status: 'Available'
    }
  ],
  30: [
    {
      name: "Arjun Reddy",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/arjun_reddy_ex4bav.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Salaar",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243229/salaar_khs9kg.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Fast Filling'
    },
    {
      name: "Eega",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/eega_xtvlq2.jpg",
      time: '4:30 PM - 7:00 PM',
      slug: '04-30-PM-07-00-PM',
      status: 'Available'
    }
  ]
};

export const ALL_POSTERS = Object.values(MOVIES_DATA).flat().map(movie => movie.poster);
