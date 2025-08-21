import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { 
  Camera, 
  Mail, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  MapPin,
  Phone,
  Clock,
  Shield,
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "AI Models", href: "#models" },
      { label: "Gallery", href: "#gallery" },
      { label: "Pricing", href: "#pricing" },
      { label: "API", href: "#api" },
      { label: "Mobile App", href: "#mobile" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Press", href: "#press" },
      { label: "Partners", href: "#partners" },
      { label: "Contact", href: "#contact" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Help Center", href: "#help" },
      { label: "Community", href: "#community" },
      { label: "Blog", href: "#blog" },
      { label: "Status", href: "#status" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy", icon: <Lock className="w-4 h-4" /> },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "Security", href: "#security", icon: <Shield className="w-4 h-4" /> },
      { label: "GDPR", href: "#gdpr" }
    ]
  }
];

const socialLinks = [
  { icon: <Twitter className="w-5 h-5" />, href: "#twitter", label: "Twitter" },
  { icon: <Instagram className="w-5 h-5" />, href: "#instagram", label: "Instagram" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#linkedin", label: "LinkedIn" },
  { icon: <Youtube className="w-5 h-5" />, href: "#youtube", label: "YouTube" }
];

const contactInfo = [
  { icon: <MapPin className="w-4 h-4" />, text: "San Francisco, CA" },
  { icon: <Phone className="w-4 h-4" />, text: "+1 (555) 123-4567" },
  { icon: <Mail className="w-4 h-4" />, text: "hello@aiheadshots.com" },
  { icon: <Clock className="w-4 h-4" />, text: "24/7 Support Available" }
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322d3ee' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm0 0v-40h40l-40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 border-b border-gray-800"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay Updated with AI Innovations
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get the latest updates on new AI models, features, and professional photography tips delivered to your inbox.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex space-x-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-cyan-400/30 text-white placeholder:text-gray-400 focus:border-cyan-400"
              />
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-2 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    AI Headshots
                  </div>
                  <div className="text-sm text-gray-400">Professional AI Photography</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed max-w-md">
                Transform your photos into stunning professional headshots using cutting-edge AI technology. 
                Trusted by professionals worldwide for LinkedIn, resumes, and business profiles.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-300">
                    <div className="text-cyan-400">{item.icon}</div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="space-y-4"
                >
                  <h4 className="text-white font-semibold">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center space-x-2 group"
                        >
                          {link.icon && (
                            <span className="text-cyan-400 group-hover:text-cyan-300">
                              {link.icon}
                            </span>
                          )}
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2024 AI Headshots. All rights reserved. Built with cutting-edge AI technology.
            </div>

            {/* Status & Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>All Systems Operational</span>
              </div>
              
              <div className="flex items-center space-x-2 text-cyan-400">
                <Shield className="w-4 h-4" />
                <span>SOC 2 Certified</span>
              </div>
              
              <div className="flex items-center space-x-2 text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
      </div>
    </footer>
  );
}