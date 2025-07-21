"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './logo';

export default function FloatingNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Services', href: '#services', isRoute: false },
    { name: 'About', href: '#about', isRoute: false },
    { name: 'Blog', href: '/blog', isRoute: true },
    { name: 'Contact', href: '#contact', isRoute: false }
  ];

  const handleNavigation = (href: string, isRoute: boolean) => {
    if (isRoute) {
      router.push(href);
      setIsMenuOpen(false);
    } else if (href.startsWith('#')) {
      if (pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setIsMenuOpen(false);
        }
      } else {
        router.push('/');
        setIsMenuOpen(false);
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <Logo className="h-10 w-auto" />
              </div>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href, item.isRoute)}
                  className={`font-orbitron font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-800 hover:text-orange-600' 
                      : 'text-white hover:text-orange-400 text-shadow-sm'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            {/* Contact Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Contact Button */}
              <div className="hidden md:flex items-center space-x-3">
                <Phone className={`${isScrolled ? 'text-orange-600' : 'text-orange-400'}`} size={18} />
                <span className={`font-orbitron font-bold text-sm ${
                  isScrolled ? 'text-gray-800' : 'text-white text-shadow-sm'
                }`}>
                  0772 974 846
                </span>
              </div>
              <Button
                onClick={() => handleNavigation('#contact', false)}
                className={`hidden md:inline-flex bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 font-orbitron font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 border-0 rounded-full`}
              >
                Get Quote
              </Button>
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-800 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        } overflow-hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/20`}>
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.isRoute)}
                className="block w-full text-left px-4 py-3 font-orbitron font-semibold text-gray-800 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 text-sm tracking-wider uppercase"
              >
                {item.name}
              </button>
            ))}
            {/* Mobile Contact Info */}
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="text-orange-600" size={18} />
                <span className="font-orbitron font-bold text-sm text-gray-800">
                  +263 772 974 846
                </span>
              </div>
              <Button
                onClick={() => handleNavigation('#contact', false)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 font-orbitron font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-orange-500/25 transition-all duration-300 border-0 rounded-full"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}