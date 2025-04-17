import styled from '@emotion/styled';

export const cardColors = {
  Red: '#e74c3c',
  Blue: '#3498db',
  Green: '#2ecc71',
  Default: '#95a5a6',
};

export const CardPreview = styled.div`
  width: 300px;
  height: 420px;
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid whitesmoke;
`;

export const CardHeader = styled.div`
  padding: 10px;
  background-color: ${({ color }) => cardColors[color] || cardColors.Default};
  color: white;
  text-align: center;
`;

export const CardBody = styled.div`
  background-color: #fff;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
`;

export const CardName = styled.h2`
  margin: 0;
  font-size: 24px;
`;

export const CardBottomContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  backdrop-filter: blur(10px);
  background-color: rgba(255,255,255,0.55);
`;

export const DescriptionBox = styled.div`
  padding: 10px;
  height: fit-content;
  font-size: 14px;
  color: white;
  white-space: pre-line;
  border-radius: 0 0 8px 8px;
  margin-bottom: 2px;
  pointer-events: auto;
`;

export const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid ${({ color }) => cardColors[color] || cardColors.Default};
  background-color:${({ color }) => cardColors[color] || cardColors.Default};
`;

export const StatBox = styled.div`
  display: flex;
  align-items: center;
`;

export const StatLabel = styled.span`
  margin-right: 4px;
`;

export const StatValue = styled.span`
  font-weight: bold;
  font-size: 18px;
  margin-left: 2px;
  color: white;
`;

// 可继续在这里添加其它通用样式组件
