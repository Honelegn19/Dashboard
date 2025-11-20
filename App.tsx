import React, { useMemo, useState, useEffect } from 'react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import DateRangeFilter from './components/DateRangeFilter';
import AIChatBot from './components/AIChatBot';
import {
  SalesTrendChart,
  SalesByLocationChart,
  SalesByCategoryChart,
  TopCustomersChart,
  FinancialsStackedChart,
  ProfitByCategoryChart,
  ProfitByLocationChart,
  SalesProfitTrendChart,
  ProfitMarginTrendChart
} from './components/Charts';
import { MOCK_DATA } from './constants';
import {
  parseDate,
  calculateKPIs,
  getSalesTrend,
  getSalesByLocation,
  getSalesByCategory,
  getTopCustomers,
  getFinancialsByYear,
  getProfitByCategoryYear,
  getProfitByLocation,
  getSalesProfitTrend,
  getProfitMarginTrend
} from './utils';

// Theme Definitions
interface ThemeDefinition {
  label: string;
  primary900: string;
  primary800: string;
  chart: string[];
}

const THEMES: Record<string, ThemeDefinition> = {
  navy: { 
    label: 'Executive Navy', 
    primary900: '#021640', 
    primary800: '#0F2952', 
    chart: ['#021640', '#0066CC', '#0099CC', '#4572C4', '#558ED5', '#1F4E79'] 
  },
  forest: { 
    label: 'Forest Green', 
    primary900: '#064E3B', 
    primary800: '#065F46', 
    chart: ['#064E3B', '#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'] 
  },
  berry: { 
    label: 'Berry Purple', 
    primary900: '#4C1D95', 
    primary800: '#5B21B6', 
    chart: ['#4C1D95', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'] 
  },
  slate: { 
    label: 'Slate Gray', 
    primary900: '#0F172A', 
    primary800: '#1E293B', 
    chart: ['#0F172A', '#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'] 
  },
};

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('navy');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Filters
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('');

  // Apply Theme Side Effects
  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;
    
    root.style.setProperty('--primary-900', theme.primary900);
    root.style.setProperty('--primary-800', theme.primary800);
    
    // Update chart color variables just in case they are used in CSS, though we pass props to charts
    theme.chart.forEach((color, index) => {
      root.style.setProperty(`--color-chart-${index + 1}`, color);
    });

  }, [currentTheme]);

  // Extract unique values for dropdowns
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(MOCK_DATA.map(item => item.location))).sort();
  }, []);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(MOCK_DATA.map(item => item.category))).sort();
  }, []);

  const uniqueProducts = useMemo(() => {
    return Array.from(new Set(MOCK_DATA.map(item => item.product))).sort();
  }, []);

  const uniqueEntities = useMemo(() => {
    return Array.from(new Set(MOCK_DATA.map(item => item.entityName))).sort();
  }, []);

  // Filter data based on selected criteria
  const filteredData = useMemo(() => {
    if (!startDate && !endDate && !selectedLocation && !selectedCategory && !selectedProduct && !selectedEntity) {
      return MOCK_DATA;
    }

    return MOCK_DATA.filter(item => {
      // Location Filter
      if (selectedLocation && item.location !== selectedLocation) return false;

      // Category Filter
      if (selectedCategory && item.category !== selectedCategory) return false;

      // Product Filter
      if (selectedProduct && item.product !== selectedProduct) return false;

      // Entity/Customer Filter
      if (selectedEntity && item.entityName !== selectedEntity) return false;

      // Date Filter
      const itemDate = parseDate(item.date);
      itemDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const [y, m, d] = startDate.split('-').map(Number);
        const start = new Date(y, m - 1, d);
        if (itemDate < start) return false;
      }

      if (endDate) {
        const [y, m, d] = endDate.split('-').map(Number);
        const end = new Date(y, m - 1, d);
        if (itemDate > end) return false;
      }

      return true;
    });
  }, [startDate, endDate, selectedLocation, selectedCategory, selectedProduct, selectedEntity]);

  // Calculate all derived data based on filteredData
  const kpiData = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const salesTrend = useMemo(() => getSalesTrend(filteredData), [filteredData]);
  const salesByLocation = useMemo(() => getSalesByLocation(filteredData), [filteredData]);
  const salesByCategory = useMemo(() => getSalesByCategory(filteredData), [filteredData]);
  const topCustomers = useMemo(() => getTopCustomers(filteredData), [filteredData]);
  const financialsByYear = useMemo(() => getFinancialsByYear(filteredData), [filteredData]);
  const { data: profitByCategory, categories } = useMemo(() => getProfitByCategoryYear(filteredData), [filteredData]);
  const profitByLocation = useMemo(() => getProfitByLocation(filteredData), [filteredData]);
  const salesProfitTrend = useMemo(() => getSalesProfitTrend(filteredData), [filteredData]);
  const profitMarginTrend = useMemo(() => getProfitMarginTrend(filteredData), [filteredData]);

  const chartColors = THEMES[currentTheme].chart;

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedProduct('');
    setSelectedEntity('');
  };

  const handleRefresh = () => {
    handleResetFilter();
  };

  const handleExport = () => {
    // Define CSV headers
    const headers = [
      "Date", 
      "Entity Name", 
      "Product", 
      "Category", 
      "Location", 
      "Sales", 
      "Cost", 
      "Margin", 
      "Expenses", 
      "Profit", 
      "Margin %", 
      "Profit %"
    ];

    // Map data to CSV rows
    const csvRows = filteredData.map(item => [
      item.date,
      `"${item.entityName}"`, // Quote strings to handle commas
      `"${item.product}"`,
      `"${item.category}"`,
      `"${item.location}"`,
      item.sales,
      item.cost,
      item.margin,
      item.expenses,
      item.profit,
      `${(item.marginPercent * 100).toFixed(2)}%`,
      `${(item.profitPercent * 100).toFixed(2)}%`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-200 font-sans pb-12 transition-colors duration-300">
      <Header 
        themes={THEMES} 
        currentTheme={currentTheme} 
        onThemeChange={setCurrentTheme}
        onRefresh={handleRefresh}
      />
      
      <main className="max-w-[1600px] mx-auto px-4 py-6 relative">
        
        {/* AI Chat Bot Integration */}
        <AIChatBot kpiData={kpiData} filteredData={filteredData} />

        {/* Filter Bar */}
        <div className="pt-8 lg:pt-0"> {/* Added padding top to avoid overlap with AI button on mobile if needed */}
          <DateRangeFilter 
            startDate={startDate} 
            endDate={endDate} 
            onStartDateChange={setStartDate} 
            onEndDateChange={setEndDate}
            
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            locations={uniqueLocations}

            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={uniqueCategories}

            selectedProduct={selectedProduct}
            onProductChange={setSelectedProduct}
            products={uniqueProducts}

            selectedEntity={selectedEntity}
            onEntityChange={setSelectedEntity}
            entities={uniqueEntities}

            onReset={handleResetFilter}
            onExport={handleExport}
          />
        </div>

        {/* KPI Section - Row 1 */}
        <KPICards data={kpiData} />

        {/* Charts Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1 (33% approx - span 4) */}
          <div className="lg:col-span-4 flex flex-col">
            <SalesTrendChart data={salesTrend} title="Sales Trend" colors={chartColors} />
            <div className="flex flex-col sm:flex-row gap-6">
               <div className="w-full sm:w-1/2">
                  <SalesByLocationChart data={salesByLocation} title="Sales By Location" colors={chartColors} />
               </div>
               <div className="w-full sm:w-1/2">
                  <SalesByCategoryChart data={salesByCategory} title="Sales By Category" colors={chartColors} />
               </div>
            </div>
          </div>

          {/* Column 2 (25% approx - span 3) - Tall chart */}
          <div className="lg:col-span-3 h-full">
             <div className="h-[675px]"> {/* Matching roughly column 1 height */}
                <TopCustomersChart data={topCustomers} title="Top 10 Customers" colors={chartColors} />
             </div>
          </div>

          {/* Column 3 (42% approx - span 5) */}
          <div className="lg:col-span-5 flex flex-col">
             <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="w-full sm:w-1/2">
                    <FinancialsStackedChart data={financialsByYear} title="Sales, Expense & Profit" colors={chartColors} />
                </div>
                <div className="w-full sm:w-1/2">
                   <ProfitByCategoryChart data={profitByCategory} categories={categories} title="Profit By Category" colors={chartColors} />
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-6 h-[350px]">
                <div className="w-full sm:w-1/3">
                   <ProfitByLocationChart data={profitByLocation} title="Profit By Location" colors={chartColors} />
                </div>
                <div className="w-full sm:w-2/3">
                   <SalesProfitTrendChart data={salesProfitTrend} title="Sales and Profit Trend" colors={chartColors} />
                </div>
             </div>
          </div>

          {/* New Row: Profit Margin % Trend (Full Width) */}
          <div className="lg:col-span-12">
            <ProfitMarginTrendChart data={profitMarginTrend} title="Profit Margin % Trend" colors={chartColors} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;