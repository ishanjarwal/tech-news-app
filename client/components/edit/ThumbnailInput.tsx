'use client';
import {
  removeThumbnail,
  selectPostState,
  uploadThumbnail,
  uploadThumbnailTemp,
} from '@/reducers/postReducer';
import { AppDispatch } from '@/stores/appstore';
import cropAndReturnImage from '@/utils/cropAndReturnImage';
import fireToast from '@/utils/fireToast';
import {
  Camera,
  Loader,
  Mouse,
  Pen,
  Pointer,
  Trash,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import { MouseEventHandler, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import Tooltip from '../common/Tooltip';

const ThumbnailInput = ({
  id,
  postImage,
}: {
  id: string;
  postImage?: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(selectPostState);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [existingImage, setExistingImage] = useState<string | undefined>(
    postImage
  );

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

  const handleUpload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (croppedArea && imageSrc) {
      const finalImage = await cropAndReturnImage(imageSrc, croppedArea);
      if (finalImage) {
        // update the thumbnail
        const result = await dispatch(
          uploadThumbnail({ id, photo: finalImage })
        );
        if (uploadThumbnail.fulfilled.match(result)) {
          setExistingImage(result.payload.data.url);
          setCrop({ x: 0, y: 0 });
          setImageSrc(null);
          setZoom(1);
        }
      }
    }
  };

  const handleRemoveThumbnail = async () => {
    const result = await dispatch(removeThumbnail({ id }));
    if (removeThumbnail.fulfilled.match(result)) {
      setExistingImage(undefined);
      setCrop({ x: 0, y: 0 });
      setImageSrc(null);
      setZoom(1);
    }
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setCrop({ x: 0, y: 0 });
    setImageSrc(null);
    setZoom(1);
  };

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
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Button
              disabled={loading}
              onClick={handleCancel}
              className="cursor-pointer"
              variant={'secondary'}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} className="cursor-pointer">
              {!loading ? (
                <>
                  {' '}
                  <Upload />
                  <span>Upload</span>
                </>
              ) : (
                <Loader className="animate-spin" />
              )}
            </Button>
          </div>
        </div>
      ) : !existingImage ? (
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
      ) : (
        <div className="relative">
          <div className="absolute top-0 right-0 z-[2] flex overflow-hidden rounded-tr-lg rounded-bl-xl">
            <Tooltip content="Remove thumbnail">
              <Button
                type="button"
                onClick={handleRemoveThumbnail}
                className="cursor-pointer rounded-none"
                variant={'destructive'}
                size={'lg'}
              >
                <Trash />
              </Button>
            </Tooltip>
          </div>
          <div
            {...getRootProps()}
            className="bg-accent border-border group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed"
          >
            <Image
              src={existingImage}
              alt="thumbnail"
              width={400}
              height={300}
              className="h-full w-full object-cover object-center duration-100 group-hover:brightness-50"
            />
            <input {...getInputProps()} />
            <div className="pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
              <span>
                <Camera size={32} />
              </span>
              <span className="text-center text-xs text-balance">
                Drag and drop or select to change.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThumbnailInput;
