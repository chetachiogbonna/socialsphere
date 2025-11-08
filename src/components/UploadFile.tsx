"use client";

import usePostStore from '@/stores/usePostStore';
import { Post } from '@/types';
import { ImageIcon, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function UploadFile({ post }: { post?: Post }) {
  const pathname = usePathname();

  const { imageUrl, setImageUrl, setImageFile, imageFile } = usePostStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageUrl(URL.createObjectURL(acceptedFiles[0]));
    setImageFile(acceptedFiles[0]);
  }, [setImageFile, setImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={`relative z-0 w-full h-[500px] rounded-2xl border-2 border-dashed transition 
    ${isDragActive ? "border-blue-400 bg-blue-50/10" : "border-gray-600 bg-[#1A1A1A]"} 
    flex flex-col items-center justify-center cursor-pointer hover:border-blue-400`}
    >
      <input {...getInputProps()} />

      {imageUrl ? (
        isDragActive ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <UploadCloud className="w-12 h-12 mb-2 text-blue-400" />
            <p className="text-lg">Drop the file here...</p>
          </div>
        ) : (
          <div className="relative w-full h-full p-2" title="Click to change image">
            {pathname.startsWith("/edit-post") && imageFile && (
              <button
                type="button"
                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full text-xs flex items-center gap-1 cursor-pointer"
                title="Restore to default"
                onClick={async (e) => {
                  e.stopPropagation();
                  setImageUrl(post?.imageUrl || "");
                  setImageFile(null);
                }}>
                <ImageIcon className="w-3 h-3" />
                Restore to default
              </button>
            )}

            <Image
              src={imageUrl}
              alt="Uploaded"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="w-12 h-12 mb-3 text-gray-500" />
          <p className="text-lg font-medium">Drag & drop files here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
        </div>
      )}
    </div>
  )
}

export default UploadFile