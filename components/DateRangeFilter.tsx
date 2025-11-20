import React from 'react';
import { Calendar, X, Download, Filter, MapPin, Tag, Package, Users } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  locations: string[];

  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];

  selectedProduct: string;
  onProductChange: (product: string) => void;
  products: string[];

  selectedEntity: string;
  onEntityChange: (entity: string) => void;
  entities: string[];

  onReset: () => void;
  onExport: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedLocation,
  onLocationChange,
  locations,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedProduct,
  onProductChange,
  products,
  selectedEntity,
  onEntityChange,
  entities,
  onReset,
  onExport
}) => {
  const hasActiveFilter = startDate || endDate || selectedLocation || selectedCategory || selectedProduct || selectedEntity;

  // Updated to semi-transparent white for glassmorphism on colored background
  return (
    <div className="bg-white/50 p-4 rounded-lg border border-white/60 shadow-sm backdrop-blur-sm mb-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex items-center gap-2 text-navy-900 font-bold uppercase text-sm mr-2">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>
        
        {/* Location Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap hidden sm:block">Location:</span>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900 bg-transparent min-w-[130px]"
            aria-label="Filter by Location"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap hidden sm:block">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900 bg-transparent min-w-[130px]"
            aria-label="Filter by Category"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Product Filter */}
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap hidden sm:block">Product:</span>
          <select
            value={selectedProduct}
            onChange={(e) => onProductChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900 bg-transparent min-w-[130px] max-w-[200px]"
            aria-label="Filter by Product"
          >
            <option value="">All Products</option>
            {products.map(prod => (
              <option key={prod} value={prod}>{prod}</option>
            ))}
          </select>
        </div>

        {/* Customer/Entity Filter */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap hidden sm:block">Customer:</span>
          <select
            value={selectedEntity}
            onChange={(e) => onEntityChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900 bg-transparent min-w-[130px] max-w-[200px]"
            aria-label="Filter by Customer"
          >
            <option value="">All Customers</option>
            {entities.map(ent => (
              <option key={ent} value={ent}>{ent}</option>
            ))}
          </select>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2 hidden xl:block"></div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <label htmlFor="start-date" className="text-sm text-gray-600 font-medium whitespace-nowrap">From:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="end-date" className="text-sm text-gray-600 font-medium whitespace-nowrap">To:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-navy-900 text-navy-900 bg-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 w-full xl:w-auto justify-end mt-4 xl:mt-0">
        {hasActiveFilter && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium transition-colors px-3 py-1.5 rounded hover:bg-red-50 border border-transparent hover:border-red-100 whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
        
        <button
          onClick={onExport}
          className="flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 font-medium transition-colors px-4 py-1.5 rounded shadow-sm whitespace-nowrap"
          title="Download filtered data as CSV"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};

export default DateRangeFilter;