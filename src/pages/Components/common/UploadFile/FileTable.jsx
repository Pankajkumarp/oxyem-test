import React from 'react';
import { MdDownload } from 'react-icons/md';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';

const FileTable = ({ files = [], baseImageUrl, onDownload }) => {
  if (!files || files.length === 0) return null;

  const getFileName = (path) => {
    return path.substring(path.lastIndexOf('/') + 1);
  };

  const handleDownloadClickWithPath = async (path) => {
    try {
      const response = await axiosJWT.get(`${baseImageUrl}/download`, {
        params: { filePath: path },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = getFileName(path);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  return (
    <div className='file_table_data_f'>
      <table>
        <thead>
          <tr>
            <th className='f_h'>Title</th>
            <th className='d_h'>Dl</th>
            <th className='s_h'>Info</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr className='bottom_table_line' key={file.Id || `${file.fileName}-${index}`}>
              <td className='name_ic'>
                <div className='highlight_t_s'>{file["Uploaded Date"] || file.submitDate}</div>
                <div>{file["Title"] || file.fileName}</div>
              </td>
              <td className='svg_ic'>
                <span onClick={() => handleDownloadClickWithPath(file["download"] || file.filePath)} style={{ cursor: 'pointer' }}>
                  <MdDownload />
                </span>
              </td>
              <td className='type_ic'>
                <div>{file["Doc Type"] || file.fileExtenstion}</div>
                <div>({file["Size"] || file.fileSize})</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;