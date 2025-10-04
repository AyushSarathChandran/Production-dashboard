// src/App.jsx
import React, { useState, useMemo } from 'react';
import { scheduleData } from './data/scheduleData';
import { groupDataByWeek } from './utils/scheduleUtils';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import CalendarView from './components/CalendarView'; // Import the new component
import DetailedCallSheet from './components/DetailedCallSheet';
import DetailedWeekSheet from './components/DetailedWeekSheet';

function App() {
  const [view, setView] = useState('daily'); // 'daily', 'weekly', or 'calendar'
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedWeekNum, setSelectedWeekNum] = useState(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0); // For calendar navigation

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
    // If we are viewing a day from the weekly detail, go back to weekly detail
    if (selectedDayId && selectedWeekNum) {
      setSelectedDayId(null);
    } else { // Otherwise go back to the main overview
      setSelectedDayId(null);
      setSelectedWeekNum(null);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex(prev => Math.min(prev + 1, weeklyData.length - 1));
  };
  
  const handlePrevWeek = () => {
    setCurrentWeekIndex(prev => Math.max(prev - 1, 0));
  };

  const selectedDayData = scheduleData.find(d => d.id === selectedDayId);
  // Find the selected week data using either the week number or the current calendar index
  const selectedWeekData = weeklyData.find(w => w.weekNumber === selectedWeekNum) || weeklyData[currentWeekIndex];

  const renderContent = () => {
    if (selectedDayData) {
      return <DetailedCallSheet dayData={selectedDayData} onBack={handleBack} />;
    }
    if (selectedWeekNum) {
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
            <button
              className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              Calendar View
            </button>
          </div>
        </div>
        {view === 'daily' && <DailyView scheduleData={scheduleData} onSelectDay={handleSelectDay} />}
        {view === 'weekly' && <WeeklyView weeklyData={weeklyData} onSelectWeek={handleSelectWeek} />}
        {view === 'calendar' && (
          <CalendarView 
            weekData={weeklyData[currentWeekIndex]}
            onNextWeek={handleNextWeek}
            onPrevWeek={handlePrevWeek}
            isFirstWeek={currentWeekIndex === 0}
            isLastWeek={currentWeekIndex === weeklyData.length - 1}
          />
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