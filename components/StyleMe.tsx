import React, { useState } from 'react';
import { generateOutfit } from '../services/geminiService';
import type { OutfitRecommendation } from '../types';
import LoadingSpinner from './LoadingSpinner';

const StyleMe: React.FC = () => {
  const [bodyShape, setBodyShape] = useState('Đồng hồ cát');
  const [style, setStyle] = useState('Thanh lịch');
  const [occasion, setOccasion] = useState('Đi làm công sở');
  const [weather, setWeather] = useState('Nắng nhẹ, 28 độ C');
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const result = await generateOutfit(bodyShape, style, occasion, weather);
      setRecommendation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-800">Tư Vấn Phong Cách Cá Nhân</h2>
        <p className="text-gray-600 mt-2">Điền thông tin dưới đây để nhận gợi ý phối đồ từ AI nhé!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          <div>
            <label htmlFor="bodyShape" className="block text-sm font-bold text-gray-700 mb-2">Dáng người của bạn?</label>
            <select id="bodyShape" value={bodyShape} onChange={(e) => setBodyShape(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500">
              <option>Đồng hồ cát</option>
              <option>Quả lê</option>
              <option>Quả táo</option>
              <option>Chữ nhật</option>
              <option>Tam giác ngược</option>
            </select>
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-bold text-gray-700 mb-2">Phong cách yêu thích?</label>
            <input type="text" id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <div>
            <label htmlFor="occasion" className="block text-sm font-bold text-gray-700 mb-2">Bạn mặc cho dịp nào?</label>
            <input type="text" id="occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <div>
            <label htmlFor="weather" className="block text-sm font-bold text-gray-700 mb-2">Thời tiết hôm nay?</label>
            <input type="text" id="weather" value={weather} onChange={(e) => setWeather(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300 disabled:bg-pink-300 flex items-center justify-center">
            {loading ? <LoadingSpinner /> : 'Nhận Gợi Ý'}
          </button>
        </form>

        <div className="mt-8 md:mt-0">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-2xl shadow-lg min-h-[400px]">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">AI đang phối đồ và vẽ tranh cho bạn...</p>
            </div>
          )}
          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          {recommendation && (
            <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in">
              <img src={recommendation.imageUrl} alt={recommendation.outfitName} className="w-full h-auto rounded-lg mb-6 object-cover aspect-[4/5]" />
              <div className="p-2">
                <h3 className="text-2xl font-serif font-bold text-pink-600">{recommendation.outfitName}</h3>
                <p className="text-gray-600 mt-2 mb-6 italic">{recommendation.description}</p>
                <div className="space-y-4">
                  {recommendation.items.map((item, index) => (
                    <div key={index} className="p-4 bg-pink-50 rounded-lg">
                      <p className="font-bold text-gray-800">{item.type}</p>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleMe;