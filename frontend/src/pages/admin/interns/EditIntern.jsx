import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import InternForm from '../../../components/interns/InternForm';
import internService from '../../../services/internService';

const EditIntern = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [internData, setInternData] = useState(null);

  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        const response = await internService.getInternById(id);
        if (response.success && response.data) {
          setInternData(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch intern details');
          navigate('/admin/interns');
        }
      } catch (error) {
        console.error('Error fetching intern details:', error);
        const errorMsg = error.response?.data?.message || 'Error loading intern details';
        toast.error(errorMsg);
        navigate('/admin/interns');
      } finally {
        setLoading(false);
      }
    };

    fetchInternDetails();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await internService.updateIntern(id, formData);
      if (response.success) {
        toast.success(response.message || 'Intern profile updated successfully!');
        navigate('/admin/interns');
      } else {
        toast.error(response.message || 'Failed to update intern profile');
      }
    } catch (error) {
      console.error('Error updating intern:', error);
      const errorMsg = error.response?.data?.message || 'Error occurred while updating intern profile';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Intern Profile"
        description={`Modify tracking details for ${internData?.firstName} ${internData?.lastName}.`}
      />
      <div className="max-w-4xl mx-auto">
        {internData && (
          <InternForm
            initialData={internData}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            isEdit={true}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default EditIntern;
