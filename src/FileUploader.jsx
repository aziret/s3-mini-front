import React, { useState } from 'react';
import * as tus from 'tus-js-client';

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadURL, setUploadURL] = useState('');

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Start file upload
    const handleUpload = () => {
        if (!file) return;

        setUploading(true);

        const options = {
            endpoint: 'http://localhost:8080/files/', // Replace with your TUS server endpoint
            file: file,
            metadata: {
                filename: file.name,
                filetype: file.type,
            },
            // This option allows you to upload in chunks (the default behavior)
            onProgress: (bytesUploaded, bytesTotal) => {
                const progress = (bytesUploaded / bytesTotal) * 100;
                setUploadProgress(progress);
            },
            onSuccess: () => {
                setUploading(false);
                setUploadURL(upload.url); // Set the uploaded file URL
                alert(`Upload complete! File available at: ${uploadURL}`);
            },
            onError: (error) => {
                setUploading(false);
                console.error('Error uploading file:', error);
                alert('Error uploading file');
            },
        };

        // Create and start the upload
        const upload = new tus.Upload(file, options);
        upload.start();
    };

    return (
        <div>
            <h1>Upload File using TUS</h1>
            <input type="file" onChange={handleFileChange} />
            {file && !uploading && (
                <div>
                    <button onClick={handleUpload}>Upload File</button>
                </div>
            )}

            {uploading && (
                <div>
                    <p>Uploading... {Math.round(uploadProgress)}%</p>
                </div>
            )}

            {uploading && uploadProgress === 100 && (
                <div>
                    <p>Upload complete! File available at: {uploadURL}</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
