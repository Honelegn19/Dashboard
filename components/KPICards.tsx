import React from 'react';
import { DollarSign, Percent, MapPin, ShoppingBag, User } from 'lucide-react';
import { KPIResult } from '../types';
import { formatCurrency, formatPercent } from '../utils';

interface KPICardsProps {
  data: KPIResult;
}

const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  // Updated card class to use semi-transparent white background
  const cardClass = "bg-white/50 p-4 border border-white/60 shadow-sm backdrop-blur-sm flex flex-col justify-between h-[100px] min-w-[290px] rounded-lg hover:bg-white/60 transition-colors";
  const titleClass = "text-navy-900 font-bold flex items-center gap-2 text-sm uppercase opacity-90";
  const valueClass = "text-navy-900 text-2xl font-bold mt-2";
  const iconClass = "w-4 h-4";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {/* Card 1: Total Sales */}
      <div className={cardClass}>
        <h3 className={titleClass}><DollarSign className={iconClass} /> Total Sales</h3>
        <p className={valueClass}>{formatCurrency(data.totalSales)}</p>
      </div>

      {/* Card 2: Total Cost */}
      <div className={cardClass}>
        <h3 className={titleClass}><DollarSign className={iconClass} /> Total Cost</h3>
        <p className={valueClass}>{formatCurrency(data.totalCost)}</p>
      </div>

      {/* Card 3: Average Margin */}
      <div className={cardClass}>
        <h3 className={titleClass}><Percent className={iconClass} /> Average Margin</h3>
        <p className={valueClass}>{formatPercent(data.avgMarginPercent)}</p>
      </div>

      {/* Card 4: Top Sales Location */}
      <div className={cardClass}>
        <h3 className={titleClass}><MapPin className={iconClass} /> Top Sales Location</h3>
        <p className={valueClass}>{data.topLocation}</p>
      </div>

      {/* Card 5: Top Selling Product */}
      <div className={cardClass}>
        <h3 className={titleClass}><ShoppingBag className={iconClass} /> Top Selling Product</h3>
        <p className={valueClass}>{data.topProduct}</p>
      </div>

      {/* Card 6: Top Customer */}
      <div className={cardClass}>
        <h3 className={titleClass}><User className={iconClass} /> Top Customer</h3>
        <p className={`text-navy-900 text-xl font-bold mt-2 truncate`} title={data.topCustomer}>{data.topCustomer}</p>
      </div>
    </div>
  );
};

export default KPICards;