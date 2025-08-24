import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  Camera,
  Sparkles,
  Download,
  Share2,
  BarChart3,
  Clock,
  Star,
  Zap,
  Users,
  Eye,
  User,
  Calendar,
  TrendingUp,
  FileImage,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Crown
} from 'lucide-react';
import { PageType } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { useUploads } from '../../hooks/useUploads';
import { useGenerations } from '../../hooks/useGenerations';
import { useSubscription } from '../../hooks/useSubscription';
import { useUsage } from '../../hooks/useUsage';
import { useCredits } from '../../hooks/useCredits';
import type { Upload, Generation } from '../../types/supabase';

interface DashboardProps {
  navigate: (page: PageType) => void;
}

interface DashboardStats {
  totalHeadshots: number;
  completedSessions: number;
  totalDownloads: number;
  pendingGenerations: number;
}

export function Dashboard({ navigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalHeadshots: 0,
    completedSessions: 0,
    totalDownloads: 0,
    pendingGenerations: 0
  });
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { user, profile } = useAuth();
  const { getUserUploads } = useUploads();
  const { getGenerationsByUpload } = useGenerations();
  const {
    currentTier,
    currentPlan,
    upgradeToTier,
    loading: subscriptionLoading
  } = useSubscription();
  const {
    stats: usageStats,
    usageColor,
    progressColor,
    shouldUpgrade: shouldShowUpgrade,
    refreshUsage
  } = useUsage();
  const {
    credits,
    display: creditsDisplay,
    isOneTimeTier,
    isLowOnCredits,
    purchaseCredits,
    refreshCredits
  } = useCredits();

  // Fetch dashboard data
  useEffect(() => {
    if (!user) {
      navigate('home');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch user uploads
      const uploadsResult = await getUserUploads(user.id);
      if (uploadsResult.success) {
        setUploads(uploadsResult.uploads || []);

        // Fetch generations for each upload
        const allGenerations: Generation[] = [];
        for (const upload of uploadsResult.uploads || []) {
          const genResult = await getGenerationsByUpload(upload.id);
          if (genResult.success) {
            allGenerations.push(...(genResult.generations || []));
          }
        }
        setGenerations(allGenerations);

        // Calculate statistics
        const completedGenerations = allGenerations.filter(g => g.status === 'completed');
        const pendingGenerations = allGenerations.filter(g =>
          g.status === 'queued' || g.status === 'processing'
        );

        setStats({
          totalHeadshots: completedGenerations.length,
          completedSessions: uploadsResult.uploads?.length || 0,
          totalDownloads: completedGenerations.length, // Assuming each completed = downloaded
          pendingGenerations: pendingGenerations.length
        });

        // Check generation limits and show upgrade recommendations
        const totalGenerations = allGenerations.length;
        const limitCheck = checkGenerationLimit(totalGenerations);
        const upgradeRec = getUpgradeRecommendation(totalGenerations);

        if (upgradeRec.shouldUpgrade) {
          console.log('Upgrade recommendation:', upgradeRec.reason);
        }
      } else {
        setError(uploadsResult.error || 'Failed to fetch uploads');
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
    refreshUsage();
    refreshCredits();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  // Process generations for display
  const recentGenerations = generations
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map(gen => {
      const upload = uploads.find(u => u.id === gen.upload_id);
      return {
        id: gen.id,
        date: formatDate(gen.created_at),
        status: gen.status,
        headshots: gen.status === 'completed' ? 1 : 0,
        model: gen.model || 'SDXL',
        style: gen.style || 'Professional',
        thumbnail: gen.result_url || upload?.file_url || null,
        resultUrl: gen.result_url
      };
    });

  // Calculate popular styles from generations
  const styleUsage = generations.reduce((acc, gen) => {
    const style = gen.style || 'Professional';
    acc[style] = (acc[style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularStyles = Object.entries(styleUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)
    .map(([name, usage]) => ({
      name,
      usage: Math.round((usage / generations.length) * 100) || 0,
      trend: '+' + Math.floor(Math.random() * 20) + '%' // Mock trend for now
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Dashboard</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <Button onClick={refreshData} className="bg-cyan-500 hover:bg-cyan-600">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-slate-300 text-lg">
                Your AI headshot generation dashboard
              </p>
              {profile && (
                <div className="flex items-center gap-4 mt-2">
                  <Badge
                    variant="secondary"
                    className={`
                      ${currentTier === 'free' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                        currentTier === 'pro' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-purple-500/10 text-purple-400 border-purple-500/20'}
                    `}
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    {currentTier.toUpperCase()} Plan
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={refreshData}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700/50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => navigate('upload-intro')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 text-lg font-semibold"
              >
                <Camera className="mr-2 h-5 w-5" />
                Create New Headshots
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Usage Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {isOneTimeTier ? 'Credits Remaining' : 'Generation Usage'}
                </h2>
                <p className={`text-sm ${isOneTimeTier ? creditsDisplay.color : usageColor}`}>
                  {isOneTimeTier ? creditsDisplay.text : usageStats.message}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {isOneTimeTier
                    ? credits
                    : `${usageStats.used}/${usageStats.limit === 0 ? '∞' : usageStats.limit}`
                  }
                </p>
                <p className="text-xs text-slate-400">
                  {isOneTimeTier
                    ? 'credits available'
                    : `${usageStats.percentage}% used`
                  }
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${Math.min(usageStats.percentage, 100)}%` }}
              />
            </div>

            {/* Upgrade/Purchase CTA */}
            {(shouldShowUpgrade || (isOneTimeTier && isLowOnCredits)) && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-cyan-300">
                  {isOneTimeTier
                    ? (credits === 0 ? 'No credits remaining!' : 'Running low on credits')
                    : (usageStats.remaining === 0 ? 'Limit reached!' : 'Running low on generations')
                  }
                </p>
                <Button
                  onClick={() => {
                    if (isOneTimeTier) {
                      purchaseCredits();
                    } else {
                      upgradeToTier(usageStats.recommendedTier === 'enterprise' ? 'enterprise' : 'pro');
                    }
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {isOneTimeTier ? 'Buy Credits' : 'Upgrade'}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Headshots</p>
                <p className="text-2xl font-bold text-white">{stats.totalHeadshots}</p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Camera className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              {stats.totalHeadshots > 0 ? 'Ready to download' : 'Get started!'}
            </div>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Upload Sessions</p>
                <p className="text-2xl font-bold text-white">{stats.completedSessions}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FileImage className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-400 text-sm">
              <Camera className="h-4 w-4 mr-1" />
              {uploads.length} total uploads
            </div>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Pending Jobs</p>
                <p className="text-2xl font-bold text-white">{stats.pendingGenerations}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-orange-400 text-sm">
              <Loader2 className="h-4 w-4 mr-1" />
              {stats.pendingGenerations > 0 ? 'In progress' : 'All complete'}
            </div>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {generations.length > 0
                    ? Math.round((generations.filter(g => g.status === 'completed').length / generations.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              {generations.filter(g => g.status === 'completed').length} completed
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Generations */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Generations</h2>
                <div className="space-y-4">
                  {recentGenerations.length === 0 ? (
                    <div className="text-center py-12">
                      <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No generations yet</h3>
                      <p className="text-slate-400 mb-6">Start by uploading photos to generate your first AI headshots</p>
                      <Button
                        onClick={() => navigate('upload-intro')}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Started
                      </Button>
                    </div>
                  ) : (
                    recentGenerations.map((generation, index) => (
                    <motion.div
                      key={generation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/20 hover:bg-slate-700/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {generation.thumbnail ? (
                            <ImageWithFallback
                              src={generation.thumbnail}
                              alt="Generation thumbnail"
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-600/50 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          {generation.status === 'processing' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-white">{generation.style}</p>
                            <Badge variant="outline" className="text-xs">
                              {generation.model}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">{generation.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {generation.status === 'completed' ? (
                          <>
                            <span className="text-sm text-slate-300">{generation.headshots} photo{generation.headshots !== 1 ? 's' : ''}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {generation.resultUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(generation.resultUrl, '_blank')}
                                  title="Download headshot"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (generation.resultUrl) {
                                    navigator.clipboard.writeText(generation.resultUrl);
                                    // Could add a toast notification here
                                  }
                                }}
                                title="Copy link"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        ) : generation.status === 'processing' ? (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Processing...
                          </Badge>
                        ) : generation.status === 'failed' ? (
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            <Clock className="h-3 w-3 mr-1" />
                            Queued
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  )))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Popular Styles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Popular Styles</h2>
                <div className="space-y-4">
                  {popularStyles.length === 0 ? (
                    <div className="text-center py-8">
                      <Palette className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No style data yet</p>
                      <p className="text-slate-500 text-xs mt-1">Generate headshots to see popular styles</p>
                    </div>
                  ) : (
                    popularStyles.map((style, index) => (
                    <motion.div
                      key={style.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white text-sm">{style.name}</p>
                        <span className="text-green-400 text-xs font-medium">{style.trend}</span>
                      </div>
                      <Progress value={style.usage} className="h-2" />
                      <p className="text-xs text-slate-400">{style.usage}% usage rate</p>
                    </motion.div>
                  )))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Subscription Management */}
        {currentTier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-cyan-800/20 to-blue-800/20 backdrop-blur-sm border-cyan-500/30">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Upgrade Your Plan</h2>
                    <p className="text-slate-300">
                      You're on the Free plan. Upgrade for more generations and premium features.
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-cyan-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Button
                    onClick={() => upgradeToTier('pro')}
                    disabled={subscriptionLoading}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 p-4 h-auto flex-col gap-2"
                  >
                    {subscriptionLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                    <div className="text-center">
                      <p className="font-semibold">Upgrade to Pro</p>
                      <p className="text-xs opacity-90">${currentPlan.price}/month • 100 generations</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => upgradeToTier('enterprise')}
                    disabled={subscriptionLoading}
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/10 p-4 h-auto flex-col gap-2"
                  >
                    {subscriptionLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Crown className="h-5 w-5 text-purple-400" />
                    )}
                    <div className="text-center">
                      <p className="font-semibold">Upgrade to Enterprise</p>
                      <p className="text-xs opacity-70">$99/month • Unlimited generations</p>
                    </div>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-slate-600">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate('upload-intro')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 p-4 h-auto flex-col gap-2"
                >
                  <Camera className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-semibold">New Session</p>
                    <p className="text-xs opacity-90">Generate fresh headshots</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-600 hover:bg-slate-700/50 p-4 h-auto flex-col gap-2"
                >
                  <Download className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-semibold">Download All</p>
                    <p className="text-xs opacity-70">Get your complete collection</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-600 hover:bg-slate-700/50 p-4 h-auto flex-col gap-2"
                >
                  <BarChart3 className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-semibold">View Analytics</p>
                    <p className="text-xs opacity-70">Track your usage stats</p>
                  </div>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}