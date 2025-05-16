// src/pages/ViewFiles.jsx
import React, {useState} from 'react';
// import { useParams }       from 'react-router-dom';
import FileViewerAuto      from '../components/FileViewerAuto';
import '../styles/ViewFiles.css';  // <-- import the new stylesheet

const BACKEND_URL = 'http://localhost:8000';

const ViewFiles = ({files = null}) => {
  // const { fileId } = useParams();
  const [expandedFile, setExpandedFile] = useState(null);

  // List of your filenames in public/static/
  const dummyFiles = [
    '0e5646150cddf0549be1e165bf878090.jpeg',
    '277d090b5cdbd0a539315e48708e6168.jpeg',
    'anylogLogo.png',
    // 'report.pdf',
    'flower.jpg',
    'example.wav',
    'video.mp4',
    // …add as many as you like
  ];

  const finalFiles = files || dummyFiles;

  return (
    <>
      <div className="view-files-grid">
        {finalFiles.map((name, idx) => {
          const url = `${BACKEND_URL}/static/${name}`;
          return (
            <div
              key={idx}
              className="view-files-card"
              onClick={() => setExpandedFile(name)}
            >
              <h4 className="view-files-header">{name}</h4>
              <div className="view-files-wrapper">
                <FileViewerAuto src={url} />
              </div>
            </div>
          );
        })}
      </div>

      {expandedFile && (
        <div className="modal-overlay" onClick={() => setExpandedFile(null)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setExpandedFile(null)}
            >
              ×
            </button>
            <FileViewerAuto
              src={`${BACKEND_URL}/static/${expandedFile}`}
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ViewFiles;
