import { Transaction, KPIResult, AggregatedData } from './types';

export const parseDate = (dateStr: string): Date => {
  // Matches DD-MMM-YYYY (e.g., 01-Jan-2023)
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date();
  
  const day = parseInt(parts[0], 10);
  const monthStr = parts[1];
  const year = parseInt(parts[2], 10);
  
  const monthMap: {[key: string]: number} = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
    // Handle potential numeric middle part just in case
    '01': 0, '02': 1, '03': 2, '04': 3, '05': 4, '06': 5,
    '07': 6, '08': 7, '09': 8, '10': 9, '11': 10, '12': 11
  };

  return new Date(year, monthMap[monthStr] || 0, day);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
};

export const calculateKPIs = (data: Transaction[]): KPIResult => {
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  const totalMargin = data.reduce((sum, item) => sum + item.margin, 0);
  
  // Avoid division by zero
  const avgMarginPercent = totalSales > 0 ? totalMargin / totalSales : 0;

  // Helper for finding top groups
  const getTopCategory = (field: keyof Transaction): string => {
    const counts: {[key: string]: number} = {};
    data.forEach(item => {
      const key = String(item[field]);
      counts[key] = (counts[key] || 0) + item.sales;
    });
    
    let maxVal = -Infinity;
    let maxKey = "N/A";
    
    for (const [key, val] of Object.entries(counts)) {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    }
    return maxKey;
  };

  return {
    totalSales,
    totalCost,
    avgMarginPercent,
    topLocation: getTopCategory('location'),
    topProduct: getTopCategory('product'),
    topCustomer: getTopCategory('entityName'),
  };
};

// Chart 1: Sales Trend (Group by Month/Year)
export const getSalesTrend = (data: Transaction[]) => {
  const agg: {[key: string]: {dateVal: number, sales: number, label: string}} = {};
  
  data.forEach(item => {
    const date = parseDate(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`; // unique key
    if (!agg[key]) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      agg[key] = {
        dateVal: date.getTime(),
        sales: 0,
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      };
    }
    agg[key].sales += item.sales;
  });

  return Object.values(agg).sort((a, b) => a.dateVal - b.dateVal);
};

// Chart 2: Sales By Location
export const getSalesByLocation = (data: Transaction[]) => {
  const agg: {[key: string]: number} = {};
  data.forEach(item => {
    agg[item.location] = (agg[item.location] || 0) + item.sales;
  });
  return Object.entries(agg).map(([name, value]) => ({ name, value }));
};

// Chart 3: Sales By Category
export const getSalesByCategory = (data: Transaction[]) => {
  const agg: {[key: string]: number} = {};
  data.forEach(item => {
    agg[item.category] = (agg[item.category] || 0) + item.sales;
  });
  return Object.entries(agg).map(([name, value]) => ({ name, value }));
};

// Chart 4: Top 10 Customers
export const getTopCustomers = (data: Transaction[]) => {
  const agg: {[key: string]: number} = {};
  data.forEach(item => {
    agg[item.entityName] = (agg[item.entityName] || 0) + item.sales;
  });
  return Object.entries(agg)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

// Chart 5: Sales, Expense, Profit Stacked (By Year)
export const getFinancialsByYear = (data: Transaction[]) => {
  const agg: {[key: string]: any} = {};
  data.forEach(item => {
    const year = parseDate(item.date).getFullYear().toString();
    if (!agg[year]) agg[year] = { name: year, sales: 0, cost: 0, expenses: 0, profit: 0 };
    agg[year].sales += item.sales;
    agg[year].cost += item.cost;
    agg[year].expenses += item.expenses;
    agg[year].profit += item.profit;
  });
  return Object.values(agg).sort((a, b) => parseInt(a.name) - parseInt(b.name));
};

// Chart 6: Profit By Category Stacked (Year on X, Profit on Y, Stacked by Category)
export const getProfitByCategoryYear = (data: Transaction[]) => {
  const agg: {[key: string]: any} = {};
  const categories = new Set<string>();
  
  data.forEach(item => {
    const year = parseDate(item.date).getFullYear().toString();
    categories.add(item.category);
    
    if (!agg[year]) agg[year] = { name: year };
    agg[year][item.category] = (agg[year][item.category] || 0) + item.profit;
  });

  const result = Object.values(agg).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  return { data: result, categories: Array.from(categories) };
};

// Chart 7: Profit By Location
export const getProfitByLocation = (data: Transaction[]) => {
  const agg: {[key: string]: number} = {};
  data.forEach(item => {
    agg[item.location] = (agg[item.location] || 0) + item.profit;
  });
  return Object.entries(agg).map(([name, value]) => ({ name, value }));
};

// Chart 8: Sales vs Profit Trend
export const getSalesProfitTrend = (data: Transaction[]) => {
  const agg: {[key: string]: {dateVal: number, sales: number, profit: number, label: string}} = {};
  
  data.forEach(item => {
    const date = parseDate(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!agg[key]) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      agg[key] = {
        dateVal: date.getTime(),
        sales: 0,
        profit: 0,
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      };
    }
    agg[key].sales += item.sales;
    agg[key].profit += item.profit;
  });

  return Object.values(agg).sort((a, b) => a.dateVal - b.dateVal);
};

// Chart 9: Profit Margin % Trend
export const getProfitMarginTrend = (data: Transaction[]) => {
  const agg: {[key: string]: {dateVal: number, margin: number, sales: number, label: string}} = {};
  
  data.forEach(item => {
    const date = parseDate(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!agg[key]) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      agg[key] = {
        dateVal: date.getTime(),
        margin: 0,
        sales: 0,
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      };
    }
    agg[key].margin += item.margin;
    agg[key].sales += item.sales;
  });

  return Object.values(agg)
    .sort((a, b) => a.dateVal - b.dateVal)
    .map(item => ({
      label: item.label,
      marginPercent: item.sales > 0 ? item.margin / item.sales : 0
    }));
};