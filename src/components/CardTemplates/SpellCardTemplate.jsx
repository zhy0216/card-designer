import React, { forwardRef } from 'react';
import useImageCropper from '../../hooks/useImageCropper.jsx';
import { cardColors, CardPreview, CardHeader, CardBody, CardName, CardBottomContainer, DescriptionBox } from './styled.jsx';

const SpellCardTemplate = forwardRef(({ card }, ref) => {
  const { cropperZone } = useImageCropper({
    initialImage: card.descriptionImage || '',
    onCropComplete: () => {},
  });

  return (
    <CardPreview ref={ref}>
      <CardHeader color={card.color}>
        <CardName>{card.name}</CardName>
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
