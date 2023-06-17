import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState("/file-server/");
  const [showChartModal, setShowChartModal] = useState(false);
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    setMyFiles(data);
  }, []);

  const handleDeleteFile = (fileId) => {
    const updatedFiles = myFiles.filter(file => file.id !== fileId);
    setMyFiles(updatedFiles);
    setSelectedFile(null);
  };

  const handleSortChange = (event) => {
    const selectedSortType = event.target.value;
    setSortType(selectedSortType);
    sortFiles(selectedSortType);
  };

  const sortFiles = (type) => {
    let sortedFiles = [...myFiles];

    if (type === 'name') {
      sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === 'type') {
      sortedFiles.sort((a, b) => a.type.localeCompare(b.type));
    } else if (type === 'size') {
      sortedFiles.sort((a, b) => a.size - b.size);
    } else if (type === 'date') {
      sortedFiles.sort((a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate));
    }

    setMyFiles(sortedFiles);
  };

  const shareFile = (file) => {
    // Assuming there is a file sharing API
    const shareUrl = `https://example.com/share/${file.id}`;
    window.open(shareUrl, '_blank');
  };

  var barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  return (
    <>
      {showChartModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
              <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
            </div>
            <div style={styles.modalBody}>
              <Pie
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              <Bar
                data={{
                  labels: ['Video', 'Audio', 'Document', 'Image'],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
      )}

      <div className="App">
        <Header />
        <div style={styles.container}>
          <div style={{ padding: 10, paddingBottom: 0 }}>
            <p style={{ fontWeight: "bold" }}>My Files</p>
            <p>{selectedFile ? selectedFile.path : filePath}</p>
          </div>
          <div style={styles.controlTools}>
            <div style={styles.buttonContainer}>
              <button
                style={styles.controlButton}
                onClick={() => {
                  if (selectedFile) {
                    const newFiles = myFiles.map(file => {
                      if (file.id === selectedFile.id) {
                        return {
                          ...file,
                          name: prompt("Enter new name")
                        };
                      }
                      return file;
                    });
                    setMyFiles(newFiles);
                    setSelectedFile(null);
                  }
                }}
              >
                Rename
              </button>
              <button
                style={styles.controlButton}
                onClick={() => {
                  setShowChartModal(true);
                }}
              >
                Files Breakdown
              </button>
              <button
  style={styles.controlButton}
  onClick={() => {
    if (selectedFile) {
      const email = 'recipient@example.com';
      const subject = 'File Sharing';
      const body = 'Please find the attached file.';
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.open(`${mailtoLink}&attachment=${selectedFile.path}`, "_blank");
    }
  }}
>
  Share via Email
</button>

              <button
                style={styles.controlButton}
                onClick={() => {
                  if (selectedFile) {
                    window.open(selectedFile.path, "_blank");
                  }
                }}
              >
                Download
              </button>
              <button
                style={styles.controlButton}
                onClick={() => {
                  if (selectedFile) {
                    handleDeleteFile(selectedFile.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
            <div style={{ width: "100%", padding: "10px 0" }}>
              <label htmlFor="sortType">Sort By:</label>
              <select
                id="sortType"
                name="sortType"
                value={sortType}
                onChange={handleSortChange}
              >
                <option value="">None</option>
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="size">Size</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>
          <div style={{ width: "100%", padding: 10 }}>
              {myFiles.map((file) => {
                if (file.path.slice(0, filePath.length) === filePath) {
                  return (
                    <div
                      style={styles.file}
                      className="files"
                      key={file.id}
                      onClick={() => {
                        if (selectedFile && selectedFile.id === file.id) {
                          setSelectedFile(null);
                          return;
                        }
                        setSelectedFile(file);
                      }}
                    >
                      <p>{file.name}</p>
                    </div>
                  );
                }
              })}
            </div>
            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.type === 'video' && (
                  <VideoPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'audio' && (
                  <AudioPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'document' && (
                  <DocumentViewer path={selectedFile.path} />
                )}
                {selectedFile.type === 'image' && (
                  <ImageViewer path={selectedFile.path} />
                )}
                <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
                <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
                <p>file type: <span style={{ fontStyle: "italic" }}>{selectedFile.type}</span></p>
              </div>
            )}
          </div>
        </div>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "left",
    alignItems: "left",
    height: "100vh",
    flexDirection: "column",
  },
  controlTools: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  controlButton: {
    padding: "10px 20px",
    margin: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  file: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: 10,
    marginBottom: 5,
    cursor: "pointer",
    backgroundColor: "#f2f2f2",
  },
  fileViewer: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: 10,
    marginTop: 20,
    backgroundColor: "#f2f2f2",
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    zIndex: 9999,
  },
  modalContent: {
    background: 'white',
    borderRadius: '4px',
    padding: '20px',
    width: '600px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'left',
    marginBottom: '10px',
  },
  closeButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  modalBody: {
    marginBottom: '20px',
  },
};
