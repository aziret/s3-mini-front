import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileIndexPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/files'); // Update with your Go API URL
        setFiles(response.data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:8081/files/${fileId}`, {
        responseType: 'blob', // Important for file download
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}`); // Set the file name or use the actual file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="App">
      <h1>Files</h1>
      {loading ? (
        <p>Loading files...</p>
      ) : (
        <ul>
          {files && files.map((file) => (
            <li key={file.id}>
              {file.name}
              <button onClick={() => handleDownload(file.id, file.name)}>Download</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileIndexPage;