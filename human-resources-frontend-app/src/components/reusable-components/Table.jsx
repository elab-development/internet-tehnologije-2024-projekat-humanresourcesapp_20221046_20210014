import React, { useState, useMemo, useEffect } from 'react';

/**
 * Reusable Table Component
 *
 * Props:
 *  - columns: [{ Header: 'Name', accessor: 'name' }, ...]
 *  - data: array of objects (each representing a row)
 *  - showSearch: boolean (whether to show the global search bar)
 *  - searchPlaceholder: string (placeholder text for search bar)
 *  - showFilter: boolean (whether to show a single dropdown filter)
 *  - filterLabel: string (label for the dropdown filter, e.g. 'Filter by Gender')
 *  - filterAccessor: string (the row field to filter by, e.g. 'gender' or 'reason')
 *  - filterOptions: array of possible values for the dropdown filter
 *  - defaultSortKey: string (optional column accessor to sort ascending by default)
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
  defaultSortKey = ''
}) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  // Single dropdown filter
  const [filterValue, setFilterValue] = useState('');

  // If a defaultSortKey is provided, set up initial sorting on mount
  useEffect(() => {
    if (defaultSortKey) {
      setSortConfig({ key: defaultSortKey, direction: 'ascending' });
    }
  }, [defaultSortKey]);

  // Filter + Search + Sort
  const processedData = useMemo(() => {
    let temp = [...data];

    // 1) Global Search
    if (showSearch && search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      temp = temp.filter(row =>
        columns.some(col => {
          const cellValue = row[col.accessor];
          return cellValue && cellValue.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }

    // 2) Single-column Filter (e.g. gender, reason)
    if (showFilter && filterValue) {
      temp = temp.filter(row => row[filterAccessor] === filterValue);
    }

    // 3) Sorting
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
    // If we're already sorting by this key asc, flip to desc
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-container">
      <div className="table-controls">
        {/* Optional Filter Dropdown */}
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

        {/* Optional Search Input */}
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
          </tr>
        </thead>
        <tbody>
          {processedData.length > 0 ? (
            processedData.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col.accessor}>{row[col.accessor]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
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
