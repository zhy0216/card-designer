import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

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