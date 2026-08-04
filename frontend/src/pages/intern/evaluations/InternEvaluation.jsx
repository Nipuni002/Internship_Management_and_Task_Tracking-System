import React, { useState, useEffect } from 'react';
import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import evaluationService from '../../../services/evaluationService';
import toast from 'react-hot-toast';
import { FiAward, FiStar, FiClock, FiShield, FiAlertCircle } from 'react-icons/fi';

const InternEvaluation = () => {
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await evaluationService.getPersonalEvaluation();
        if (res.success && res.data) {
          setEvaluation(res.data);
        }
      } catch (err) {
        toast.error('Failed to load performance evaluations.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, []);

  return (
    <PageContainer>
      <PageHeader 
        title="My Evaluation" 
        description="Verify your overall evaluation scores, category ratings, and comments submitted by administrators."
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner fullScreen={false} /></div>
      ) : (
        <div className="max-w-4xl font-sans text-xs">
          {evaluation ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score badge summary left card */}
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4 border-4 border-blue-50">
                      <span className="text-3xl font-black leading-none">{evaluation.overallScore}%</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Overall</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Performance Rating</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">
                      Evaluated by: {evaluation.evaluatedBy}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50 mt-4">
                      <FiClock size={12} />
                      {evaluation.date}
                    </span>
                  </div>
                </Card>
              </div>

              {/* Score card metrics breakdown & comments */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Metrics */}
                <Card title="Category Competency Ratings">
                  <div className="space-y-4">
                    {Object.keys(evaluation.scores).map((criteria) => {
                      const val = evaluation.scores[criteria];
                      const label = criteria.replace(/([A-Z])/g, ' $1');
                      return (
                        <div key={criteria} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <span className="capitalize">{label}</span>
                            <span className="text-blue-600 font-black">{val}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Reviewer Comments */}
                <Card title="Reviewer Critique & Remarks">
                  <div className="relative pl-4 border-l-2 border-slate-200 italic text-slate-650 text-xs leading-relaxed py-1.5 font-medium bg-slate-50/50 p-4 rounded-r-xl">
                    "{evaluation.comments}"
                  </div>
                </Card>

              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl py-16 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 mb-3">
                <FiAlertCircle size={22} />
              </div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">No evaluation found</h4>
              <p className="text-[10px] text-slate-400 font-medium max-w-[250px] mt-1.5 leading-relaxed">
                Your performance has not been rated yet. Feedback scores will register here once graded by administrators.
              </p>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default InternEvaluation;
