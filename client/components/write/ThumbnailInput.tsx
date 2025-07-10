'use client';
import { AppDispatch } from '@/stores/appstore';
import cropAndReturnImage from '@/utils/cropAndReturnImage';
import fireToast from '@/utils/fireToast';
import { Camera, Mouse, Pointer, Upload } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';

const ThumbnailInput = () => {
  const searchParams = useSearchParams();

  const dispatch = useDispatch<AppDispatch>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onDrop = (files: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      fireToast('error', fileRejections[0].errors[0].message, 2000);
      return;
    }
    const file = files[0];
    const src = URL.createObjectURL(file);
    if (!src) {
      fireToast('error', 'Something went wrong', 2000);
      return;
    }
    setImageSrc(src);
  };

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      accept: {
        'image/png': ['.png'],
        'image/jpg': ['.jpg, .jpeg'],
      },
      maxFiles: 1,
      maxSize: 2 * 1024 * 1024, // 2mb
      multiple: false,
      onDrop,
    });

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleUpload = async () => {
    if (croppedArea && imageSrc) {
      const finalImage = await cropAndReturnImage(imageSrc, croppedArea);
      if (finalImage) {
        // dispatch from here
        window.open(URL.createObjectURL(finalImage), '_blank');
      }
    }
  };

  const handleCancel = async () => {
    setCrop({ x: 0, y: 0 });
    setImageSrc(null);
    setZoom(1);
  };

  if (!searchParams.get('pid')) return null;

  return (
    <>
      {imageSrc ? (
        <div className="border-border rounded-lg border p-4">
          <div className="relative h-[250px] w-full sm:h-[400px]">
            <p className="animate-fade-out-delay bg-background/25 pointer-events-none absolute top-1/2 left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-md px-4 py-2 text-center text-xs text-balance backdrop-blur-sm sm:text-sm">
              pinch <Pointer className="inline" size={16} /> or use wheel{' '}
              <Mouse className="inline" size={16} /> to zoom
            </p>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Button
              onClick={handleCancel}
              className="cursor-pointer"
              variant={'secondary'}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} className="cursor-pointer">
              <Upload />
              <span>Upload</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="bg-accent border-border flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-16 hover:brightness-75"
        >
          <input {...getInputProps()} />
          <span>
            <Camera size={32} />
          </span>
          <span className="text-center text-xs text-balance">
            Drag and drop or select thumbnail.
          </span>
        </div>
      )}
    </>
  );
};

export default ThumbnailInput;
