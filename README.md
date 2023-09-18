

Trang chủ
có 2 khung,
sidebar bên trái là list source
sidebar bên phải là phim mới theo category




Server hỗ trợ nhiều source, config source lưu trong database

cấu trúc route

/phim/[sourceId]
Lấy data theo category rồi hiển thị phim theo category

/phim/[sourceId]/category?filter=${filterId}
Hiển thị phim theo bộ lọc và category


/phim/[sourceId]/info=${MovieSlug}
Hiển thị thông tin phim theo Slug

/phim/[sourceId]/xem=${episodeId}
Hiển thị trình xem phim theo Slug


Vấn đề

Có vài phim sẽ không có Info

Vài phim sẽ không chứa danh sách chapter tại trang info
Trang Info có thể có nhiều Seasion, Link sang trang Info khác

Hầu hết sẽ có danh sách chapter tại trình xem

Trình xem có nhiều Server

Pattern mới

{
    "api": "https://phimmoiyyy.net/",
    "search": "?s=",
    "pagination" : "/page/*",
    "home": [
        {
            "title": "Phim mới nổi bật",
            "selector": "#featured-titles",
            "slug": "/"
        },
        {
            "title": "Phim chiếu rạp mới cập nhật",
            "selector": "#genre_phim-chieu-rap",
            "slug": "/the-loai/phim-chieu-rap"
        },
        {
            "title": "Phim bộ mới cập nhật",
            "selector": "#dt-tvshows",
            "slug": "/phim-bo"
        },
        {
            "title": "Phim lẻ mới cập nhật",
            "selector": "#dt-movies",
            "slug": "/phim-le"
        }
    ],
    "selector": {
        "home": {
            "item": "article",
            "title": "h3 a",
            "image": ".poster img",
            "image-src": "src",
            "latest": ".trangthai"
        },
        "category": {
            "item": "#archive-content article",
            "title": "h3 a",
            "image": ".poster img",
            "image-src": "src",
             "latest": ".trangthai"
        },
        "filter": {},
        "info": {
            "title": "h1",
            "other": ".extra span",
            "description": ".wp-content"
        },
        "episode": {
            "item": ".episodios li",
            "slug": "a"
        },
        "watch": {
            "type": "phimmoiqqq"
        }
    }
}





Default Pattern

{
    "hot": "hot",
    "home": "https://www.nettruyenus.com/",
    "news": "",
    "proxy":"proxy2",
    "manga": {
        "item": {
            "name": "h3 a",
            "image": ".image img",
            "new_chapter": {
                "selector": "ul li",
                "chapter_name": "a",
                "chapter_updated": "i.time"
            }
        },
        "child": {
            "name": "#item-detail h1.title-detail",
            "image": ".detail-info img",
            "author": "li.author a",
            "genres": ".kind a",
            "status": "li.status a",
            "chapter": {
                "child": {
                    "parent": "h1 a",
                    "selector": ".page-chapter img",
                    "nextChapter": ".page-chapter img",
                    "prevChapter": ".page-chapter img"
                },
                "server": [
                    "data-original",
                    "data-cdn"
                ],
                "chapterList": "#item-detail .list-chapter nav ul li",
                "chapterName": ".chapter a",
                "updatedTime": " .no-wrap.small"
            },
            "otherName": "li.othername h2",
            "description": ".detail-content p"
        },
        "selector": ".items .item"
    },
    "search": "tim-truyen?keyword=",
    "genreList": "#mainNav > div > div > div > div > ul > li:nth-child(5) > ul > li > div > div:nth-child(1) > ul",
    "manga_pos": "4",
    "filterList": ".comic-filter .sort-by div.col-sm-9  div",
    "manga_slug": "truyen-tranh",
    "pagination": "page",
    "chapter_pos": [
        "4",
        "5",
        "6"
    ]
}