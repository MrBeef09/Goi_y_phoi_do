import React, { useState, useEffect, useCallback } from 'react';
import { fetchTrends } from '../services/geminiService';
import type { Trend } from '../types';
import LoadingSpinner from './LoadingSpinner';

const trendCategories = ['Mùa Hè 2024', 'Công sở hiện đại', 'Dạo phố cuối tuần', 'Tiệc tối sang trọng'];

const Trends: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(trendCategories[0]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTrends = useCallback(async (category: string) => {
    setLoading(true);
    setError('');
    setTrends([]);
    try {
      const result = await fetchTrends(category);
      setTrends(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrends(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-800">Khám Phá Xu Hướng Thời Trang</h2>
        <p className="text-gray-600 mt-2">Chọn một chủ đề để xem các xu hướng nổi bật nhất.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {trendCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
              selectedCategory === category 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-pink-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center p-8">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Đang tìm kiếm xu hướng và tạo hình ảnh...</p>
        </div>
      )}
      {error && <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trends.map((trend, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
            <img src={trend.imageUrl} alt={trend.name} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-serif font-bold text-pink-600 mb-2">{trend.name}</h3>
              <p className="text-gray-600 mb-4 text-sm flex-grow">{trend.description}</p>
              <div>
                <h4 className="font-bold text-gray-700 mb-2">Món đồ chính:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                  {trend.keyItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;