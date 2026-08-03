import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

import SearchBar from '../../../components/interns/SearchBar';
import FilterPanel from '../../../components/interns/FilterPanel';
import InternTable from '../../../components/interns/InternTable';
import InternCard from '../../../components/interns/InternCard';
import Pagination from '../../../components/interns/Pagination';
import DeleteInternModal from '../../../components/interns/DeleteInternModal';

import internService from '../../../services/internService';

const InternList = () => {
  // Lists & Page State
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter, Search, Sort & Pagination Parameters
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sort: 'employeeId,asc',
    status: '',
    university: '',
    degree: '',
    search: '',
  });

  // Modal deletion helper state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    name: '',
  });

  // Load interns
  const fetchInterns = async () => {
    setLoading(true);
    try {
      const response = await internService.getAllInterns(params);
      if (response.success && response.data) {
        // Page response structure
        const pageData = response.data;
        setInterns(pageData.content || []);
        setTotalElements(pageData.totalElements || 0);
        setTotalPages(pageData.totalPages || 0);
      } else {
        toast.error(response.message || 'Failed to fetch interns');
      }
    } catch (error) {
      console.error('Error fetching interns:', error);
      const errorMsg = error.response?.data?.message || 'Network error occurred while fetching interns';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, [params]);

  // Page handlers
  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setParams((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  // Sorting handler
  const handleSort = (field) => {
    let newSort = `${field},asc`;
    const [currentField, currentDir] = params.sort.split(',');
    
    if (currentField === field) {
      newSort = `${field},${currentDir === 'asc' ? 'desc' : 'asc'}`;
    }
    
    setParams((prev) => ({ ...prev, sort: newSort, page: 0 }));
  };

  const currentSortField = params.sort.split(',')[0];
  const currentSortDirection = params.sort.split(',')[1];

  // Filtering & Search handlers
  const handleApplyFilters = (newFilters) => {
    setParams((prev) => ({
      ...prev,
      ...newFilters,
      page: 0,
    }));
  };

  const handleResetFilters = () => {
    setParams((prev) => ({
      ...prev,
      status: '',
      university: '',
      degree: '',
      page: 0,
    }));
  };

  const handleSearch = (searchVal) => {
    setParams((prev) => ({
      ...prev,
      search: searchVal,
      page: 0,
    }));
  };

  // Status Activation/Deactivation Toggle
  const handleToggleStatus = async (id, activate) => {
    setLoading(true);
    try {
      let response;
      if (activate) {
        response = await internService.activateIntern(id);
      } else {
        response = await internService.deactivateIntern(id);
      }

      if (response.success) {
        toast.success(response.message || `Intern status updated successfully.`);
        fetchInterns();
      } else {
        toast.error(response.message || 'Failed to update status');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      const errorMsg = error.response?.data?.message || 'Failed to toggle status';
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  // Deletion Modal triggers
  const triggerDeleteModal = (id, fullName) => {
    setDeleteModal({
      isOpen: true,
      id,
      name: fullName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      id: null,
      name: '',
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteModal;
    closeDeleteModal();
    setLoading(true);
    try {
      const response = await internService.deleteIntern(id);
      if (response.success) {
        toast.success(response.message || 'Intern profile deleted successfully.');
        // If we deleted the last item on the current page, go back a page
        const isLastItemOnPage = interns.length === 1;
        const isNotFirstPage = params.page > 0;
        if (isLastItemOnPage && isNotFirstPage) {
          setParams((prev) => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchInterns();
        }
      } else {
        toast.error(response.message || 'Failed to delete intern');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting intern:', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete intern profile';
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Interns Registry"
        description="Search, filter, edit status, and manage active profiles for registered interns."
        actions={
          <Link
            to="/admin/interns/add"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <FiUserPlus size={15} />
            Register Intern
          </Link>
        }
      />

      <div className="space-y-6 font-sans">
        {/* Search Panel */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <SearchBar initialValue={params.search} onSearch={handleSearch} />
        </div>

        {/* Filter Panel */}
        <FilterPanel
          initialFilters={{
            status: params.status,
            university: params.university,
            degree: params.degree,
          }}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Table & Cards Container */}
        {loading && interns.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl py-12 flex justify-center items-center shadow-sm">
            <LoadingSpinner fullScreen={false} />
          </div>
        ) : interns.length === 0 ? (
          <EmptyState
            icon={<FiUser size={36} />}
            title="No Interns Found"
            description="No interns matched your filters or search terms. Try modifying your criteria."
            action={
              <button
                onClick={() =>
                  setParams({
                    page: 0,
                    size: 10,
                    sort: 'employeeId,asc',
                    status: '',
                    university: '',
                    degree: '',
                    search: '',
                  })
                }
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Reset Search parameters
              </button>
            }
          />
        ) : (
          <div className="relative">
            {/* Inline Loading Indicator overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex justify-center items-center z-10 rounded-xl">
                <div className="bg-slate-900 text-white px-5 py-3 rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-bold shadow-lg">
                  <LoadingSpinner fullScreen={false} />
                  <span>Syncing...</span>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <InternTable
                interns={interns}
                sortField={currentSortField}
                sortDirection={currentSortDirection}
                onSort={handleSort}
                onDelete={triggerDeleteModal}
                onToggleStatus={handleToggleStatus}
              />
            </div>

            {/* Mobile & Tablet Card Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {interns.map((intern) => (
                <InternCard
                  key={intern.id}
                  intern={intern}
                  onDelete={triggerDeleteModal}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>

            {/* Pagination controls */}
            <Pagination
              currentPage={params.page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={params.size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <DeleteInternModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        internName={deleteModal.name}
      />
    </PageContainer>
  );
};

export default InternList;
