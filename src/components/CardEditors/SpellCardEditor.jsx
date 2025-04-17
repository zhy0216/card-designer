import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

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
  margin-right: 6px;
  color: #f1c40f;
  font-size: 18px;
  vertical-align: middle;
`;

// 法术卡牌编辑器组件
const SpellCardEditor = ({ card, handleChange }) => {
  return (
    <>
      <FormGroup>
        <Label htmlFor="manaCost">
          <IconWrapper>
            <FontAwesomeIcon icon={faBolt} />
          </IconWrapper>
          法力值
        </Label>
        <Input 
          type="number" 
          id="manaCost" 
          name="manaCost" 
          value={card.manaCost || 0} 
          onChange={handleChange} 
        />
      </FormGroup>
    </>
  );
};

export default SpellCardEditor;