"use client"
import React, { useState } from 'react';
import Image from 'next/image';

const CloudinaryUploader = ({ onUpload, previewClassName = "" }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        onUpload(data.secure_url);
      }
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleImageUpload}
        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
      />

      {loading && <p className="text-blue-500">Uploading...</p>}

      {preview && !loading && (
        <Image
          src={preview}
          alt="Preview"
          width={500}
          height={500}
          className={previewClassName}
        />
      )}
    </div>
  );
};

export default CloudinaryUploader;
