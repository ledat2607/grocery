"use client"

import Image from "next/image";

interface GalleryTabProps {
  url: string;
}
const GalleryTab = ({ url }: GalleryTabProps) => {
  return (
    <div className="w-24 h-24 mt-20 aspect-square sm:rounded-lg overflow-hidden relative">
      <Image src={url} alt="" className="object-contain" fill />
    </div>
  );
};

export default GalleryTab;