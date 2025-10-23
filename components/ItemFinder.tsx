import React, { useState, useRef } from 'react';
import { analyzeItemByText, analyzeItemByImage } from '../services/geminiService';
import type { ItemAnalysis } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import LoadingSpinner from './LoadingSpinner';
import { UploadIcon } from './icons/UploadIcon';

const ItemFinder: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ItemAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await analyzeItemByText(textInput);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const base64Image = await fileToBase64(imageFile);
      const res = await analyzeItemByImage(base64Image, imageFile.type);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-gray-800">Tìm Kiếm Thông Tin Món Đồ</h2>
        <p className="text-gray-600 mt-2">Mô tả hoặc tải ảnh một món đồ để AI phân tích giúp bạn.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold mb-2">Tìm bằng mô tả</h3>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ví dụ: Một chiếc túi xách màu đỏ bằng da..."
              className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-pink-500 focus:border-pink-500"
              disabled={loading}
            />
            <button onClick={handleTextSubmit} disabled={loading || !textInput} className="mt-2 w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300 disabled:bg-pink-300">
              Phân tích văn bản
            </button>
          </div>
          <hr />
          <div>
            <h3 className="text-xl font-serif font-bold mb-2">Tìm bằng hình ảnh</h3>
            <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-pink-400"
                onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              {imagePreview ? (
                <img src={imagePreview} alt="Xem trước" className="max-h-40 mx-auto rounded-lg"/>
              ) : (
                <div className="text-gray-500">
                    <UploadIcon className="w-12 h-12 mx-auto text-gray-400"/>
                    <p>Nhấn để chọn ảnh</p>
                </div>
              )}
            </div>
            <button onClick={handleImageSubmit} disabled={loading || !imageFile} className="mt-4 w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300 disabled:bg-pink-300">
              Phân tích hình ảnh
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-serif font-bold mb-4">Kết quả phân tích</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600 text-center">AI đang phân tích và tạo hình ảnh phối đồ...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
          ) : result ? (
            <div className="space-y-4 animate-fade-in">
                <img src={result.imageUrl} alt="Gợi ý phối đồ" className="w-full h-auto rounded-lg object-cover aspect-[4/5]" />
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: result.description.replace(/\n/g, '<br />') }} />
            </div>
          ) : (
            <p className="text-gray-500">Kết quả sẽ được hiển thị ở đây.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemFinder;