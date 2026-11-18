import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App page="home" />} />
        <Route path="/products" element={<App page="products" />} />
        <Route path="/product/:productSlug" element={<ProductRoute />} />
        <Route path="*" element={<App page="product" productSlug="not-found" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

function ProductRoute() {
  const { productSlug } = useParams()
  return <App page="product" productSlug={productSlug} />
}
