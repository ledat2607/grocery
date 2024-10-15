'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GalleryContent from "./gallery-content";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
  image: { url: string }[];
}

const Gallery = ({ image }: GalleryProps) => {
  return (
    <Tabs defaultValue={image[0].url} className="pl-4">
      {image.map((tab) => (
        <TabsContent
          key={tab.url}
          value={tab.url.toString()}
          className="flex items-center justify-center"
        >
          <GalleryContent url={tab.url} />
        </TabsContent>
      ))}
      <TabsList className="bg-transparent w-full">
        {image.map((tab) => (
          <TabsTrigger key={tab.url} value={tab.url.toString()}>
            <GalleryTab url={tab.url} />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

 
export default Gallery;