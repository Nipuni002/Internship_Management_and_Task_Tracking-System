import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { 
  FiSettings, 
  FiBell, 
  FiDatabase, 
  FiSave, 
  FiRotateCcw, 
  FiDownload, 
  FiClock, 
  FiCalendar, 
  FiMail,
  FiShield
} from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    workspaceName: 'DeepMind Internships Platform',
    contactEmail: 'admin@internship.com',
    probationPeriod: '3',
    maxDailyHours: '8',
    allowWeekendLogs: true,
    requireSubmissionsClearance: 'HIGH',
    enableEmailAlerts: true,
    enableOverdueAlerts: true,
    dailyLogsReminderTime: '17:00',
    sessionTimeout: '60',
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('system_portal_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('system_portal_settings', JSON.stringify(settings));
      setSaving(false);
      toast.success('System configurations updated successfully!');
    }, 1000);
  };

  // Feature: Back up all localStorage tables as a downloadable JSON file
  const handleBackupData = () => {
    try {
      const keys = [
        'intern_attendance_data',
        'intern_leave_requests',
        'intern_performance_evaluations',
        'intern_portal_notifications',
        'system_portal_settings'
      ];
      const backupObj = {};
      keys.forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) {
          backupObj[key] = JSON.parse(item);
        }
      });

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `System_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      toast.success('Database backup JSON exported successfully!');
    } catch (e) {
      toast.error('Failed to create system backup.');
    }
  };

  // Feature: Restore Factory Settings (wipes localStorage mock tables)
  const handleFactoryReset = () => {
    if (window.confirm('WARNING: This will purge all attendance, leaves, notifications, and evaluations records. Are you sure you want to reset the mock database?')) {
      localStorage.removeItem('intern_attendance_data');
      localStorage.removeItem('intern_leave_requests');
      localStorage.removeItem('intern_performance_evaluations');
      localStorage.removeItem('intern_portal_notifications');
      localStorage.removeItem('system_portal_settings');
      toast.success('Database reset complete. Reloading view...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Portal Settings" 
        description="Configure workspace properties, restrict check-in constraints, toggle notification preferences, and back up databases."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans text-xs">
        
        {/* Navigation Tabs List */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors cursor-pointer border ${
              activeTab === 'general'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <FiSettings size={16} />
            <span>General Setup</span>
          </button>
          
          <button
            onClick={() => setActiveTab('constraints')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors cursor-pointer border ${
              activeTab === 'constraints'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <FiCalendar size={16} />
            <span>Policy & Constraints</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors cursor-pointer border ${
              activeTab === 'notifications'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <FiBell size={16} />
            <span>Alerts & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-colors cursor-pointer border ${
              activeTab === 'maintenance'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <FiDatabase size={16} />
            <span>DB Maintenance</span>
          </button>
        </div>

        {/* Tab Contents Panels */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">
            
            {activeTab === 'general' && (
              <Card title="Workspace General Settings">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Workspace/Company Name</label>
                    <input
                      type="text"
                      name="workspaceName"
                      value={settings.workspaceName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Support/Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Default Probation Period (Months)</label>
                    <select
                      name="probationPeriod"
                      value={settings.probationPeriod}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'constraints' && (
              <Card title="Internship Policy Constraints">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Max Work Hours Per Log Entry</label>
                    <select
                      name="maxDailyHours"
                      value={settings.maxDailyHours}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="8">8 Hours</option>
                      <option value="10">10 Hours</option>
                      <option value="12">12 Hours</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submissions Approval Clearance Tier</label>
                    <select
                      name="requireSubmissionsClearance"
                      value={settings.requireSubmissionsClearance}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="LOW">Low (Auto approve simple files)</option>
                      <option value="MEDIUM">Medium (Internal review validation)</option>
                      <option value="HIGH">High (Full Administrator review required)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 mt-2">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Allow Weekend Logs Submission</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Let interns log hours worked on Saturdays and Sundays.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="allowWeekendLogs"
                        checked={settings.allowWeekendLogs}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-750 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card title="Alerts & Notification Preferences">
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Enable Email Notification Alerts</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Send real-time alerts to registered users upon status reviews.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="enableEmailAlerts"
                        checked={settings.enableEmailAlerts}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-750 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Task Overdue Reminders</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Auto flag and issue warnings to assigned interns on deadlines.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="enableOverdueAlerts"
                        checked={settings.enableOverdueAlerts}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-750 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Daily Log Reminder Delivery Time</label>
                    <input
                      type="time"
                      name="dailyLogsReminderTime"
                      value={settings.dailyLogsReminderTime}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'maintenance' && (
              <Card title="Database Maintenance & Recovery">
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
                    <FiShield className="text-blue-500 shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                      <p className="font-bold text-blue-700 dark:text-blue-400">Sandbox Database System</p>
                      <p className="text-[10px] leading-relaxed text-blue-600 dark:text-blue-400 font-semibold">
                        This portal stores mock parameters (leaves, attendance timelines, evaluations) inside the local storage cache. You can run backups or restore seeds here.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 flex flex-col justify-between h-36">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-850 dark:text-slate-200">Export System Database Backup</p>
                        <p className="text-[10px] text-slate-400 font-semibold leading-normal font-sans">
                          Exports all sandbox databases into a portable JSON file.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleBackupData}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FiDownload size={14} /> Download Backup
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-800 flex flex-col justify-between h-36">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-850 dark:text-slate-200">Factory Reset Database</p>
                        <p className="text-[10px] text-slate-400 font-semibold leading-normal font-sans">
                          Clears all logs, leaves, grades, and restores default parameters.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleFactoryReset}
                        className="bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-600 font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FiRotateCcw size={14} /> Clear Cache Reset
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Save Controls footer */}
            {activeTab !== 'maintenance' && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <FiSave size={14} />
                  <span>{saving ? 'Saving Configs...' : 'Save Settings'}</span>
                </button>
              </div>
            )}

          </form>
        </div>

      </div>
    </PageContainer>
  );
};

export default Settings;
