
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface PhotoSelectorProps {
  photos: string[];
  onPhotosSelected: (selectedPhotos: string[]) => void;
}

const PhotoSelector: React.FC<PhotoSelectorProps> = ({ photos, onPhotosSelected }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const togglePhotoSelection = (index: number) => {
    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else if (prev.length < 6) {
        return [...prev, index];
      }
      return prev;
    });
  };

  const handleNext = () => {
    const selectedPhotos = selectedIndices.map(index => photos[index]);
    onPhotosSelected(selectedPhotos);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Chọn 6 ảnh yêu thích
      </h2>
      <p className="text-gray-600 mb-6">
        Đã chọn {selectedIndices.length}/6 ảnh
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {photos.map((photo, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'ring-4 ring-pink-400 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => togglePhotoSelection(index)}
            >
              <CardContent className="p-2 relative">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                
                {/* Selection Indicator */}
                <div className="absolute top-1 right-1">
                  {isSelected ? (
                    <CheckCircle className="w-6 h-6 text-pink-500 bg-white rounded-full" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 bg-white bg-opacity-80 rounded-full" />
                  )}
                </div>

                {/* Photo Number */}
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>

                {/* Selection Order */}
                {isSelected && (
                  <div className="absolute top-1 left-1 bg-pink-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {selectedIndices.indexOf(index) + 1}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection Status */}
      <div className="mb-6">
        <div className="flex justify-center items-center gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all ${
                index < selectedIndices.length
                  ? 'bg-pink-500 scale-110'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        {selectedIndices.length < 6 && (
          <p className="text-gray-500">
            Vui lòng chọn thêm {6 - selectedIndices.length} ảnh nữa
          </p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleNext}
        disabled={selectedIndices.length !== 6}
        size="lg"
        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
      >
        Tạo Collage
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default PhotoSelector;
