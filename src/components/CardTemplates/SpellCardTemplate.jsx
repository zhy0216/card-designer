import React, { forwardRef } from 'react';
import useImageCropper from '../../hooks/useImageCropper.jsx';
import { cardColors, CardPreview, CardHeader, CardBody, CardName, CardBottomContainer, DescriptionBox, ManaCostCircle } from './styled.jsx';

const SpellCardTemplate = forwardRef(({ card, onImageChange }, ref) => {
  const { cropperZone } = useImageCropper({
    initialImage: card.descriptionImage || '',
    onCropComplete: () => {},
    onCropConfirm: (croppedImg) => {
      if (onImageChange) onImageChange(croppedImg);
    },
  });

  return (
    <CardPreview ref={ref}>
      <CardHeader color={card.color}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 法力值展示 */}
          <ManaCostCircle>{card.manaCost || 0}</ManaCostCircle>
          <CardName>{card.name}</CardName>
        </div>
      </CardHeader>
      <CardBody style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {cropperZone}
        <CardBottomContainer>
          {card.description && (
            <DescriptionBox>
              {card.description}
            </DescriptionBox>
          )}
        </CardBottomContainer>
      </CardBody>
    </CardPreview>
  );
});

export default SpellCardTemplate;
