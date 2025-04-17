import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFistRaised, faHeart } from '@fortawesome/free-solid-svg-icons';
import Cropper from 'react-easy-crop';

const grey = "#7f8c8d";
const cardColors = {
  Red: "#e74c3c",
  Blue: "#3498db",
  Green: "#2ecc71",
  Default: "#95a5a6"
};

const CardPreview = styled.div`
  width: 300px;
  height: 420px;
  position: relative;
  border-radius: 30px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 10px;
  background-color: ${({ color }) => cardColors[color] || cardColors.Default};
  color: white;
  text-align: center;
`;

const CardBody = styled.div`
  background-color: #fff;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
`;

const CardName = styled.h2`
  margin: 0;
  font-size: 24px;
  text-align: center;
`;

const CardType = styled.div`
  font-size: 16px;
  color: ${grey};
  margin-bottom: 10px;
  text-align: center;
`;

const CardStats = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid ${({ color }) => cardColors[color] || cardColors.Default};
`;

const StatBox = styled.div`
  display: flex;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.type === 'attack' ? '#e74c3c' : '#3498db'};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${grey};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardBottomContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  /* 高斯模糊背景 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.55);
`;

const DescriptionBox = styled.div`
  padding: 10px;
  font-size: 14px;
  color: #333;
  white-space: pre-line;
  border-radius: 0 0 8px 8px;
  margin-bottom: 2px;
  pointer-events: auto;
`;

const ImageLayer = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const DragHint = styled.div`
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  font-size: 20px;
  font-weight: bold;
  z-index: 20;
  pointer-events: none;
`;

const CardPreviewComponent = ({ card, cardRef, handleChange }) => {
  const defaultSize = { width: 150, height: 150 };
  const defaultPosition = { x: 75, y: 120 };
  const [frame] = React.useState({
    x: (card.descriptionImagePosition && card.descriptionImagePosition.x) || defaultPosition.x,
    y: (card.descriptionImagePosition && card.descriptionImagePosition.y) || defaultPosition.y,
    width: (card.descriptionImageSize && card.descriptionImageSize.width) || defaultSize.width,
    height: (card.descriptionImageSize && card.descriptionImageSize.height) || defaultSize.height,
  });
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [showCrop, setShowCrop] = React.useState(false);
  const [cropImage, setCropImage] = React.useState(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => {
        setCropImage(ev.target.result);
        setShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }, 'image/png');
    });
  };

  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', error => reject(error));
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
  }

  const onCropComplete = React.useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (cropImage && croppedAreaPixels) {
      const cropped = await getCroppedImg(cropImage, croppedAreaPixels);
      handleChange({ target: { name: 'descriptionImage', value: cropped } });
      setShowCrop(false);
      setCropImage(null);
    }
  };

  return (
    <CardPreview
      ref={cardRef}
      style={{ position: 'relative', border: isDragOver ? '2px dashed #3498db' : undefined, transition: 'border 0.2s' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* 拖拽提示，仅在无图片时显示 */}
      {!card.descriptionImage && (
        <DragHint>
          拖拽图片到此处上传
        </DragHint>
      )}
      {showCrop && cropImage && (
          <div style={{
            position: 'absolute',
            zIndex: 100,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ position: 'relative', width: 260, height: 260, background: '#222', borderRadius: 8, overflow: 'hidden', zIndex: 2 }}>
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                minZoom={1}
                maxZoom={3}
              />
            </div>
            <div style={{ marginTop: 20, zIndex: 3, background: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '10px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                style={{ width: 180 }}
              />
            </div>
          <div style={{ marginTop: 16, zIndex: 3, background: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '10px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', display: 'flex', gap: 12 }}>
            <button onClick={handleCropConfirm} style={{ marginRight: 10, padding: '8px 18px', borderRadius: 4, background: '#3498db', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>确认裁剪</button>
            <button onClick={() => { setShowCrop(false); setCropImage(null); }} style={{ padding: '8px 18px', borderRadius: 4, background: '#eee', color: '#333', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>取消</button>          </div>
        </div>
      )}
      <CardHeader color={card.color}>
        {(card.cardType.toLowerCase() === 'spell' || card.cardType.toLowerCase() === 'creep') && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#2c3e50', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: grey, fontWeight: 'bold' }}>{card.manaCost || 0}</div>
          </div>
        )}
        <CardName>{card.name}</CardName>
      </CardHeader>
      <CardBody style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <ImageLayer>
          {card.descriptionImage && (
            <img
              src={card.descriptionImage}
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
        </ImageLayer>
        <CardBottomContainer>
          {card.description && (
            <DescriptionBox>
              {card.description}
            </DescriptionBox>
          )}
          {(card.cardType.toLowerCase() === 'hero' || card.cardType.toLowerCase() === 'creep') && (
            <CardStats color={card.color}>
              <StatBox>
                <StatLabel>
                  <FontAwesomeIcon icon={faFistRaised} />
                </StatLabel>
                <StatValue type="attack">{card.attack || 0}</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>
                  <FontAwesomeIcon icon={faHeart} />
                </StatLabel>
                <StatValue type="health">{card.health || 0}</StatValue>
              </StatBox>
            </CardStats>
          )}
        </CardBottomContainer>
      </CardBody>
    </CardPreview>
  );
};

export default CardPreviewComponent;
