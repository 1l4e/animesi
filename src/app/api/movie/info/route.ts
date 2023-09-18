import { findOneSource } from "@/action/SourceModel";
import { SelectorHome, SourceSelector } from "@/types/types";
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { getWatchPhimYYY } from "./watch";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const start = new Date().getTime();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const movie = searchParams.get("movie");
    if (!id) {
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
      let obj = source.selector as SourceSelector;
      let url = `${obj.api}${movie}`;

      const headers = {
        "User-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
        Referal: obj.api,
      };
      // Fetch the HTML content of the combined URL

      const infoSelector = obj.selector.info;
      const episodeSelector = obj.selector.episode;
      const watchSelector = obj.selector.watch;
      const data: any = {};
      const response = await axios.get(url, {
        headers,
      });
      const html = response.data;

      // Load the HTML content into Cheerio
      const $ = cheerio.load(html);
      data.title = $(infoSelector.title).text().trim() || "";
      data.image = $(infoSelector.image).attr(infoSelector["image-src"]);
      data.other = $(infoSelector.other).text().trim() || "";
      data.description = $(infoSelector.description).text().trim() || "";
      data.episode = []
      $(episodeSelector.item).each((idx,element)=>{
        const epName = $(element).find(episodeSelector.slug).text().trim();
        const epSlug = $(element).find(episodeSelector.slug).attr('href');
        const ep = {
            title:epName,
            slug: epSlug ? new URL(epSlug).pathname : ""
        }
        data.episode.push(ep)
      })
      data.watch = []
      switch (watchSelector.type) {
        case 'phimmoiyyy':
                const phimyyy = await getWatchPhimYYY($,url);
                data.watch.push(phimyyy)
            break;
      
        default:
            const res2 = await getWatchPhimYYY($,url);
            data.watch.push(res2)
            break;
      }

      return NextResponse.json({
        status: 200,
        time: new Date().getTime() - start,
        message: "OK",
        data: data,
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
