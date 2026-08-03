import React, { useState, useEffect } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import internService from '../../services/internService';

const DateFilter = ({
  initialFilters = { date: '', month: '', year: '', internId: '' },
  onApply,
  onReset,
  showInternFilter = false,
}) => {
  const [date, setDate] = useState(initialFilters.date || '');
  const [month, setMonth] = useState(initialFilters.month || '');
  const [year, setYear] = useState(initialFilters.year || '');
  const [internId, setInternId] = useState(initialFilters.internId || '');
  const [interns, setInterns] = useState([]);

  // Fetch interns for admin filter dropdown if needed
  useEffect(() => {
    if (showInternFilter) {
      const fetchInterns = async () => {
        try {
          const response = await internService.getAllInterns({ size: 1000 });
          if (response.success && response.data) {
            setInterns(response.data.content || []);
          }
        } catch (error) {
          console.error('Error fetching interns list for log filters:', error);
        }
      };
      fetchInterns();
    }
  }, [showInternFilter]);

  // Sync state with parent filters
  useEffect(() => {
    setDate(initialFilters.date || '');
    setMonth(initialFilters.month || '');
    setYear(initialFilters.year || '');
    setInternId(initialFilters.internId || '');
  }, [initialFilters]);

  const handleApply = (e) => {
    e.preventDefault();
    onApply({
      date,
      month: month ? Number(month) : '',
      year: year ? Number(year) : '',
      internId: showInternFilter ? internId : '',
    });
  };

  const handleReset = () => {
    setDate('');
    setMonth('');
    setYear('');
    setInternId('');
    onReset();
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Year choices
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm font-sans">
      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <FiFilter size={15} className="text-blue-500" />
        <span>Date & Scope Filters</span>
      </div>

      <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Date Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Specific Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              // Clear month/year if they select specific date, or keep them?
              // Standard behavior is either select specific date OR month/year
              if (e.target.value) {
                setMonth('');
                setYear('');
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          />
        </div>

        {/* Month Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Month</label>
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              if (e.target.value) {
                setDate(''); // Clear specific date if filtering by month
                if (!year) setYear(currentYear.toString()); // default to current year
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Months</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Year</label>
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              if (e.target.value) {
                setDate('');
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Intern Filter (Admin only) */}
        {showInternFilter ? (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Intern Profile</label>
            <select
              value={internId}
              onChange={(e) => setInternId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="">All Interns</option>
              {interns.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.firstName} {i.lastName} ({i.employeeId})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}

        {/* Actions Row */}
        <div className="md:col-span-4 flex justify-end gap-3 mt-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <FiRefreshCw size={13} className="shrink-0" />
            Reset Filters
          </button>
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateFilter;
