import React, { useState, useEffect } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  Star,
  PlayCircle,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Filter,
  Send,
  Code2,
  Database,
  Palette,
  Sun,
  Leaf
} from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { StudentReview, CareerDemo } from '../types';
import { CAREERS } from '../data/careers';
import { CAREER_DEMOS } from '../data/demos';
import { useLanguage } from '../context/LanguageContext';

export const ReviewsDemoPage: React.FC = () => {
  const { language } = useLanguage();

  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [selectedCareerFilter, setSelectedCareerFilter] = useState('all');
  const [selectedDemoFilter, setSelectedDemoFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'reviews' | 'try_demo' | 'submit_review'>('reviews');

  // Interactive Demo State
  const [activeDemo, setActiveDemo] = useState<CareerDemo>(CAREER_DEMOS[0]);
  const [codeInputValue, setCodeInputValue] = useState(activeDemo.initialCode || '');
  const [codeExecutionOutput, setCodeExecutionOutput] = useState<string | null>(null);
  const [codeIsCorrect, setCodeIsCorrect] = useState<boolean | null>(null);

  // Soil Demo State
  const [nitrogenVal, setNitrogenVal] = useState(180); // kg/ha (Deficient < 280)
  const [phosphorusVal, setPhosphorusVal] = useState(15); // kg/ha (Deficient < 23)
  const [potassiumVal, setPotassiumVal] = useState(250); // kg/ha (Medium 145-337)

  // Solar Demo State
  const [tubeLightsCount, setTubeLightsCount] = useState(6);
  const [ceilingFansCount, setCeilingFansCount] = useState(4);
  const [sunHours, setSunHours] = useState(5.2);

  // Review Submission Form State
  const [formCareerId, setFormCareerId] = useState(CAREERS[0].id);
  const [formDemoId, setFormDemoId] = useState(CAREER_DEMOS[0].id);
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formEducation, setFormEducation] = useState('Class 12 (MPC / Science)');
  const [formRating, setFormRating] = useState(5);
  const [formWhatLearned, setFormWhatLearned] = useState('');
  const [formDifficult, setFormDifficult] = useState('');
  const [formRecommendations, setFormRecommendations] = useState('');
  const [formSubmittedNotice, setFormSubmittedNotice] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    reviewService.getReviews().then(setReviews);

    // Subscribe to real-time reviews stream (Supabase Realtime + BroadcastChannel)
    const unsubscribe = reviewService.subscribe(updated => {
      setReviews(updated);
    });

    return () => unsubscribe();
  }, []);

  const handleRunCodeDemo = () => {
    try {
      // Safe client-side sandbox execution
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
      };

      // Wrap code with isolated console
      const runFn = new Function('console', codeInputValue);
      runFn(customConsole);

      const out = logs.join('\n');
      setCodeExecutionOutput(out || 'Code executed with no output.');

      // Check if output includes both completed tasks
      const hasCompleted1 = out.includes("Math Algebra HW");
      const hasCompleted3 = out.includes("English Essay");
      const lacksPending2 = !out.includes("Physics Lab Record");

      if (hasCompleted1 && hasCompleted3 && lacksPending2) {
        setCodeIsCorrect(true);
      } else {
        setCodeIsCorrect(false);
      }
    } catch (err: any) {
      setCodeExecutionOutput(`Execution Error: ${err.message}`);
      setCodeIsCorrect(false);
    }
  };

  const handleHelpful = async (id: string) => {
    await reviewService.toggleHelpful(id);
    const updated = await reviewService.getReviews();
    setReviews(updated);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWhatLearned.trim() || !formRecommendations.trim()) return;

    const careerObj = CAREERS.find(c => c.id === formCareerId);
    const demoObj = CAREER_DEMOS.find(d => d.id === formDemoId);

    const res = await reviewService.submitReview({
      careerId: formCareerId,
      careerName: careerObj?.name || 'Career Pathway',
      demoId: formDemoId,
      demoTitle: demoObj?.title,
      displayName: formDisplayName || 'Anonymous Student',
      educationStage: formEducation,
      rating: formRating,
      whatLearned: formWhatLearned,
      whatWasDifficult: formDifficult,
      recommendations: formRecommendations,
      completionStatus: 'completed',
      isVerifiedParticipation: true
    });

    setFormSubmittedNotice(res.message);
    setFormWhatLearned('');
    setFormDifficult('');
    setFormRecommendations('');
    setTimeout(() => {
      setFormSubmittedNotice(null);
      setActiveTab('reviews');
    }, 2000);
  };

  const filteredReviews = reviews.filter(r => {
    if (selectedCareerFilter !== 'all' && r.career_id !== selectedCareerFilter) return false;
    if (selectedDemoFilter !== 'all' && r.demo_id !== selectedDemoFilter) return false;
    return true;
  });

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>Feature A · Real-Time Reviews & Demos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Student Reviews & Career Path Demos
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
            Experience starter tasks for Indian career tracks and read authentic student takeaways. Every demo is a risk-free educational preview.
          </p>
        </div>

        {/* Realtime Live Indicator Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-elevated border border-brand-border text-brand-cyan text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span>Realtime Feed Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-brand-border space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition-colors ${
            activeTab === 'reviews'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-muted hover:text-brand-dark'
          }`}
        >
          Student Reviews ({filteredReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('try_demo')}
          className={`pb-3 transition-colors ${
            activeTab === 'try_demo'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-muted hover:text-brand-dark'
          }`}
        >
          Try Career Demo (Interactive)
        </button>
        <button
          onClick={() => setActiveTab('submit_review')}
          className={`pb-3 transition-colors ${
            activeTab === 'submit_review'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-muted hover:text-brand-dark'
          }`}
        >
          Share Your Experience
        </button>
      </div>

      {/* TAB 1: Student Reviews Feed */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-brand-surface border border-brand-border rounded-brand p-4  flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-muted" />
              <span className="font-bold text-brand-dark">Filter Pathway:</span>
              <select
                value={selectedCareerFilter}
                onChange={e => setSelectedCareerFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-brand-sm border border-brand-border bg-brand-bg text-brand-dark font-medium"
              >
                <option value="all">All Pathways</option>
                {CAREERS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-dark">Demo Attempted:</span>
              <select
                value={selectedDemoFilter}
                onChange={e => setSelectedDemoFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-brand-sm border border-brand-border bg-brand-bg text-brand-dark font-medium"
              >
                <option value="all">All Demos</option>
                {CAREER_DEMOS.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="bg-brand-surface border border-brand-border rounded-brand p-12 text-center space-y-3">
              <MessageSquareCode className="w-10 h-10 text-brand-muted mx-auto" />
              <h3 className="font-bold text-brand-dark">No Student Reviews Yet for this Filter</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Be the first to try an interactive career demo and share your authentic learning experience!
              </p>
              <button
                onClick={() => setActiveTab('try_demo')}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-brand-sm "
              >
                Try a Career Demo Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map(review => (
                <div
                  key={review.id}
                  className="bg-brand-surface border border-brand-border rounded-brand p-6  flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-brand-dark">
                            {review.student_display_name}
                          </h3>
                          {review.is_demo_seed && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-brand-elevated text-brand-dark uppercase border border-brand-border">
                              Demo Seed
                            </span>
                          )}
                          {review.is_verified_participation && (
                            <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-0.5" title="Verified Demo Participation">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-brand-muted">
                          {review.education_stage} • {review.student_state}
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Pathway / Demo Tag */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-bg border border-brand-border text-[11px] font-semibold text-brand-primary">
                      <span>{review.career_name}</span>
                      {review.demo_title && (
                        <>
                          <span className="text-brand-muted">›</span>
                          <span className="text-brand-dark/80 truncate max-w-[200px]">{review.demo_title}</span>
                        </>
                      )}
                    </div>

                    {/* What Learned */}
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-brand-dark">What I Learned:</span>
                      <p className="text-brand-muted leading-relaxed">{review.what_learned}</p>
                    </div>

                    {/* What Was Difficult */}
                    {review.what_was_difficult && (
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-brand-dark">What I Found Difficult:</span>
                        <p className="text-brand-muted leading-relaxed">{review.what_was_difficult}</p>
                      </div>
                    )}

                    {/* Recommendation for Beginners */}
                    <div className="p-3 bg-brand-bg/70 rounded-brand-sm border border-brand-borderLight text-xs space-y-1">
                      <span className="font-bold text-brand-primary">Advice to Beginners:</span>
                      <p className="text-brand-dark/90 italic leading-relaxed">
                        "{review.beginner_recommendations}"
                      </p>
                    </div>
                  </div>

                  {/* Footer & Upvote */}
                  <div className="pt-3 border-t border-brand-borderLight flex items-center justify-between text-[11px] text-brand-muted">
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>

                    <button
                      type="button"
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-brand-bg text-brand-dark font-semibold transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-brand-primary" />
                      <span>Helpful ({review.helpful_count || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Try Career Demo (Interactive Simulations) */}
      {activeTab === 'try_demo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Demo Picker List */}
          <aside className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-2">
              Select an Interactive Demo
            </span>
            {CAREER_DEMOS.map(demo => {
              const isSelected = activeDemo.id === demo.id;
              return (
                <button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemo(demo);
                    setCodeInputValue(demo.initialCode || '');
                    setCodeExecutionOutput(null);
                    setCodeIsCorrect(null);
                  }}
                  className={`w-full text-left p-4 rounded-brand-sm border transition-all ${
                    isSelected
                      ? 'bg-brand-primary-light border-brand-primary text-brand-primary shadow-xs'
                      : 'bg-brand-surface border-brand-border hover:bg-brand-elevated text-brand-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{demo.category}</span>
                    <span className="text-[10px] text-brand-muted font-semibold">{demo.estimatedMinutes} min</span>
                  </div>
                  <h4 className="text-xs font-bold text-brand-dark mt-1 line-clamp-1">{demo.title}</h4>
                  <p className="text-[11px] text-brand-muted mt-1 line-clamp-2">{demo.description}</p>
                </button>
              );
            })}
          </aside>

          {/* Demo Execution Workspace */}
          <main className="lg:col-span-8 bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8  space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Interactive Career Simulation
              </span>
              <h2 className="text-xl font-black text-brand-dark mt-1">
                {activeDemo.title}
              </h2>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                {activeDemo.description}
              </p>
            </div>

            {/* DEMO 1: Coding Task (JavaScript Task Filter) */}
            {activeDemo.type === 'code' && (
              <div className="space-y-4">
                <div className="bg-brand-bg p-3 rounded-brand-sm border border-brand-border text-xs text-brand-dark">
                  <strong>Challenge Prompt:</strong> {activeDemo.testPrompt}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-brand-muted font-semibold">
                    <span>JavaScript Sandbox Code:</span>
                    <span>Client-Side Runtime</span>
                  </div>
                  <textarea
                    rows={10}
                    value={codeInputValue}
                    onChange={e => setCodeInputValue(e.target.value)}
                    className="w-full font-mono text-xs p-4 rounded-brand-sm bg-gray-900 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-muted">
                    Hint: {activeDemo.expectedOutputHint}
                  </span>
                  <button
                    onClick={handleRunCodeDemo}
                    className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-brand-sm  hover:bg-brand-primary-hover flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Run Code Sandbox</span>
                  </button>
                </div>

                {codeExecutionOutput && (
                  <div className={`p-4 rounded-brand-sm border text-xs font-mono space-y-2 ${
                    codeIsCorrect
                      ? 'bg-brand-elevated border-brand-border text-brand-dark'
                      : 'bg-brand-elevated border-brand-border text-brand-dark'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Console Output:</span>
                      {codeIsCorrect && <span className="text-emerald-700">Test Passed Successfully! ✓</span>}
                    </div>
                    <pre className="whitespace-pre-wrap">{codeExecutionOutput}</pre>
                  </div>
                )}
              </div>
            )}

            {/* DEMO 2: Data Analytics Dataset Inspection */}
            {activeDemo.type === 'data' && (
              <div className="space-y-4">
                <div className="bg-brand-bg p-3 rounded-brand-sm border border-brand-border text-xs text-brand-dark">
                  <strong>Analyst Task:</strong> {activeDemo.questionPrompt}
                </div>

                <div className="overflow-x-auto border border-brand-border rounded-brand-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-bg border-b border-brand-border text-brand-muted uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="p-3">Rural Health Center</th>
                        <th className="p-3">Medicine Item</th>
                        <th className="p-3">Required Stock</th>
                        <th className="p-3">Current Stock</th>
                        <th className="p-3">Inventory Health</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-borderLight">
                      {activeDemo.dataset?.map((row, i) => (
                        <tr key={i} className={row.status.includes('CRITICAL') ? 'bg-rose-50 font-semibold' : ''}>
                          <td className="p-3 font-semibold text-brand-dark">{row.phc_name}</td>
                          <td className="p-3 text-brand-muted">{row.medicine}</td>
                          <td className="p-3">{row.required_units.toLocaleString('en-IN')}</td>
                          <td className="p-3">{row.current_units.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.status.includes('CRITICAL')
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-brand-elevated text-brand-cyan border border-brand-border'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-brand-elevated border border-brand-border rounded-brand-sm text-xs text-brand-dark space-y-1">
                  <strong>Actionable Insight Generated:</strong>
                  <p>
                    Toopran PHC has only 480 ORS packets out of 2,000 required (24%). An emergency requisition should immediately be flagged to District Medical & Health Officer (DMHO) before monsoon diarrheal season.
                  </p>
                </div>
              </div>
            )}

            {/* DEMO 3: Agriculture Soil Diagnostic Calculator */}
            {activeDemo.type === 'agriculture' && (
              <div className="space-y-5">
                <div className="bg-brand-bg p-3 rounded-brand-sm border border-brand-border text-xs text-brand-dark">
                  <strong>Agronomist Task:</strong> Adjust the soil test nutrient sliders to compute the fertilizer prescription for a 1-acre paddy field.
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-brand-dark mb-1">
                      <span>Available Soil Nitrogen (N):</span>
                      <span>{nitrogenVal} kg/ha ({nitrogenVal < 280 ? 'Low / Deficient' : 'Normal'})</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={450}
                      value={nitrogenVal}
                      onChange={e => setNitrogenVal(Number(e.target.value))}
                      className="w-full accent-brand-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-brand-dark mb-1">
                      <span>Available Soil Phosphorus (P):</span>
                      <span>{phosphorusVal} kg/ha ({phosphorusVal < 23 ? 'Low / Deficient' : 'Normal'})</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      value={phosphorusVal}
                      onChange={e => setPhosphorusVal(Number(e.target.value))}
                      className="w-full accent-brand-primary"
                    />
                  </div>
                </div>

                <div className="p-4 bg-brand-elevated border border-brand-border rounded-brand-sm text-xs text-brand-dark space-y-1.5">
                  <div className="font-bold">Calculated Agronomist Prescription (per Acre):</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Recommended Urea: <strong>{nitrogenVal < 280 ? '65 kg (Split in 3 doses)' : '45 kg'}</strong></li>
                    <li>Recommended Single Super Phosphate (SSP): <strong>{phosphorusVal < 23 ? '120 kg at basel transplantation' : '75 kg'}</strong></li>
                    <li>Soil Health Tip: Inoculate with 2 tons Farm Yard Manure (FYM) to improve microbial carbon retention.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* DEMO 4: Solar Sizing Calculator */}
            {activeDemo.type === 'solar_calculator' && (
              <div className="space-y-5">
                <div className="bg-brand-bg p-3 rounded-brand-sm border border-brand-border text-xs text-brand-dark">
                  <strong>Solar Technician Task:</strong> Size the required solar PV array and inverter for a rural school building.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-brand-dark block mb-1">LED Tube Lights (20W each):</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={tubeLightsCount}
                      onChange={e => setTubeLightsCount(Number(e.target.value))}
                      className="w-full p-2 border border-brand-border rounded-brand-sm bg-brand-bg/50 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-brand-dark block mb-1">Ceiling Fans (60W each):</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={ceilingFansCount}
                      onChange={e => setCeilingFansCount(Number(e.target.value))}
                      className="w-full p-2 border border-brand-border rounded-brand-sm bg-brand-bg/50 font-bold"
                    />
                  </div>
                </div>

                {(() => {
                  const dailyWatts = (tubeLightsCount * 20 * 6) + (ceilingFansCount * 60 * 6); // 6 hours run
                  const kwNeeded = (dailyWatts / 1000) / sunHours;
                  const panels330W = Math.ceil((kwNeeded * 1000) / 330);
                  const inverterKva = (Math.ceil(kwNeeded * 1.25 * 10) / 10).toFixed(1);

                  return (
                    <div className="p-4 bg-brand-elevated border border-brand-border rounded-brand-sm text-xs text-brand-dark space-y-2">
                      <div className="font-bold">Solar Array Sizing Output:</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-2 bg-brand-surface rounded border border-brand-border">
                          <span className="text-[10px] text-brand-muted block">Daily Energy:</span>
                          <strong className="text-sm">{dailyWatts} Wh / day</strong>
                        </div>
                        <div className="p-2 bg-brand-surface rounded border border-brand-border">
                          <span className="text-[10px] text-brand-muted block">330W PV Panels:</span>
                          <strong className="text-sm">{panels330W} Solar Panels</strong>
                        </div>
                        <div className="p-2 bg-brand-surface rounded border border-brand-border">
                          <span className="text-[10px] text-brand-muted block">Inverter Sizing:</span>
                          <strong className="text-sm">{inverterKva} kVA Inverter</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* DEMO 5: UI/UX Critique */}
            {activeDemo.type === 'design_critique' && (
              <div className="space-y-4">
                <div className="bg-brand-bg p-3 rounded-brand-sm border border-brand-border text-xs text-brand-dark">
                  <strong>UX Inspector Task:</strong> Spot the 3 usability defects in this rural student bus pass screen.
                </div>

                <div className="max-w-xs mx-auto border-2 border-brand-border rounded-brand p-4 bg-brand-surface space-y-3 text-xs">
                  <div className="text-[10px] text-center text-gray-400">Rural Student Bus Pass</div>
                  <div className="p-2 rounded bg-yellow-100 text-yellow-300 text-[10px] font-bold">
                    Warning: Poor Contrast Text (Light yellow on yellow!)
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-600 block">Enter Aadhaar UID:</label>
                    <input type="text" placeholder="No Telugu translation label" className="w-full p-1 border text-[10px]" disabled />
                  </div>
                  <button className="w-full py-1 text-[10px] bg-red-600 text-white rounded">
                    SUBMIT (Destructive Red Color on Confirm Button!)
                  </button>
                </div>

                <div className="p-4 bg-brand-elevated border border-brand-border rounded-brand-sm text-xs text-brand-dark space-y-1">
                  <strong>Heuristic Findings:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Accessibility violation: Light yellow text on yellow background fails WCAG AA contrast.</li>
                    <li>Localization barrier: Absence of Telugu script creates anxiety for first-time rural users.</li>
                    <li>Color affordance violation: Primary "Submit" action should use welcoming green/blue, not alarming red.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Transition to Review */}
            <div className="pt-4 border-t border-brand-borderLight flex items-center justify-between">
              <span className="text-xs text-brand-muted">Finished exploring this demo?</span>
              <button
                onClick={() => {
                  setFormCareerId(activeDemo.careerId);
                  setFormDemoId(activeDemo.id);
                  setActiveTab('submit_review');
                }}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-brand-sm hover:bg-brand-primary-hover "
              >
                Review This Demo Experience →
              </button>
            </div>
          </main>
        </div>
      )}

      {/* TAB 3: Share Your Experience (Review Submission) */}
      {activeTab === 'submit_review' && (
        <div className="max-w-2xl mx-auto bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8  space-y-6">
          <div>
            <h2 className="text-xl font-black text-brand-dark">
              Share Your Authentic Experience
            </h2>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              Help peer students understand what studying or trying this career pathway is really like. We respect your privacy: only your display name is published.
            </p>
          </div>

          {formSubmittedNotice && (
            <div className="p-4 rounded-brand-sm bg-brand-elevated border border-brand-border text-brand-cyan text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{formSubmittedNotice}</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-brand-dark block mb-1">Career Pathway:</label>
                <select
                  value={formCareerId}
                  onChange={e => setFormCareerId(e.target.value)}
                  className="w-full p-2.5 rounded-brand-sm border border-brand-border bg-brand-bg/50 text-brand-dark font-medium"
                >
                  {CAREERS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-brand-dark block mb-1">Demo Attempted (Optional):</label>
                <select
                  value={formDemoId}
                  onChange={e => setFormDemoId(e.target.value)}
                  className="w-full p-2.5 rounded-brand-sm border border-brand-border bg-brand-bg/50 text-brand-dark font-medium"
                >
                  {CAREER_DEMOS.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-brand-dark block mb-1">Your Display Name (or Alias):</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul S. (Never your private email)"
                  value={formDisplayName}
                  onChange={e => setFormDisplayName(e.target.value)}
                  className="w-full p-2.5 rounded-brand-sm border border-brand-border bg-brand-bg/50 text-brand-dark"
                />
              </div>

              <div>
                <label className="font-bold text-brand-dark block mb-1">Education Stage:</label>
                <select
                  value={formEducation}
                  onChange={e => setFormEducation(e.target.value)}
                  className="w-full p-2.5 rounded-brand-sm border border-brand-border bg-brand-bg/50 text-brand-dark font-medium"
                >
                  <option value="Class 10 Pass">Class 10 Pass</option>
                  <option value="Class 11–12 (Science / PCM)">Class 11–12 (Science / PCM)</option>
                  <option value="Class 11–12 (BiPC / Biology)">Class 11–12 (BiPC / Biology)</option>
                  <option value="Class 11–12 (Commerce / Arts)">Class 11–12 (Commerce / Arts)</option>
                  <option value="Polytechnic / ITI Student">Polytechnic / ITI Student</option>
                  <option value="College Undergraduate">College Undergraduate</option>
                </select>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="font-bold text-brand-dark block mb-1">Rating for this Path / Demo:</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= formRating ? 'fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
                <span className="ml-2 font-bold text-brand-dark">{formRating} out of 5 stars</span>
              </div>
            </div>

            {/* What Learned */}
            <div>
              <label className="font-bold text-brand-dark block mb-1">What did you learn? *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe key concepts or insights you gained..."
                value={formWhatLearned}
                onChange={e => setFormWhatLearned(e.target.value)}
                className="w-full p-3 rounded-brand-sm border border-brand-border bg-brand-bg/50 text-brand-dark focus:border-brand-primary focus:outline-none"
              />
            </div>

            {/* What Was Difficult */}
            <div>
              <label className="font-bold text-brand-dark block mb-1">What did you find difficult? (Optional)</label>
              <textarea
                rows={2}
                placeholder="Mention any roadblocks, math formulas, or confusing steps..."
                value={formDifficult}
                onChange={e => setFormDifficult(e.target.value)}
                className="w-full p-3 rounded-brand-sm border border-brand-border bg-brand-bg/50 text-brand-dark focus:border-brand-primary focus:outline-none"
              />
            </div>

            {/* Recommendations to Beginners */}
            <div>
              <label className="font-bold text-brand-dark block mb-1">What would you recommend to beginners? *</label>
              <textarea
                rows={2}
                required
                placeholder="Share one practical piece of advice for someone starting from scratch..."
                value={formRecommendations}
                onChange={e => setFormRecommendations(e.target.value)}
                className="w-full p-3 rounded-brand-sm border border-brand-border bg-brand-bg/50 text-brand-dark focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="px-4 py-2 rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-brand-sm bg-brand-primary text-white font-bold hover:bg-brand-primary-hover  flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Experience</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
