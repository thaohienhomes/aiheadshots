import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { useAuth } from './hooks/useAuth';

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

  const { user, loading: authLoading } = useAuth();

  // Handle authentication redirects and protected routes
  useEffect(() => {
    // Handle payment callback success/cancellation
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionStatus = urlParams.get('subscription');
    const paymentStatus = urlParams.get('payment');

    if (subscriptionStatus === 'success' || paymentStatus === 'success') {
      setCurrentPage('dashboard');
      // Show success message (could implement toast notification here)
      console.log('Payment/subscription successful!');
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (subscriptionStatus === 'cancelled' || paymentStatus === 'cancelled') {
      setCurrentPage('dashboard');
      // Show cancellation message (could implement toast notification here)
      console.log('Payment/subscription cancelled');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Protected routes - redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const protectedPages: PageType[] = ['dashboard', 'upload-intro', 'image-upload', 'personal-info', 'style-selection', 'summary', 'wait'];
      if (protectedPages.includes(currentPage)) {
        setCurrentPage('home');
        setIsLoginModalOpen(true);
      }
    }
  }, [user, authLoading, currentPage]);

  const navigate = (page: PageType) => {
    // Check if page requires authentication
    const protectedPages: PageType[] = ['dashboard', 'upload-intro', 'image-upload', 'personal-info', 'style-selection', 'summary', 'wait'];

    if (protectedPages.includes(page) && !user && !authLoading) {
      setIsLoginModalOpen(true);
      return;
    }

    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Expose navigate for components that can't receive it via props (e.g., showcase CSA)
  useEffect(() => {
    (window as any).appNavigate = navigate;
    return () => {
      try { delete (window as any).appNavigate; } catch {}
    };
  }, [navigate]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // Navigate to dashboard after successful login
    setCurrentPage('dashboard');
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
        return <ImageUpload navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />
      case 'personal-info':
        return <ParsonalInfo navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />;
      case 'style-selection':
        return <StyleSelection navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />
      case 'summary':
        return <Summary navigate={navigate} uploadData={uploadData} updateUploadData={updateUploadData} />
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
              <FAQSEction />
            </section>
          </main>
        );
    }
  };

  return (
    <div className="min-hr-screen bg-slate-900 text-white overflow-x-hidden">
      {/{ Navigation }}
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
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
