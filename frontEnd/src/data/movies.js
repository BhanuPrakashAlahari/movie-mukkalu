export const MOVIES_DATA = {
  28: [
    {
      name: "Orange",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412256/WhatsApp_Image_2026-03-24_at_03.27.51_xlxu8j.jpg",
      time: '10:00 AM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=_FrmfC5_Pv8"
    },
    {
      name: "Ee Nagaraniki Emaindhi",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.30.56_cuxavb.jpg",
      time: '1:30 PM',
      slug: '01-30-PM-04-30-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=0-ra4l54MSg"
    },
    {
      name: "Devara",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774644250/__bhswnt.jpg",
      bookingPoster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774644250/Devara_fzwwyl.jpg",
      time: '4:45 PM',
      slug: '04-45-PM-07-45-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=uzCsH2v81q8"
    }
  ],
  /*
  29: [
    {
      name: "7/G Brindavan Colony",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/7G_gmcfzx.jpg",
      time: '10:00 AM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=qwFkjI0BbBU"
    },
    {
      name: "Eega",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/eega_xtvlq2.jpg",
      time: '1:00 PM',
      slug: '01-00-PM-04-00-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=x-1ZoU1xB4I"
    },
    {
      name: "Murari",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296895/murari_mdwsm0.jpg",
      time: '3:45 PM',
      slug: '03-45-PM-06-45-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=_mPuQcQ7aGg"
    }
  ],
  */
  /*
  30: [
    {
      name: "Nuvvu Naku Nachhav",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774296849/nnn_yiobqv.jpg",
      time: '10:00 AM',
      slug: '10-00-AM-01-00-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=9wbdREaW6uM"
    },
    {
      name: "Ee Nagaraniki Emaindhi",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.30.56_cuxavb.jpg",
      time: '1:15 PM',
      slug: '01-15-PM-04-15-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=0-ra4l54MSg"
    },
    {
      name: "Arjun Reddy",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.31.47_t58oxx.jpg",
      time: '3:40 PM',
      slug: '03-40-PM-06-40-PM',
      status: 'Available',
      trailer: "https://www.youtube.com/watch?v=aozErj9NqeE"
    }
  ]
  */
};

export const ALL_POSTERS = Object.values(MOVIES_DATA).flat().map(movie => movie.poster);
