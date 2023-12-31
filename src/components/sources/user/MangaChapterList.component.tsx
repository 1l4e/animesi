"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MangaChapterListComponent({ mangaData, id,mangaSlug }: any) {
  return (
    <>
      <div className="flex flex-col lg:flex-row py-20 gap-4">
        <img width={300} height={400} src={mangaData.image}></img>

        <div className="flex flex-col">
          <h1 className="text-xl text-center">{mangaData.name}</h1>
          <span>Author : {mangaData.author}</span>
          <span>Other Name: {mangaData.otherName}</span>
          <div className="flex flex-row gap-4">
            <span>Genres</span>
            <ul className="flex flex-col gap-4">
              {mangaData.genres?.map((item: any, index: number) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>

          <span>{mangaData.description}</span>
          <Button asChild><Link href={`/phim/sources/${id}/${mangaSlug}${mangaData.watch}`}>
            XEM PHIM
          </Link></Button>
        </div>
      </div>
      <div className="flex flex-col">
        <ul className="grid grid-cols-1 px-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2 text-xs">
          {mangaData.chapters?.map((chapter: any, index: number) => (
            <li className="" key={index}>
              <Link
                className="flex px-4 py-2 bg-green-700 justify-between items-center font-bold rounded-full text-white visited:text-red-600 visited:bg-gray-600 visited:hover:bg-gray-400 "
                href={`/phim/sources/${id}/${mangaSlug}/${chapter.url}`}
              >
                <span> {chapter.name}</span>
                <span className="text-xs text-gray-200">
                  {" "}
                  {chapter.updated_at}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
