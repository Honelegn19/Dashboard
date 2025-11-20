import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { KPIResult, Transaction } from '../types';
import { formatCurrency } from '../utils';

interface AIChatBotProps {
  kpiData: KPIResult;
  filteredData: Transaction[];
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ kpiData, filteredData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'ai', 
      text: 'Hello! I am your Business Intelligence Assistant. I have analyzed the current dashboard data. Ask me about trends, top performers, or profitability!' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare Context for the AI
      // We summarize the data to keep the prompt efficient
      const dataSummary = {
        KPIs: {
          TotalSales: formatCurrency(kpiData.totalSales),
          TotalCost: formatCurrency(kpiData.totalCost),
          AvgMargin: (kpiData.avgMarginPercent * 100).toFixed(1) + '%',
          TopLocation: kpiData.topLocation,
          TopProduct: kpiData.topProduct,
          TopCustomer: kpiData.topCustomer,
        },
        // Send a sample of transactions or aggregated view if dataset is large. 
        // For this app, we'll send the first 50 rows of filtered data to give specific context.
        SampleTransactions: filteredData.slice(0, 50).map(t => ({
          Date: t.date,
          Location: t.location,
          Category: t.category,
          Sales: t.sales,
          Profit: t.profit
        }))
      };

      const systemPrompt = `
        You are an expert Business Intelligence Analyst AI attached to a sales dashboard.
        
        Current Dashboard Context (based on active filters):
        ${JSON.stringify(dataSummary, null, 2)}
        
        Instructions:
        1. Answer the user's question based strictly on the provided data.
        2. If the user asks about "Top 10" or specific details not in the summary, make a reasonable inference based on the provided sample or explain that you are analyzing the visible dataset.
        3. Keep answers concise, professional, and insightful.
        4. Format currency appropriately.
        5. If the data shows negative profit, highlight it as a concern.
      `;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + userMessage.text }] }
        ]
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.text || "I couldn't generate a response based on the data."
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "I'm having trouble connecting to the analysis engine. Please ensure the API Key is configured correctly."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Trigger Button - Top Left */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-[85px] left-4 z-40 flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-navy-800 transition-all hover:scale-105 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-left-4"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="font-medium text-sm">AI Analysis</span>
        </button>
      )}

      {/* Chat Interface Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-96 bg-slate-50/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-white/20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-navy-900 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Data Insight AI</h3>
              <p className="text-xs text-gray-300">Powered by Gemini 2.5</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-130px)] space-y-4 bg-gradient-to-b from-transparent to-gray-100/50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gray-200' : 'bg-navy-100'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-gray-600" /> : <Bot className="w-5 h-5 text-navy-900" />}
              </div>
              
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-navy-900 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-navy-900" />
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing data...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about sales, trends, or profits..."
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent shadow-inner disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-navy-900 text-white rounded-full hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">AI can make mistakes. Verify important business data.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatBot;