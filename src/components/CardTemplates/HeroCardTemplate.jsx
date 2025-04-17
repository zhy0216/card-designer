import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFistRaised, faHeart, faCrop } from '@fortawesome/free-solid-svg-icons';
import useImageCropper from '../../hooks/useImageCropper.jsx';
import { cardColors, CardPreview, CardHeader, CardBody, CardName, CardBottomContainer, DescriptionBox, CardStats, StatBox, StatLabel, StatValue } from './styled.jsx';

const HeroCardTemplate = ({ card }) => {
  const { cropperZone } = useImageCropper({
    initialImage: card.descriptionImage || '',
    onCropComplete: () => {},
  });

  return (
    <CardPreview>
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
        </CardBottomContainer>
      </CardBody>
    </CardPreview>
  );
};

export default HeroCardTemplate;
