import { Camera, Scan, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

export default function UploadArea({ onFilesUpload, onBarcodeScan }: { 
  onFilesUpload: (files: FileList) => void;
  onBarcodeScan: () => void;
}) {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      onFilesUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesUpload(e.target.files);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (error) {
      alert('No se pudo acceder a la cámara');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          const dt = new DataTransfer();
          dt.items.add(file);
          onFilesUpload(dt.files);
          stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  return (
    <>
      <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-neutral-300 rounded-2xl p-12 text-center hover:border-neutral-400 transition-colors bg-white mb-8">
        <div className="inline-flex w-16 h-16 bg-neutral-100 rounded-2xl items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-neutral-900" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">Subir Fotos de Productos</h3>
        <p className="text-neutral-600 mb-6">Arrastra imágenes, toma fotos o escanea códigos</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <label className="inline-block">
            <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
            <span className="px-6 py-3 bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer inline-block font-medium">Archivos</span>
          </label>
          <button onClick={startCamera} className="px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2">
            <Camera className="w-5 h-5" />Tomar Foto
          </button>
          <button onClick={onBarcodeScan} className="px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium flex items-center gap-2">
            <Scan className="w-5 h-5" />Escanear
          </button>
        </div>
      </div>
      {showCamera && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Capturar Foto</h3>
              <button onClick={stopCamera} className="text-neutral-400 hover:text-neutral-600"><X className="w-6 h-6" /></button>
            </div>
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl mb-4" />
            <button onClick={capturePhoto} className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-neutral-800">Capturar</button>
          </div>
        </div>
      )}
    </>
  );
}