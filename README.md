# Card Designer

使用 Trae + sonnet 3.7 生成的基于 React + Vite 的卡牌游戏生成工具。



## 开发环境设置

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 构建生产版本：

```bash
npm run build
```

## 项目结构

```plaintext
src/
  ├── components/     # React 组件
  ├── assets/        # 静态资源
  ├── styles/        # 样式文件
  ├── utils/         # 工具函数
  └── App.jsx        # 应用入口
```

## 功能特性

- 卡片设计（支持图片上传、裁剪、描述与属性编辑）
- 实时预览（所见即所得，图片铺满卡面）
- 图片裁剪（集成 react-easy-crop，上传后可直接裁剪图片）
- 导出功能
- 响应式布局

## 技术栈与依赖

- React 19
- Vite 6
- Emotion（CSS-in-JS）
- FontAwesome（图标）
- react-easy-crop（图片裁剪）
- 其它详见 package.json

## 开发规范     

- 遵循 ESLint 规则
- 使用 Prettier 进行代码格式化

## 许可证

[MIT](LICENSE)
