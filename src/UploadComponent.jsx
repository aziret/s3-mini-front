import React, { useState, useRef } from 'react';
import { Upload } from 'tus-js-client';

const UploadComponent = () => {
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);
    const uploadRef = useRef(null);

    const startUpload = (file) => {
        const endpoint = 'http://localhost:8080/files';

        const upload = new Upload(file, {
            endpoint: endpoint,
            metadata: {
                filename: file.name,
                filetype: file.type,
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const progress = (bytesUploaded / bytesTotal) * 100;
                setProgress(progress);
            },
            onSuccess: () => {
                setIsUploading(false);
                setIsPaused(false);
                alert('Upload complete!');
            },
            onError: (error) => {
                console.error('Error during upload:', error);
                alert('Upload failed');
                setIsUploading(false);
            },
        });

        uploadRef.current = upload;
        upload.start();
        setIsUploading(true);
        setIsPaused(false);
        setFileName(file.name);
    };

    const pauseUpload = () => {
        if (uploadRef.current) {
            uploadRef.current.abort();
            setIsPaused(true);
            setIsUploading(false);
        }
    };

    const resumeUpload = () => {
        if (uploadRef.current && isPaused) {
            uploadRef.current.start();
            setIsUploading(true);
            setIsPaused(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            startUpload(file);
        }
    };

    return (
        <div className="upload-container">
            <h1>Upload File with Pause and Resume</h1>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
            />

            {fileName && <p>Uploading: {fileName}</p>}

            <progress value={progress} max="100" style={{ width: '100%' }}></progress>

            <div className="controls">
                {isUploading && !isPaused && (
                    <button onClick={pauseUpload}>Pause Upload</button>
                )}

                {!isUploading && !isPaused && (
                    <button onClick={resumeUpload}>Resume Upload</button>
                )}

                {!isUploading && isPaused && (
                    <button onClick={resumeUpload}>Resume Upload</button>
                )}
            </div>
        </div>
    );
};

export default UploadComponent;
