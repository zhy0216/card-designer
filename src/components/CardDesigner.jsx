import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { BaseCardEditor, HeroCardEditor, SpellCardEditor, CreepCardEditor } from './CardEditors';
import CardPreview from './CardPreview';

const grey = "#7f8c8d"
// 样式组件
const DesignerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EditorPanel = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PreviewPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;


const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 18px;
  margin-right: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background-color: #217dbb;
  }
`;

// 卡牌类型字段模板
const defaultFields = {
  Hero: { attack: 0, health: 0, description: '', color: 'Red', name: '', id: 0, descriptionImage: '' },
  Creep: { attack: 0, health: 0, manaCost: 0, description: '', color: 'Red', name: '', id: 0, descriptionImage: '' },
  Spell: { manaCost: 0, description: '', color: 'Blue', name: '', id: 0, descriptionImage: '' },
};

// 卡牌设计器组件
const CardDesigner = () => {
  // 默认卡牌数据
  const defaultCard = {
    id: 21,
    name: "Axe",
    cardType: "Hero",
    color: "Red",
    attack: 7,
    health: 11,
    description: "Axe is a powerful weapon that can be used to cut through enemies.",
    descriptionImage: ''
  };

  // 状态管理
  const [card, setCard] = useState(defaultCard);
  const cardRef = useRef(null);

  // 从本地存储加载卡牌数据
  useEffect(() => {
    const savedCard = localStorage.getItem('cardData');
    if (savedCard) {
      try {
        setCard(JSON.parse(savedCard));
      } catch (e) {
        console.error('Failed to parse saved card data', e);
      }
    }
  }, []);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    // 对数字类型的字段进行转换
    if (name === 'attack' || name === 'health' || name === 'id' || name === 'manaCost') {
      processedValue = parseInt(value) || 0;
    }
    setCard({
      ...card,
      [name]: processedValue
    });
  };

  // 处理类型切换
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setCard(prev => {
      // 保留图片字段（descriptionImage）
      const image = prev.descriptionImage;
      // 合并新类型默认字段和已有字段
      const merged = {
        ...defaultFields[newType],
        ...prev,
        cardType: newType,
      };
      // 强制保留图片字段（避免 undefined 覆盖）
      if (image) merged.descriptionImage = image;
      return merged;
    });
  };

  // 编辑器渲染
  function renderCardTypeEditor() {
    switch(card.cardType) {
      case 'Hero':
        return <HeroCardEditor card={card} handleChange={handleChange} />;
      case 'Creep':
        return <CreepCardEditor card={card} handleChange={handleChange} />;
      case 'Spell':
        return <SpellCardEditor card={card} handleChange={handleChange} />;
      default:
        return null;
    }
  }

  // 导出为PNG
  const exportAsPNG = async () => {
    if (cardRef.current === null) {
      return;
    }
    
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
      saveAs(dataUrl, `${card.name.replace(/\s+/g, '_')}_card.png`);
    } catch (error) {
      console.error('Error exporting card as PNG:', error);
    }
  };

  // 导出为JSON（过滤图片字段）
  const exportAsJSON = () => {
    // 过滤掉 descriptionImage 字段
    const { descriptionImage, ...exportCard } = card;
    const blob = new Blob([JSON.stringify(exportCard, null, 2)], { type: 'application/json' });
    saveAs(blob, `${card.name || 'card'}.json`);
  };

  // 导出为ZIP（包含SVG和JSON）
  const exportAsZIP = async () => {
    if (cardRef.current === null) {
      return;
    }
    
    try {
      const zip = new JSZip();
      
      // 添加JSON文件
      const jsonString = JSON.stringify(card, null, 2);
      zip.file(`${card.name.replace(/\s+/g, '_')}_card.json`, jsonString);
      
      // 添加PNG文件
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
      const pngData = dataUrl.split(',')[1];
      zip.file(`${card.name.replace(/\s+/g, '_')}_card.png`, pngData, {base64: true});
      
      // 生成并下载ZIP
      const content = await zip.generateAsync({type: 'blob'});
      saveAs(content, `${card.name.replace(/\s+/g, '_')}_card_package.zip`);
    } catch (error) {
      console.error('Error exporting as ZIP:', error);
    }
  };

  // 重置为默认值
  const resetToDefault = () => {
    setCard(defaultCard);
  };

  return (
    <DesignerContainer>
      <PreviewPanel>
        <CardPreview card={card} cardRef={cardRef} handleChange={handleChange} />
      </PreviewPanel>
      <EditorPanel>
        <h2>卡牌编辑器</h2>
        <BaseCardEditor card={card} handleChange={handleChange} />
        {/* 类型选择器 */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 8 }}>卡牌类型：</label>
          <select value={card.cardType} onChange={handleTypeChange}>
            <option value="Hero">英雄</option>
            <option value="Creep">随从</option>
            <option value="Spell">法术</option>
          </select>
        </div>
        {renderCardTypeEditor()}
        <ButtonGroup>
          <Button onClick={exportAsPNG}>导出PNG</Button>
          <Button onClick={exportAsJSON}>导出JSON</Button>
          <Button onClick={exportAsZIP}>导出ZIP</Button>
        </ButtonGroup>
      </EditorPanel>
    </DesignerContainer>
  );
};

export default CardDesigner;