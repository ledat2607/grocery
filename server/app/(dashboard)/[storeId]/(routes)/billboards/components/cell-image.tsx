'use client'

import Image from "next/image";
import { BillboardColumns } from "./columns";


interface CellImageProps {
  imageUrl: string;
}
const CellImage = ({ imageUrl }: CellImageProps) => {
  return (
    <div className="overflow-hidden w-32 h-16 relative rounded-md shadow-md">
      <Image src={imageUrl} alt="" fill />
    </div>
  );
};
 
export default CellImage;