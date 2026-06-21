/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";

const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const Products = lazy(() => import("./pages/Products").then(module => ({ default: module.Products })));
const GenericPage = lazy(() => import("./pages/GenericPage").then(module => ({ default: module.GenericPage })));
const SitemapViewer = lazy(() => import("./pages/SitemapViewer").then(module => ({ default: module.SitemapViewer })));
const VadoCollection = lazy(() => import("./pages/VadoCollection").then(module => ({ default: module.VadoCollection })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(module => ({ default: module.ProductDetail })));
const Contact = lazy(() => import("./pages/Contact").then(module => ({ default: module.Contact })));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts").then(module => ({ default: module.AdminProducts })));
const AdminGeneric = lazy(() => import("./pages/admin/AdminGeneric").then(module => ({ default: module.AdminGeneric })));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-stone-200 border-t-brand-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="brands" element={<AdminGeneric />} />
            <Route path="categories" element={<AdminGeneric />} />
            <Route path="projects" element={<AdminGeneric />} />
            <Route path="blogs" element={<AdminGeneric />} />
            <Route path="media" element={<AdminGeneric />} />
            <Route path="seo" element={<AdminGeneric />} />
            <Route path="catalogs" element={<AdminGeneric />} />
            <Route path="leads" element={<AdminGeneric />} />
            <Route path="users" element={<AdminGeneric />} />
          </Route>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:sku" element={<ProductDetail />} />
            <Route path="vado-collection" element={<VadoCollection />} />
            <Route path="sitemap" element={<SitemapViewer />} />
            <Route path="contact" element={<Contact />} />
            
            {/* Catch-all generic route for mockups */}
            <Route path="*" element={<GenericPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


