import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFistRaised, faHeart } from '@fortawesome/free-solid-svg-icons';

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

const IconWrapper = styled.span`
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
`;

// 英雄卡牌编辑器组件
const HeroCardEditor = ({ card, handleChange }) => {
  return (
    <>
      <FormGroup>
        <Label htmlFor="attack">
          <IconWrapper>
            <FontAwesomeIcon icon={faFistRaised} />
          </IconWrapper>
          攻击力
        </Label>
        <Input 
          type="number" 
          id="attack" 
          name="attack" 
          value={card.attack || 0} 
          onChange={handleChange} 
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="health">
          <IconWrapper>
            <FontAwesomeIcon icon={faHeart} />
          </IconWrapper>
          生命值
        </Label>
        <Input 
          type="number" 
          id="health" 
          name="health" 
          value={card.health || 0} 
          onChange={handleChange} 
        />
      </FormGroup>
    </>
  );
};

export default HeroCardEditor;