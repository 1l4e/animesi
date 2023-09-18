const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const user= {
    name: "Nghia",
    email: "angelinmyeye@outlook.com",
    password: "0bdabd756427f398d4ff8a1e819d8088",
    is_admin: true
}
const source =  [
    {
      url: 'https://www.nettruyenus.com/',
      name: 'Net truyện',
      image: 'https://st.nettruyenus.com/data/logos/logo-nettruyen.png',
      selector: JSON.parse('{"hot": "hot", "home": "https://www.nettruyenus.com/", "news": "", "manga": {"item": {"name": "h3 a", "image": ".image img", "new_chapter": {"selector": "ul li", "chapter_name": "a", "chapter_updated": "i.time"}}, "child": {"name": "#item-detail h1.title-detail", "image": ".detail-info img", "author": "li.author a", "genres": ".kind a", "status": "li.status a", "chapter": {"child": {"selector": ".page-chapter img", "nextChapter": ".page-chapter img", "prevChapter": ".page-chapter img"}, "server": ["data-original", "data-cdn"], "chapterList": "nav .chapter a", "updatedTime": " .no-wrap.small"}, "otherName": "li.othername h2", "description": ".detail-content p"}, "selector": ".items .item"}, "search": "tim-truyen?keyword=", "genreList": "#mainNav > div > div > div > div > ul > li:nth-child(5) > ul > li > div > div:nth-child(1) > ul", "manga_pos": "4", "filterList": ".comic-filter .sort-by div.col-sm-9  div", "manga_slug": "truyen-tranh", "pagination": "page", "chapter_pos": ["4", "5", "6"]}'),
      order: 1,
      safe: true
    },
    {
      url: 'https://hentaivn.autos/',
      name: 'Mangavn',
      image: 'https://st.nettruyenus.com/data/logos/logo-nettruyen.png',
      selector: JSON.parse('{"hot": "hot", "home": "https://hentaivn.autos/", "news": "", "manga": {"item": {"name": ".box-description a", "image": "img", "new_chapter": {"selector": "a:nth-child(2)", "chapter_name": "a:nth-child(2) b", "chapter_updated": ""}}, "child": {"name": "h1", "image": ".page-ava img", "author": "div.left-info:nth-child(2) > div:nth-child(2) > p:nth-child(4) > span:nth-child(2) > a:nth-child(1)", "genres": "div.left-info:nth-child(2) > div:nth-child(2) > p:nth-child(2) span", "status": "div.left-info:nth-child(2) > div:nth-child(2) > p:nth-child(6) > span:nth-child(2) > a:nth-child(1)", "chapter": {"child": {"selector": ".page-chapter img", "nextChapter": ".page-chapter img", "prevChapter": ".page-chapter img"}, "server": ["data-original", "data-cdn"], "chapterList": ".listing td a", "updatedTime": " .listing td a:nth-child(2)"}, "otherName": "li.othername h2", "description": "div.left-info:nth-child(2) > div:nth-child(2) > p:nth-child(8)"}, "selector": ".page-item .item"}, "search": "tim-kiem-truyen.html?key=", "genreList": "#1_tags li", "manga_pos": "3", "filterList": "", "manga_slug": "", "pagination": "page", "chapter_pos": ["3"]}'),
      order: 1,
      safe: false
    },
    {
      url: 'https://lxmanga.net/',
      name: 'LxManga',
      image: 'https://st.nettruyenus.com/data/logos/logo-nettruyen.png',
      selector: JSON.parse('{"hot": "hot", "home": "https://lxmanga.net/", "news": "danh-sach", "manga": {"item": {"name": ".text-ellipsis", "type": "div.rounded-t-lg.cover", "image": ".cover-frame .cover", "new_chapter": {"selector": ".latest-chapter a", "chapter_name": ".latest-chapter a", "chapter_updated": ".latest-chapter span"}}, "child": {"name": "div:nth-child(1) > div:nth-child(1) > span:nth-child(2)", "type": ".cover", "image": ".cover-frame .cover", "author": "div.mt-2:nth-child(4) > span:nth-child(2) > a:nth-child(1)", "genres": "div.mt-2:nth-child(3) > span:nth-child(2) a", "status": "span.text-blue-500", "chapter": {"child": {"selector": ".text-center img.lazy", "nextChapter": ".text-center img", "prevChapter": ".text-center img"}, "server": ["src", "src"], "chapterList": "ul.overflow-y-auto:nth-child(2) a", "updatedTime": ".listing td a:nth-child(2)"}, "otherName": "li.othername h2", "description": ""}, "selector": ".mt-4 div.manga-vertical"}, "search": "tim-kiem?sort=-updated_at&filter[name]=", "genreList": ".grid-cols-3 a", "manga_pos": "2", "filterList": "", "manga_slug": "truyen", "pagination": "page", "chapter_pos": ["2", "3"]}'),
      order: 1,
      safe: false
    }
  ]
    

async function seed(){
    await prisma.source.deleteMany({});
    await prisma.users.deleteMany({});
    await prisma.collection.deleteMany({});

    const uu =await prisma.users.create({
        data: user
    })
    await prisma.source.createMany({
        data: source
    })
    await prisma.collection.create({
        data: {
          name: 'Default',
          image: 'https://st.nettruyenus.com/data/comics/236/thuong-nguyen-do.jpg',
          description: 'First Collections',
          author_id: uu.id
        }
    })
    console.log("Seeded")
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });