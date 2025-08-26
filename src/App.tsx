import React, { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { Dashboard } from './components/Dashboard';
import { EclipseFinder } from './components/EclipseFinder';
import { LunarCalendar } from './components/LunarCalendar';
import { MoonTracker } from './components/MoonTracker';
import { EclipsePredictor } from './components/EclipsePredictor';

type Page = 'welcome' | 'dashboard' | 'eclipses' | 'calendar' | 'tracker' | 'predictor';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleStart = () => {
    setCurrentPage('dashboard');
  };

  const handleBack = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onStart={handleStart} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'eclipses':
        return <EclipseFinder onBack={handleBack} />;
      case 'calendar':
        return <LunarCalendar onBack={handleBack} />;
      case 'tracker':
        return <MoonTracker onBack={handleBack} />;
      case 'predictor':
        return <EclipsePredictor onBack={handleBack} />;
      default:
        return <WelcomePage onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderPage()}
    </div>
  );
}

export default App;