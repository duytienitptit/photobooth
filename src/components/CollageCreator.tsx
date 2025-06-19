
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RotateCcw, Shuffle, ArrowLeft, Palette } from 'lucide-react';
import { FrameType } from '@/pages/Index';
import { toast } from 'sonner';

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

  const frames = [
    {
      id: 'cute' as FrameType,
      name: 'Cute & Kawaii',
      description: 'Với sticker mèo con dễ thương',
      colors: 'from-pink-200 to-rose-200',
      borderColor: 'border-pink-300',
      preview: '🐱💕🌸',
      background: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
      border: '4px solid #f472b6',
      stickers: ['🐱', '🌸', '💕', '⭐', '🎀', '🦄']
    },
    {
      id: 'retro' as FrameType,
      name: 'Retro Vintage',
      description: 'Phong cách hoài cổ',
      colors: 'from-amber-200 to-orange-200',
      borderColor: 'border-amber-300',
      preview: '📷🌻☀️',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      border: '4px solid #d97706',
      stickers: ['📷', '🌻', '☀️', '🎵', '📼', '🌈']
    },
    {
      id: 'minimal' as FrameType,
      name: 'Minimal Clean',
      description: 'Đơn giản và tinh tế',
      colors: 'from-gray-100 to-slate-200',
      borderColor: 'border-gray-300',
      preview: '✨⚪⬜',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      border: '2px solid #64748b',
      stickers: []
    },
    {
      id: 'colorful' as FrameType,
      name: 'Colorful Fun',
      description: 'Đầy màu sắc và vui tươi',
      colors: 'from-purple-200 to-blue-200',
      borderColor: 'border-purple-300',
      preview: '🌈🎨🎪',
      background: 'linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)',
      border: '4px solid #8b5cf6',
      stickers: ['🌈', '✨', '🎨', '🎪', '🎭', '🎊']
    }
  ];

  const currentFrameData = frames.find(f => f.id === selectedFrame) || frames[0];

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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size for 6-photo layout (3x2)
      canvas.width = 1200;
      canvas.height = 800;

      // Draw background with frame style
      const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
      if (selectedFrame === 'cute') {
        gradient.addColorStop(0, '#fce7f3');
        gradient.addColorStop(1, '#fdf2f8');
      } else if (selectedFrame === 'retro') {
        gradient.addColorStop(0, '#fef3c7');
        gradient.addColorStop(1, '#fde68a');
      } else if (selectedFrame === 'colorful') {
        gradient.addColorStop(0, '#ddd6fe');
        gradient.addColorStop(1, '#c7d2fe');
      } else {
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Draw photos in 3x2 grid with padding
      const photoWidth = 360;
      const photoHeight = 240;
      const padding = 40;
      const startX = padding;
      const startY = padding;

      for (let i = 0; i < Math.min(photoPositions.length, photoCount); i++) {
        const photoSrc = photoPositions[i];
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve) => {
          img.onload = () => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = startX + col * (photoWidth + padding);
            const y = startY + row * (photoHeight + padding);
            
            // Draw white border around photo
            ctx.fillStyle = 'white';
            ctx.fillRect(x - 4, y - 4, photoWidth + 8, photoHeight + 8);
            
            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            resolve(void 0);
          };
          img.src = photoSrc;
        });
      }

      // Add decorative stickers around photos (like in reference image)
      if (currentFrameData.stickers.length > 0) {
        ctx.font = '48px Arial';
        const stickerPositions = [
          { x: 50, y: 100, sticker: currentFrameData.stickers[0] },
          { x: 1100, y: 150, sticker: currentFrameData.stickers[1] },
          { x: 100, y: 400, sticker: currentFrameData.stickers[2] },
          { x: 1000, y: 450, sticker: currentFrameData.stickers[3] },
          { x: 200, y: 700, sticker: currentFrameData.stickers[4] },
          { x: 950, y: 720, sticker: currentFrameData.stickers[5] || currentFrameData.stickers[0] }
        ];

        stickerPositions.forEach(({ x, y, sticker }) => {
          ctx.fillText(sticker, x, y);
        });
      }

      // Add watermark
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(500, 720, 200, 60);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('photobooth', 600, 760);

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

  const handleFrameSelect = (frameId: FrameType) => {
    onFrameChange(frameId);
    toast.success('Đã thay đổi khung nền!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Collage Display */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Tạo Collage của bạn
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Kéo thả ảnh để đổi vị trí hoặc chọn khung bên phải!
        </p>

        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div
              ref={collageRef}
              className="relative"
              style={{
                background: currentFrameData.background,
                border: currentFrameData.border,
                minHeight: '600px'
              }}
            >
              {/* 3x2 Grid Layout for 6 photos */}
              <div className="grid grid-cols-3 grid-rows-2 gap-4 p-8 h-full">
                {photoPositions.slice(0, photoCount).map((photo, index) => (
                  <div
                    key={index}
                    className="relative group cursor-move transition-all duration-300 hover:scale-105 bg-white p-1 rounded shadow-lg"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img
                      src={photo}
                      alt={`Collage photo ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 font-semibold text-sm">
                        Kéo để đổi vị trí
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Stickers */}
              {currentFrameData.stickers.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {currentFrameData.stickers.slice(0, 6).map((sticker, index) => {
                    const positions = [
                      { top: '10%', left: '5%' },
                      { top: '15%', right: '8%' },
                      { top: '45%', left: '3%' },
                      { top: '50%', right: '5%' },
                      { bottom: '15%', left: '8%' },
                      { bottom: '10%', right: '10%' }
                    ];
                    return (
                      <div
                        key={index}
                        className="absolute text-3xl animate-bounce"
                        style={{
                          ...positions[index],
                          animationDelay: `${index * 0.2}s`,
                          animationDuration: '3s'
                        }}
                      >
                        {sticker}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Photobooth Label */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm font-semibold">
                photobooth
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button
            onClick={shufflePhotos}
            variant="outline"
            size="lg"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Xáo trộn
          </Button>
          
          <Button
            onClick={downloadCollage}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Download className="w-5 h-5 mr-2" />
            Tải xuống
          </Button>
          
          <Button
            onClick={onBackToPhotoSelect}
            variant="outline"
            size="lg"
          >
            Chọn lại ảnh
          </Button>
          
          <Button
            onClick={onRestart}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Chụp lại
          </Button>
        </div>
      </div>

      {/* Frame Selector Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Chọn khung nền
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {frames.map((frame) => (
              <Card 
                key={frame.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                  selectedFrame === frame.id ? 'ring-4 ring-blue-400 shadow-lg' : frame.borderColor
                } bg-gradient-to-br ${frame.colors}`}
                onClick={() => handleFrameSelect(frame.id)}
              >
                <CardContent className="p-3 text-center">
                  <div className="text-lg mb-2">{frame.preview}</div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    {frame.name}
                  </h4>
                  <p className="text-gray-600 text-xs mb-2">
                    {frame.description}
                  </p>
                  <Button 
                    className={`w-full text-xs ${
                      selectedFrame === frame.id 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-white/80 text-gray-800 hover:bg-white/90 border border-gray-300'
                    }`}
                    variant={selectedFrame === frame.id ? "default" : "outline"}
                    size="sm"
                  >
                    {selectedFrame === frame.id ? 'Đã chọn' : 'Chọn'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollageCreator;
