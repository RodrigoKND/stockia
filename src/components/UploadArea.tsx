import { Upload } from 'lucide-react';

export default function UploadArea({ onFilesUpload }: { onFilesUpload: (files: FileList) => void }) {
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

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-neutral-300 rounded-2xl p-12 text-center hover:border-neutral-400 transition-colors bg-white mb-8"
    >
      <div className="inline-flex w-16 h-16 bg-neutral-100 rounded-2xl items-center justify-center mb-4">
        <Upload className="w-8 h-8 text-neutral-900" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight">
        Upload Product Photos
      </h3>
      <p className="text-neutral-600 mb-6">
        Drag and drop images or click to browse
      </p>
      <label className="inline-block">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <span className="px-6 py-3 bg-black text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer inline-block font-medium">
          Browse Files
        </span>
      </label>
    </div>
  );
}