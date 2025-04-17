import { useState, useCallback, useMemo } from 'react';
import Cropper from 'react-easy-crop';
import React from 'react';

// 通用图片裁剪 hook，返回 cropperZone 组件（集成拖拽与裁剪弹窗）
export default function useImageCropper({
  initialImage = '',
  aspect = 3/4, // 默认卡牌比例
  onCropComplete,
  placeholder = null,
} = {}) {
  const [image, setImage] = useState(initialImage);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialImage);

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
    if (cropped) {
      const url = URL.createObjectURL(cropped);
      setPreviewUrl(url);
    }
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

  // 拖拽事件
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      startCrop(url);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    startCrop(url);
  };

  // 集成拖拽和裁剪弹窗的区域
  const cropperZone = useMemo(() => (
    <div
      style={{ position: 'relative', flex: 1, overflow: 'hidden', border: dragActive ? '2px dashed #3498db' : undefined, background: dragActive ? '#eaf6fb' : '#fff', minHeight: 200 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 预览图片层 */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="desc"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2
          }}
          draggable={false}
        />
      )}
      {/* 拖拽提示层 */}
      {dragActive && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(52,152,219,0.15)',
          color: '#3498db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          fontWeight: 600,
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          拖拽图片到这里更换插图
        </div>
      )}
      {/* 文件选择按钮（可选） */}
      <input type="file" accept="image/*" style={{ display: 'none' }} id="hidden-cropper-upload-input" onChange={handleFileChange} />
      {/* 裁剪弹窗 */}
      {showCropper && (
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
      )}
      {/* 可选：自定义占位符 */}
      {!previewUrl && !dragActive && placeholder}
    </div>
  ), [previewUrl, dragActive, showCropper, image, crop, zoom, aspect, setCrop, setZoom, handleCropComplete, confirmCrop, cancelCrop, placeholder]);

  return {
    cropperZone, // 直接渲染这个区域即可，内含拖拽、上传、裁剪
    setPreviewUrl, // 可用于外部设置图片（如重置）
    previewUrl,    // 当前预览图片 url
  };
}
