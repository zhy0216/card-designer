import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// 样式组件
const DesignerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
      case 'Yellow': return '#f1c40f';
      case 'Purple': return '#9b59b6';
      default: return '#95a5a6';
    }
  }};
  color: white;
  text-align: center;
`;

const CardBody = styled.div`
  padding: 15px;
  background-color: #fff;
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
`;

const CardName = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
  text-align: center;
`;

const CardType = styled.div`
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 10px;
  text-align: center;
`;

const CardRarity = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
  text-align: center;
  font-style: italic;
`;

const CardStats = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.type === 'attack' ? '#e74c3c' : '#3498db'};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #7f8c8d;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #2980b9;
  }
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
    rarity: "Rare",
    color: "Red",
    attack: 7,
    health: 11
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
    if (name === 'attack' || name === 'health' || name === 'id') {
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

  return (
    <DesignerContainer>
      <EditorPanel>
        <h2>卡牌编辑器</h2>
        
        <FormGroup>
          <Label htmlFor="id">ID</Label>
          <Input 
            type="number" 
            id="id" 
            name="id" 
            value={card.id} 
            onChange={handleChange} 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="name">名称</Label>
          <Input 
            type="text" 
            id="name" 
            name="name" 
            value={card.name} 
            onChange={handleChange} 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="cardType">卡牌类型</Label>
          <Select 
            id="cardType" 
            name="cardType" 
            value={card.cardType} 
            onChange={handleChange}
          >
            <option value="Hero">英雄</option>
            <option value="Spell">法术</option>
            <option value="Minion">随从</option>
            <option value="Weapon">武器</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="rarity">稀有度</Label>
          <Select 
            id="rarity" 
            name="rarity" 
            value={card.rarity} 
            onChange={handleChange}
          >
            <option value="Common">普通</option>
            <option value="Rare">稀有</option>
            <option value="Epic">史诗</option>
            <option value="Legendary">传说</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="color">颜色</Label>
          <Select 
            id="color" 
            name="color" 
            value={card.color} 
            onChange={handleChange}
          >
            <option value="Red">红色</option>
            <option value="Blue">蓝色</option>
            <option value="Green">绿色</option>
            <option value="Yellow">黄色</option>
            <option value="Purple">紫色</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="attack">攻击力</Label>
          <Input 
            type="number" 
            id="attack" 
            name="attack" 
            value={card.attack} 
            onChange={handleChange} 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="health">生命值</Label>
          <Input 
            type="number" 
            id="health" 
            name="health" 
            value={card.health} 
            onChange={handleChange} 
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button onClick={exportAsPNG}>导出PNG</Button>
          <Button onClick={exportAsJSON}>导出JSON</Button>
          <Button onClick={exportAsZIP}>导出ZIP</Button>
          <Button onClick={resetToDefault}>重置</Button>
        </ButtonGroup>
      </EditorPanel>
      
      <PreviewPanel>
        <CardPreview ref={cardRef}>
          <CardHeader color={card.color}>
            <CardName>{card.name}</CardName>
          </CardHeader>
          <CardBody>
            <CardType>{card.cardType}</CardType>
            <CardRarity>{card.rarity}</CardRarity>
            <CardStats>
              <StatBox>
                <StatValue type="attack">{card.attack}</StatValue>
                <StatLabel>攻击</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue type="health">{card.health}</StatValue>
                <StatLabel>生命</StatLabel>
              </StatBox>
            </CardStats>
          </CardBody>
        </CardPreview>
      </PreviewPanel>
    </DesignerContainer>
  );
};

export default CardDesigner;