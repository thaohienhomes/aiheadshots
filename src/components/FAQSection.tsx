import { useState } from 'react';
import { Search, ChevronDown, Brain, Clock, Shield, RefreshCw, Palette } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 'ai-technology',
      question: 'How does the AI headshot technology work?',
      answer: 'Our platform uses advanced AI models including Fal AI integration with state-of-the-art diffusion models like Flux Pro Ultra, Imagen4, and Recraft V3. The AI analyzes your uploaded photos to understand your facial features, expressions, and style preferences, then generates professional headshots by combining this understanding with sophisticated image generation algorithms. The process involves facial recognition, style transfer, and high-resolution upscaling to create photorealistic results.',
      icon: <Brain className="w-5 h-5 text-cyan-400" />,
      tags: ['AI', 'Technology', 'Fal AI']
    },
    {
      id: 'processing-time',
      question: 'How long does it take to process my headshots?',
      answer: 'Processing times vary by plan: Basic plan takes 5-10 minutes, Pro plan with priority processing takes 2-5 minutes, and Enterprise customers get the fastest processing. The actual time depends on the complexity of your request, current server load, and the AI model selected. You\'ll receive real-time updates during processing, and we\'ll notify you via email when your headshots are ready for download.',
      icon: <Clock className="w-5 h-5 text-green-400" />,
      tags: ['Processing', 'Time', 'Speed']
    },
    {
      id: 'privacy-security',
      question: 'What about privacy and data security?',
      answer: 'We take your privacy seriously. All uploaded photos are automatically deleted from our servers after processing is complete and you\'ve downloaded your results. We use enterprise-grade encryption for data transmission and storage. Your photos are never used for training AI models or shared with third parties. We comply with GDPR, CCPA, and other privacy regulations. You can request complete data deletion at any time.',
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      tags: ['Privacy', 'Security', 'Data Protection']
    },
    {
      id: 'refund-policy',
      question: 'What is your refund policy?',
      answer: 'We offer a comprehensive satisfaction guarantee: 14-day money-back guarantee for Basic plan, 30-day for Pro plan, and custom terms for Enterprise. If you\'re not satisfied with the quality of your AI-generated headshots, contact our support team within the guarantee period for a full refund. We also offer free re-processing if the initial results don\'t meet your expectations due to technical issues.',
      icon: <RefreshCw className="w-5 h-5 text-yellow-400" />,
      tags: ['Refund', 'Guarantee', 'Policy']
    },
    {
      id: 'custom-styles',
      question: 'Can I create custom styles and backgrounds?',
      answer: 'Yes! Our Pro and Enterprise plans include custom style creation capabilities. You can specify custom backgrounds, lighting conditions, clothing styles, and professional settings. Pro users get access to our advanced style editor powered by Fal AI\'s custom model training. Enterprise customers can create branded templates, company-specific backgrounds, and even train custom AI models for consistent team headshots that match your brand guidelines.',
      icon: <Palette className="w-5 h-5 text-purple-400" />,
      tags: ['Custom', 'Styles', 'Backgrounds', 'Branding']
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="relative py-24 px-4 bg-slate-900/50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 neural-pattern opacity-20" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            FAQ
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient-cyan">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Get answers to common questions about our AI headshot generation platform
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white/5 border-white/10 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-cyan-400/20"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="glass-strong rounded-2xl border border-white/10 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className={`border-white/10 ${index === filteredFaqs.length - 1 ? 'border-b-0' : ''}`}
              >
                <AccordionTrigger className="px-6 py-6 hover:bg-white/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-4 text-left">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-200">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-white group-hover:text-cyan-400 transition-colors duration-200">
                        {faq.question}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {faq.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs bg-white/5 text-slate-400 hover:bg-white/10"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-16">
                    <p className="text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* No Results Message */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl text-white mb-2">No results found</h3>
            <p className="text-slate-400">
              Try different keywords or browse all questions above
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 glass rounded-2xl border border-white/10">
          <h3 className="text-xl text-white mb-2">Still have questions?</h3>
          <p className="text-slate-400 mb-6">
            Our support team is here to help you get the perfect AI headshots
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-cyan-400/50 rounded-xl transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}