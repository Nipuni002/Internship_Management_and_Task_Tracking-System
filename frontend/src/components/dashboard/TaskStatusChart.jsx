import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const TaskStatusChart = ({ data = [] }) => {
  // data should be an array of: { name: 'Status Name', value: 12 }
  // e.g. [{ name: 'To Do', value: 2 }, { name: 'In Progress', value: 5 }, ...]

  // Theme-specific premium colors
  const COLORS = {
    'TO DO': '#8b5cf6', // Purple
    'IN PROGRESS': '#3b82f6', // Blue
    'SUBMITTED': '#f59e0b', // Amber
    'REVISION REQUIRED': '#f43f5e', // Rose
    'COMPLETED': '#10b981', // Emerald
  };

  const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'];

  const getCellColor = (name, index) => {
    const key = name?.toUpperCase().replace('_', ' ');
    return COLORS[key] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  const hasData = data && data.some(item => item.value > 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans h-[350px] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <h4 className="font-bold text-slate-800 text-sm">Task Status Distribution</h4>
        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          Proportional
        </span>
      </div>

      <div className="flex-1 min-h-0 relative">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getCellColor(entry.name, index)} 
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
                itemStyle={{ color: '#1e293b' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {value.replace('_', ' ')}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              No Task Metrics
            </p>
            <p className="text-[10px] text-slate-350 font-medium mt-1">
              Add tasks to populate status diagrams.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskStatusChart;
