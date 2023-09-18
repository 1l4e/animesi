
import { findOneSource } from "@/action/SourceModel";
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: any) {
  try {

    const start = new Date().getTime();
    const { searchParams } = new URL(request.url);
    const chapter = params.chapterSlug.join('/');
    const id = searchParams.get("id");
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
        message: "No Source 1",
      });
    }
    if (typeof source.selector === "object" && source.selector !== null) {
      let obj: any = source.selector;
      // Combine the home and news URLs
      let pathSegments = [obj.chapter_slug, chapter];
      let url = new URL(
        pathSegments.filter((segment: string) => segment !== "").join("/"),
        obj.home
      );
      const headers = {
        "User-agent":
          obj.agent ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
          Referer: obj.home,
      };
      // Fetch the HTML content of the combined URL
      const response = await fetch(url.href, {
        headers: headers,
      });
      const html = await response.text();
      // Load the HTML content into Cheerio
      const $ = cheerio.load(html);
      let videoUrl
      const scriptContent = $('script').text();
      const match = scriptContent.match(/filmInfo\.episodeID = parseInt\('(\d+)'\);/);
      // Select the elements that contain manga information using the provided selector
      let episodeID
      let plValue 
      let nValue
      const mangaInfo: any = {};
      if (match) {
        episodeID = parseInt(match[1]);
        console.log('filmInfo.episodeID:', episodeID);
        
        const res = await axios({
          url: "https://phimmoichillg.net/chillsplayer.php",
          method: "POST",
          headers: {
            "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
            "Referer": url.href
          },
          data: `qcao=${episodeID}&sv=1`,
        })
         
        const data = res.data;

        const match2 = data.match(/iniPlayers\("([^"]+)"/);
         if (match2) {
          videoUrl = match2.toString().split("\"")[1]
        } 
        const res2 = await axios.get(`https://phimmoichillg.net/player/pmcontent.js?_=${new Date().getTime()}`)
        const data2 = res2.data;
        const plMatch = data2.match(/var pl = "([^"]+)";/);
       const nMatch = data2.match(/var n = "([^"]+)"/);
          if (plMatch ) {
          plValue = plMatch.toString().split("\"")[1];} 
          if (nMatch) {
            nValue = nMatch.toString().split("\"")[1];
          }
      }
      // Initialize an object to store manga information
      const home = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const proxy = home+'/api/proxy3'
        mangaInfo.videoUrl= {
          hlspm: `${proxy}?source=${obj.home}&image=${plValue}/hlspm/${videoUrl}`,
          m3u8: `${proxy}?source=${obj.home}&image=${nValue}${videoUrl}/index.m3u8`
        };
        console.log(mangaInfo.videoUrl)
        const server= obj.manga.detail.chapter.server
        mangaInfo.parent= $(obj.manga.detail.chapter.child.parent).attr('href') || "";
        mangaInfo.chapters = [];
      $(obj.manga.detail.chapter.child.selector).each((idx, imageElement) => {
        const name = $(imageElement).find('a').text().trim() || ""
        const slug = $(imageElement).find('a').attr('href') || "";
        let uu 
        if(slug){
          uu = new URL(slug).pathname
        }
        const chapterInfo ={
          name :name,slug: uu?.replace('/xem','')
        }
        // Create an object for each chapter and add it to the latestChapters array
        mangaInfo.chapters.push(chapterInfo); 
      });

      // Push the mangaInfo object to the mangaUrls array

      return NextResponse.json({
        status: 200,
        time: new Date().getTime() - start,
        message: "OK",
        data: mangaInfo,
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
