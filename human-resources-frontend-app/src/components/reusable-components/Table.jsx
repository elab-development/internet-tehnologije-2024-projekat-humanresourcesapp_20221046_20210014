import React, { useState, useMemo, useEffect } from 'react';

/**
 * Reusable Table Component (enhanced)
 *
 * New props:
 *  - onCreate: function() -> opens a create modal in the page
 *  - actionsRenderer: function(row) -> ReactNode (row-level action buttons)
 *  - actionHeader: optional string for the actions column header (default "Actions")
 */
const Table = ({
  columns,
  data,
  showSearch = false,
  searchPlaceholder = 'Search...',
  showFilter = false,
  filterLabel = '',
  filterAccessor = '',
  filterOptions = [],
  defaultSortKey = '',
  onCreate = null,
  createLabel = 'Create',
  actionsRenderer = null,
  actionHeader = 'Actions',
}) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    if (defaultSortKey) {
      setSortConfig({ key: defaultSortKey, direction: 'ascending' });
    }
  }, [defaultSortKey]);

  const processedData = useMemo(() => {
    let temp = [...data];

    if (showSearch && search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      temp = temp.filter(row =>
        columns.some(col => {
          const cell = row[col.accessor];
          return cell && cell.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }

    if (showFilter && filterValue) {
      temp = temp.filter(row => row[filterAccessor] === filterValue);
    }

    if (sortConfig) {
      temp.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return temp;
  }, [data, showSearch, search, showFilter, filterValue, filterAccessor, columns, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-container">
      <div className="table-controls">
        {showFilter && (
          <div className="table-filter">
            <label className="table-filter-label">{filterLabel}</label>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="table-filter-select"
            >
              <option value="">All</option>
              {filterOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {showSearch && (
          <div className="table-search">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {onCreate && (
          <div className="table-cta">
            <button className="btn btn-primary" onClick={onCreate}>{createLabel}</button>
          </div>
        )}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.accessor} onClick={() => requestSort(col.accessor)}>
                {col.Header}
                {sortConfig && sortConfig.key === col.accessor && (
                  sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'
                )}
              </th>
            ))}
            {actionsRenderer && <th style={{ width: 140 }}>{actionHeader}</th>}
          </tr>
        </thead>
        <tbody>
          {processedData.length > 0 ? (
            processedData.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.accessor}>{row[col.accessor]}</td>
                ))}
                {actionsRenderer && <td className="cell-actions">{actionsRenderer(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actionsRenderer ? 1 : 0)} style={{ textAlign: 'center' }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
