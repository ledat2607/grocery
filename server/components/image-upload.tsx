"use client";

import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { ImagePlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import { Button } from "./ui/button";

interface ImageUploadProps {
  disable?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload = ({
  disable,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [imageRef, setImageRef] = useState<any>(null); // State to store the image reference

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  //upload image
  const onUpload = async (e: any) => {
    const file = e.target.files[0];

    setIsLoading(true);

    const storageRef = ref(storage, `Image/${Date.now()} - ${file.name}`);
    setImageRef(storageRef); // Store reference to the uploaded image

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          onChange(downloadUrl); // Pass the image URL to parent component
          setIsLoading(false);
        });
      }
    );
  };

  //delete image from storage
  const handleRemove = async () => {
    if (imageRef) {
      try {
        await deleteObject(imageRef); // Delete the image from Firebase storage
        onRemove(value[0]); // Call the parent component's onRemove to update the state
        toast.success("Image deleted successfully");
      } catch (error) {
        toast.error("Error deleting image");
      }
    }
  };

  return (
    <div>
      {value && value.length > 0 ? (
        <div className="relative">
          <img
            src={value[0]}
            alt="Uploaded"
            className="w-52 h-52 object-cover"
          />
          <button
            className="absolute bg-rose-500 px-2 py-3 top-0 flex items-center justify-center rounded-t-none rounded-l-none rounded-br-2xl"
            onClick={handleRemove}
          >
            <Trash className="text-white w-6 h-6 hover:animate-bounce transition-all duration-300" />
          </button>
        </div>
      ) : (
        <div className="w-52 h-52 rounded-xl border-2 border-dashed overflow-hidden border-gray-400 flex items-center justify-center flex-col gap-3">
          {isLoading ? (
            <>
              <PuffLoader size={30} color="#555" />
              <p>{`${progress.toFixed(2)} %`}</p>
            </>
          ) : (
            <>
              <label>
                <div className="flex items-center justify-center flex-col cursor-pointer">
                  <ImagePlus className="w-4 h-4" />
                  Add image
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className="w-0 h-0"
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default ImageUpload;
