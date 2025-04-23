import React from 'react';
import '../styles/DataTable.css'; // Reuse existing styles

const BookmarkTable = ({ bookmarks, onDelete }) => {
  if (!bookmarks || bookmarks.length === 0) {
    return <div>No bookmarks available.</div>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Node</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {bookmarks.map((bookmark, index) => (
          <tr key={bookmark.id || bookmark.node || index}>
            <td>{bookmark.node}</td>
            <td>
              <button
                onClick={() => onDelete(bookmark.node)}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookmarkTable;
