import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import AnalyticsCards from './components/AnalyticsCards';
import AssetAnalysisForm from './components/AssetAnalysisForm';
import LoadingRailway from './components/LoadingRailway';
import RiskAssessmentCard from './components/RiskAssessmentCard';
import AiInsightsCard from './components/AiInsightsCard';
import WorkOrderCard from './components/WorkOrderCard';
import CrewAssignmentCard from './components/CrewAssignmentCard';
import ErrorState from './components/ErrorState';
import Footer from './components/Footer';
import { runAutomation, checkBackendHealth, getDemoResponse, API_BASE_URL } from './services/api';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Radio, 
  Layers, 
  SlidersHorizontal,
  Compass,
  Zap
} from 'lucide-react';

export default function App() {
  const [backendUrl, setBackendUrl] = useState(API_BASE_URL);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const resultsRef = useRef(null);

  // Check backend health periodically
  useEffect(() => {
    let isMounted = true;
    const probe = async () => {
      const online = await checkBackendHealth(backendUrl);
      if (isMounted) setBackendOnline(online);
    };
    probe();
    const interval = setInterval(probe, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [backendUrl]);

  // Initial load: show the demo analysis for the prompt's reference data
  useEffect(() => {
    const initialData = {
      assetId: 'TRK-1001',
      wearPercentage: 85,
      vibrationLevel: 9.4,
      temperature: 53,
      lastMaintenanceDays: 210,
      requiredSkill: 'TRACK'
    };
    setLastPayload({ assetData: initialData, crews: [] });
    // Initialize with standard demo data matching prompt specs
    const demo = getDemoResponse(initialData);
    setAnalysisResult(demo.data);
  }, []);

  const handleRunAnalysis = async (payload) => {
    setIsLoading(true);
    setError(null);
    setLastPayload(payload);
    setIsDemoMode(false);

    try {
      const response = await runAutomation(payload, backendUrl);
      if (response && response.success && response.data) {
        setAnalysisResult(response.data);
      } else {
        throw new Error(response?.error || 'Invalid response structure from backend.');
      }
    } catch (err) {
      console.warn('API error encountered, offering fallback:', err);
      setError(err.message || 'Failed to complete pipeline.');
    } finally {
      setIsLoading(false);
      // Scroll smoothly to results on analysis completion
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleUseDemo = () => {
    setError(null);
    setIsLoading(true);
    setIsDemoMode(true);
    setTimeout(() => {
      const demo = getDemoResponse(lastPayload?.assetData || {});
      setAnalysisResult(demo.data);
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleRunAnalysis(lastPayload);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-railway-dark text-slate-100 relative selection:bg-sky-500 selection:text-white">
      
      {/* Background railway glow & ambient accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-600/10 via-sky-900/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-3xl pointer-events-none -z-10" />

      {/* 1. Hero Section */}
      <Hero
        backendOnline={backendOnline}
        backendUrl={backendUrl}
        onUpdateBackendUrl={(url) => setBackendUrl(url)}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* 8. Analytics KPI Section */}
        <AnalyticsCards 
          dynamicStats={{
            criticalRisks: analysisResult?.riskAssessment?.riskLevel === 'CRITICAL' ? '4' : '3',
            activeOrders: analysisResult ? '25' : '24'
          }}
        />

        {/* 2. Asset Analysis Form Section */}
        <section>
          <AssetAnalysisForm 
            onSubmit={handleRunAnalysis} 
            isLoading={isLoading} 
          />
        </section>

        {/* 11. Error Handling State */}
        {error && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ErrorState
              error={error}
              onRetry={handleRetry}
              onUseDemo={handleUseDemo}
            />
          </section>
        )}

        {/* 3. Loading State */}
        {isLoading && (
          <section className="animate-in fade-in zoom-in-95 duration-300">
            <LoadingRailway />
          </section>
        )}

        {/* Analysis Results View */}
        {!isLoading && analysisResult && (
          <section ref={resultsRef} className="space-y-6 pt-4 animate-in fade-in duration-500">
            
            {/* Section Banner Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Compass className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Pipeline Diagnostic Output
                </h2>
                {isDemoMode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-semibold">
                    SIMULATED DEMO
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                <span>ASSET: <b className="text-white">{analysisResult.riskAssessment?.assetId}</b></span>
                <span>•</span>
                <span>STATUS: <b className="text-emerald-400">ANALYZED</b></span>
              </div>
            </div>

            {/* Top Grid: 4. Risk Assessment Card & 5. AI Insights Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <RiskAssessmentCard riskAssessment={analysisResult.riskAssessment} />
              <AiInsightsCard aiExplanation={analysisResult.aiExplanation} />
            </div>

            {/* Bottom Grid: 6. Work Order Card & 7. Crew Assignment Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <WorkOrderCard workOrder={analysisResult.workOrder} />
              <CrewAssignmentCard crewAssignment={analysisResult.crewAssignment} />
            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
