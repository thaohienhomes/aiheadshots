import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

// Landing Page Components
import { HeroSection } from './components/HeroSection';
import { InteractiveGallery } from './components/InteractiveGallery';
import { VideoTestimonials } from './components/VideoTestimonials';
import { ProcessAnimation } from './components/ProcessAnimation';
import { DashboardTeaser } from './components/DashboardTeaser';
import { StatisticsCounter } from './components/StatisticsCounter';
import { PricingSection } from './components/PricingSection';
import { CarouselShowcase } from './components/CarouselShowcase';
import { AIModelsShowcase } from './components/AIModelsShowcase';
import { FAQSection } from './components/FAQSection';
import { LoginModal } from './components/LoginModal';

// Page Components
import { Dashboard } from './components/pages/Dashboard';
import { UploadIntro } from './components/pages/UploadIntro';
import { ImageUpload } from './components/pages/ImageUpload';
import { PersonalInfo } from './components/pages/PersonalInfo';
import { StyleSelection } from './components/pages/StyleSelection';
import { Summary } from './components/pages/Summary';
import { WaitPage } from './components/pages/WaitPage';

export type PageType = 'home' | 'dashboard' | 'upload-intro' | 'image-upload' | 'personal-info' | 'style-selection' | 'summary' | 'wait';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    images: [],
    personalInfo: {},
    styleSelection: {},
    currentStep: 0
  });

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Set dark theme by default
    document.documentElement.classList.add('dark');
    
    // Add enhanced hover effects for buttons
    const style = document.createElement('style');
    style.textContent = `
      .btn-hover-glow:hover {
        box-shadow: 0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.2);
        transform: translateY(-2px);
      }
      
      .gallery-zoom:hover {
        transform: scale(1.05);
        z-index: 10;
      }
      
      .interactive-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .interactive-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
      }
      
      @media (max-width: 768px) {
        .mobile-responsive {
          font-size: 0.875rem !important;
        }
        
        .hero-mobile {
          min-height: 60vh !important;
        }
        
        .section-mobile {
          padding-top: 60px !important;
          padding-bottom: 60px !important;
        }
      }
      
      .stats-counter {
        animation: countUp 2s ease-out forwards;
      }
      
      @keyframes countUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Add additional interactive styles
    const interactiveStyle = document.createElement('style');
    interactiveStyle.textContent = `
      /* Enhanced Button Hover Effects */
      .btn-primary {
        position: relative;
        overflow: hidden;
      }
      
      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .btn-primary:hover::before {
        left: 100%;
      }

      /* Gallery Image Zoom Effect */
      .gallery-item {
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .gallery-item:hover {
        transform: scale(1.02);
        z-index: 10;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .text-6xl { font-size: 2.5rem !important; }
        .text-5xl { font-size: 2rem !important; }
        .text-4xl { font-size: 1.75rem !important; }
        
        .py-24 { padding-top: 60px !important; padding-bottom: 60px !important; }
        .py-20 { padding-top: 50px !important; padding-bottom: 50px !important; }
        
        .space-y-8 > * + * { margin-top: 1.5rem !important; }
        .space-y-12 > * + * { margin-top: 2rem !important; }
      }

      /* Smooth Animations */
      .animate-fade-in {
        animation: fadeIn 0.6s ease-out;
      }
      
      .animate-slide-up {
        animation: slideUp 0.8s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Loading States */
      .loading-shimmer {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
        background-size: 400% 100%;
        animation: shimmer 1.5s ease infinite;
      }
      
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Enhanced Focus States for Accessibility */
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: 2px solid #22d3ee;
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1);
      }

      /* Improved Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #1e293b;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #22d3ee, #0ea5e9);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #06b6d4, #0284c7);
      }
    `;
    document.head.appendChild(interactiveStyle);
    
    return () => {
      document.head.removeChild(interactiveStyle);
    };
  }, []);

  const navigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const updateUploadData = (key: string, data: any) => {
    setUploadData(prev => ({ ...prev, [key]: data }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard navigate={navigate} />;
      case 'upload-intro':
        return <UploadIntro navigate={navigate} />;
      case 'image-upload':
        return <ImageUpload navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />;
      case 'personal-info':
        return <PersonalInfo navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />;
      case 'style-selection':
        return <StyleSelection navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />;
      case 'summary':
        return <Summary navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />;
      case 'wait':
        return <WaitPage navigate={navigate} uploadData={uploadData} />;
      default:
        return (
          <main className="relative">
            {/* Hero Section with Video Background */}
            <section id="hero" className="hero-mobile">
              <HeroSection navigate={navigate} openLoginModal={openLoginModal} />
            </section>

            {/* Interactive Gallery with Masonry Layout */}
            <section id="gallery" className="section-spacing">
              <InteractiveGallery />
            </section>

            {/* Video Testimonials */}
            <section id="testimonials" className="section-spacing">
              <VideoTestimonials />
            </section>

            {/* Process Animation (How It Works) */}
            <section id="process" className="section-spacing">
              <ProcessAnimation />
            </section>

            {/* Dashboard Teaser - Show mock dashboard */}
            <section id="dashboard-teaser" className="section-spacing">
              <DashboardTeaser />
            </section>

            {/* Statistics Counter */}
            <section id="statistics" className="section-spacing">
              <StatisticsCounter />
            </section>

            {/* Pricing Section - New addition */}
            <section id="pricing" className="section-spacing cta-section">
              <PricingSection />
            </section>

            {/* 3D Carousel Showcase */}
            <section id="showcase" className="section-spacing">
              <CarouselShowcase />
            </section>

            {/* AI Models Showcase */}
            <section id="models" className="section-spacing">
              <AIModelsShowcase />
            </section>

            {/* FAQ Section - New addition */}
            <section id="faq" className="section-spacing">
              <FAQSection />
            </section>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage} 
        navigate={navigate} 
        openLoginModal={openLoginModal}
      />
      
      {/* Page Content */}
      {renderPage()}

      {/* Footer - Only show on home page and dashboard */}
      {(currentPage === 'home' || currentPage === 'dashboard') && <Footer />}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
      />
    </div>
  );
}