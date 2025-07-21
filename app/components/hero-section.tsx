"use client";

import { MessageSquare, ArrowRight, Star, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0">
        {/* Tesla Model S Background Image */}
        <div className="absolute inset-0 bg-[url('https://electriccarhome.co.uk/wp-content/uploads/2020/03/tesla-model-s-1536x960.png')] bg-cover bg-center"></div>

        {/* Professional overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-16 sm:py-20">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-3 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-orange-400 font-orbitron font-semibold text-sm tracking-wider uppercase">
                GENUINE OEM PARTS SUPPLIER
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed font-light">
                We are the leading service provider in vehicle diagnosis and supply of Automotive Sensors
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Shield className="text-orange-400" size={16} />
                <span className="text-white text-sm font-medium">Genuine OEM Parts</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Star className="text-blue-400" size={16} />
                <span className="text-white text-sm font-medium">Expert Installation</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Award className="text-orange-400" size={16} />
                <span className="text-white text-sm font-medium">Premium Quality</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={scrollToServices}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-orbitron font-bold tracking-wider uppercase shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25 border-0 rounded-full"
              >
                <span className="flex items-center space-x-3">
                  <span>Explore Our Products</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced WhatsApp Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => window.open('https://wa.me/+263719974846', '_blank')}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group transform hover:scale-110"
        >
          <MessageSquare size={28} className="group-hover:scale-110 transition-transform duration-300" />
        </Button>
      </div>
    </section>
  );
}