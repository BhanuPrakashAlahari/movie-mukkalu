export const MOVIES_DATA = {
  27: [
    {
      name: "Kushi",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243294/kushi_ffkvjj.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Anand",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296970/anand_txwoak.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Available'
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
      name: "Orange",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296862/orange_phpxt3.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Eega",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/eega_xtvlq2.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Available'
    },
    {
      name: "Murari",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296895/murari_mdwsm0.jpg",
      time: '4:30 PM - 7:00 PM',
      slug: '04-30-PM-07-00-PM',
      status: 'Available'
    }
  ],
  29: [
    {
      name: "7/G Brindavan Colony",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/7G_gmcfzx.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Darling",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/darling_c8mplf.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Available'
    },
    {
      name: "Godavari",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296848/godavari_xkbksc.jpg",
      time: '4:30 PM - 7:00 PM',
      slug: '04-30-PM-07-00-PM',
      status: 'Available'
    }
  ],
  30: [
    {
      name: "Nuvvu Naku Nachhav",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296849/nnn_yiobqv.jpg",
      time: '10:00 AM - 1:00 PM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available'
    },
    {
      name: "Ee Nagaraniki Emaindhi",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296884/ene_dkpmbb.jpg",
      time: '1:15 PM - 4:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Available'
    },
    {
      name: "Arjun Reddy",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/arjun_reddy_ex4bav.jpg",
      time: '4:30 PM - 7:00 PM',
      slug: '04-30-PM-07-00-PM',
      status: 'Available'
    }
  ]
};

export const ALL_POSTERS = Object.values(MOVIES_DATA).flat().map(movie => movie.poster);
