"use client";

import { Facebook, Mail, MessageSquare } from "lucide-react";
import Logo from "./logo";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="py-12 px-6 bg-black relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-orange)]/5 via-transparent to-[var(--brand-blue)]/5 opacity-50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Logo className="h-12 w-auto" />
            </div>
            <div className="text-xl font-orbitron font-bold text-white mb-4">
              Diagnosis & Sensors
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The best solution to your automotive challenges.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a href="mailto:sales@diagnosisandsensors.co.zw" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Mail size={20} />
              </a>
              <a href="https://wa.me/+263772974846" className="text-gray-400 hover:text-orange-500 transition-colors">
                <MessageSquare size={20} />
              </a>
              <a href="https://www.facebook.com/p/Diagnosis-and-Sensors-100063639080600/" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-orange-500 font-semibold text-lg mb-4">Quick Links</h3>
            <nav className="space-y-2">
              {['home', 'services', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block text-gray-300 hover:text-white transition-colors duration-200 capitalize text-sm"
                >
                  {item}
                </button>
              ))}
              <a href="/blog" className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                Blog
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-orange-500 font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Phone:</span>
                <div className="text-gray-300">0292 883 884</div>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <div className="text-gray-300">sales@diagnosisandsensors.co.zw</div>
              </div>
            </div>
          </div>
          <div className="text-2x">
            <span className="text-orange-500">For all your hybrid engines, gear boxes, body part and hybrid auto accessories : </span>
            <a 
              href="https://fadarc.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-white font-medium transition-colors"
            >
              Fadarc
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Diagnosis & Sensors. All rights reserved.
          </div>
          <div className="text-sm">
            <span className="text-orange-500">Website designed & developed by </span>
            <a 
              href="https://niakazi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-white font-medium transition-colors"
            >
              Niakazi Technology Solutions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
