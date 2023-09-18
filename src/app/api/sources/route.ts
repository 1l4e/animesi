import { findOneSource } from "@/action/SourceModel";
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"
export async function GET(request: Request,{params}:any) {
  try {

    const start = new Date().getTime();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    let loc = searchParams.get('filter');

    console.log(loc)
    if (!id ) {
      return NextResponse.json({
        status: 404,
        message: "No Source",
      });
    }
    const source = await findOneSource(id);
    if (!source) {
      return NextResponse.json({
        status: 404,
        message: "No Source",
      });
    }
    if (typeof source.selector === "object" && source.selector !== null) {
      let obj: any = source.selector;
      // Combine the home and news URLs
      let url = `${obj.home}${obj.news}`;
      if (search) {
        url = `${obj.home}${obj.search}${search}`;
      }
      let pageSlug = obj.pagination;
      const pages = pageSlug.replace('*',page)
      if (page && parseInt(page.toString()) > 0) {
        if (search) {
          url += pages;
        } else {
          url += pages;
        }
      }
      const headers = {
        "User-agent":
          obj.agent ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
        Referral: obj.home,
      };
      // Fetch the HTML content of the combined URL
   
      const response = await axios.get(url, {
        headers,
      });
      const html = response.data;

      // Load the HTML content into Cheerio
      const $ = cheerio.load(html);

      // Select the elements that contain manga information using the provided selector
      const mangaUrls: any[] = [];
      let filterNumber= 0
      $(obj.manga.selector).each((index, element) => {
        // Initialize an object to store manga information
        const mangaInfo: any = {};
        // Extract manga name from the provided selector
        const ele = $(element).find(obj.manga.item.name);
        const name = ele.text().trim();
        if (!loc && mangaFilter(name,filter)){
          filterNumber++
            return
        }
        mangaInfo.name = name;

        mangaInfo.url = ele.attr("href")?.toString().split("/")[
          parseInt(obj.manga_pos)
        ];
        mangaInfo.image = $(element)
          .find(obj.manga.item.image)
          .attr("data-original");
          if (!mangaInfo.image){
            mangaInfo.image = $(element)
          .find(obj.manga.item.image)
          .attr("src");
          }

        const type = obj.manga.item.type;
        if (type) {
          const styleAttribute = $(element).find(type)?.attr("style");

          if (styleAttribute) {
            const match = styleAttribute.match(/url\('([^']+)'\)/);
            if (match) {
              mangaInfo.image = match[1];
            }
          }
        }
 
        mangaInfo.filter=filterNumber
        mangaUrls.push(mangaInfo);
      });

      return NextResponse.json({
        status: 200,
        time: new Date().getTime() - start,
        message: "OK",
        data: mangaUrls,
      });
    }
    return NextResponse.json({
      status: 500,
      time: new Date().getTime() - start,
      message: "error",
      data: {},
    });
  } catch (error) {
    console.error("Error fetching and parsing the manga URLs:", error);
    return NextResponse.json({
      status: 500,
      message: error,
    });
  }
}

function mangaFilter(inputString:string, filter:string[]) {
  for (const word of filter) {
    if (inputString.toLowerCase().includes(word.toLowerCase())) {
      return true;
    }
  }
  return false;
}
const filter = [
  'mom',"mẹ","loạn luân","SpyxFamily","Okaa","Niece","little sister","loli",
]