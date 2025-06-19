
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RotateCcw, Shuffle } from 'lucide-react';
import { FrameType } from '@/pages/Index';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface CollageCreatorProps {
  photos: string[];
  selectedFrame: FrameType;
  onRestart: () => void;
}

const CollageCreator: React.FC<CollageCreatorProps> = ({ photos, selectedFrame, onRestart }) => {
  const collageRef = useRef<HTMLDivElement>(null);
  const [photoPositions, setPhotoPositions] = useState<string[]>(photos);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const frameStyles = {
    cute: {
      background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
      border: '4px solid #f472b6',
      stickers: ['🐱', '🌸', '💕', '⭐', '🎀', '🦄']
    },
    retro: {
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      border: '4px solid #d97706',
      stickers: ['📷', '🌻', '☀️', '🎵', '📼', '🌈']
    },
    minimal: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      border: '2px solid #64748b',
      stickers: []
    },
    colorful: {
      background: 'linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)',
      border: '4px solid #8b5cf6',
      stickers: ['🌈', '✨', '🎨', '🎪', '🎭', '🎊']
    }
  };

  const currentStyle = frameStyles[selectedFrame];

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newPositions = [...photoPositions];
    const draggedPhoto = newPositions[draggedIndex];
    newPositions[draggedIndex] = newPositions[dropIndex];
    newPositions[dropIndex] = draggedPhoto;
    
    setPhotoPositions(newPositions);
    setDraggedIndex(null);
    toast.success('Đã đổi vị trí ảnh!');
  };

  const shufflePhotos = () => {
    const shuffled = [...photoPositions].sort(() => Math.random() - 0.5);
    setPhotoPositions(shuffled);
    toast.success('Đã xáo trộn vị trí ảnh!');
  };

  const downloadCollage = async () => {
    if (!collageRef.current) return;

    try {
      const canvas = await html2canvas(collageRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `photobooth-collage-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Collage đã được tải xuống!');
    } catch (error) {
      console.error('Error downloading collage:', error);
      toast.error('Có lỗi khi tải xuống. Vui lòng thử lại!');
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Tạo Collage của bạn
      </h2>
      <p className="text-gray-600 mb-6">
        Kéo th ảnh để đổi vị trí hoặc tải xuống kết quả cuối cùng!
      </p>

      {/* Collage Preview */}
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div
              ref={collageRef}
              className="relative"
              style={{
                background: currentStyle.background,
                border: currentStyle.border,
                minHeight: '600px'
              }}
            >
              {/* Main Grid Layout */}
              <div className="grid grid-cols-3 grid-rows-2 gap-2 p-4 h-full">
                {photoPositions.map((photo, index) => (
                  <div
                    key={index}
                    className={`relative group cursor-move transition-all duration-300 hover:scale-105 ${
                      index === 0 || index === 5 ? 'row-span-2' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img
                      src={photo}
                      alt={`Collage photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-md"
                      style={{ imageRendering: 'auto' }}
                    />
                    
                    {/* Drag Indicator */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 font-semibold">
                        Kéo để đổi vị trí
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Stickers */}
              {currentStyle.stickers.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {currentStyle.stickers.map((sticker, index) => (
                    <div
                      key={index}
                      className="absolute text-2xl animate-bounce"
                      style={{
                        top: `${10 + (index * 15) % 70}%`,
                        left: `${5 + (index * 20) % 80}%`,
                        animationDelay: `${index * 0.2}s`,
                        animationDuration: '3s'
                      }}
                    >
                      {sticker}
                    </div>
                  ))}
                </div>
              )}

              {/* Photobooth Label */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm font-semibold">
                photobooth
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={shufflePhotos}
          variant="outline"
          size="lg"
          className="px-6 py-3"
        >
          <Shuffle className="w-5 h-5 mr-2" />
          Xáo trộn
        </Button>
        
        <Button
          onClick={downloadCollage}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
        >
          <Download className="w-5 h-5 mr-2" />
          Tải xuống
        </Button>
        
        <Button
          onClick={onRestart}
          variant="outline"
          size="lg"
          className="px-6 py-3"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Chụp lại
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-500 max-w-md mx-auto">
        <p>💡 Mẹo: Kéo và thả ảnh để đổi vị trí trong collage. Nhấn "Tải xuống" để lưu collage về máy!</p>
      </div>
    </div>
  );
};

export default CollageCreator;
