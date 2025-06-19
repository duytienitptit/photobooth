
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Minimize, Palette, Star, Coffee, Flower, Music } from 'lucide-react';
import { FrameType } from '@/pages/Index';

interface FrameSelectorProps {
  onFrameSelect: (frame: FrameType) => void;
  selectedFrame?: FrameType;
  showPreview?: boolean;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ onFrameSelect, selectedFrame, showPreview = false }) => {
  const frames = [
    {
      id: 'cute' as FrameType,
      name: 'Cute & Kawaii',
      description: 'Với sticker mèo con dễ thương',
      icon: Heart,
      colors: 'from-pink-200 to-rose-200',
      borderColor: 'border-pink-300',
      preview: '🐱💕🌸'
    },
    {
      id: 'retro' as FrameType,
      name: 'Retro Vintage',
      description: 'Phong cách hoài cổ',
      icon: Zap,
      colors: 'from-amber-200 to-orange-200',
      borderColor: 'border-amber-300',
      preview: '📷🌻☀️'
    },
    {
      id: 'minimal' as FrameType,
      name: 'Minimal Clean',
      description: 'Đơn giản và tinh tế',
      icon: Minimize,
      colors: 'from-gray-100 to-slate-200',
      borderColor: 'border-gray-300',
      preview: '✨⚪⬜'
    },
    {
      id: 'colorful' as FrameType,
      name: 'Colorful Fun',
      description: 'Đầy màu sắc và vui tươi',
      icon: Palette,
      colors: 'from-purple-200 to-blue-200',
      borderColor: 'border-purple-300',
      preview: '🌈🎨🎪'
    },
    {
      id: 'elegant' as FrameType,
      name: 'Elegant Gold',
      description: 'Sang trọng và lịch lãm',
      icon: Star,
      colors: 'from-yellow-100 to-amber-100',
      borderColor: 'border-yellow-400',
      preview: '⭐✨🏆'
    },
    {
      id: 'cozy' as FrameType,
      name: 'Cozy Coffee',
      description: 'Ấm áp và thân thiện',
      icon: Coffee,
      colors: 'from-orange-100 to-red-100',
      borderColor: 'border-orange-300',
      preview: '☕🍂🏠'
    },
    {
      id: 'nature' as FrameType,
      name: 'Nature Fresh',
      description: 'Tự nhiên và tươi mát',
      icon: Flower,
      colors: 'from-green-100 to-emerald-100',
      borderColor: 'border-green-300',
      preview: '🌿🌺🦋'
    },
    {
      id: 'party' as FrameType,
      name: 'Party Time',
      description: 'Vui nhộn và sôi động',
      icon: Music,
      colors: 'from-fuchsia-200 to-cyan-200',
      borderColor: 'border-fuchsia-300',
      preview: '🎉🎵🎭'
    }
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {showPreview ? 'Chọn khung cho collage' : 'Chọn khung nền yêu thích'}
      </h2>
      <p className="text-gray-600 mb-8">
        {showPreview ? 'Chọn khung phù hợp với phong cách của bạn!' : 'Hãy chọn một khung nền để bắt đầu chụp ảnh!'}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {frames.map((frame) => {
          const IconComponent = frame.icon;
          const isSelected = selectedFrame === frame.id;
          return (
            <Card 
              key={frame.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                isSelected ? 'ring-4 ring-blue-400 shadow-lg' : frame.borderColor
              } bg-gradient-to-br ${frame.colors}`}
              onClick={() => onFrameSelect(frame.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="mb-3">
                  <IconComponent className="w-8 h-8 mx-auto text-gray-700" />
                </div>
                
                {/* Preview của khung */}
                <div className="text-2xl mb-2">{frame.preview}</div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {frame.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {frame.description}
                </p>
                <Button 
                  className={`w-full text-sm ${
                    isSelected 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-white/80 text-gray-800 hover:bg-white/90 border border-gray-300'
                  }`}
                  variant={isSelected ? "default" : "outline"}
                >
                  {isSelected ? 'Đã chọn' : 'Chọn khung này'}
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
