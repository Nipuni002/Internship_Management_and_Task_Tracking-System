import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const MonthlyActivityChart = ({ data = [] }) => {
  // data should be: [{ name: 'Jan 2026', hours: 120 }, { name: 'Feb 2026', hours: 85 }]
  const hasData = data && data.length > 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-md font-sans">
          <p className="text-xs font-bold text-slate-800 leading-none">{payload[0].payload.name}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Work Logged: <span className="text-emerald-600 font-black">{payload[0].value.toFixed(1)} hrs</span>
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
        <h4 className="font-bold text-slate-800 text-sm">Monthly Work Engagement</h4>
        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          Hours Logged
        </span>
      </div>

      <div className="flex-1 min-h-0 relative">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
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
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#areaGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              No Work Logs Found
            </p>
            <p className="text-[10px] text-slate-350 font-medium mt-1">
              Log working hours in log records to map monthly activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyActivityChart;
