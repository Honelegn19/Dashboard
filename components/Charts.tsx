import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, TooltipProps, LineChart, Line
} from 'recharts';
import { ArrowUpDown, AlertCircle } from 'lucide-react';

interface ChartProps {
  data: any[];
  title: string;
  colors: string[];
}

// Helper for tooltip formatting - Updated to Dark Theme
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900 p-3 border border-navy-800 shadow-xl rounded-md text-sm text-white z-50 relative">
        <p className="font-bold mb-1 text-gray-200">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Chart Wrapper & Empty State ---

interface ChartWrapperProps {
  title: string;
  hasData: boolean;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

const NoDataMessage = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100/10 backdrop-blur-sm text-gray-500 z-10 rounded-lg">
    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
    <span className="text-sm font-medium">No data available</span>
  </div>
);

// Updated: Changed from bg-transparent to bg-white/50 for glassmorphism on slate background
const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  title, 
  hasData, 
  children, 
  className = "h-[300px]", 
  headerAction 
}) => (
  <div className={`bg-white/50 p-4 border border-white/60 shadow-sm backdrop-blur-sm rounded-lg w-full flex flex-col ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-navy-900 font-bold">{title}</h3>
      {headerAction}
    </div>
    <div className="flex-1 min-h-0 w-full relative">
      {hasData ? children : <NoDataMessage />}
    </div>
  </div>
);

// --- Chart Components ---

// Chart 1: Sales Trend (Spline Area)
export const SalesTrendChart: React.FC<ChartProps> = ({ data, title, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[300px] mb-6">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
        <XAxis dataKey="label" tick={{fontSize: 10, fill: colors[0]}} interval="preserveStartEnd" />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{fontSize: 10, fill: colors[0]}} />
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Area type="monotone" dataKey="sales" stroke={colors[0]} fill={colors[0]} fillOpacity={0.8} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Chart 2: Sales By Location (Column)
export const SalesByLocationChart: React.FC<ChartProps> = ({ data, title, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[350px] mb-6">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
        <XAxis dataKey="name" tick={{fontSize: 10, fill: colors[0]}} interval={0} angle={-45} textAnchor="end" height={60} />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{fontSize: 10, fill: colors[0]}} />
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Bar dataKey="value" name="Sales" fill={colors[1]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Chart 3: Sales By Category (Pie)
export const SalesByCategoryChart: React.FC<ChartProps> = ({ data, title, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[350px] mb-6">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{fontSize: '12px'}} />
      </PieChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Chart 4: Top 10 Customers (Horizontal Bar) with Sorting Dropdown
export const TopCustomersChart: React.FC<ChartProps> = ({ data, title, colors }) => {
  const [sortOption, setSortOption] = useState<string>('sales_desc');

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      switch (sortOption) {
        case 'sales_desc': return a.value - b.value; // Recharts vertical layout: last item is top
        case 'sales_asc': return b.value - a.value;
        case 'name_asc': return b.name.localeCompare(a.name);
        case 'name_desc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [data, sortOption]);

  return (
    <ChartWrapper 
      title={title} 
      hasData={data && data.length > 0} 
      className="h-full"
      headerAction={
        <div className="relative">
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none bg-transparent border border-gray-300 hover:border-navy-900 text-xs font-medium text-navy-900 py-1 pl-2 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-navy-900 cursor-pointer transition-colors"
          >
            <option value="sales_desc">Sales: High to Low</option>
            <option value="sales_asc">Sales: Low to High</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} layout="vertical" margin={{ left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} stroke="#94A3B8" />
          <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{fontSize: 10, fill: colors[0]}} />
          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fill: colors[0]}} />
          <Tooltip content={<CustomTooltip prefix="$" />} />
          <Bar dataKey="value" name="Sales" fill={colors[3]} barSize={20} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

// Chart 5: Sales, Expense, Profit (100% Stacked Bar)
export const FinancialsStackedChart: React.FC<ChartProps> = ({ data, title, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[300px] mb-6">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} stackOffset="expand">
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
        <XAxis dataKey="name" tick={{fontSize: 10, fill: colors[0]}} />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{fontSize: 10, fill: colors[0]}} />
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
        <Bar dataKey="sales" name="Sales" stackId="a" fill={colors[0]} />
        <Bar dataKey="cost" name="Cost" stackId="a" fill={colors[1]} />
        <Bar dataKey="expenses" name="Expenses" stackId="a" fill={colors[2]} />
        <Bar dataKey="profit" name="Profit" stackId="a" fill={colors[3]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Chart 6: Profit By Category Stacked (Stacked Column)
export const ProfitByCategoryChart: React.FC<ChartProps & {categories: string[]}> = ({ data, title, categories, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[300px] mb-6">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
        <XAxis dataKey="name" tick={{fontSize: 10, fill: colors[0]}} />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{fontSize: 10, fill: colors[0]}} />
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
        {categories.map((cat, index) => (
          <Bar key={cat} dataKey={cat} stackId="a" fill={colors[index % colors.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Chart 7: Profit By Location (Semi Donut)
export const ProfitByLocationChart: React.FC<ChartProps> = ({ data, title, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[350px] mb-6">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cy="70%"
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          stroke="transparent"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{fontSize: '12px'}} />
      </PieChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Chart 8: Sales and Profit Trend (Stacked Area)
export const SalesProfitTrendChart: React.FC<ChartProps> = ({ data, title, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
        <XAxis dataKey="label" tick={{fontSize: 10, fill: colors[0]}} interval="preserveStartEnd" />
        <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{fontSize: 10, fill: colors[0]}} />
        <Tooltip content={<CustomTooltip prefix="$" />} />
        <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
        <Area type="monotone" dataKey="sales" stackId="1" stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
        <Area type="monotone" dataKey="profit" stackId="1" stroke={colors[2]} fill={colors[2]} fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

// Chart 9: Profit Margin % Trend (Line Chart)
export const ProfitMarginTrendChart: React.FC<ChartProps> = ({ data, title, colors }) => (
  <ChartWrapper title={title} hasData={data && data.length > 0} className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#94A3B8" />
        <XAxis dataKey="label" tick={{fontSize: 10, fill: colors[0]}} interval="preserveStartEnd" />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} tick={{fontSize: 10, fill: colors[0]}} />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-navy-900 p-3 border border-navy-800 shadow-xl rounded-md text-sm text-white z-50 relative">
                  <p className="font-bold mb-1 text-gray-200">{label}</p>
                  <p style={{ color: payload[0].color }} className="font-medium">
                    Margin: {(Number(payload[0].value) * 100).toFixed(2)}%
                  </p>
                </div>
              );
            }
            return null;
          }} 
        />
        <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
        <Line type="monotone" dataKey="marginPercent" name="Profit Margin %" stroke={colors[3]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  </ChartWrapper>
);