import React from 'react';
import styled from '@emotion/styled';

// 样式组件
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


const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
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
        <Label htmlFor="description">描述</Label>
        <TextArea
          id="description"
          name="description"
          value={card.description || ''}
          onChange={handleChange}
        />
      </FormGroup>
    </>
  );
};

export default BaseCardEditor;