import React, { useState, useEffect } from 'react';
import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import evaluationService from '../../../services/evaluationService';
import internService from '../../../services/internService';
import useNotifications from '../../../hooks/useNotifications';
import toast from 'react-hot-toast';
import { FiAward, FiStar, FiFileText, FiPlusSquare, FiUserCheck, FiUsers } from 'react-icons/fi';

const AdminEvaluation = () => {
  const [loading, setLoading] = useState(true);
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  
  // Scoring Criteria State (1-100)
  const [scores, setScores] = useState({
    taskCompletion: 80,
    communication: 80,
    attendance: 80,
    qualityOfWork: 80,
  });

  const [comments, setComments] = useState('');
  const [evalList, setEvalList] = useState([]);
  const [saving, setSaving] = useState(false);

  // Notification context
  const { addNotification } = useNotifications();

  const loadData = async () => {
    setLoading(true);
    try {
      const [internsRes, evaluationsRes] = await Promise.all([
        internService.getAllInterns({ size: 1000 }),
        evaluationService.getEvaluations()
      ]);

      if (internsRes.success && internsRes.data) {
        setInterns(internsRes.data.content);
      }
      if (evaluationsRes.success && evaluationsRes.data) {
        setEvalList(evaluationsRes.data.content);
      }
    } catch (err) {
      toast.error('Failed to load performance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScoreChange = (criteria, val) => {
    // Range enforce 0 - 100
    const clamped = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    setScores(prev => ({ ...prev, [criteria]: clamped }));
  };

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIntern) {
      toast.error('Please select an intern to evaluate.');
      return;
    }

    if (!comments.trim()) {
      toast.error('Please enter review comments.');
      return;
    }

    setSaving(true);
    try {
      const res = await evaluationService.submitEvaluation(selectedIntern, scores, comments);
      if (res.success) {
        toast.success('Evaluation saved successfully!');
        
        // Notify intern
        addNotification(
          'Performance Evaluated 📈',
          `Your administrator submitted a new performance review with a score of ${res.data.overallScore}%.`,
          'FEEDBACK',
          'ROLE_INTERN'
        );

        setComments('');
        loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Failed to submit evaluation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Performance Evaluation" 
        description="Monitor intern growth rates, log numeric score indicators, and write professional reviews."
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner fullScreen={false} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans text-xs">
          
          {/* Evaluation Form card */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Add Performance Review">
              <form onSubmit={handleEvaluationSubmit} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Evaluate Intern</label>
                  <select
                    value={selectedIntern}
                    onChange={(e) => setSelectedIntern(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                    required
                  >
                    <option value="">Select Intern</option>
                    {interns.map((intern) => (
                      <option key={intern.id} value={intern.id}>
                        {intern.firstName} {intern.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Score inputs */}
                {Object.keys(scores).map((criteria) => {
                  const label = criteria.replace(/([A-Z])/g, ' $1');
                  return (
                    <div key={criteria} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wide capitalize">{label}</label>
                        <span className="text-[10px] font-black text-blue-600">{scores[criteria]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={scores[criteria]}
                        onChange={(e) => handleScoreChange(criteria, e.target.value)}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  );
                })}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Review Comments</label>
                  <textarea
                    rows="3"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide professional feedback..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none placeholder-slate-400 font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiPlusSquare size={14} />
                  <span>{saving ? 'Saving...' : 'Submit Score'}</span>
                </button>

              </form>
            </Card>
          </div>

          {/* Evaluations list */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-bold text-slate-800 text-sm">Performance Logs Timeline</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Chronological</span>
              </div>

              {evalList.length > 0 ? (
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {evalList.map((item) => (
                    <div key={item.id} className="bg-slate-50/50 border border-slate-150 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{item.internName}</span>
                          <span className="text-[10px] text-slate-400 font-bold">Evaluated by: {item.evaluatedBy}</span>
                          <span className="text-[10px] text-slate-400 font-bold">on {item.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                          "{item.comments}"
                        </p>
                        
                        {/* Summary rating progress bars */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {Object.keys(item.scores).map((key) => {
                            const val = item.scores[key];
                            return (
                              <div key={key} className="space-y-0.5">
                                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                  <span className="text-blue-600">{val}%</span>
                                </div>
                                <div className="w-full bg-slate-200/70 h-1 rounded-full overflow-hidden">
                                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${val}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Overall badge score */}
                      <div className="shrink-0 w-16 h-16 rounded-full border-4 border-blue-50 bg-blue-100/50 flex flex-col items-center justify-center text-blue-600">
                        <span className="text-lg font-black leading-none">{item.overallScore}%</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Score</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                  <FiAward size={24} className="text-slate-350 mb-2" />
                  <p className="text-slate-400 font-bold">No Evaluations Logged</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </PageContainer>
  );
};

export default AdminEvaluation;
