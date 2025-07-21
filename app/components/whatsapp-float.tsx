"use client";

export default function WhatsAppFloat() {
  return (
    <a 
      href="https://wa.me/+263772974846" 
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 z-40 animate-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
    >
      <i className="fab fa-whatsapp text-2xl text-white"></i>
    </a>
  );
}
