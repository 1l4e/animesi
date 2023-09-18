const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt')

const source = [
  {
    url: "https://phimmoiyyy.net/",
    name: "Phim MớiYYY",
    image: "https://phimmoiyyy.net/wp-content/uploads/2023/03/phimmoi.png",
    selector: {
      api: "https://phimmoiyyy.net/",
      home: [
        {
          slug: "/",
          title: "Phim mới nổi bật",
          selector: "#featured-titles",
        },
        {
          slug: "/the-loai/phim-chieu-rap",
          title: "Phim chiếu rạp mới cập nhật",
          selector: "#genre_phim-chieu-rap",
        },
        {
          slug: "/phim-bo",
          title: "Phim bộ mới cập nhật",
          selector: "#dt-tvshows",
        },
        {
          slug: "/phim-le",
          title: "Phim lẻ mới cập nhật",
          selector: "#dt-movies",
        },
      ],
      selector: {
        home: {
          item: "article",
          image: ".poster img",
          title: "h3 a",
          latest: ".trangthai",
          "image-src": "src",
        },
        info: {
          image: ".poster img",
          other: ".extra span",
          title: "h1",
          "image-src": "src",
          description: ".wp-content",
        },
        watch: {
          type: "phimmoiyyy",
        },
        filter: {},
        episode: {
          item: ".episodios li",
          slug: "a",
        },
        category: {
          item: "#archive-content article",
          image: ".poster img",
          title: "h3 a",
          latest: ".trangthai",
          "image-src": "src",
        },
      },
    },
    order: 1,
    safe: true,
    type: "normal",
  },
];

async function seed() {
  const user = {
    name: "Nghia",
    email: "angelinmyeye@outlook.com",
    password: await bcrypt.hash('qwert!@#qwert',10),
    is_admin: true,
  };
  await prisma.source.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.collection.deleteMany({});

  await prisma.users.create({
    data: user,
  });
  await prisma.source.createMany({
    data: source,
  });

  console.log("Seeded");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
