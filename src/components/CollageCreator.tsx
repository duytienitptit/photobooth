
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

  const frames = [
    {
      id: 'cute' as FrameType,
      name: 'Cute & Kawaii',
      colors: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      borderColor: 'border-pink-400',
      preview: '🐱💕🌸',
      stickers: ['🐱', '🌸', '💕', '⭐', '🎀', '🦄'],
      decorativeElements: [
        { element: '💖', className: 'absolute top-4 right-4 text-3xl animate-pulse' },
        { element: '🌸', className: 'absolute top-12 left-4 text-2xl animate-bounce' },
        { element: '⭐', className: 'absolute bottom-8 right-8 text-2xl animate-spin' },
        { element: '🎀', className: 'absolute bottom-4 left-8 text-2xl animate-pulse' }
      ]
    },
    {
      id: 'retro' as FrameType,
      name: 'Retro Vintage',
      colors: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #e17055 100%)',
      borderColor: 'border-orange-400',
      preview: '📷🌻☀️',
      stickers: ['📷', '🌻', '☀️', '🎵', '📼', '🌈'],
      decorativeElements: [
        { element: '🌻', className: 'absolute top-6 right-6 text-3xl' },
        { element: '📷', className: 'absolute top-4 left-4 text-2xl' },
        { element: '☀️', className: 'absolute bottom-6 right-4 text-3xl animate-pulse' },
        { element: '🎵', className: 'absolute bottom-8 left-6 text-2xl' }
      ]
    },
    {
      id: 'minimal' as FrameType,
      name: 'Minimal Clean',
      colors: 'linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 50%, #f0f9ff 100%)',
      borderColor: 'border-indigo-300',
      preview: '✨⚪⬜',
      stickers: [],
      decorativeElements: [
        { element: '✨', className: 'absolute top-4 right-4 text-2xl opacity-60' },
        { element: '💫', className: 'absolute bottom-4 left-4 text-2xl opacity-60' }
      ]
    },
    {
      id: 'colorful' as FrameType,
      name: 'Colorful Fun',
      colors: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 25%, #fd79a8 50%, #fdcb6e 75%, #55efc4 100%)',
      borderColor: 'border-purple-400',
      preview: '🌈🎨🎪',
      stickers: ['🌈', '✨', '🎨', '🎪', '🎭', '🎊'],
      decorativeElements: [
        { element: '🌈', className: 'absolute top-4 right-4 text-3xl' },
        { element: '🎨', className: 'absolute top-12 left-4 text-2xl animate-bounce' },
        { element: '🎪', className: 'absolute bottom-6 right-6 text-2xl' },
        { element: '✨', className: 'absolute bottom-4 left-4 text-2xl animate-pulse' }
      ]
    },
    {
      id: 'elegant' as FrameType,
      name: 'Elegant Gold',
      colors: 'linear-gradient(135deg, #f7dc6f 0%, #f4d03f 30%, #f8c471 70%, #e74c3c 100%)',
      borderColor: 'border-yellow-500',
      preview: '⭐✨🏆',
      stickers: ['⭐', '✨', '🏆', '👑', '💎', '🥇'],
      decorativeElements: [
        { element: '👑', className: 'absolute top-4 right-4 text-3xl animate-pulse' },
        { element: '💎', className: 'absolute top-8 left-4 text-2xl' },
        { element: '🏆', className: 'absolute bottom-6 right-6 text-2xl' },
        { element: '⭐', className: 'absolute bottom-4 left-6 text-2xl animate-spin' }
      ]
    },
    {
      id: 'cozy' as FrameType,
      name: 'Cozy Coffee',
      colors: 'linear-gradient(135deg, #d63031 0%, #e17055 30%, #fdcb6e 70%, #fd79a8 100%)',
      borderColor: 'border-red-400',
      preview: '☕🍂🏠',
      stickers: ['☕', '🍂', '🏠', '🧸', '🍪', '🕯️'],
      decorativeElements: [
        { element: '☕', className: 'absolute top-4 right-4 text-3xl' },
        { element: '🍂', className: 'absolute top-12 left-4 text-2xl animate-bounce' },
        { element: '🏠', className: 'absolute bottom-6 right-6 text-2xl' },
        { element: '🧸', className: 'absolute bottom-4 left-6 text-2xl' }
      ]
    },
    {
      id: 'nature' as FrameType,
      name: 'Nature Fresh',
      colors: 'linear-gradient(135deg, #00b894 0%, #55efc4 30%, #81ecec 70%, #74b9ff 100%)',
      borderColor: 'border-green-400',
      preview: '🌿🌺🦋',
      stickers: ['🌿', '🌺', '🦋', '🌸', '🍃', '🐝'],
      decorativeElements: [
        { element: '🌿', className: 'absolute top-4 right-4 text-3xl animate-pulse' },
        { element: '🦋', className: 'absolute top-8 left-4 text-2xl animate-bounce' },
        { element: '🌺', className: 'absolute bottom-6 right-6 text-2xl' },
        { element: '🍃', className: 'absolute bottom-4 left-6 text-2xl' }
      ]
    },
    {
      id: 'party' as FrameType,
      name: 'Party Time',
      colors: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 25%, #e17055 50%, #6c5ce7 75%, #00b894 100%)',
      borderColor: 'border-pink-400',
      preview: '🎉🎵🎭',
      stickers: ['🎉', '🎵', '🎭', '🎪', '🎈', '🎊'],
      decorativeElements: [
        { element: '🎉', className: 'absolute top-4 right-4 text-3xl animate-bounce' },
        { element: '🎵', className: 'absolute top-12 left-4 text-2xl animate-pulse' },
        { element: '🎭', className: 'absolute bottom-6 right-6 text-2xl' },
        { element: '🎊', className: 'absolute bottom-4 left-6 text-2xl animate-spin' }
      ]
    },
    {
      id: 'pastel' as FrameType,
      name: 'Pastel Dream',
      colors: 'linear-gradient(135deg, #fab1a0 0%, #ffeaa7 25%, #55efc4 50%, #81ecec 75%, #a29bfe 100%)',
      borderColor: 'border-purple-300',
      preview: '🌸🦋☁️',
      stickers: ['🌸', '🦋', '☁️', '🌙', '⭐', '🌈'],
      decorativeElements: [
        { element: '🌸', className: 'absolute top-4 right-4 text-2xl animate-pulse' },
        { element: '🦋', className: 'absolute top-12 left-4 text-2xl animate-bounce' },
        { element: '☁️', className: 'absolute bottom-6 right-6 text-2xl' },
        { element: '🌙', className: 'absolute bottom-4 left-6 text-2xl' }
      ]
    },
    {
      id: 'neon' as FrameType,
      name: 'Neon Glow',
      colors: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 25%, #fd79a8 50%, #fdcb6e 75%, #00cec9 100%)',
      borderColor: 'border-purple-500',
      preview: '⚡🌟💫',
      stickers: ['⚡', '🌟', '💫', '🔥', '✨', '💥'],
      decorativeElements: [
        { element: '⚡', className: 'absolute top-4 right-4 text-3xl animate-pulse' },
        { element: '🌟', className: 'absolute top-8 left-4 text-2xl animate-spin' },
        { element: '💫', className: 'absolute bottom-6 right-6 text-2xl animate-bounce' },
        { element: '🔥', className: 'absolute bottom-4 left-6 text-2xl animate-pulse' }
      ]
    },
    {
      id: 'vintage' as FrameType,
      name: 'Vintage Film',
      colors: 'linear-gradient(135deg, #636e72 0%, #b2bec3 30%, #ddd6fe 70%, #fab1a0 100%)',
      borderColor: 'border-gray-400',
      preview: '🎞️📸🍁',
      stickers: ['🎞️', '📸', '🍁', '📷', '🎭', '🎪'],
      decorativeElements: [
        { element: '🎞️', className: 'absolute top-4 right-4 text-2xl' },
        { element: '📸', className: 'absolute top-12 left-4 text-2xl' },
        { element: '🍁', className: 'absolute bottom-6 right-6 text-2xl' },
        { element: '📷', className: 'absolute bottom-4 left-6 text-2xl' }
      ]
    },
    {
      id: 'modern' as FrameType,
      name: 'Modern Chic',
      colors: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 30%, #6c5ce7 70%, #a29bfe 100%)',
      borderColor: 'border-blue-400',
      preview: '💎🔷🌟',
      stickers: ['💎', '🔷', '🌟', '✨', '🔹', '💠'],
      decorativeElements: [
        { element: '💎', className: 'absolute top-4 right-4 text-2xl animate-pulse' },
        { element: '🔷', className: 'absolute top-12 left-4 text-2xl' },
        { element: '🌟', className: 'absolute bottom-6 right-6 text-2xl animate-spin' },
        { element: '✨', className: 'absolute bottom-4 left-6 text-2xl animate-bounce' }
      ]
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

      // Set canvas size for 2x3 layout (2 columns, 3 rows)
      canvas.width = 800;
      canvas.height = 1200;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 800, 1200);
      
      // Apply frame-specific gradients
      if (selectedFrame === 'cute') {
        gradient.addColorStop(0, '#ff9a9e');
        gradient.addColorStop(0.5, '#fecfef');
        gradient.addColorStop(1, '#fecfef');
      } else if (selectedFrame === 'retro') {
        gradient.addColorStop(0, '#ffeaa7');
        gradient.addColorStop(0.5, '#fab1a0');
        gradient.addColorStop(1, '#e17055');
      } else if (selectedFrame === 'colorful') {
        gradient.addColorStop(0, '#a29bfe');
        gradient.addColorStop(0.25, '#6c5ce7');
        gradient.addColorStop(0.5, '#fd79a8');
        gradient.addColorStop(0.75, '#fdcb6e');
        gradient.addColorStop(1, '#55efc4');
      } else if (selectedFrame === 'elegant') {
        gradient.addColorStop(0, '#f7dc6f');
        gradient.addColorStop(0.3, '#f4d03f');
        gradient.addColorStop(0.7, '#f8c471');
        gradient.addColorStop(1, '#e74c3c');
      } else {
        gradient.addColorStop(0, '#ddd6fe');
        gradient.addColorStop(1, '#e0e7ff');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 1200);

      // Draw photos in 2x3 grid with minimal padding
      const photoWidth = 380;
      const photoHeight = 380;
      const padding = 10;
      const startX = (800 - (2 * photoWidth + padding)) / 2;
      const startY = (1200 - (3 * photoHeight + 2 * padding)) / 2;

      for (let i = 0; i < Math.min(photoPositions.length, photoCount); i++) {
        const photoSrc = photoPositions[i];
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve) => {
          img.onload = () => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = startX + col * (photoWidth + padding);
            const y = startY + row * (photoHeight + padding);
            
            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            resolve(void 0);
          };
          img.src = photoSrc;
        });
      }

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
    <div className="flex h-[calc(100vh-200px)]">
      {/* Main Collage Display */}
      <div className="flex-1 pr-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Tạo Collage của bạn
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Kéo thả ảnh để đổi vị trí hoặc chọn khung bên phải!
        </p>

        <Card className="overflow-hidden shadow-2xl h-full">
          <CardContent className="p-4 h-full">
            <div
              ref={collageRef}
              className="relative h-full rounded-lg overflow-hidden"
              style={{
                background: currentFrameData.colors,
                minHeight: '600px'
              }}
            >
              {/* 2x3 Grid Layout */}
              <div className="grid grid-cols-2 gap-2 p-4 h-full">
                {photoPositions.slice(0, photoCount).map((photo, index) => (
                  <div
                    key={index}
                    className="relative group cursor-move transition-all duration-300 hover:scale-105 rounded-lg overflow-hidden"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img
                      src={photo}
                      alt={`Collage photo ${index + 1}`}
                      className="w-full h-full object-cover aspect-square rounded-lg"
                    />
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-lg">
                      <span className="text-white opacity-0 group-hover:opacity-100 font-semibold text-sm">
                        Kéo để đổi vị trí
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Elements */}
              {currentFrameData.decorativeElements?.map((element, index) => (
                <div
                  key={index}
                  className={element.className}
                >
                  {element.element}
                </div>
              ))}
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

      {/* Frame Selector Sidebar - Full Height */}
      <div className="w-80 pl-4">
        <div className="h-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center sticky top-0 bg-white z-10 py-2">
            <Palette className="w-5 h-5 mr-2" />
            Chọn khung nền
          </h3>
          
          <div className="grid grid-cols-1 gap-3 h-[calc(100%-60px)] overflow-y-auto pr-2">
            {frames.map((frame) => (
              <Card 
                key={frame.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-3 ${
                  selectedFrame === frame.id ? 'ring-4 ring-blue-400 shadow-xl scale-105' : frame.borderColor
                } overflow-hidden`}
                style={{ 
                  background: frame.colors,
                  minHeight: '120px'
                }}
                onClick={() => handleFrameSelect(frame.id)}
              >
                <CardContent className="p-4 text-center relative">
                  {/* Preview decorative elements */}
                  <div className="absolute top-2 right-2 text-lg opacity-70">
                    {frame.preview.split('').map((emoji, i) => (
                      <span key={i} className="inline-block animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                        {emoji}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="text-sm font-bold text-gray-800 mb-2 mt-4">
                    {frame.name}
                  </h4>
                  
                  <Button 
                    className={`w-full text-xs ${
                      selectedFrame === frame.id 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                        : 'bg-white/90 text-gray-800 hover:bg-white border border-gray-400'
                    }`}
                    variant={selectedFrame === frame.id ? "default" : "outline"}
                    size="sm"
                  >
                    {selectedFrame === frame.id ? 'Đã chọn ✓' : 'Chọn khung này'}
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
