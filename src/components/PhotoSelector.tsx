import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Circle, ArrowRight, Camera, ImageIcon, Heart, Grid2x2, Grid3x3 } from 'lucide-react'

interface PhotoSelectorProps {
  photos: string[]
  onPhotosSelected: (selectedPhotos: string[], photoCount: 4 | 6) => void
}

const PhotoSelector: React.FC<PhotoSelectorProps> = ({ photos, onPhotosSelected }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [photoCount, setPhotoCount] = useState<4 | 6>(6)

  const togglePhotoSelection = (index: number) => {
    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else if (prev.length < photoCount) {
        return [...prev, index]
      }
      return prev
    })
  }

  const handleNext = () => {
    const selectedPhotos = selectedIndices.map(index => photos[index])
    onPhotosSelected(selectedPhotos, photoCount)
  }

  return (
    <div className='text-center max-w-6xl mx-auto px-4 py-8 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-sm'>
      <div className='mb-8'>
        <h2 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2'>
          Tạo Collage của bạn
        </h2>
        <p className='text-gray-600 max-w-lg mx-auto'>
          Chọn những khoảnh khắc đẹp nhất để tạo bộ sưu tập ảnh độc đáo
        </p>
      </div>

      {/* Chọn số lượng ảnh */}
      <div className='flex justify-center gap-4 mb-8'>
        <Button
          onClick={() => {
            setPhotoCount(4)
            setSelectedIndices(prev => prev.slice(0, 4))
          }}
          variant={photoCount === 4 ? 'default' : 'outline'}
          className={`px-8 py-3 rounded-full transition-all ${
            photoCount === 4
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'border-2 hover:border-blue-400'
          }`}
        >
          <Grid2x2 className='w-5 h-5 mr-2' />4 ảnh
        </Button>
        <Button
          onClick={() => {
            setPhotoCount(6)
          }}
          variant={photoCount === 6 ? 'default' : 'outline'}
          className={`px-8 py-3 rounded-full transition-all ${
            photoCount === 6
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'border-2 hover:border-blue-400'
          }`}
        >
          <Grid3x3 className='w-5 h-5 mr-2' />6 ảnh
        </Button>
      </div>

      <div className='inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-2 rounded-full mb-8 shadow-inner'>
        <Camera className='w-4 h-4' />
        <span className='font-medium'>
          Đã chọn {selectedIndices.length}/{photoCount} ảnh
        </span>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10'>
        {photos.map((photo, index) => {
          const isSelected = selectedIndices.includes(index)
          return (
            <Card
              key={index}
              className={`cursor-pointer overflow-hidden transition-all duration-300 hover:scale-102 ${
                isSelected
                  ? 'ring-4 ring-blue-400 shadow-lg transform scale-105'
                  : 'hover:shadow-lg border-2 border-gray-100'
              }`}
              onClick={() => togglePhotoSelection(index)}
            >
              <CardContent className='p-0 relative'>
                <div className='overflow-hidden'>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className={`w-full h-40 object-cover transition-transform duration-500 ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  />
                </div>

                {/* Selection Indicator */}
                <div className='absolute top-2 right-2 z-10'>
                  {isSelected ? (
                    <div className='bg-blue-500 text-white p-1 rounded-full shadow-md'>
                      <CheckCircle className='w-5 h-5' />
                    </div>
                  ) : (
                    <div className='bg-white bg-opacity-70 p-1 rounded-full shadow-sm'>
                      <Circle className='w-5 h-5 text-gray-400' />
                    </div>
                  )}
                </div>

                {/* Photo Number */}
                <div className='absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm'>
                  #{index + 1}
                </div>

                {/* Selection Order - Heart shape for selected photos */}
                {isSelected && (
                  <div className='absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md'>
                    {selectedIndices.indexOf(index) + 1}
                  </div>
                )}

                {/* Gradient overlay for unselected photos */}
                {!isSelected && (
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60 hover:opacity-0 transition-opacity duration-300'></div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selection Status - Progress bar */}
      <div className='mb-8 max-w-md mx-auto'>
        <div className='h-2 bg-gray-200 rounded-full mb-4 overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500'
            style={{ width: `${(selectedIndices.length / photoCount) * 100}%` }}
          ></div>
        </div>
        <div className='flex justify-between items-center text-sm text-gray-500'>
          <span>{selectedIndices.length} ảnh đã chọn</span>
          <span>{photoCount} ảnh cần thiết</span>
        </div>

        {selectedIndices.length < photoCount && (
          <p className='text-blue-600 mt-2 font-medium animate-pulse'>
            Vui lòng chọn thêm {photoCount - selectedIndices.length} ảnh nữa
          </p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleNext}
        disabled={selectedIndices.length !== photoCount}
        size='lg'
        className={`px-10 py-6 rounded-xl font-medium text-lg transition-all duration-300 ${
          selectedIndices.length === photoCount
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:translate-y-[-2px]'
            : 'bg-gray-300 text-gray-500'
        }`}
      >
        Chọn khung nền
        <ArrowRight className='w-5 h-5 ml-2' />
      </Button>
    </div>
  )
}

export default PhotoSelector
