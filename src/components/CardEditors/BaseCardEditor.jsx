import React from 'react';
import styled from '@emotion/styled';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// 样式组件
const FormGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  display: inline-block;
  min-width: 70px;
  margin-bottom: 0;
  margin-right: 10px;
  font-weight: bold;
  text-align: right;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  flex: 1;
`;

// 基础卡牌编辑器组件
const BaseCardEditor = ({ card, handleChange }) => {
  return (
    <>
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
          <option value="Creep">随从</option>
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
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="attack">攻击</Label>
        <Input
          type="number"
          id="attack"
          name="attack"
          value={card.attack || 0}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="health">生命值</Label>
        <Input
          type="number"
          id="health"
          name="health"
          value={card.health || 0}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="description">描述</Label>
        <TextArea
          id="description"
          name="description"
          value={card.description || ''}
          onChange={handleChange}
        />
        {/* 拖拽上传图片区域 */}
        <div style={{ marginTop: 10 }}>
          <ImageDropArea
            image={card.descriptionImage}
            onImageChange={img => handleChange({ target: { name: 'descriptionImage', value: img } })}
          />
        </div>
      </FormGroup>
    </>
  );
};

// 拖拽上传、移动、缩放图片组件
const ImageDropArea = ({ image, onImageChange }) => {
  const fileInputRef = React.useRef();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [size, setSize] = React.useState({ width: 150, height: 150 });

  const handleDrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => onImageChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = e => e.preventDefault();

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => onImageChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        border: '1px dashed #bbb',
        borderRadius: 4,
        minHeight: 120,
        position: 'relative',
        background: '#fafafa',
        textAlign: 'center',
        overflow: 'hidden',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {!image && <div style={{ padding: 40, color: '#aaa' }}>拖拽图片到此或点击上传</div>}
      {image && (
        <Draggable
          position={position}
          onStop={(_, data) => setPosition({ x: data.x, y: data.y })}
        >
          <ResizableBox
            width={size.width}
            height={size.height}
            minConstraints={[60, 60]}
            maxConstraints={[400, 400]}
            onResize={(_, { size }) => setSize(size)}
            resizeHandles={['se']}
          >
            <img
              src={image}
              alt="desc"
              style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
              draggable={false}
            />
          </ResizableBox>
        </Draggable>
      )}
    </div>
  );
};

export default BaseCardEditor;