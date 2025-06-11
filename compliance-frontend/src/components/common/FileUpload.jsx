// src/components/common/FileUpload.jsx
import { useState } from 'react';
import { uploadEvidenceFile } from '../../api/evidence';
import Loading from './Loading';

const FileUpload = ({ controlId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('controlId', controlId);
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      const result = await uploadEvidenceFile(formData);
      onUploadComplete(result);
      setFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Evidence Files
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {files.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loading size="small" className="mr-2" />
            Uploading...
          </>
        ) : 'Upload Files'}
      </button>
    </div>
  );
};

export default FileUpload;