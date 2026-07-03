import { useState, useRef } from 'react';
import { Upload, X, File, FileText, Image, Video, Music } from 'lucide-react';
import Button from './Button';

/**
 * FileUpload Component
 * Reusable file upload component with drag & drop support
 * 
 * @param {string} label - Field label
 * @param {string} name - Input name
 * @param {string} accept - Accepted file types (e.g., ".pdf,.doc,.docx")
 * @param {number} maxSize - Maximum file size in MB (default: 10MB)
 * @param {boolean} required - Is field required
 * @param {function} onChange - Change handler
 * @param {string} helperText - Helper text below input
 * @param {string} error - Error message
 * @param {File} value - Current file value
 */
const FileUpload = ({
  label,
  name,
  accept = '*',
  maxSize = 10, // MB
  required = false,
  onChange,
  helperText,
  error,
  value,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(value || null);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef(null);

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    if (!fileName) return File;
    
    const ext = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) {
      return Image;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(ext)) {
      return Video;
    }
    if (['mp3', 'wav', 'ogg', 'wma', 'aac'].includes(ext)) {
      return Music;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) {
      return FileText;
    }
    
    return File;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file) => {
    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File terlalu besar. Maksimal ${maxSize}MB`;
    }

    // Check file type if accept is specified
    if (accept !== '*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExt === type.toLowerCase();
        }
        // Handle MIME types
        return file.type.startsWith(type.replace('/*', ''));
      });

      if (!isAccepted) {
        return `Tipe file tidak didukung. Yang diterima: ${accept}`;
      }
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    setUploadError('');
    
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setSelectedFile(file);
    if (onChange) {
      onChange(file);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle remove file
  const handleRemove = () => {
    setSelectedFile(null);
    setUploadError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  // Handle click on drop zone
  const handleClick = () => {
    inputRef.current?.click();
  };

  const FileIcon = selectedFile ? getFileIcon(selectedFile.name) : Upload;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Drop zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${error || uploadError ? 'border-red-300 bg-red-50' : ''}
          ${selectedFile ? 'bg-gray-50' : 'bg-white'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          className="hidden"
          required={required && !selectedFile}
        />

        {/* Content */}
        {selectedFile ? (
          // File selected
          <div className="flex items-start gap-4">
            {/* File icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // No file selected
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div className="mb-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
              >
                Pilih File
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              atau drag & drop file di sini
            </p>
            {helperText && (
              <p className="text-xs text-gray-400 mt-2">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {(error || uploadError) && (
        <p className="mt-2 text-sm text-red-600">
          {error || uploadError}
        </p>
      )}

      {/* Helper text (when no file selected and no error) */}
      {!selectedFile && !error && !uploadError && helperText && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
