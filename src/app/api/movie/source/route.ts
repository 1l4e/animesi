import { findOneSource } from "@/action/SourceModel";
import { SelectorHome, SourceSelector } from "@/types/types";
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"
export async function GET(request: Request) {
  try {

    const start = new Date().getTime();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    console.log(category);
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
      let obj  = source.selector as SourceSelector;
      let url = `${obj.api}`;
      if (category){
        url = url + "/"+ category.replace('/',"");
      }
    
      if (search) {
        url = `${obj.api}${obj.search}${search}`;
      }
      let pageSlug = obj.pagination;
      if (page && parseInt(page.toString()) > 0) {
        const pages = pageSlug.replace('*',page)
        if (search) {
          url += pages;
        } else {
          url += pages;
        }
      }
      const headers = {
        "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
        Referal: obj.api,
      };
      // Fetch the HTML content of the combined URL
   
      const homeItemSelector = obj.selector.home
      const catItemSelector = obj.selector.category

      const data: any = [];
      if (category){
        const response = await axios.get(url, {
            headers ,
          });
          const html = response.data;
    
          // Load the HTML content into Cheerio
          const $ = cheerio.load(html);
    

            const sections: any = {
                title: "Phim theo Danh mục",
                slug: category,
                movies: [],
              };
              const movies: any[] = [];
            $(catItemSelector.item).each((index, element) => {
                
               /*  console.log({data:$(element).html()}) */

                    const title = $(element).find(catItemSelector.title).text().trim() || '';
                    const href = $(element).find(catItemSelector.title).attr('href') || '';
                    const image = $(element).find(catItemSelector.image).attr(catItemSelector["image-src"]) || '';
                    const latest = $(element).find(catItemSelector.latest).text().trim() || ''
                    let slug = ''
                    if (href) {
                        slug = new URL(href).pathname
                    }
                    movies.push({
                        title,slug,image,latest
                    })
  
                
            }
            );
            sections.movies = movies
            data.push(sections)
          
      }
      else{
        const response = await axios.get(url, {
            headers ,
          });
          const html = response.data;
    
          // Load the HTML content into Cheerio
          const $ = cheerio.load(html);
    
        obj.home.forEach((item:SelectorHome,index:number)=>{
            const sections: any = {
                title: item.title,
                slug: item.slug,
                movies: [],
              };
            $(item.selector).each((index, element) => {
                const movies: any[] = [];
           /*      console.log({data:$(element).html()}) */
                $(element).find(homeItemSelector.item).each((idx,hItem)=> {
                    
                    const title = $(hItem).find(homeItemSelector.title).text().trim() || '';
                    const href = $(hItem).find(homeItemSelector.title).attr('href') || '';
                    const image = $(hItem).find(homeItemSelector.image).attr(homeItemSelector["image-src"]) || '';
                    const latest = $(hItem).find(homeItemSelector.latest).text().trim() || ''
                    let slug = ''
                    if (href) {
                        slug = new URL(href).pathname
                    }
                    movies.push({
                        title,slug,image,latest
                    })
                })
                sections.title = item.title
                sections.slug = item.slug
                sections.movies = movies
            }
            );
            data.push(sections)
          })
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
