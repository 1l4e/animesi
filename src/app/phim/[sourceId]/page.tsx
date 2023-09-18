import { findOneSource } from "@/action/SourceModel"
import { fetchData } from "@/action/fetch"
import NotFound from "@/app/not-found"
import { home } from "@/lib/constant"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function Phim({params,searchParams}: {params:{
    sourceId:string
},
searchParams: {

}}) {
    const sources = await findOneSource(params.sourceId)
    if (!sources){
        return <NotFound title="Source Not Found" />
    }
    const data = await fetchData(`${home}/api/movie/source?id=${sources.id}`,'no-cache')

  return (
    <div>
        {data?.map((section:any,index:number)=> (
            <div key={index}>
                <h1 className="text-2xl ">{section.title}</h1>
                <Link href={`/phim/${sources.id}/category?id=${section.slug}`}>Xem Thêm</Link>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 lg:p-8 p-1 pt-6">
              {section?.movies.map((item: any, index: number) => (
                 <div className="" key={index}>
                 <div className="overflow-hidden rounded-md relative">
                   <Link href={`${sources.id}/info?id=${item.slug}`}>
                    <span className="absolute top-0 right-0 bg-green-500 px-4 py-2">{item.latest}</span>
                     <img
                       src={`${item.image}`}
                       alt="alt"
                       width={300}
                       height={278}
                       className={cn("h-auto object-cover transition-all aspect-[3/4]")}
                     />
                   </Link>
                   <div className=" text-center w-full ">
                     <h3>{item.title}</h3>
                     
                   </div>
                 </div>
               </div>
              ))}
    </div>
            </div>
        ))}
    </div>
  )
}
