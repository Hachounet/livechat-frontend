import { useEffect, useState } from 'react';

export default function FileInput({ onFileChange, file }) {
  const [fileSelected, setFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (file === null) setFileSelected(false);
  }, [file]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setFileSelected(files.length > 0);
    setSelectedFile(files[0]);
    onFileChange(files.length > 0, files[0]);
  };

  return (
    <input
      type="file"
      onChange={handleFileChange}
      className={`file-input file-input-bordered ${fileSelected ? 'file-input-warning' : 'file-input-info'} max-w-xs md:max-w-36 self-center w-full`}
    />
  );
}
