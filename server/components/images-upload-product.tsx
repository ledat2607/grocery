"use client";

import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { ImagePlus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";

interface ImageProductUploadProps {
  disable?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageProductUpload = ({
  disable,
  onChange,
  onRemove,
  value,
}: ImageProductUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [imageRef, setImageRef] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
    // Set imageRef from value prop when it changes
    if (value.length > 0) {
      const imgRef = ref(storage, value[0]); // Assuming value[0] is the download URL
      setImageRef(imgRef);
    }
  }, [value]);

  if (!isMounted) {
    return null;
  }

  // Upload image
  const onUpload = async (e: any) => {
    const files: File[] = Array.from(e.target.files || []);
    setIsLoading(true);

    const newUrls: string[] = [];
    let counterUploads = 0;
    files.forEach((file: File) => {
      const uploadTask = uploadBytesResumable(
        ref(storage, `Image/Products/${Date.now()} - ${file.name}`),
        file,
        { contentType: file.type }
      );
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
            newUrls.push(downloadUrl);
            counterUploads++;
            if (counterUploads === files.length) {
              setIsLoading(false);
              onChange([...value, ...newUrls]);
            }
          });
        }
      );
    });
  };

  // Delete image from storage
  const handleRemove = async (url: string) => {
    const newValue = value.filter((imageUrl) => imageUrl !== url);
    onRemove(url);
    onChange(newValue);
    await deleteObject(ref(storage, url)).then(() => {
      toast.success("Success");
    });
  };
  return (
    <div className="grid lg:grid-cols-3 xl:grid-cols-8 gap-4">
      {value && value.length > 0 ? (
        value.map((imageUrl, index) => (
          <div key={index} className="relative">
            <img
              src={imageUrl}
              alt={`Uploaded ${index}`}
              className="w-52 h-52 object-cover rounded-2xl"
            />
            <div className="absolute cursor-pointer bg-rose-500 px-2 py-3 top-0 flex items-center justify-center rounded-t-none rounded-l-none rounded-br-2xl">
              <Trash
                onClick={() => handleRemove(imageUrl)} // Truyền URL của ảnh
                className="text-white w-6 h-6 hover:animate-bounce transition-all duration-300"
              />
            </div>
          </div>
        ))
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
                  multiple
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageProductUpload;
