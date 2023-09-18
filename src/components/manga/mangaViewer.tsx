"use client";

import { useRef, useState } from "react";
/* import ListViewer from "./listViewer";
import Overlay from "./overlay"; */
import TopBarProgress from "../sources/user/TopBarProgress.component";
import ButtonChangeSize from "../sources/user/ButtonChangeSize.component";
import VideoPlayer from "./video";

export default function MangaViewer({
  mangaData,
  id,
  chapterSlug,
  source,
  list,
  parent
}: any) {
  const [imageWidth, setImageWidth] = useState("w-auto");
  const [showOverlay, setShowOverlay] = useState(false);
  const proxy = source.selector.proxy || 'proxy'

  const toggleUI = () => {
    setShowOverlay(!showOverlay);
  };
  const toggleImageWidth = () => {
    if (imageWidth === "w-auto") {
      setImageWidth("w-full");
    } else if (imageWidth === "w-full") {
      setImageWidth("w-2/3");
    } else {
      setImageWidth("w-auto");
    }
  };

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    preload: 'metadata',
    sources: [{
      src: mangaData.videoUrl.m3u8,
      type: 'application/x-mpegURL',
    }]
  };

 

  return (
    <>
      <div className="flex flex-col w-full min-h-[120vh]">
     
      <TopBarProgress />
      <ButtonChangeSize source={source} showOverlay={showOverlay} toggleImageWidth={toggleImageWidth} imageWidth={imageWidth} parent={parent} />
      <div className="reader min-h-screen ">
      <VideoPlayer {...videoJsOptions} />
      
      </div>
     {/* { <ListViewer
        className={`${showOverlay ? "" : "hidden"} `}
        list={list}
        id={id}
        chapterSlug={chapterSlug}
      />} */}
      {/*  <Overlay show={true} onClick={toggleUI} /> */}
    </div>
   
    </>
    
  );
}
