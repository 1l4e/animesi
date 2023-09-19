import { findManySources } from "@/action/SourceModel"
import Phim from "./phim/[sourceId]/page";

export default async function Home({searchParams}:any) {
  const sources = await findManySources();
  const params = {
    sourceId: sources[0].id.toString()
  }
  return (
    <div className="flex flex-wrap flex-col w-full justify-center items-center">
      
      <Phim params={params} searchParams={searchParams}/>
   
    </div>
  )
}
