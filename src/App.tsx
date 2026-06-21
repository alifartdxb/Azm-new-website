/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { GenericPage } from "./pages/GenericPage";
import { SitemapViewer } from "./pages/SitemapViewer";
import { VadoCollection } from "./pages/VadoCollection";
import { ProductDetail } from "./pages/ProductDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:sku" element={<ProductDetail />} />
          <Route path="vado-collection" element={<VadoCollection />} />
          <Route path="sitemap" element={<SitemapViewer />} />
          
          {/* Catch-all generic route for mockups */}
          <Route path="*" element={<GenericPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


