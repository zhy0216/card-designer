import React from 'react';
import styled from '@emotion/styled';
import HeroCardTemplate from './CardTemplates/HeroCardTemplate';
import CreepCardTemplate from './CardTemplates/CreepCardTemplate';
import SpellCardTemplate from './CardTemplates/SpellCardTemplate';

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

const CardPreviewComponent = ({ card, cardRef, ...props }) => {
  const type = card.cardType?.toLowerCase();
  if (type === 'hero') {
    return <HeroCardTemplate ref={cardRef} card={card} {...props} />;
  }
  if (type === 'creep') {
    return <CreepCardTemplate ref={cardRef} card={card} {...props} />;
  }
  if (type === 'spell') {
    return <SpellCardTemplate ref={cardRef} card={card} {...props} />;
  }
  // fallback
  return <div>暂不支持该卡牌类型的预览</div>;
};

export default CardPreviewComponent;
