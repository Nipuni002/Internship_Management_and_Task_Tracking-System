import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const ProjectProgressChart = ({ data = [] }) => {
  // data should be: [{ name: 'Project Alpha', progress: 80 }, { name: 'Project Beta', progress: 45 }]
  const hasData = data && data.length > 0;

  // Custom tool-tip customizer
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-md font-sans">
          <p className="text-xs font-bold text-slate-800 leading-none">{payload[0].payload.name}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2.5 h-2.5 rounded bg-indigo-500" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Progress: <span className="text-indigo-600 font-black">{payload[0].value}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans h-[350px] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <h4 className="font-bold text-slate-800 text-sm">Project Completion Rate</h4>
        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          Percentage
        </span>
      </div>

      <div className="flex-1 min-h-0 relative">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              barSize={20}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo-600 */}
                  <stop offset="100%" stopColor="#818cf8" /> {/* Indigo-400 */}
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="progress" 
                radius={[6, 6, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill="url(#barGradient)"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              No Projects Assigned
            </p>
            <p className="text-[10px] text-slate-350 font-medium mt-1">
              Onboard projects to visualize progress trends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectProgressChart;
