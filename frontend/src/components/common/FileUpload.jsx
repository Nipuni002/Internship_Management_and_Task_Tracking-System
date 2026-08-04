import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiFile, FiTrash2, FiDownload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FileUpload = ({ onFilesChange, allowedTypes = ['pdf', 'docx', 'zip', 'image'], maxFiles = 3 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({}); // file index -> progress percentage
  const fileInputRef = useRef(null);

  const getMimeTypes = () => {
    const types = [];
    if (allowedTypes.includes('pdf')) types.push('application/pdf');
    if (allowedTypes.includes('docx')) {
      types.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      types.push('application/msword');
    }
    if (allowedTypes.includes('zip')) {
      types.push('application/zip');
      types.push('application/x-zip-compressed');
    }
    if (allowedTypes.includes('image')) {
      types.push('image/jpeg');
      types.push('image/png');
      types.push('image/webp');
    }
    return types;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const validMimes = getMimeTypes();
    const isMimeValid = validMimes.includes(file.type);
    
    // Fallback for extensions check if mime type parsing is tricky
    const ext = file.name.split('.').pop().toLowerCase();
    const isExtValid = allowedTypes.includes(ext) || (ext === 'jpg' && allowedTypes.includes('image')) || (ext === 'png' && allowedTypes.includes('image'));

    if (!isMimeValid && !isExtValid) {
      toast.error(`Invalid file type: ${file.name}. Supported: ${allowedTypes.join(', ').toUpperCase()}`);
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error(`File too large: ${file.name}. Max size 10MB.`);
      return false;
    }

    return true;
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
    }, 150);
  };

  const processFiles = (files) => {
    if (filesList.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const updated = [...filesList];
    const newProgress = { ...uploadProgress };

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        const fileId = `file-${Date.now()}-${file.name}`;
        updated.push({
          id: fileId,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: file.type,
          rawFile: file,
        });
        
        newProgress[fileId] = 0;
        simulateUpload(fileId);
      }
    });

    setFilesList(updated);
    setUploadProgress(newProgress);
    if (onFilesChange) onFilesChange(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleDelete = (id) => {
    const updated = filesList.filter((f) => f.id !== id);
    setFilesList(updated);
    
    const progressCopy = { ...uploadProgress };
    delete progressCopy[id];
    setUploadProgress(progressCopy);

    if (onFilesChange) onFilesChange(updated);
    toast.success('File deleted successfully');
  };

  const handleDownload = (file) => {
    // Generate simple dummy download trigger
    const blob = new Blob([file.rawFile || 'mock content'], { type: file.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${file.name}`);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      
      {/* Upload Drag Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50/20' 
            : 'border-slate-350 bg-slate-50/50 hover:bg-slate-50/80 hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleChange}
          accept={allowedTypes.map(t => `.${t}`).join(',')}
        />
        <div className="flex flex-col items-center justify-center">
          <FiUploadCloud className="text-slate-400 mb-3" size={32} />
          <p className="text-xs font-bold text-slate-700">Drag and drop your file here, or <span className="text-blue-600 hover:underline">browse</span></p>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
            Supports: {allowedTypes.join(', ')} (Max 10MB)
          </p>
        </div>
      </div>

      {/* Uploaded Files list */}
      {filesList.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Uploaded Assets ({filesList.length})</span>
          <div className="space-y-2">
            {filesList.map((file) => {
              const progress = uploadProgress[file.id] || 0;
              return (
                <div key={file.id} className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg">
                      <FiFile size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-700 truncate">{file.name}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{file.size}</p>
                      
                      {/* Progress bar */}
                      {progress < 100 && (
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                          <div className="bg-blue-500 h-full rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {progress === 100 ? (
                      <>
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 cursor-pointer transition-colors"
                          title="Download File"
                        >
                          <FiDownload size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-rose-600 cursor-pointer transition-colors"
                          title="Delete File"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{progress}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default FileUpload;
