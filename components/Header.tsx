
import React from 'react';
import type { Page } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'style-me', label: 'Tư Vấn Phong Cách' },
    { id: 'trends', label: 'Xu Hướng' },
    { id: 'item-finder', label: 'Tìm Kiếm Đồ' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <SparklesIcon className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl font-bold font-serif text-gray-800">Trợ Lý Phong Cách</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  currentPage === item.id
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-600 hover:bg-pink-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
