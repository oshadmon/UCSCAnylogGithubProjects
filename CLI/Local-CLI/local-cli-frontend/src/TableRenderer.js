import React from 'react';

function TableRenderer({ tableText }) {
  // Split by newline and filter out empty lines.
  const lines = tableText.split('\n').filter(line => line.trim() !== '');

  // Detect the header separator row (e.g. row with dashes)
  // We'll assume it's the row that comes immediately after the header row.
  const headerLineIndex = 0;
  const separatorIndex = 1;

  // Parse header: split by "|" and trim spaces, filtering out empty columns.
  const headers = lines[headerLineIndex]
    .split('|')
    .map(col => col.trim())
    .filter(col => col !== '');

  // Parse the rest of the rows. Skip the header separator row.
  const dataRows = lines.slice(separatorIndex + 1).map(line => {
    return line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');
  });

  return (
    <table className="result-table">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={`header-${idx}`}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataRows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableRenderer;
