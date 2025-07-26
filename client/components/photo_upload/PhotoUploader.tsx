'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { close, selectPhotoState } from '@/reducers/photoReducer';
import { AppDispatch } from '@/stores/appstore';
import fireToast from '@/utils/fireToast';
import { Camera, Loader, Mouse, Pointer, X } from 'lucide-react';

import cropAndReturnImage from '@/utils/cropAndReturnImage';
import { useEffect, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';

const PhotoUploader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { open, title, description, aspectRatio, action, loading, errors } =
    useSelector(selectPhotoState);

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
        action && action(finalImage);
      }
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    dispatch(close());
  };

  useEffect(() => {
    if (open === false) {
      handleClose();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) {
          handleClose();
        }
      }}
    >
      <form>
        <DialogContent className="sm:max-w-[768px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {errors && (
            <div className="border-destructive bg-destructive/10 text-destructive w-full rounded-lg px-3 py-2">
              {errors.map((el) => (
                <p className="flex items-start justify-start space-x-1">
                  <X size={16} className="mt-[3px]" />
                  <span>{el.msg}</span>
                </p>
              ))}
            </div>
          )}
          <div className="">
            {imageSrc ? (
              <div className="relative h-[250px] w-full sm:h-[400px]">
                <p className="animate-fade-out-delay bg-background/25 pointer-events-none absolute top-1/2 left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-md px-4 py-2 text-center text-xs text-balance backdrop-blur-sm sm:text-sm">
                  pinch <Pointer className="inline" size={16} /> or use wheel{' '}
                  <Mouse className="inline" size={16} /> to zoom
                </p>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="bg-background/50 border-border flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-16"
              >
                <input {...getInputProps()} />
                <span>
                  <Camera size={32} />
                </span>
                <span className="text-center text-xs text-balance">
                  Drag and drop or select picture.
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {imageSrc && (
              <Button onClick={handleUpload}>
                {!loading ? 'Upload' : <Loader className="animate-spin" />}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
export default PhotoUploader;
