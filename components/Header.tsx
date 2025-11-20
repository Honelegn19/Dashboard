import React from 'react';
import { Palette, RefreshCw } from 'lucide-react';

interface HeaderProps {
  themes: Record<string, { label: string }>;
  currentTheme: string;
  onThemeChange: (themeKey: string) => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ themes, currentTheme, onThemeChange, onRefresh }) => {
  return (
    <header className="bg-navy-900 text-white py-4 px-6 shadow-md w-full flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Business Dashboard</h1>
        <p className="text-xs text-gray-300 mt-0.5 uppercase tracking-wide">Key trends & insights</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onRefresh}
          className="p-1.5 bg-navy-800 bg-opacity-50 rounded-lg hover:bg-navy-700 transition-colors group"
          title="Refresh Dashboard"
        >
          <RefreshCw className="w-4 h-4 text-gray-300 group-hover:text-white group-hover:rotate-180 transition-transform duration-700" />
        </button>

        <div className="flex items-center gap-2 bg-navy-800 bg-opacity-50 rounded-lg p-1.5">
          <Palette className="w-4 h-4 text-gray-300 ml-2" />
          <label htmlFor="theme-select" className="text-xs font-medium text-gray-300 uppercase mr-1">Theme:</label>
          <select 
            id="theme-select"
            value={currentTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-white focus:outline-none border-none cursor-pointer hover:text-gray-200"
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key} className="text-navy-900 bg-white">
                {(theme as { label: string }).label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;