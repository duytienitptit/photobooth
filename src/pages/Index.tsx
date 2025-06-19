
import React, { useState } from 'react';
import { Camera, ImageIcon, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CameraCapture from '@/components/CameraCapture';
import FrameSelector from '@/components/FrameSelector';
import PhotoSelector from '@/components/PhotoSelector';
import CollageCreator from '@/components/CollageCreator';
import { toast } from 'sonner';

export type FrameType = 'cute' | 'retro' | 'minimal' | 'colorful';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'frame' | 'capture' | 'select' | 'collage'>('frame');
  const [selectedFrame, setSelectedFrame] = useState<FrameType>('cute');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const handleFrameSelect = (frame: FrameType) => {
    setSelectedFrame(frame);
    setCurrentStep('capture');
    toast.success('Khung nền đã được chọn! Sẵn sàng chụp ảnh!');
  };

  const handlePhotosComplete = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentStep('select');
    toast.success(`Đã chụp ${photos.length} ảnh! Hãy chọn 6 ảnh yêu thích.`);
  };

  const handlePhotosSelected = (photos: string[]) => {
    if (photos.length !== 6) {
      toast.error('Vui lòng chọn đúng 6 ảnh!');
      return;
    }
    setSelectedPhotos(photos);
    setCurrentStep('collage');
    toast.success('Tuyệt vời! Bây giờ hãy tạo collage của bạn!');
  };

  const handleRestart = () => {
    setCurrentStep('frame');
    setCapturedPhotos([]);
    setSelectedPhotos([]);
    toast.info('Bắt đầu lại từ đầu!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Photobooth Magic
            </h1>
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Chụp 10 ảnh, chọn 6 ảnh yêu thích và tạo collage tuyệt đẹp!
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['frame', 'capture', 'select', 'collage'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep === step 
                    ? 'bg-pink-500 text-white shadow-lg scale-110' 
                    : capturedPhotos.length > 0 && index < 2 || selectedPhotos.length > 0 && index < 3
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && <div className="w-8 h-1 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {currentStep === 'frame' && (
              <FrameSelector onFrameSelect={handleFrameSelect} />
            )}
            
            {currentStep === 'capture' && (
              <CameraCapture 
                selectedFrame={selectedFrame}
                onComplete={handlePhotosComplete}
              />
            )}
            
            {currentStep === 'select' && (
              <PhotoSelector 
                photos={capturedPhotos}
                onPhotosSelected={handlePhotosSelected}
              />
            )}
            
            {currentStep === 'collage' && (
              <CollageCreator 
                photos={selectedPhotos}
                selectedFrame={selectedFrame}
                onRestart={handleRestart}
              />
            )}
          </CardContent>
        </Card>

        {/* Restart Button */}
        {currentStep !== 'frame' && (
          <div className="text-center mt-6">
            <Button 
              onClick={handleRestart}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm hover:bg-pink-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Bắt đầu lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
