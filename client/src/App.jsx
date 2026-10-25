import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import { RatesProvider } from "./context/RatesContext";
import { SiteConfigProvider } from "./context/SiteConfigContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingSocial from "./components/FloatingSocial";

const HomePage = lazy(() => import("./pages/HomePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const LiveRatePage = lazy(() => import("./pages/LiveRatePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminHeroImages = lazy(() => import("./pages/admin/AdminHeroImages"));
const AdminRates = lazy(() => import("./pages/admin/AdminRates"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <Header />
    <main className="flex-1">
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
    <FloatingSocial />
  </div>
);

const AdminWelcome = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Admin Panel</h2>
    <p className="text-gray-500 mb-6">Select an option from the sidebar to get started.</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
      {[
        { label: "Products", desc: "Add & manage products", color: "amber" },
        { label: "Categories", desc: "Organize collections", color: "blue" },
        { label: "Hero Images", desc: "Homepage slider", color: "green" },
        { label: "Rates", desc: "Gold & silver prices", color: "yellow" },
        { label: "Settings", desc: "Store information", color: "purple" },
      ].map((item) => (
        <div key={item.label} className={`p-4 bg-${item.color}-50 rounded-xl`}>
          <h3 className="font-semibold text-gray-800">{item.label}</h3>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <SiteConfigProvider>
          <RatesProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:productId" element={<ProductDetailsPage />} />
                  <Route path="/live-rate" element={<LiveRatePage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Route>

                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminWelcome />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="hero-images" element={<AdminHeroImages />} />
                  <Route path="rates" element={<AdminRates />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Page not found</p>
                      <a href="#/" className="px-6 py-3 btn-gold rounded-full">Go Home</a>
                    </div>
                  </div>
                } />
              </Routes>
            </Suspense>
          </RatesProvider>
        </SiteConfigProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
