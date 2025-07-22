"use client";

import { Wrench, Zap, Cog, Shield, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdvantagesSection() {
  const services = [
    {

      title: "Car Servicing & Repairs",
      description: "Comprehensive automotive servicing including diagnostics, repairs, and maintenance.",
      features: ["Wiring repairs", "Sensor replacement","Common rail injector fitments", "Changing Oil",
        "Checking idle position", " Changing filters","Checking leaks", "High pressure pump fitment"],
      
    },
    {
      
      title: "Diesel Injector Services", 
      description: "Specialized diesel injector diagnostics, cleaning, and replacement services.",
      features: ["Uniformity/Sprayability test", "Leakage test", "Injecting flow test","Auto test", "Ultrasonic cleaning"],
    },
    {
      title: "Our advance services",
      description: "We offer top-notch servicing and repair for hybrid vehicles.",
      features: ["Routine Maintenance", "Extensive Repairs", "Oil changes",
        "Battery replacements","Electrical Sytem Repairs", "Brake inspection"],
    },
    {
      
      title: "Premium Parts Supply",
      description: "High-quality automotive parts and sensors from trusted manufacturers.",
      features: ["EGR Valve, Injector drive, Pedal sensor, Speedo sensor, OC V/VVT sensors", "Gear Box connectors, Abs Sensors, Indicator Switch, Idle Control Switch", "Spiral cables, Valve board, Computer box", "Petrol & Diesel high pressure pump, Pump housing, Booster pump"],
      
    }
  ];

  return (
    <section id="advantages" className="py-32 px-6 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-orange-50/40"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-l from-blue-200/30 to-orange-200/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-blue-100 rounded-full px-8 py-4 mb-8 shadow-lg border border-orange-200/50">
            <Star className="text-orange-500" size={20} />
            <span className="text-transparent bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text font-orbitron font-bold text-lg tracking-wider uppercase">
              Why Choose Us
            </span>
          </div>
          <div className="w-32 h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500 mx-auto rounded-full mb-8 shadow-lg"></div>

          <p className="text-xl md:text-1xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            If you own a hybrid car or are considering purchasing one, trust us with all your maintanance and repair needs. We are dedicated to keeping your vehicle in top condition so that you can enjoy its many benefits for years to come.
          </p>
        </div>

        {/* Modern Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => {
            return (
              <Card key={index} className="modern-card group overflow-hidden border-0 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="relative">
                    {/* Content */}
                    <h3 className="font-orbitron font-bold text-2xl text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}