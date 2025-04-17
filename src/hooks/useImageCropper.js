import { useState, useCallback, useMemo } from 'react';
import Cropper from 'react-easy-crop';
import React from 'react';

// 通用图片裁剪 hook，返回 cropperElement 组件
export default function useImageCropper({
  initialImage = '',
  aspect = 3/4, // 默认卡牌比例
  onCropComplete,
} = {}) {
  const [image, setImage] = useState(initialImage);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // 裁剪完成后，返回裁剪区域像素
  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 触发实际裁剪（返回blob）
  const getCroppedImage = useCallback(async () => {
    if (!image || !croppedAreaPixels) return null;
    const createImage = (url) => new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
    const getCroppedImg = async (imageSrc, pixelCrop) => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    };
    return await getCroppedImg(image, croppedAreaPixels);
  }, [image, croppedAreaPixels]);

  // 用户确认裁剪
  const confirmCrop = useCallback(async () => {
    const cropped = await getCroppedImage();
    if (onCropComplete) onCropComplete(cropped);
    setShowCropper(false);
    return cropped;
  }, [getCroppedImage, onCropComplete]);

  // 开始裁剪
  const startCrop = useCallback((img) => {
    setImage(img);
    setShowCropper(true);
  }, []);

  // 关闭裁剪
  const cancelCrop = useCallback(() => {
    setShowCropper(false);
    setImage('');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, []);

  // 裁剪弹窗渲染
  const cropperElement = useMemo(() => {
    if (!showCropper) return null;
    return (
      <div style={{
        position: 'absolute',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <div style={{ width: 260, height: 340, background: '#fff', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={confirmCrop} style={{ marginRight: 8 }}>确认裁剪</button>
          <button onClick={cancelCrop}>取消</button>
        </div>
      </div>
    );
  }, [showCropper, image, crop, zoom, aspect, setCrop, setZoom, handleCropComplete, confirmCrop, cancelCrop]);

  return {
    startCrop,
    cropperElement,
    // 其它状态如有需要可暴露
  };
}
