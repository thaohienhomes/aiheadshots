import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import {
  Menu,
  X,
  Camera,
  Sparkles,
  User,
  CreditCard,
  HelpCircle,
  LogIn,
  Settings,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    label: "Generate",
    href: "#generate",
    icon: <Camera className="w-4 h-4" />,
  },
  {
    label: "Gallery",
    href: "#gallery",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    label: "Models",
    href: "#models",
    children: [
      { label: "Flux Pro Ultra", href: "#flux-pro" },
      { label: "Imagen4", href: "#imagen4" },
      { label: "Recraft V3", href: "#recraft" },
    ],
  },
  {
    label: "Pricing",
    href: "#pricing",
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    label: "Help",
    href: "#help",
    icon: <HelpCircle className="w-4 h-4" />,
  },
];

import { PageType } from "../App";

interface NavigationProps {
  currentPage: PageType;
  navigate: (page: PageType) => void;
  openLoginModal?: () => void;
}

export function Navigation({
  currentPage,
  navigate,
  openLoginModal,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-md border-b border-cyan-400/20"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Min Studio
              </div>
              <div className="text-xs text-gray-400">
                Professional AI Photography
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={() => navigate("home")}
              className={`transition-all duration-200 ${
                currentPage === "home"
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("dashboard")}
              className={`transition-all duration-200 ${
                currentPage === "dashboard"
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Dashboard
            </Button>
            {currentPage === "home" && (
              <>
                <Button
                  variant="ghost"
                  onClick={() =>
                    document
                      .getElementById("gallery")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  Gallery
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  Pricing
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    document
                      .getElementById("process")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  Process
                </Button>
              </>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={openLoginModal}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              onClick={() => navigate("upload-intro")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-2 rounded-xl shadow-lg shadow-cyan-500/25"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-cyan-400/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white py-3 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">
                      {item.label}
                    </span>
                  </a>

                  {/* Mobile Submenu */}
                  {item.children && (
                    <div className="ml-7 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block text-gray-400 hover:text-white py-2 transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile CTA Buttons */}
              <div className="pt-6 border-t border-gray-700 space-y-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    openLoginModal?.();
                    setIsOpen(false);
                  }}
                  className="w-full border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    navigate("upload-intro");
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
        style={{
          width: `${scrolled ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 : 0}%`,
        }}
        transition={{ duration: 0.1 }}
      />
    </motion.nav>
  );
}