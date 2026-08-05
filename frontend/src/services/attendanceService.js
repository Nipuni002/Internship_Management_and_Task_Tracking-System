// Attendance Mock Service using LocalStorage
import internService from './internService';

const ATTENDANCE_KEY = 'intern_attendance_data';

// Helper to seed initial attendance logs if empty
const getStoredAttendance = () => {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  if (data) return JSON.parse(data);

  // Seed sample data for testing
  const seed = [
    {
      id: 'att-1',
      internId: 'mock-intern-id',
      internName: 'System Intern',
      date: '2026-08-01',
      checkIn: '08:55:00',
      checkOut: '17:05:00',
      status: 'PRESENT',
    },
    {
      id: 'att-2',
      internId: 'mock-intern-id',
      internName: 'System Intern',
      date: '2026-08-02',
      checkIn: '09:15:00',
      checkOut: '17:00:00',
      status: 'LATE',
    },
    {
      id: 'att-3',
      internId: 'mock-intern-id',
      internName: 'System Intern',
      date: '2026-08-03',
      checkIn: '08:45:00',
      checkOut: '17:15:00',
      status: 'PRESENT',
    },
  ];
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(seed));
  return seed;
};

const saveAttendance = (data) => {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
};

const attendanceService = {
  getAllAttendance: async (params = {}) => {
    // Mimic API latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    let logs = getStoredAttendance();

    if (params.search) {
      const q = params.search.toLowerCase();
      logs = logs.filter(l => l.internName.toLowerCase().includes(q) || l.status.toLowerCase().includes(q));
    }

    if (params.date) {
      logs = logs.filter(l => l.date === params.date);
    }

    if (params.internId) {
      logs = logs.filter(l => l.internId === params.internId);
    }

    // Sort newest date first
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      success: true,
      message: 'Attendance retrieved successfully',
      data: {
        content: logs,
        totalElements: logs.length,
      }
    };
  },

  getPersonalAttendance: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Fetch logged-in intern profile to match
    let internId = 'mock-intern-id';
    try {
      const profile = await internService.getCurrentInternProfile();
      if (profile.success && profile.data) {
        internId = profile.data.id;
      }
    } catch (e) {
      console.warn('Profile fetch failed, using mock-intern-id for attendance check');
    }

    return attendanceService.getAllAttendance({ internId });
  },

  markAttendance: async (internId, status, dateString = '') => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const logs = getStoredAttendance();
    const date = dateString || new Date().toISOString().split('T')[0];

    // Find intern profile for full name mapping
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

    // Check if attendance already logged for this date
    const existingIndex = logs.findIndex(l => l.internId === internId && l.date === date);
    const nowTime = new Date().toLocaleTimeString(undefined, { hour12: false });

    if (existingIndex > -1) {
      logs[existingIndex].status = status;
      logs[existingIndex].checkOut = nowTime;
    } else {
      logs.push({
        id: `att-${Date.now()}`,
        internId,
        internName,
        date,
        checkIn: nowTime,
        checkOut: '',
        status,
      });
    }

    saveAttendance(logs);
    return {
      success: true,
      message: 'Attendance marked successfully',
    };
  },

  checkIn: async () => {
    // Intern self check-in
    let internId = 'mock-intern-id';
    try {
      const profile = await internService.getCurrentInternProfile();
      if (profile.success && profile.data) {
        internId = profile.data.id;
      }
    } catch (e) {}

    // Deduce if late (e.g. check-in after 09:00:00)
    const hour = new Date().getHours();
    const mins = new Date().getMinutes();
    const isLate = hour > 9 || (hour === 9 && mins > 0);
    const status = isLate ? 'LATE' : 'PRESENT';

    return attendanceService.markAttendance(internId, status);
  },

  checkOut: async () => {
    // Intern self check-out
    let internId = 'mock-intern-id';
    try {
      const profile = await internService.getCurrentInternProfile();
      if (profile.success && profile.data) {
        internId = profile.data.id;
      }
    } catch (e) {}

    const logs = getStoredAttendance();
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = logs.findIndex(l => l.internId === internId && l.date === today);

    if (existingIndex > -1) {
      const nowTime = new Date().toLocaleTimeString(undefined, { hour12: false });
      logs[existingIndex].checkOut = nowTime;
      saveAttendance(logs);
      return { success: true, message: 'Checked out successfully' };
    }

    return { success: false, message: 'You must check-in first before checking out.' };
  },

  getMonthlySummary: async (internId = '') => {
    let logs = getStoredAttendance();
    if (internId) {
      logs = logs.filter(l => l.internId === internId);
    } else {
      // For intern, use their personal logs
      let targetId = 'mock-intern-id';
      try {
        const profile = await internService.getCurrentInternProfile();
        if (profile.success && profile.data) {
          targetId = profile.data.id;
        }
      } catch (e) {}
      logs = logs.filter(l => l.internId === targetId);
    }

    const summary = {
      present: logs.filter(l => l.status === 'PRESENT').length,
      absent: logs.filter(l => l.status === 'ABSENT').length,
      late: logs.filter(l => l.status === 'LATE').length,
      leave: logs.filter(l => l.status === 'LEAVE').length,
    };

    return {
      success: true,
      data: summary,
    };
  },

  deleteAttendance: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const logs = getStoredAttendance();
    const filtered = logs.filter((l) => l.id !== id);
    saveAttendance(filtered);
    return {
      success: true,
      message: 'Attendance record deleted successfully',
    };
  }
};

export default attendanceService;
