import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiBookOpen, 
  FiCalendar, 
  FiArrowLeft, 
  FiEdit, 
  FiUser, 
  FiClock,
  FiCheckCircle,
  FiMinusCircle,
  FiAward
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/interns/StatusBadge';
import internService from '../../../services/internService';

const InternDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [intern, setIntern] = useState(null);

  const fetchInternDetails = async () => {
    try {
      const response = await internService.getInternById(id);
      if (response.success && response.data) {
        setIntern(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch intern details');
        navigate('/admin/interns');
      }
    } catch (error) {
      console.error('Error fetching intern details:', error);
      const errorMsg = error.response?.data?.message || 'Error occurred while loading profile details';
      toast.error(errorMsg);
      navigate('/admin/interns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternDetails();
  }, [id]);

  const handleToggleStatus = async (activate) => {
    setLoading(true);
    try {
      let response;
      if (activate) {
        response = await internService.activateIntern(id);
      } else {
        response = await internService.deactivateIntern(id);
      }

      if (response.success) {
        toast.success(response.message || `Status updated successfully.`);
        fetchInternDetails();
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

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const months = Math.floor(diffDays / 30.4); // average month length
    const remainingDays = Math.round(diffDays % 30.4);

    let output = '';
    if (months > 0) {
      output += `${months} month${months > 1 ? 's' : ''}`;
    }
    if (remainingDays > 0) {
      if (output) output += ' ';
      output += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    }
    return output || '0 days';
  };

  if (loading && !intern) {
    return <LoadingSpinner />;
  }

  if (!intern) return null;

  const { employeeId, firstName, lastName, email, phone, university, degree, startDate, endDate, status } = intern;
  const fullName = `${firstName} ${lastName}`;
  const durationText = calculateDuration(startDate, endDate);

  return (
    <PageContainer>
      <PageHeader
        title="Intern Profile Details"
        description={`Detailed view of employee records for ${fullName}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/interns"
              className="border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiArrowLeft size={15} />
              Registry List
            </Link>
            
            {status === 'ACTIVE' ? (
              <button
                onClick={() => handleToggleStatus(false)}
                className="border border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FiMinusCircle size={15} className="text-slate-450" />
                Deactivate Account
              </button>
            ) : (
              <button
                onClick={() => handleToggleStatus(true)}
                className="bg-emerald-50 border border-emerald-250 text-emerald-700 hover:bg-emerald-100 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FiCheckCircle size={15} />
                Activate Account
              </button>
            )}

            <Link
              to={`/admin/interns/${id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md hover:shadow-lg"
            >
              <FiEdit size={15} />
              Edit Profile
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Personal Info Card */}
          <Card className="relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                  <FiUser size={30} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-semibold text-slate-450 uppercase tracking-wide">
                    <span>Employee ID: <strong className="text-slate-700">{employeeId}</strong></span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span>Status: <StatusBadge status={status} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-grid of Personal & Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Contact Channels
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <FiMail size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Email Address</p>
                      <a href={`mailto:${email}`} className="text-xs font-bold text-blue-650 hover:underline mt-1 block">
                        {email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <FiPhone size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Phone Number</p>
                      <p className="text-xs font-bold text-slate-750 mt-1">{phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Academic Background
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <FiBookOpen size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">University Name</p>
                      <p className="text-xs font-bold text-slate-755 mt-1">{university}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <FiAward size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Degree Program</p>
                      <p className="text-xs font-bold text-slate-755 mt-1">{degree}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          {/* Duration Card */}
          <Card title="Internship Timeline" className="relative overflow-hidden">
            <div className="space-y-5">
              {/* Duration display */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Duration</p>
                  <p className="text-sm font-bold text-slate-800">{durationText}</p>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="space-y-3.5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-450 flex items-center gap-1.5">
                    <FiCalendar size={13} className="text-slate-400" />
                    Start Date
                  </span>
                  <span className="text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                    {startDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-450 flex items-center gap-1.5">
                    <FiCalendar size={13} className="text-slate-400" />
                    End Date
                  </span>
                  <span className="text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                    {endDate}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default InternDetails;
