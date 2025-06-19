
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RotateCcw, Shuffle, ArrowLeft } from 'lucide-react';
import { FrameType } from '@/pages/Index';
import { toast } from 'sonner';
import FrameSelector from './FrameSelector';

interface CollageCreatorProps {
  photos: string[];
  selectedFrame: FrameType;
  photoCount: 4 | 6;
  onRestart: () => void;
  onFrameChange: (frame: FrameType) => void;
  onBackToPhotoSelect: () => void;
}

const CollageCreator: React.FC<CollageCreatorProps> = ({ 
  photos, 
  selectedFrame, 
  photoCount,
  onRestart, 
  onFrameChange,
  onBackToPhotoSelect 
}) => {
  const collageRef = useRef<HTMLDivElement>(null);
  const [photoPositions, setPhotoPositions] = useState<string[]>(photos);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showFrameSelector, setShowFrameSelector] = useState(false);

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
    },
    elegant: {
      background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
      border: '4px solid #eab308',
      stickers: ['⭐', '✨', '🏆', '👑', '💎', '🌟']
    },
    cozy: {
      background: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 100%)',
      border: '4px solid #ea580c',
      stickers: ['☕', '🍂', '🏠', '🕯️', '🧸', '🍰']
    },
    nature: {
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      border: '4px solid #10b981',
      stickers: ['🌿', '🌺', '🦋', '🌸', '🍃', '🌼']
    },
    party: {
      background: 'linear-gradient(135deg, #fae8ff 0%, #cffafe 100%)',
      border: '4px solid #c026d3',
      stickers: ['🎉', '🎵', '🎭', '🎪', '🎈', '🥳']
    }
  };

  const currentStyle = frameStyles[selectedFrame];

  const getGridLayout = () => {
    if (photoCount === 4) {
      return 'grid-cols-2 grid-rows-2';
    }
    return 'grid-cols-3 grid-rows-2';
  };

  const getPhotoClass = (index: number) => {
    if (photoCount === 6) {
      return index === 0 || index === 5 ? 'row-span-2' : '';
    }
    return '';
  };

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
      // Create a new canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      if (selectedFrame === 'cute') {
        gradient.addColorStop(0, '#fce7f3');
        gradient.addColorStop(1, '#fdf2f8');
      } else if (selectedFrame === 'retro') {
        gradient.addColorStop(0, '#fef3c7');
        gradient.addColorStop(1, '#fde68a');
      } else {
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      // Draw photos
      const photoWidth = photoCount === 4 ? 350 : 250;
      const photoHeight = photoCount === 4 ? 260 : 180;
      
      let photoIndex = 0;
      for (const photoSrc of photoPositions) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve) => {
          img.onload = () => {
            const x = photoCount === 4 
              ? (photoIndex % 2) * 400 + 25
              : (photoIndex % 3) * 250 + 25;
            const y = photoCount === 4 
              ? Math.floor(photoIndex / 2) * 280 + 25
              : photoIndex < 3 ? 25 : 320;
            
            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            photoIndex++;
            resolve(void 0);
          };
          img.src = photoSrc;
        });
      }

      // Add watermark
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(650, 550, 140, 40);
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText('photobooth', 665, 575);

      // Download
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

  const handleFrameSelect = (frame: FrameType) => {
    onFrameChange(frame);
    setShowFrameSelector(false);
    toast.success('Đã thay đổi khung nền!');
  };

  if (showFrameSelector) {
    return (
      <div>
        <div className="mb-4">
          <Button
            onClick={() => setShowFrameSelector(false)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
        <FrameSelector 
          onFrameSelect={handleFrameSelect}
          selectedFrame={selectedFrame}
          showPreview={true}
        />
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Tạo Collage của bạn
      </h2>
      <p className="text-gray-600 mb-6">
        Kéo thả ảnh để đổi vị trí hoặc tải xuống kết quả cuối cùng!
      </p>

      {/* Collage Preview */}
      <div className="max-w-3xl mx-auto mb-8">
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
              <div className={`grid ${getGridLayout()} gap-3 p-6 h-full`}>
                {photoPositions.map((photo, index) => (
                  <div
                    key={index}
                    className={`relative group cursor-move transition-all duration-300 hover:scale-105 ${getPhotoClass(index)}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img
                      src={photo}
                      alt={`Collage photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                    
                    {/* Drag Indicator */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 font-semibold text-sm">
                        Kéo để đổi vị trí
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Stickers */}
              {currentStyle.stickers.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {currentStyle.stickers.slice(0, photoCount === 4 ? 4 : 6).map((sticker, index) => (
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
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <Button
          onClick={() => setShowFrameSelector(true)}
          variant="outline"
          size="lg"
          className="px-6 py-3"
        >
          Đổi khung nền
        </Button>
        
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
          onClick={onBackToPhotoSelect}
          variant="outline"
          size="lg"
          className="px-6 py-3"
        >
          Chọn lại ảnh
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
