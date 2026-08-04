// Performance Evaluation Mock Service using LocalStorage
import internService from './internService';

const EVAL_KEY = 'intern_performance_evaluations';

const getStoredEvaluations = () => {
  const data = localStorage.getItem(EVAL_KEY);
  if (data) return JSON.parse(data);

  // Seed sample evaluations
  const seed = [
    {
      id: 'eval-1',
      internId: 'mock-intern-id',
      internName: 'System Intern',
      scores: {
        taskCompletion: 85,
        communication: 90,
        attendance: 95,
        qualityOfWork: 88,
      },
      overallScore: 90,
      comments: 'Shows excellent coding capacity and handles submissions promptly.',
      evaluatedBy: 'Admin Manager',
      date: '2026-08-01',
    }
  ];
  localStorage.setItem(EVAL_KEY, JSON.stringify(seed));
  return seed;
};

const saveEvaluations = (data) => {
  localStorage.setItem(EVAL_KEY, JSON.stringify(data));
};

const evaluationService = {
  getEvaluations: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let evals = getStoredEvaluations();

    if (params.internId) {
      evals = evals.filter(e => e.internId === params.internId);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      evals = evals.filter(e => e.internName.toLowerCase().includes(q) || e.comments.toLowerCase().includes(q));
    }

    // Sort newest date first
    evals.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      success: true,
      message: 'Evaluations retrieved successfully',
      data: {
        content: evals,
        totalElements: evals.length,
      }
    };
  },

  getPersonalEvaluation: async () => {
    let internId = 'mock-intern-id';
    try {
      const profile = await internService.getCurrentInternProfile();
      if (profile.success && profile.data) {
        internId = profile.data.id;
      }
    } catch (e) {}

    const res = await evaluationService.getEvaluations({ internId });
    // Return newest evaluation, if any
    const latest = res.data.content[0] || null;
    return {
      success: true,
      data: latest,
    };
  },

  submitEvaluation: async (internId, scores, comments, evaluatorName = 'Admin Manager') => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const evals = getStoredEvaluations();

    let internName = 'Unknown Intern';
    try {
      const internsRes = await internService.getAllInterns({ size: 1000 });
      if (internsRes.success && internsRes.data?.content) {
        const matching = internsRes.data.content.find(i => i.id === internId);
        if (matching) {
          internName = `${matching.firstName} ${matching.lastName}`;
        }
      }
    } catch (e) {
      if (internId === 'mock-intern-id') {
        internName = 'System Intern';
      }
    }

    // Compute overall score as direct average of all scores
    const values = Object.values(scores);
    const sum = values.reduce((s, val) => s + parseInt(val, 10), 0);
    const overallScore = Math.round(sum / values.length);

    const newEval = {
      id: `eval-${Date.now()}`,
      internId,
      internName,
      scores: {
        taskCompletion: parseInt(scores.taskCompletion, 10),
        communication: parseInt(scores.communication, 10),
        attendance: parseInt(scores.attendance, 10),
        qualityOfWork: parseInt(scores.qualityOfWork, 10),
      },
      overallScore,
      comments,
      evaluatedBy: evaluatorName,
      date: new Date().toISOString().split('T')[0],
    };

    // Remove existing if any on same day, or simply add as history
    evals.push(newEval);
    saveEvaluations(evals);

    return {
      success: true,
      message: 'Performance evaluation saved successfully',
      data: newEval,
    };
  }
};

export default evaluationService;
