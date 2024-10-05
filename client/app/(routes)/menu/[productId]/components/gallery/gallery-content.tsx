"use client"

import Image from "next/image";

interface GallerContentProps {
  url: string;
}
const GalleryContent = ({ url }: GallerContentProps) => {
  return (
    <div className="w-[550px] h-[550px] aspect-square sm:rounded-lg overflow-hidden relative">
      <Image src={url} alt="" className="w-full h-full object-contain" fill />
    </div>
  );
};
 
export default GalleryContent;