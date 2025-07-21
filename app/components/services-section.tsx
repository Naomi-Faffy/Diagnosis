"use client";

import { Shield, Wrench, DollarSign, Award, Clock, Users, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.scroll-reveal');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const advantages = [
    {
      title: "Injector Pressure Testing",
      description: "We also do diagnosis on 24 volts trucks e.g Hino Dutro, IVECO, Ben Atego, Isuzu Elf and many more. It is essential that injectors are tested as part of the diagnostic procedure on all petrol vehicles especially when faced with combustion related problems",
     color: "from-orange-500 to-orange-600",
      image: "/images/injector.jpg"
    },
    {
      title: "Vehicle Diagnostics and Troubleshooting",
      description: "We use state of the art equipment and diagnostic tools to ensure that every aspect of your hybrid vehicle is fuctioning at its best.",
      color: "from-blue-500 to-blue-600",
      image: "/images/image15.png"
    },
    {
      title: "Vehicle Automative Repair",
      description: "We take pride in offering top-notch servicing and repair for hybrid vehicles.We are dedicated to keeping your vehicle in top condition so that you can enjoy its many benefits for years to come",
      color: "from-orange-500 to-orange-600",
      image: "/images/image4.jpg"
    },
    {
      title: "Supply and fitting of automotive sensors and common rail injectors",
      description: "We provide cutting-edge vehicle diagnosis and sensor solutions to help clients optimize their vehicle perfomance.",
      color: "from-blue-500 to-blue-600",
      image: "/images/vehicle-servicing.jpg"
    },
        {
      
      title: "Sensors",
      description: "High-precision sensors for modern engine management systems",
      color:"from-orange-500 to-orange-600",
      image: "/images/sensors.jpg",
    },
    
    {
      title: "Diagnostic Equipment",
      description: "Professional automotive diagnostic tools and scanners",
      color:"from-orange-500 to-orange-600",
      image: "/images/vehicle.jpg",
    },
    {
      title: "Low mileage batteries",
      description: "For your toyota Aqua Hybrid",
      color:"from-orange-500 to-orange-600",
      image: "/images/battery.jpg",
      
    }
   
  ];

  return (
    <section ref={sectionRef} id="services" className="py-32 px-6 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-blue-50/30"></div>

      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(249,115,22,0.15)_1px,transparent_0)] bg-[length:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-24 scroll-reveal">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-orange-100 to-blue-100 rounded-full px-8 py-4 mb-8 shadow-lg border border-orange-200/50">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full animate-pulse"></div>
            <span className="text-transparent bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text font-orbitron font-bold text-lg tracking-wider uppercase">
              Professional Services
            </span>
          </div>

          <div className="w-32 h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500 mx-auto rounded-full mb-8 shadow-lg"></div>

          <p className="text-xl md:text-1xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            Diagnosis and Sensors is a specialist in motor vehicle diagnosis, troubleshooting, auto repairs, selling parts and accessories.
          </p>
        </div>

        {/* Enhanced Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-10">
          {advantages.map((service, index) => (
            <Card key={index} className="group relative bg-white border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 overflow-hidden scroll-reveal">
              {/* Service Image */}
                <div className="relative aspect-card overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="image-full-cover group-hover:scale-110 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/vehicle.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      margin: 0,
                      padding: 0,
                      border: 'none',
                      background: 'transparent'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              <CardContent className="relative p-8 text-center">
                {/* Icon Container */}
                
                <h3 className="font-orbitron font-black text-xl md:text-2xl text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-lg">
                  {service.description}
                </p>

                {/* Check Mark */}
                <div className="mt-6 flex justify-center">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center scroll-reveal">
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="font-orbitron font-bold text-3xl md:text-4xl mb-6">
              Need Professional Automotive Service?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Contact our expert team for comprehensive diagnostic and repair solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}