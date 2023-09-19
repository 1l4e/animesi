import { findOneSource } from "@/action/SourceModel";
import { fetchMovieInfo } from "@/action/fetch";
import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function MovieXem({
  params,
  searchParams,
}: {
  params: { sourceId: string };
  searchParams: { id: string };
}) {
  const source = params.sourceId;
  const id = searchParams.id;

  if (!source || !id) {
    return <NotFound title="Check ID/ Source" />;
  }
  const sources = await findOneSource(params.sourceId)
  if (!sources){
      return <NotFound title="Source Not Found" />
  }
  const search = {
    movie:id
  }
  const data = await fetchMovieInfo(sources, search);
  if (!data){
    return <>Not Found</>
  }
  const iff = data?.watch[0];
  return (
    <div className="flex flex-col justify-center items-center w-full">
      {data ? (
        <>
          <div className="player w-full h-full flex justify-center">
            {iff.type === "iframe" && (
              <iframe
                className="w-full h-full min-h-[60vh]"
                src={iff.embed_url}
                allowFullScreen
              ></iframe>
            )}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 my-8">
            {data.episode?.map((chapter: any, index: number) => (
              <Button asChild key={index}>
                <Link href={`/phim/${source}/xem?id=${chapter.slug}`}>
                  {chapter.title}
                </Link>
              </Button>
            ))}
          </div>

          <h1>{data.title}</h1>
          <p>{data.other}</p>
          <span>{data.description}</span>
          <img width={400} height="auto" src={data.image}></img>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
