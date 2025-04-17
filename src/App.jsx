import React from 'react'
import './App.css'
import CardDesigner from './components/CardDesigner'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>卡牌设计器</h1>
      </header>
      <main>
        <CardDesigner />
      </main>
      <footer>
        <p>卡牌设计器 - 可以编辑卡牌并导出为SVG、JSON或ZIP</p>
      </footer>
    </div>
  )
}

export default App
