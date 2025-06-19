
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Minimize, Palette } from 'lucide-react';
import { FrameType } from '@/pages/Index';

interface FrameSelectorProps {
  onFrameSelect: (frame: FrameType) => void;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ onFrameSelect }) => {
  const frames = [
    {
      id: 'cute' as FrameType,
      name: 'Cute & Kawaii',
      description: 'Với sticker mèo con dễ thương',
      icon: Heart,
      colors: 'from-pink-200 to-rose-200',
      borderColor: 'border-pink-300'
    },
    {
      id: 'retro' as FrameType,
      name: 'Retro Vintage',
      description: 'Phong cách hoài cổ',
      icon: Zap,
      colors: 'from-amber-200 to-orange-200',
      borderColor: 'border-amber-300'
    },
    {
      id: 'minimal' as FrameType,
      name: 'Minimal Clean',
      description: 'Đơn giản và tinh tế',
      icon: Minimize,
      colors: 'from-gray-100 to-slate-200',
      borderColor: 'border-gray-300'
    },
    {
      id: 'colorful' as FrameType,
      name: 'Colorful Fun',
      description: 'Đầy màu sắc và vui tươi',
      icon: Palette,
      colors: 'from-purple-200 to-blue-200',
      borderColor: 'border-purple-300'
    }
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Chọn khung nền yêu thích
      </h2>
      <p className="text-gray-600 mb-8">
        Hãy chọn một khung nền để bắt đầu chụp ảnh!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frames.map((frame) => {
          const IconComponent = frame.icon;
          return (
            <Card 
              key={frame.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${frame.borderColor} bg-gradient-to-br ${frame.colors}`}
              onClick={() => onFrameSelect(frame.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <IconComponent className="w-12 h-12 mx-auto text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {frame.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {frame.description}
                </p>
                <Button 
                  className="w-full bg-white/80 text-gray-800 hover:bg-white/90 border border-gray-300"
                  variant="outline"
                >
                  Chọn khung này
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FrameSelector;
