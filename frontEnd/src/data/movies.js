export const MOVIES_DATA = {
  27: [
    {
      name: "Kushi",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243294/kushi_ffkvjj.jpg",
      time: '10:00 AM',
      slug: '10-00-AM',
      status: 'Available',
      trailer: "https://youtu.be/KFHXCvvxL1U?si=CO7Z2NQ_j7GIVhrk"
    },
    {
      name: "Kanchana",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243228/kanchana_rgz5fg.jpg",
      time: '1:00 PM',
      slug: '01-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/p078qlaiypw?si=hXlEdvz6uFwh3FAI"
    },
    {
      name: "Ganga",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774967255/ganga_wjqbap.jpg",
      time: '4:00 PM',
      slug: '04-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/ijxDgjbH37E?si=F9M7j1IaWanim4Vy"
    }
  ],
  28: [
    {
      name: "Orange",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412256/WhatsApp_Image_2026-03-24_at_03.27.51_xlxu8j.jpg",
      time: '10:00 AM',
      slug: '10-00-AM',
      status: 'Available',
      trailer: "https://youtu.be/_FrmfC5_Pv8?si=Q_T6i3Vrq9XXjLP0"
    },
    {
      name: "Ee Nagaraniki Emaindhi",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.30.56_cuxavb.jpg",
      time: '1:00 PM',
      slug: '01-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/0-ra4l54MSg?si=3IBcOdpsZednLenL"
    }
  ],
  29: [
    {
      name: "Darling",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774412257/WhatsApp_Image_2026-03-24_at_03.29.31_fqchqx.jpg",
      time: '10:00 AM',
      slug: '10-00-AM',
      status: 'Available',
      trailer: "https://youtu.be/sRu1hiOz2jI?si=aHCbZxE2ZjNONheU"
    },
    {
      name: "Arjun Reddy",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774243227/arjun_reddy_ex4bav.jpg",
      time: '1:00 PM',
      slug: '01-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/aozErj9NqeE?si=3l0akzmDj5UYNupY"
    },
    {
      name: "Masoodha",
      poster: "https://res.cloudinary.com/diipfzmyj/image/upload/v1774716746/masoodha_l6xw95.jpg",
      time: '4:00 PM',
      slug: '04-00-PM',
      status: 'Available',
      trailer: "https://youtu.be/5iwdHPO1EJk?si=GAjVRGDsNpAYQKkP"
    }
  ],
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
