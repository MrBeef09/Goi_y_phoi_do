
import React from 'react';
import type { Page } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { TagIcon } from './icons/TagIcon';
import { SearchIcon } from './icons/SearchIcon';

interface HomeProps {
    setCurrentPage: (page: Page) => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}> = ({ icon, title, description, buttonText, onClick }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col text-center items-center">
        <div className="bg-pink-100 p-4 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-2xl font-serif font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-6 flex-grow">{description}</p>
        <button 
            onClick={onClick}
            className="mt-auto bg-pink-500 text-white font-bold py-2 px-6 rounded-full hover:bg-pink-600 transition-colors duration-300"
        >
            {buttonText}
        </button>
    </div>
);


const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  return (
    <div className="space-y-16">
      <div className="text-center py-16">
        <h2 className="text-5xl md:text-6xl font-serif font-extrabold text-gray-800 mb-4">
          Tìm Phong Cách Của Riêng Bạn
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Trợ lý AI giúp bạn phối đồ, khám phá xu hướng và tỏa sáng mỗi ngày. Bắt đầu hành trình thời trang của bạn ngay hôm nay!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
                icon={<SparklesIcon className="w-8 h-8 text-pink-500"/>}
                title="Tư Vấn Phong Cách"
                description="Nhận gợi ý trang phục được cá nhân hóa dựa trên dáng người, sở thích và cả thời tiết."
                buttonText="Thử Ngay"
                onClick={() => setCurrentPage('style-me')}
            />
            <FeatureCard
                icon={<TagIcon className="w-8 h-8 text-pink-500"/>}
                title="Xu Hướng Mới Nhất"
                description="Luôn bắt kịp những xu hướng thời trang thịnh hành nhất được cập nhật liên tục."
                buttonText="Khám Phá"
                onClick={() => setCurrentPage('trends')}
            />
            <FeatureCard
                icon={<SearchIcon className="w-8 h-8 text-pink-500"/>}
                title="Tìm Kiếm Thông Minh"
                description="Tìm hiểu thông tin chi tiết về bất kỳ món đồ thời trang nào bằng văn bản hoặc hình ảnh."
                buttonText="Tìm Kiếm"
                onClick={() => setCurrentPage('item-finder')}
            />
      </div>
    </div>
  );
};

export default Home;
