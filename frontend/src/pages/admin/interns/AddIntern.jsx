import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import InternForm from '../../../components/interns/InternForm';
import internService from '../../../services/internService';

const AddIntern = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await internService.createIntern(formData);
      if (response.success) {
        toast.success(response.message || 'Intern profile created successfully!');
        navigate('/admin/interns');
      } else {
        toast.error(response.message || 'Failed to create intern profile');
      }
    } catch (error) {
      console.error('Error creating intern:', error);
      const errorMsg = error.response?.data?.message || 'Error occurred while creating intern profile. Please verify data.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Register New Intern"
        description="Add a new intern profile to the tracking system. This will automatically prepare their account."
      />
      <div className="max-w-4xl mx-auto">
        <InternForm onSubmit={handleSubmit} isSubmitting={submitting} isEdit={false} />
      </div>
    </PageContainer>
  );
};

export default AddIntern;
