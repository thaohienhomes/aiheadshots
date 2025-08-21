import { useState } from 'react';
import { Check, Star, Users, Zap, Crown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useCredits } from '../hooks/useCredits';
import { PRICING_PLANS, createOneTimePackCheckout } from '../lib/polar';

export function PricingSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { user } = useAuth();
  const { upgradeToTier, loading, currentTier } = useSubscription();
  const { purchaseCredits, loading: creditsLoading } = useCredits();

  const handleUpgrade = async (tier: 'one_time' | 'pro' | 'enterprise') => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please log in to upgrade your subscription');
      return;
    }

    if (tier === 'one_time') {
      await purchaseCredits();
    } else {
      await upgradeToTier(tier);
    }
  };

  const pricingTiers = [
    {
      id: 'free',
      name: PRICING_PLANS.free.name,
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out AI headshots',
      icon: <Users className="w-6 h-6 text-slate-400" />,
      features: PRICING_PLANS.free.features,
      buttonText: currentTier === 'free' ? 'Current Plan' : 'Downgrade',
      popular: false,
      gradient: 'from-slate-800 to-slate-900',
      tier: 'free' as const,
      disabled: currentTier === 'free'
    },
    {
      id: 'one_time',
      name: PRICING_PLANS.one_time.name,
      price: `$${PRICING_PLANS.one_time.price}`,
      period: 'one-time',
      description: 'Perfect for occasional use',
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      features: PRICING_PLANS.one_time.features,
      buttonText: currentTier === 'one_time' ? 'Buy More Credits' : 'Buy Now',
      popular: false,
      gradient: 'from-orange-600/20 to-red-600/20',
      tier: 'one_time' as const,
      disabled: false // Always allow buying more credits
    },
    {
      id: 'pro',
      name: PRICING_PLANS.pro.name,
      price: `$${PRICING_PLANS.pro.price}`,
      period: `per ${PRICING_PLANS.pro.interval}`,
      description: 'Most popular for professionals',
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      features: PRICING_PLANS.pro.features,
      buttonText: currentTier === 'pro' ? 'Current Plan' :
                  currentTier === 'enterprise' ? 'Downgrade' : 'Upgrade to Pro',
      popular: true,
      gradient: 'from-cyan-600/20 to-blue-600/20',
      tier: 'pro' as const,
      disabled: currentTier === 'pro'
    },
    {
      id: 'enterprise',
      name: PRICING_PLANS.enterprise.name,
      price: `$${PRICING_PLANS.enterprise.price}`,
      period: `per ${PRICING_PLANS.enterprise.interval}`,
      description: 'For teams and businesses',
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      features: PRICING_PLANS.enterprise.features,
      buttonText: currentTier === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise',
      popular: false,
      gradient: 'from-purple-600/20 to-pink-600/20',
      tier: 'enterprise' as const,
      disabled: currentTier === 'enterprise'
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 neural-pattern opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient-cyan">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Generate professional AI headshots with our advanced models. 
            No subscriptions, just one-time payments for lifetime access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative group cursor-pointer transition-all duration-300 ${
                hoveredCard === tier.id ? 'transform scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCard(tier.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 animate-pulse-glow">
                    <Star className="w-4 h-4 mr-1" />
                    Best Value
                  </Badge>
                </div>
              )}

              {/* Card */}
              <div className={`
                relative h-full p-8 rounded-3xl glass-strong border-2 
                transition-all duration-300 overflow-hidden
                ${tier.popular ? 'border-cyan-500/30' : 'border-white/10'}
                ${hoveredCard === tier.id ? 'border-cyan-400/50 shadow-2xl shadow-cyan-500/25' : ''}
              `}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-50`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      {tier.icon}
                      <h3 className="text-2xl text-white">{tier.name}</h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl text-gradient-cyan">{tier.price}</span>
                      <span className="text-slate-400">/{tier.period}</span>
                    </div>
                    <p className="text-slate-400 mt-2">{tier.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => {
                      if (tier.tier === 'one_time' || tier.tier === 'pro' || tier.tier === 'enterprise') {
                        handleUpgrade(tier.tier);
                      }
                    }}
                    disabled={tier.disabled || loading || creditsLoading}
                    className={`
                      w-full py-3 rounded-xl transition-all duration-300
                      ${tier.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-cyan-400/50'
                      }
                      ${hoveredCard === tier.id ? 'animate-pulse-glow transform scale-105' : ''}
                      ${tier.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {(loading || creditsLoading) && (tier.tier === 'one_time' || tier.tier === 'pro' || tier.tier === 'enterprise') ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      tier.buttonText
                    )}
                  </Button>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 
                  opacity-0 transition-opacity duration-300
                  ${hoveredCard === tier.id ? 'opacity-100' : ''}
                `} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-6">
            All plans include 14-day money-back guarantee • No hidden fees • Secure payment
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>10,000+ satisfied customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Powered by Fal AI & latest models</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}