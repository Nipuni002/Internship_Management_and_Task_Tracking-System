// Leave Request Mock Service using LocalStorage
import internService from './internService';

const LEAVE_KEY = 'intern_leave_requests';

const getStoredLeaves = () => {
  const data = localStorage.getItem(LEAVE_KEY);
  if (data) return JSON.parse(data);

  // Seed sample requests
  const seed = [
    {
      id: 'leave-1',
      internId: 'mock-intern-id',
      internName: 'System Intern',
      leaveType: 'SICK',
      startDate: '2026-08-10',
      endDate: '2026-08-12',
      reason: 'Doctor prescribed recovery rest.',
      status: 'APPROVED',
      createdAt: '2026-08-01T10:00:00.000Z',
    },
    {
      id: 'leave-2',
      internId: 'mock-intern-id',
      internName: 'System Intern',
      leaveType: 'CASUAL',
      startDate: '2026-08-18',
      endDate: '2026-08-19',
      reason: 'Attending family celebration.',
      status: 'PENDING',
      createdAt: '2026-08-03T14:30:00.000Z',
    }
  ];
  localStorage.setItem(LEAVE_KEY, JSON.stringify(seed));
  return seed;
};

const saveLeaves = (data) => {
  localStorage.setItem(LEAVE_KEY, JSON.stringify(data));
};

const leaveService = {
  getAllLeaves: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let requests = getStoredLeaves();

    if (params.status && params.status !== 'ALL') {
      requests = requests.filter(r => r.status === params.status);
    }

    if (params.internId) {
      requests = requests.filter(r => r.internId === params.internId);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      requests = requests.filter(
        r => r.internName.toLowerCase().includes(q) || 
             r.leaveType.toLowerCase().includes(q) || 
             r.reason.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      success: true,
      message: 'Leaves retrieved successfully',
      data: {
        content: requests,
        totalElements: requests.length,
      }
    };
  },

  getPersonalLeaves: async () => {
    let internId = 'mock-intern-id';
    try {
      const profile = await internService.getCurrentInternProfile();
      if (profile.success && profile.data) {
        internId = profile.data.id;
      }
    } catch (e) {}

    return leaveService.getAllLeaves({ internId });
  },

  applyForLeave: async (leaveData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const requests = getStoredLeaves();

    let internId = 'mock-intern-id';
    let internName = 'System Intern';

    try {
      const profile = await internService.getCurrentInternProfile();
      if (profile.success && profile.data) {
        internId = profile.data.id;
        internName = `${profile.data.firstName} ${profile.data.lastName}`;
      }
    } catch (e) {}

    const newRequest = {
      id: `leave-${Date.now()}`,
      internId,
      internName,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      reason: leaveData.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    saveLeaves(requests);

    return {
      success: true,
      message: 'Leave applied successfully',
      data: newRequest
    };
  },

  cancelLeaveRequest: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const requests = getStoredLeaves();
    const index = requests.findIndex(r => r.id === id);

    if (index > -1) {
      if (requests[index].status !== 'PENDING') {
        return { success: false, message: 'Only pending requests can be cancelled.' };
      }
      requests.splice(index, 1);
      saveLeaves(requests);
      return { success: true, message: 'Leave request cancelled successfully' };
    }

    return { success: false, message: 'Leave request not found.' };
  },

  approveLeave: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const requests = getStoredLeaves();
    const index = requests.findIndex(r => r.id === id);

    if (index > -1) {
      requests[index].status = 'APPROVED';
      saveLeaves(requests);
      return { success: true, message: 'Leave request approved successfully', data: requests[index] };
    }
    return { success: false, message: 'Leave request not found.' };
  },

  rejectLeave: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const requests = getStoredLeaves();
    const index = requests.findIndex(r => r.id === id);

    if (index > -1) {
      requests[index].status = 'REJECTED';
      saveLeaves(requests);
      return { success: true, message: 'Leave request rejected successfully', data: requests[index] };
    }
    return { success: false, message: 'Leave request not found.' };
  }
};

export default leaveService;
