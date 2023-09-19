import { SelectorHome, SourceSelector } from "@/types/types";
import { source }  from "@prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";
import { getWatchPhimYYY } from "./watch";

export async function fetchData(url:string,cache:RequestCache){
    try {
        const res = await fetch(url,{
            cache,
        });
        const data = await res.json();
        const mangaLists = data.data;
        return mangaLists
    } catch (error) {
        return
}
}

export async function fetchSource(source:source,searchParams:any){
    try {
    const {page,search,category} = searchParams
        let obj  = source.selector as SourceSelector;
      let url = `${obj.api}`;
      if (category){
        url = url + "/"+ category.replace('/',"");
      }
    
      if (search) {
        url = `${obj.api}${obj.search}${search}`;
      }
      let pageSlug = obj.pagination;
      console.log(obj)
      if (page && parseInt(page.toString()) > 0) {
        const pages = pageSlug.toString().replace('*',page)
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
      return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function fetchMovieInfo(source:source,searchParams:any){
    try {
        const {movie} = searchParams
        if (!movie){
            return null
        }
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
      return data

    } catch (error) {
        return null
    }
}