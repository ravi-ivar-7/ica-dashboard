import React from 'react';
import { CheckCircle, Zap, Crown, Rocket, Users, Clock, Star, CreditCard } from 'lucide-react';

const plans = [
  {
    name: "Pro Monthly",
    type: "subscription",
    price: "$10",
    credits: "1000",
    description: "Perfect for regular creators",
    icon: <Zap className="w-8 h-8" />,
    features: [
      "1000 generation credits",
      "All prebuilt models",
      "Custom model training",
      "Standard support"
    ],
    gradient: "from-blue-600 to-cyan-600",
    cta: "Start Pro",
    popular: false
  },
  {
    name: "Studio Yearly",
    type: "subscription", 
    price: "$100",
    credits: "12000",
    description: "Best value for professionals",
    icon: <Crown className="w-8 h-8" />,
    features: [
      "12000 generation credits",
      "All models + early access",
      "Priority training queue",
      "Premium support",
      "API access (coming soon)"
    ],
    gradient: "from-purple-600 to-pink-600",
    popular: true,
    cta: "Get Studio",
    savings: "Save $20"
  }
];

const topups = [
  {
    name: "Small Top-up",
    price: "$5",
    credits: "500",
    description: "Quick credit boost",
    note: "Subscribers only"
  },
  {
    name: "Large Top-up", 
    price: "$25",
    credits: "3000",
    description: "Maximum value pack",
    note: "Subscribers only"
  }
];

export default function PremiumOffer() {
  return (
    <section className="py-6 sm:py-12 bg-gradient-to-b from-gray-900 via-slate-900 to-zinc-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl border border-purple-500/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-3 sm:mb-4">
            <CreditCard className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
            <span className="text-purple-300 font-bold text-sm sm:text-base">Simple Pricing</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Creative Plan
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto">
            Subscription & top-up model. All credit funding happens via subscriptions or top-up packs.
          </p>
        </div>

        {/* Main Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 hover:bg-gradient-to-br hover:from-gray-800/90 hover:to-black/95 transition-all duration-300 hover:scale-105 hover:border-white/30 hover:shadow-2xl ${plan.popular ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20 scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-black py-1 sm:py-2 px-3 sm:px-6 rounded-full shadow-lg">
                    🔥 Best Value
                  </div>
                </div>
              )}

              <div className="text-center mb-4 sm:mb-6">
                <div className={`bg-gradient-to-r ${plan.gradient} p-3 sm:p-4 rounded-2xl inline-block mb-3 sm:mb-4 shadow-2xl`}>
                  {plan.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-1">{plan.name}</h3>
                <p className="text-white/70 text-sm sm:text-base mb-2">{plan.description}</p>
                
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">{plan.price}</div>
                <div className="text-white/60 mb-2 text-sm">{plan.type}</div>
                
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-2 mb-3 sm:mb-4">
                  <p className="text-emerald-400 font-bold text-sm">{plan.credits} credits</p>
                  {plan.savings && (
                    <p className="text-yellow-400 font-bold text-xs">{plan.savings}</p>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-4 sm:mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white/90 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-black text-base transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/25' 
                  : 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 text-white border-2 border-white/20 hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 hover:border-white/40'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Top-up Packs */}
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-4">Top-up Packs</h3>
          <p className="text-white/70 mb-5 text-sm sm:text-base">Need more credits? Top up your account (subscribers only)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {topups.map((topup, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:border-white/30 transition-all duration-300">
                <h4 className="text-lg font-black text-white mb-1">{topup.name}</h4>
                <div className="text-2xl font-black text-white mb-1">{topup.price}</div>
                <p className="text-emerald-400 font-bold mb-1 text-sm">{topup.credits} credits</p>
                <p className="text-white/70 text-xs mb-2">{topup.description}</p>
                <p className="text-yellow-400 text-xs font-semibold">{topup.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
            <Users className="w-6 sm:w-7 h-6 sm:h-7 text-purple-400" />
            <h3 className="text-2xl sm:text-3xl font-black text-white">Join 50,000+ Creators</h3>
          </div>
          <p className="text-base sm:text-lg text-white/70 mb-4 sm:mb-6 max-w-3xl mx-auto">
            Who are already creating stunning, personalized content with OpenModel Studio
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2 text-white/70">
              <Star className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400" />
              <span className="text-base sm:text-lg font-semibold">4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
              <span className="text-base sm:text-lg font-semibold">1M+ models trained</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}