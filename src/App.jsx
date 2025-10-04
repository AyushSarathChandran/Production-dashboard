// src/App.jsx
import React, { useState, useMemo } from 'react';
import { scheduleData } from './data/scheduleData';
import { groupDataByWeek } from './utils/scheduleUtils';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import DetailedCallSheet from './components/DetailedCallSheet';
import DetailedWeekSheet from './components/DetailedWeekSheet';

function App() {
  const [view, setView] = useState('daily'); // 'daily' or 'weekly'
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedWeekNum, setSelectedWeekNum] = useState(null);

  const weeklyData = useMemo(() => groupDataByWeek(scheduleData), []);

  const handleSelectDay = (dayId) => {
    setSelectedDayId(dayId);
    setSelectedWeekNum(null);
  };

  const handleSelectWeek = (weekNum) => {
    setSelectedWeekNum(weekNum);
    setSelectedDayId(null);
  };

  const handleBack = () => {
    setSelectedDayId(null);
    setSelectedWeekNum(null);
  };

  const selectedDayData = scheduleData.find(d => d.id === selectedDayId);
  const selectedWeekData = weeklyData.find(w => w.weekNumber === selectedWeekNum);

  const renderContent = () => {
    if (selectedDayData) {
      return <DetailedCallSheet dayData={selectedDayData} onBack={handleBack} />;
    }
    if (selectedWeekData) {
      return <DetailedWeekSheet weekData={selectedWeekData} onBack={handleBack} onSelectDay={handleSelectDay} />;
    }
    return (
      <>
        <div className="header">
          <h1>Production Schedule</h1>
          <div className="view-toggles">
            <button
              className={`toggle-btn ${view === 'daily' ? 'active' : ''}`}
              onClick={() => setView('daily')}
            >
              Daily View
            </button>
            <button
              className={`toggle-btn ${view === 'weekly' ? 'active' : ''}`}
              onClick={() => setView('weekly')}
            >
              Weekly View
            </button>
          </div>
        </div>
        {view === 'daily' ? (
          <DailyView scheduleData={scheduleData} onSelectDay={handleSelectDay} />
        ) : (
          <WeeklyView weeklyData={weeklyData} onSelectWeek={handleSelectWeek} />
        )}
      </>
    );
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;