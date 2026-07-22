import React, { useState } from 'react';
import { Plane, Database, Download, Upload, RotateCcw, Calendar, Sparkles } from 'lucide-react';
import { addDaysToDate, getTodayISOString } from '../utils/dateUtils';

interface TimeTravelSimulatorProps {
  currentSimulatedDate: string;
  onDateChange: (newDate: string) => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetApp: () => void;
  onLoadSampleData: () => void;
}

export const TimeTravelSimulator: React.FC<TimeTravelSimulatorProps> = ({
  currentSimulatedDate,
  onDateChange,
  onExportJSON,
  onImportJSON,
  onResetApp,
  onLoadSampleData,
}) => {
  const [inputDate, setInputDate] = useState(currentSimulatedDate);
  const realToday = getTodayISOString();

  const handleTravel = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputDate) {
      onDateChange(inputDate);
    }
  };

  const jumpDays = (days: number) => {
    const target = addDaysToDate(realToday, days);
    setInputDate(target);
    onDateChange(target);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Time-Travel Simulator Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-stone-800 tracking-tight">
              Time-Travel Simulator
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Since spaced repetition happens over days, weeks, and months, simulate moving forward in time to test future alerts instantly.
          </p>
        </div>

        <form onSubmit={handleTravel} className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 cursor-pointer"
          />
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-400 hover:bg-rose-500 text-white transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plane className="w-3.5 h-3.5" /> Travel to Date
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-stone-400 mr-1">Quick Jump:</span>
          <button
            onClick={() => jumpDays(1)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            +1 Day
          </button>
          <button
            onClick={() => jumpDays(3)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            +3 Days
          </button>
          <button
            onClick={() => jumpDays(7)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            +1 Week
          </button>
          <button
            onClick={() => jumpDays(90)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            +3 Months
          </button>
          <button
            onClick={() => {
              setInputDate(realToday);
              onDateChange(realToday);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors ml-auto"
          >
            Reset to Today
          </button>
        </div>
      </div>

      {/* Data Management Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-stone-800 tracking-tight">
              Data Management
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Keep your data safe by exporting it to a file, or import previous study records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportJSON}
            className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>

          <label className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
            <Upload className="w-3.5 h-3.5" /> Import JSON
            <input
              type="file"
              accept=".json"
              onChange={onImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetApp}
            className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset App
          </button>
        </div>
      </div>
    </div>
  );
};
