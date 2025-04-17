import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFistRaised, faHeart, faCrop } from '@fortawesome/free-solid-svg-icons';
import useImageCropper from '../../hooks/useImageCropper.jsx';
import { cardColors, CardPreview, CardHeader, CardBody, CardName, CardBottomContainer, DescriptionBox, CardStats, StatBox, StatLabel, StatValue, ManaCostCircle } from './styled.jsx';

const CreepCardTemplate = forwardRef(({ card, onImageChange }, ref) => {
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
          <CardStats color={card.color}>
            <StatBox>
              <StatLabel>
                <FontAwesomeIcon color='white' icon={faFistRaised} />
              </StatLabel>
              <StatValue type="attack">{card.attack || 0}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>
                <FontAwesomeIcon color='white' icon={faHeart} />
              </StatLabel>
              <StatValue type="health">{card.health || 0}</StatValue>
            </StatBox>
          </CardStats>
        </CardBottomContainer>
      </CardBody>
    </CardPreview>
  );
});

export default CreepCardTemplate;
