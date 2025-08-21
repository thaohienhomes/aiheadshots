import { useState } from 'react';
import { Play, Download, Share2, Star, Calendar, Users, TrendingUp, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function DashboardTeaser() {
  const [activeTab, setActiveTab] = useState('recent');

  const mockHeadshots = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      style: 'Professional',
      model: 'Flux Pro Ultra',
      rating: 4.9,
      downloads: 12
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
      style: 'Corporate',
      model: 'Imagen4',
      rating: 4.8,
      downloads: 8
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      style: 'Creative',
      model: 'Recraft V3',
      rating: 4.7,
      downloads: 15
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      style: 'Casual',
      model: 'Flux Pro Ultra',
      rating: 4.9,
      downloads: 6
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      style: 'Executive',
      model: 'Imagen4',
      rating: 4.8,
      downloads: 11
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      style: 'Modern',
      model: 'Recraft V3',
      rating: 4.6,
      downloads: 9
    }
  ];

  const stats = [
    { label: 'Total Headshots', value: '156', icon: <Eye className="w-5 h-5" />, change: '+12 this month' },
    { label: 'Avg Rating', value: '4.8', icon: <Star className="w-5 h-5" />, change: '+0.2 this month' },
    { label: 'Total Downloads', value: '89', icon: <Download className="w-5 h-5" />, change: '+23 this month' },
    { label: 'Models Used', value: '3', icon: <TrendingUp className="w-5 h-5" />, change: 'All available' }
  ];

  return (
    <section className="relative py-24 px-4 bg-slate-900/70 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 neural-pattern opacity-20" />
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            Dashboard Preview
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient-cyan">
            Your AI Headshot Dashboard
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Manage, download, and share your professional AI-generated headshots from a beautiful, intuitive dashboard.
          </p>
        </div>

        {/* Dashboard Mock */}
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs bg-white/5 text-slate-400">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Content */}
          <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
            {/* Dashboard Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl text-white mb-2">My Headshots</h3>
                  <p className="text-slate-400">Professional AI-generated headshots ready to download</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 rounded-xl"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Collection
                  </Button>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-6">
              <div className="flex space-x-1 bg-white/5 rounded-xl p-1 w-fit">
                {['recent', 'popular', 'all'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm transition-all duration-200 capitalize ${
                      activeTab === tab 
                        ? 'bg-cyan-500 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Headshots Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {mockHeadshots.map((headshot, index) => (
                  <div 
                    key={headshot.id}
                    className="group relative cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-white/10 group-hover:border-cyan-400/30 transition-all duration-300">
                      <ImageWithFallback
                        src={headshot.url}
                        alt={`${headshot.style} headshot`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-lg">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm text-white">{headshot.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Model Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm">
                          {headshot.model}
                        </Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white group-hover:text-cyan-400 transition-colors duration-200">
                          {headshot.style}
                        </h4>
                        <span className="text-sm text-slate-400">{headshot.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8"
                >
                  Load More Headshots
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl px-8 py-4 text-lg shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Creating Your Dashboard
          </Button>
          <p className="text-slate-400 mt-4">
            Join thousands of professionals who trust our AI headshot platform
          </p>
        </div>
      </div>
    </section>
  );
}