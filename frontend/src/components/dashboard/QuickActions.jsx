import React from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus, FiFolderPlus, FiPlusSquare, FiEdit3, FiUploadCloud, FiCheckSquare } from 'react-icons/fi';

const QuickActions = ({ role }) => {
  const adminActions = [
    {
      title: 'Add Intern',
      description: 'Onboard a new intern into the portal.',
      link: '/admin/interns/add',
      icon: <FiUserPlus size={20} />,
      colorClass: 'bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-700 hover:bg-blue-100/50',
    },
    {
      title: 'Create Project',
      description: 'Set up a new system or group workspace.',
      link: '/admin/projects/create',
      icon: <FiFolderPlus size={20} />,
      colorClass: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-700 hover:bg-emerald-100/50',
    },
    {
      title: 'Create Task',
      description: 'Formulate and assign a task item.',
      link: '/admin/tasks/create',
      icon: <FiPlusSquare size={20} />,
      colorClass: 'bg-violet-50 border-violet-100 hover:border-violet-300 text-violet-700 hover:bg-violet-100/50',
    },
  ];

  const internActions = [
    {
      title: 'Add Daily Log',
      description: 'Document your working hours and task notes.',
      link: '/intern/logs/add',
      icon: <FiEdit3 size={20} />,
      colorClass: 'bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-700 hover:bg-amber-100/50',
    },
    {
      title: 'Submit Work',
      description: 'Submit links and file assets for final reviews.',
      link: '/intern/submissions/submit',
      icon: <FiUploadCloud size={20} />,
      colorClass: 'bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-700 hover:bg-blue-100/50',
    },
    {
      title: 'View Tasks',
      description: 'Browse your active task list board.',
      link: '/intern/tasks',
      icon: <FiCheckSquare size={20} />,
      colorClass: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300 text-indigo-700 hover:bg-indigo-100/50',
    },
  ];

  const actions = role === 'ROLE_ADMIN' ? adminActions : internActions;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans h-full">
      <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">
        Quick Action Center
      </h4>

      <div className="space-y-3.5">
        {actions.map((act) => (
          <Link
            key={act.title}
            to={act.link}
            className={`flex items-start gap-4 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-xs ${act.colorClass}`}
          >
            <div className="p-2.5 rounded-lg bg-white shadow-xs shrink-0">
              {act.icon}
            </div>
            <div>
              <h5 className="text-xs font-bold leading-tight">{act.title}</h5>
              <p className="text-[10px] opacity-80 font-medium mt-1 leading-relaxed">
                {act.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
