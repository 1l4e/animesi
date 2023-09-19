import axios from "axios";
import { CheerioAPI } from "cheerio";
import * as cheerio from 'cheerio'

export async function getWatchPhimYYY($: CheerioAPI,referal:string) {
  const shortlinkHref = $('link[rel="shortlink"]').attr("href");
  if (!shortlinkHref) {
    return null;
  }
  const url = new URL(shortlinkHref).searchParams;
  const id = url.get("p");
  if (!id) {
    return null;
  }
  const res = await axios(
    {
        method: 'POST',
        url: "https://phimmoiyyy.net/wp-admin/admin-ajax.php",
        data: `action=doo_player_ajax&post=${id}&nume=1&type=tv`,
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
            "Accept": "*/*",
            "Accept-Language": "vi,en-US;q=0.7,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Alt-Used": "phimmoiyyy.net",
            "Referal" : `${referal}`
        },
    }
  )
  const data = await res.data;
    return data

}
