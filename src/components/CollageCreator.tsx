import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, RotateCcw, Shuffle, ArrowLeft, Palette, Move, Sparkles } from 'lucide-react'
import { FrameType } from '@/pages/Index'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image-more'

interface CollageCreatorProps {
  photos: string[]
  selectedFrame: FrameType
  photoCount: 4 | 6
  onRestart: () => void
  onFrameChange: (frame: FrameType) => void
  onBackToPhotoSelect: () => void
}

const CollageCreator: React.FC<CollageCreatorProps> = ({
  photos,
  selectedFrame,
  photoCount,
  onRestart,
  onFrameChange,
  onBackToPhotoSelect
}) => {
  const collageRef = useRef<HTMLDivElement>(null)
  const [photoPositions, setPhotoPositions] = useState<string[]>(photos)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

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
  ]

  const currentFrameData = frames.find(f => f.id === selectedFrame) || frames[0]

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newPositions = [...photoPositions]
    const draggedPhoto = newPositions[draggedIndex]
    newPositions[draggedIndex] = newPositions[dropIndex]
    newPositions[dropIndex] = draggedPhoto

    setPhotoPositions(newPositions)
    setDraggedIndex(null)
    toast.success('Đã đổi vị trí ảnh!')
  }

  const shufflePhotos = () => {
    const shuffled = [...photoPositions].sort(() => Math.random() - 0.5)
    setPhotoPositions(shuffled)
    toast.success('Đã xáo trộn vị trí ảnh!')
  }
  const downloadCollage = async () => {
    if (!collageRef.current) return

    try {
      toast.info('Đang tạo ảnh collage...')

      // Method 1: Try html2canvas first
      try {
        const canvas = await html2canvas(collageRef.current, {
          backgroundColor: 'transparent',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: collageRef.current.offsetWidth,
          height: collageRef.current.offsetHeight,
          ignoreElements: element => {
            // Skip hover overlays and invisible elements
            return (
              element.classList.contains('opacity-0') &&
              !element.classList.contains('group-hover:opacity-100')
            )
          }
        })

        // Convert to blob
        canvas.toBlob(
          blob => {
            if (!blob) {
              throw new Error('Không thể tạo blob từ canvas')
            }

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `photobooth-collage-${selectedFrame}-${Date.now()}.png`
            link.href = url
            link.style.display = 'none'

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setTimeout(() => URL.revokeObjectURL(url), 100)
            toast.success('Collage đã được tải xuống thành công! 🎉')
          },
          'image/png',
          1.0
        )
      } catch (html2canvasError) {
        console.warn('html2canvas failed, trying dom-to-image:', html2canvasError)

        // Method 2: Try dom-to-image
        try {
          const dataUrl = await domtoimage.toPng(collageRef.current, {
            quality: 1.0,
            bgcolor: 'transparent',
            width: collageRef.current.offsetWidth * 2,
            height: collageRef.current.offsetHeight * 2,
            style: {
              transform: 'scale(2)',
              transformOrigin: 'top left'
            }
          })

          const link = document.createElement('a')
          link.download = `photobooth-collage-domtoimage-${selectedFrame}-${Date.now()}.png`
          link.href = dataUrl
          link.style.display = 'none'

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          toast.success('Collage đã được tải xuống (dom-to-image)! 🎉')
        } catch (domToImageError) {
          console.warn('dom-to-image failed, trying canvas fallback:', domToImageError)
          // Method 3: Canvas fallback
          await downloadCollageCanvasFallback()
        }
      }
    } catch (error) {
      console.error('Error downloading collage:', error)
      toast.error(`Có lỗi khi tải xuống: ${error.message}. Vui lòng thử lại!`)
    }
  }
  const downloadCollageCanvasFallback = async () => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Cannot get canvas context')

      // Set canvas size
      canvas.width = 800
      canvas.height = 1200

      // Create gradient background based on current frame
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)

      // Apply frame-specific gradients
      switch (selectedFrame) {
        case 'cute':
          gradient.addColorStop(0, '#ff9a9e')
          gradient.addColorStop(0.5, '#fecfef')
          gradient.addColorStop(1, '#fecfef')
          break
        case 'retro':
          gradient.addColorStop(0, '#ffeaa7')
          gradient.addColorStop(0.5, '#fab1a0')
          gradient.addColorStop(1, '#e17055')
          break
        case 'colorful':
          gradient.addColorStop(0, '#a29bfe')
          gradient.addColorStop(0.25, '#6c5ce7')
          gradient.addColorStop(0.5, '#fd79a8')
          gradient.addColorStop(0.75, '#fdcb6e')
          gradient.addColorStop(1, '#55efc4')
          break
        case 'elegant':
          gradient.addColorStop(0, '#f7dc6f')
          gradient.addColorStop(0.3, '#f4d03f')
          gradient.addColorStop(0.7, '#f8c471')
          gradient.addColorStop(1, '#e74c3c')
          break
        default:
          gradient.addColorStop(0, '#ddd6fe')
          gradient.addColorStop(1, '#e0e7ff')
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw photos in grid
      const photoWidth = 380
      const photoHeight = 380
      const padding = 10
      const startX = (canvas.width - (2 * photoWidth + padding)) / 2
      const startY = (canvas.height - (3 * photoHeight + 2 * padding)) / 2

      // Load and draw photos
      for (let i = 0; i < Math.min(photoPositions.length, photoCount); i++) {
        const photoSrc = photoPositions[i]
        const img = new Image()
        img.crossOrigin = 'anonymous'

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            const col = i % 2
            const row = Math.floor(i / 2)
            const x = startX + col * (photoWidth + padding)
            const y = startY + row * (photoHeight + padding)

            // Draw with rounded corners
            ctx.save()
            ctx.beginPath()

            // Manual rounded rectangle since roundRect might not be available
            const radius = 20
            ctx.moveTo(x + radius, y)
            ctx.lineTo(x + photoWidth - radius, y)
            ctx.quadraticCurveTo(x + photoWidth, y, x + photoWidth, y + radius)
            ctx.lineTo(x + photoWidth, y + photoHeight - radius)
            ctx.quadraticCurveTo(x + photoWidth, y + photoHeight, x + photoWidth - radius, y + photoHeight)
            ctx.lineTo(x + radius, y + photoHeight)
            ctx.quadraticCurveTo(x, y + photoHeight, x, y + photoHeight - radius)
            ctx.lineTo(x, y + radius)
            ctx.quadraticCurveTo(x, y, x + radius, y)
            ctx.closePath()

            ctx.clip()
            ctx.drawImage(img, x, y, photoWidth, photoHeight)
            ctx.restore()

            resolve()
          }
          img.onerror = () => reject(new Error(`Failed to load image: ${photoSrc}`))
          img.src = photoSrc
        })
      }

      // Add decorative elements as text
      ctx.font = '48px Arial'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'

      // Add frame name as watermark
      ctx.font = '24px Arial'
      ctx.fillText(currentFrameData.name, canvas.width / 2, canvas.height - 30)

      // Download the canvas
      canvas.toBlob(
        blob => {
          if (!blob) throw new Error('Cannot create blob')

          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `photobooth-collage-canvas-${selectedFrame}-${Date.now()}.png`
          link.href = url
          link.style.display = 'none'

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          setTimeout(() => URL.revokeObjectURL(url), 100)
          toast.success('Collage đã được tải xuống (Canvas method)! 🎉')
        },
        'image/png',
        1.0
      )
    } catch (error) {
      console.error('Canvas fallback error:', error)
      toast.error('Không thể tải xuống với phương pháp Canvas. Vui lòng thử lại!')
    }
  }

  const handleFrameSelect = (frameId: FrameType) => {
    onFrameChange(frameId)
    toast.success('Đã thay đổi khung nền!')
  }
  return (
    <div className='flex h-[calc(100vh-200px)] gap-6 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
      {/* Main Collage Display */}
      <div className='flex-1'>
        <div className='text-center mb-6'>
          <h2 className='text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2'>
            ✨ Tạo Collage của bạn ✨
          </h2>
          <p className='text-gray-600 text-lg'>Kéo thả ảnh để đổi vị trí hoặc chọn khung bên phải!</p>
        </div>
        <Card className='overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm'>
          <CardContent className='p-6'>
            {' '}
            <div
              ref={collageRef}
              data-print-target
              className='relative rounded-2xl overflow-hidden shadow-inner'
              style={{
                background: currentFrameData.colors,
                aspectRatio: '2/3',
                minHeight: '600px'
              }}
            >
              {/* Enhanced Grid Layout */}
              <div className='grid grid-cols-2 gap-3 p-6 h-full'>
                {photoPositions.slice(0, photoCount).map((photo, index) => (
                  <div
                    key={index}
                    className={`
                      relative group cursor-move transition-all duration-500 
                      hover:scale-105 hover:z-10 rounded-xl overflow-hidden
                      shadow-lg hover:shadow-2xl border-4 border-white/50
                      ${draggedIndex === index ? 'scale-110 z-20 rotate-2' : ''}
                    `}
                    draggable
                    onDragStart={e => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, index)}
                  >
                    <img
                      src={photo}
                      alt={`Collage photo ${index + 1}`}
                      className='w-full h-full object-cover aspect-square'
                    />

                    {/* Enhanced Hover Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center'>
                      <div className='text-center'>
                        <Move className='w-8 h-8 text-white mb-2 mx-auto animate-bounce' />
                        <span className='text-white font-bold text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm'>
                          Kéo để đổi vị trí
                        </span>
                      </div>
                    </div>

                    {/* Photo number indicator */}
                    <div className='absolute top-2 left-2 bg-white/90 text-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg'>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Decorative Elements */}
              {currentFrameData.decorativeElements?.map((element, index) => (
                <div
                  key={index}
                  className={`${element.className} drop-shadow-lg`}
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
                >
                  {element.element}
                </div>
              ))}

              {/* Frame Border Effect */}
              <div className='absolute inset-0 rounded-2xl border-4 border-white/30 pointer-events-none'></div>
            </div>
          </CardContent>
        </Card>{' '}
        {/* Enhanced Controls */}
        <div className='flex flex-wrap justify-center gap-4 mt-8'>
          <Button
            onClick={shufflePhotos}
            variant='outline'
            size='lg'
            className='bg-white/80 backdrop-blur-sm hover:bg-purple-50 border-purple-200 text-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group'
          >
            <Shuffle className='w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500' />
            Xáo trộn ảnh
          </Button>
          <Button
            onClick={downloadCollage}
            size='lg'
            className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group'
          >
            <Download className='w-5 h-5 mr-2 group-hover:animate-bounce' />
            Tải xuống Collage
          </Button>{' '}
          <Button
            onClick={downloadCollageCanvasFallback}
            variant='outline'
            size='lg'
            className='bg-white/80 backdrop-blur-sm hover:bg-yellow-50 border-yellow-200 text-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <Download className='w-5 h-5 mr-2' />
            Tải xuống (Canvas)
          </Button>
          <Button
            onClick={() => {
              toast.info('Đang mở cửa sổ in. Chọn "Save as PDF" hoặc "Print to file" để lưu ảnh!')
              setTimeout(() => window.print(), 500)
            }}
            variant='outline'
            size='lg'
            className='bg-white/80 backdrop-blur-sm hover:bg-gray-50 border-gray-200 text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <Download className='w-5 h-5 mr-2' />
            In/Lưu PDF
          </Button>
          <Button
            onClick={onBackToPhotoSelect}
            variant='outline'
            size='lg'
            className='bg-white/80 backdrop-blur-sm hover:bg-blue-50 border-blue-200 text-blue-700 shadow-lg hover:shadow-xl transition-all duration-300'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Chọn lại ảnh
          </Button>
          <Button
            onClick={onRestart}
            variant='outline'
            size='lg'
            className='bg-white/80 backdrop-blur-sm hover:bg-orange-50 border-orange-200 text-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 group'
          >
            <RotateCcw className='w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500' />
            Chụp lại từ đầu
          </Button>
        </div>
      </div>{' '}
      {/* Enhanced Frame Selector Sidebar */}
      <div className='w-80'>
        <div className='h-full'>
          <div className='sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-4 rounded-t-xl border-b border-purple-100'>
            <h3 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center justify-center'>
              <Palette className='w-6 h-6 mr-2 text-purple-600' />
              Chọn khung nền
            </h3>
            <p className='text-sm text-gray-600 text-center'>Chọn phong cách yêu thích của bạn</p>
          </div>

          <div className='grid grid-cols-1 gap-4 h-[calc(100%-100px)] overflow-y-auto pr-2 py-4 custom-scrollbar'>
            {frames.map(frame => (
              <Card
                key={frame.id}
                className={`
                  cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl 
                  border-2 overflow-hidden group relative
                  ${
                    selectedFrame === frame.id
                      ? 'ring-4 ring-purple-400 shadow-2xl scale-105 border-purple-400'
                      : 'border-white/50 hover:border-purple-200'
                  }
                `}
                style={{
                  background: frame.colors,
                  minHeight: '140px'
                }}
                onClick={() => handleFrameSelect(frame.id)}
              >
                <CardContent className='p-4 text-center relative'>
                  {/* Enhanced preview decorative elements */}
                  <div className='absolute top-2 right-2 text-xl opacity-80'>
                    {frame.preview.split('').map((emoji, i) => (
                      <span
                        key={i}
                        className='inline-block animate-bounce'
                        style={{
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: '2s'
                        }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>

                  {/* Frame name with better styling */}
                  <h4 className='text-sm font-bold text-gray-800 mb-3 mt-6 bg-white/80 rounded-full px-3 py-1 backdrop-blur-sm shadow-sm'>
                    {frame.name}
                  </h4>

                  {/* Enhanced selection button */}
                  <Button
                    className={`
                      w-full text-xs font-semibold transition-all duration-300
                      ${
                        selectedFrame === frame.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg scale-105'
                          : 'bg-white/90 text-gray-800 hover:bg-white border border-gray-300 hover:shadow-md'
                      }
                    `}
                    variant={selectedFrame === frame.id ? 'default' : 'outline'}
                    size='sm'
                  >
                    {selectedFrame === frame.id ? (
                      <>
                        <Sparkles className='w-3 h-3 mr-1' />
                        Đã chọn ✨
                      </>
                    ) : (
                      'Chọn khung này'
                    )}
                  </Button>

                  {/* Selection indicator */}
                  {selectedFrame === frame.id && (
                    <div className='absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg'>
                      <span className='text-white text-xs'>✓</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollageCreator
