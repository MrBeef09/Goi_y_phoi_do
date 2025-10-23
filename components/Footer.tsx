
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Trợ Lý Phong Cách AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
