import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFistRaised, faHeart } from '@fortawesome/free-solid-svg-icons';

const grey = "#7f8c8d";

const CardPreview = styled.div`
  width: 300px;
  height: 420px;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CardHeader = styled.div`
  padding: 10px;
  background-color: ${props => {
    switch(props.color) {
      case 'Red': return '#e74c3c';
      case 'Blue': return '#3498db';
      case 'Green': return '#2ecc71';
      default: return '#95a5a6';
    }
  }};
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
  border-top: 1px solid #eee;
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

const CardPreviewComponent = ({ card, cardRef }) => (
  <CardPreview ref={cardRef}>
    <CardHeader color={card.color}>
      {(card.cardType.toLowerCase() === 'spell' || card.cardType.toLowerCase() === 'creep') && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#2c3e50', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: grey, fontWeight: 'bold' }}>{card.manaCost || 0}</div>
        </div>
      )}
      <CardName>{card.name}</CardName>
    </CardHeader>
    <CardBody>
      <CardType>{card.cardType}</CardType>
      {card.description && (
        <div style={{ padding: '10px', fontSize: '14px', flex: 1, overflow: 'auto' }}>
          {card.description}
        </div>
      )}
      {(card.cardType.toLowerCase() === 'hero' || card.cardType.toLowerCase() === 'creep') && (
        <CardStats>
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
    </CardBody>
  </CardPreview>
);

export default CardPreviewComponent;
