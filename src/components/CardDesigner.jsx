import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFistRaised, faHeart, faBolt } from '@fortawesome/free-solid-svg-icons';
import { BaseCardEditor, HeroCardEditor, SpellCardEditor, CreepCardEditor } from './CardEditors';


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
      // case 'Yellow': return '#f1c40f';
      // case 'Purple': return '#9b59b6';
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

const ButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
`;

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
    description: "Axe is a powerful weapon that can be used to cut through enemies."
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

  // 保存卡牌数据到本地存储
  useEffect(() => {
    localStorage.setItem('cardData', JSON.stringify(card));
  }, [card]);

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

  // 导出为JSON
  const exportAsJSON = () => {
    const jsonString = JSON.stringify(card, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${card.name.replace(/\s+/g, '_')}_card.json`);
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

  // 根据卡牌类型渲染对应的编辑器组件
  const renderCardTypeEditor = () => {
    switch(card.cardType.toLowerCase()) {
      case 'hero':
        return <HeroCardEditor card={card} handleChange={handleChange} />;
      case 'spell':
        return <SpellCardEditor card={card} handleChange={handleChange} />;
      case 'creep':
        return <CreepCardEditor card={card} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  // 根据卡牌类型渲染预览
  const renderCardPreview = () => {
    // 基础卡牌预览
    return (
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
  };

  return (
    <DesignerContainer>
      <PreviewPanel>
        {renderCardPreview()}
      </PreviewPanel>
      
      <EditorPanel>
        <h2>卡牌编辑器</h2>
        
        <BaseCardEditor card={card} handleChange={handleChange} />
        
        {renderCardTypeEditor()}
        
        <ButtonGroup>
          <Button onClick={exportAsPNG}>导出PNG</Button>
          <Button onClick={exportAsJSON}>导出JSON</Button>
          <Button onClick={exportAsZIP}>导出ZIP</Button>
          <Button onClick={resetToDefault}>重置</Button>
        </ButtonGroup>
      </EditorPanel>
    </DesignerContainer>
  );
};

export default CardDesigner;