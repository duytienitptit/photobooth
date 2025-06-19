
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, CheckCircle, Timer, MousePointer } from 'lucide-react';
import { FrameType } from '@/pages/Index';
import { toast } from 'sonner';

interface CameraCaptureProps {
  selectedFrame: FrameType;
  onComplete: (photos: string[]) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ selectedFrame, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [captureMode, setCaptureMode] = useState<'auto' | 'manual'>('auto');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const playBeepSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const startCountdown = () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    setCountdown(10);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          capturePhoto();
          return 0;
        }
        playBeepSound();
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhotoManual = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setTimeout(() => {
      capturePhoto();
    }, 100);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    addFrameOverlay(ctx, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL('image/png');
    
    const newPhotos = [...capturedPhotos, photoDataUrl];
    setCapturedPhotos(newPhotos);
    setCurrentPhotoIndex(prev => prev + 1);
    setIsCapturing(false);

    toast.success(`Ảnh ${newPhotos.length}/10 đã được chụp!`);

    if (newPhotos.length >= 10) {
      setTimeout(() => {
        stopCamera();
        onComplete(newPhotos);
      }, 1000);
    }
  };

  const addFrameOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    switch (selectedFrame) {
      case 'cute':
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(255, 182, 193, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 105, 180, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, 20);
        ctx.fillRect(0, height-20, width, 20);
        ctx.fillRect(0, 0, 20, height);
        ctx.fillRect(width-20, 0, 20, height);
        break;
      
      case 'retro':
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(240, 230, 140, 0.2)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        break;
      
      case 'minimal':
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, width, height);
        break;
      
      case 'colorful':
        const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0000ff', '#8000ff'];
        for (let i = 0; i < colors.length; i++) {
          ctx.strokeStyle = colors[i];
          ctx.lineWidth = 3;
          ctx.strokeRect(i * 2, i * 2, width - i * 4, height - i * 4);
        }
        break;
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Chụp ảnh với khung {selectedFrame}
      </h2>
      <p className="text-gray-600 mb-6">
        {capturedPhotos.length < 10 
          ? `Ảnh ${capturedPhotos.length + 1}/10 - Chọn chế độ chụp và bắt đầu!`
          : 'Hoàn thành! Đang chuyển sang bước tiếp theo...'
        }
      </p>

      {/* Capture Mode Selector */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={() => setCaptureMode('auto')}
          variant={captureMode === 'auto' ? "default" : "outline"}
          className="px-6 py-2"
        >
          <Timer className="w-4 h-4 mr-2" />
          Tự động (10s)
        </Button>
        <Button
          onClick={() => setCaptureMode('manual')}
          variant={captureMode === 'manual' ? "default" : "outline"}
          className="px-6 py-2"
        >
          <MousePointer className="w-4 h-4 mr-2" />
          Thủ công
        </Button>
      </div>

      <div className="relative max-w-2xl mx-auto mb-6">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
          />
          
          {countdown > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-8xl font-bold text-white animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {isCapturing && countdown === 0 && (
            <div className="absolute inset-0 bg-white animate-ping" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {captureMode === 'auto' ? (
          <Button
            onClick={startCountdown}
            disabled={isCapturing || capturedPhotos.length >= 10}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
          >
            <Camera className="w-5 h-5 mr-2" />
            {isCapturing && countdown > 0 ? `${countdown}s` : 'Chụp tự động'}
          </Button>
        ) : (
          <Button
            onClick={capturePhotoManual}
            disabled={isCapturing || capturedPhotos.length >= 10}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
          >
            <Camera className="w-5 h-5 mr-2" />
            {isCapturing ? 'Đang chụp...' : 'Chụp ngay'}
          </Button>
        )}
        
        <Button
          onClick={startCamera}
          variant="outline"
          size="lg"
          className="px-6 py-3"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset Camera
        </Button>
      </div>

      {/* Photo Thumbnails */}
      {capturedPhotos.length > 0 && (
        <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto">
          {capturedPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Captured ${index + 1}`}
                className="w-full h-20 object-cover rounded border-2 border-green-400"
              />
              <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
            </div>
          ))}
          {Array.from({ length: 10 - capturedPhotos.length }).map((_, index) => (
            <div key={`empty-${index}`} className="w-full h-20 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-sm">{capturedPhotos.length + index + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
