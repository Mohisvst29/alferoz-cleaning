'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function FileUploader({ 
  value, 
  onChange, 
  label = "upload", 
  accept = "image/*", 
  aspectRatio = "1/1" 
}: { 
  value: string; 
  onChange: (url: string) => void; 
  label?: string;
  accept?: string;
  aspectRatio?: string;
}) {

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isVideo = accept?.includes('video');

  const maxSizeBytes =
    isVideo
      ? 100 * 1024 * 1024
      : 5 * 1024 * 1024;

  const handleUpload = async (file: File) => {

    if (file.size > maxSizeBytes) {

      alert(
        `حجم الملف كبير جداً`
      );

      return;

    }

    setIsUploading(true);

    try {

      const formData =
        new FormData();

      formData.append(
        'file',
        file
      );

      const res =
        await fetch(
          '/api/upload',
          {
            method: 'POST',
            body: formData
          }
        );

      const data =
        await res.json();

      if (
        res.ok &&
        data.url
      ) {

        onChange(
          data.url
        );

      }

    } catch (err) {

      console.error(err);

    } finally {

      setIsUploading(false);

    }

  };

  const onDrop =
    useCallback(
      (e: React.DragEvent) => {

        e.preventDefault();

        setIsDragging(false);

        const file =
          e.dataTransfer.files[0];

        if (file)
          handleUpload(file);

      },
      []
    );

  return (

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >

      <label>

        {label}

      </label>


      <div

        onDragOver={e => {

          e.preventDefault();

          setIsDragging(true);

        }}

        onDragLeave={() =>
          setIsDragging(false)
        }

        onDrop={onDrop}

        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          border: '2px dashed #ccc',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden'
        }}

        onClick={() =>
          document
            .getElementById(
              `upload-${label}`
            )
            ?.click()
        }

      >

        {value ? (

          <Image
            src={value}
            alt="preview"
            fill
            style={{
              objectFit:
                'contain'
            }}
          />

        ) : (

          <Upload />

        )}

        <input

          id={`upload-${label}`}

          hidden

          type="file"

          accept={accept}

          onChange={e =>

            e.target.files?.[0] &&

            handleUpload(

              e.target.files[0]

            )

          }

        />

      </div>

    </div>

  );

}
