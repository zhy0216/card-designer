import React from 'react';
import HeroCardTemplate from './CardTemplates/HeroCardTemplate';
import CreepCardTemplate from './CardTemplates/CreepCardTemplate';
import SpellCardTemplate from './CardTemplates/SpellCardTemplate';

const CardPreviewComponent = ({ card, cardRef, handleImageChange, handleChange, ...props }) => {
  const type = card.cardType?.toLowerCase();
  const handleImgChange = (img) => {
    if (handleChange) {
      handleChange({ target: { name: 'descriptionImage', value: img } });
    }
    if (handleImageChange) handleImageChange(img);
  };
  if (type === 'hero') {
    return <HeroCardTemplate ref={cardRef} card={card} onImageChange={handleImgChange} {...props} />;
  }
  if (type === 'creep') {
    return <CreepCardTemplate ref={cardRef} card={card} onImageChange={handleImgChange} {...props} />;
  }
  if (type === 'spell') {
    return <SpellCardTemplate ref={cardRef} card={card} onImageChange={handleImgChange} {...props} />;
  }
  // fallback
  return <div>暂不支持该卡牌类型的预览</div>;
};

export default CardPreviewComponent;
