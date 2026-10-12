"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import SanskritInput from "@/components/SanskritInput";
import AudioPronounceButton from "@/components/AudioPronounceButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  AlertCircle,
  FileText,
  Loader2,
  Zap
} from "lucide-react";

export default function Grammar() {
  const [user, setUser] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const router = useRouter();

  // Safely mount user without depending on router
  useEffect(() => {
    let isMounted = true;
    let userData: any = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) userData = JSON.parse(storedUser);
    } catch (e) {
      console.error(e);
    }
    if (!userData) {
      userData = { username: "demo", level: "beginner", role: "student" };
      localStorage.setItem("user", JSON.stringify(userData));
    }
    if (isMounted) setUser(userData);
    return () => { isMounted = false; };
  }, []);

  const handleCheck = async () => {
    if (!inputText) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await api.tools.checkGrammar(inputText, useAi, user?.username);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page-layout">
      <Sidebar user={user} />

      <main className="main-content">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Vyakaraņa Check</h1>
          <p style={{ color: 'var(--text-dim)' }}>Precision analysis of your Sanskrit construction and syntax.</p>
        </motion.header>

        <section className="grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="zen-card" style={{ padding: '30px', marginBottom: '30px' }}>
              <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--primary)' }}>
                <FileText size={20} />
                <h3 style={{ margin: 0 }}>Input Sentence</h3>
              </div>
              <div style={{ position: 'relative', width: '100%', minHeight: '200px', marginBottom: '24px' }}>
                <SanskritInput
                  value={inputText}
                  onChange={(val) => setInputText(val)}
                  placeholder="रामः वनं गच्छति..."
                  showLabel={false}
                  style={{
                    fontSize: '2rem',
                    lineHeight: '1.5',
                    background: 'var(--bg-main)',
                    border: 'none',
                    padding: '30px',
                    color: 'var(--text-main)',
                    minHeight: '200px'
                  }}
                  className="devanagari"
                />
              </div>

              <div className="flex justify-between items-center">
                {/* Custom Framer Motion Toggle Switch */}
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setUseAi(!useAi)}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '24px',
                      borderRadius: '24px',
                      background: useAi ? 'var(--primary)' : 'var(--border-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <motion.div
                      layout
                      animate={{ x: useAi ? 22 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: useAi ? 'var(--primary)' : 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    transition: 'color 0.3s ease'
                  }}>
                    AI Verification (Grok)
                  </span>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleCheck}
                  disabled={loading || !inputText}
                  style={{ padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : useAi ? <Zap size={18} fill="currentColor" /> : <ShieldCheck size={18} />}
                  <span>{loading ? "Analyzing..." : useAi ? "AI Deep Scan" : "Verify Syntax"}</span>
                </button>
              </div>
            </div>

            <div className="zen-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Practice</h4>
              <div className="flex flex-col gap-3" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                {[
                  "रामः वनं गच्छति।",
                  "सीता फलं खादति।",
                  "बालकाः पठन्ति।",
                  "अहं विद्यालयं गच्छामि।",
                  "सः पुस्तकं पठति।",
                  "वयं उद्याने क्रीडामः।",
                  "माता भोजनं पचति।",
                  "बालकाः कक्षायां उपविशन्ति।",
                  "यदा अहं विद्यालयं गच्छामि तदा मित्राणि मिलन्ति।",
                  "यदि त्वं परिश्रमं करोषि तर्हि सफलः भविष्यसि।",
                  "शिक्षकः विद्यार्थिभ्यः ज्ञानं ददाति।",
                  "अहं गृहकार्यं समाप्त्वा विश्रामं करोमि।",
                  "यः सत्यम् वदति सः सर्वेषां विश्वासं लभते।",
                  "अहं विद्यालयः गच्छामि।",
                  "सा पुस्तकं पठन्ति।",
                  "वयं उद्यानं क्रीडामि।",
                  "बालकः फलानि खादन्ति।",
                  "शिक्षकाः पाठं पठति।",
                  "मम मित्रः विद्यालये गच्छन्ति।",
                  "अहं जलं पिबसि।",
                  "ते गृहं गच्छामि।",
                  "छात्राः पुस्तकम् पठति।",
                  "यदा अहं पठामि तदा सः खेलति अस्ति。"
                ].map(t => (
                  <button
                    key={t}
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '8px 16px', border: '1px solid var(--border-soft)', color: 'var(--text-dim)' }}
                    onClick={() => setInputText(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Result Area */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="zen-card" style={{ padding: '40px', minHeight: '100%' }}>
              <h3 className="mb-8">Verification Result</h3>

              <AnimatePresence mode="wait">
                {!analysis ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-light)', textAlign: 'center' }}>
                    <Sparkles size={40} style={{ opacity: 0.1, marginBottom: '20px' }} />
                    <p>Enter a sentence and verify to see linguistic breakdown.</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center justify-between p-6 mb-10" style={{ background: 'var(--bg-main)', borderRadius: '20px' }}>
                      <div className="flex items-center gap-8">
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: analysis.score >= 80 ? '#27ae60' : 'var(--primary)' }}>
                          {analysis.score}%
                        </div>
                        <div>
                          <h4 style={{ margin: 0 }}>Accuracy Score</h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                            {analysis.issues.length === 0 ? "Perfect formation." : `${analysis.issues.length} linguistic note${analysis.issues.length === 1 ? '' : 's'}.`}
                          </p>
                        </div>
                      </div>
                      {analysis.ai_verified && (
                        <div className="flex items-center gap-2" style={{ color: 'var(--primary)', padding: '6px 12px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800' }}>
                          <Zap size={14} fill="currentColor" /> GROK VERIFIED
                        </div>
                      )}
                    </div>

                    <div className="mb-10">
                      <h4 className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Detailed Issues</h4>
                      {analysis.issues.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {analysis.issues.map((issue: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ border: '1.5px solid rgba(192, 90, 43, 0.1)', color: 'var(--primary)', background: 'rgba(192, 90, 43, 0.02)' }}>
                              <AlertCircle size={18} />
                              <span style={{ fontSize: '0.95rem' }}>{issue}</span>
                            </div>
                          ))}

                          {analysis.corrected_sentence && analysis.corrected_sentence !== inputText && (
                            <div className="mt-4 p-5 rounded-xl" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-soft)' }}>
                              <h5 className="mb-3" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>Suggested Correction</h5>

                              <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="devanagari" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
                                  {analysis.corrected_sentence}
                                </div>
                                <AudioPronounceButton text={analysis.corrected_sentence} size={20} title="Listen to suggested correction" />
                                <button
                                  onClick={() => setInputText(analysis.corrected_sentence)}
                                  style={{
                                    padding: '8px 16px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <Sparkles size={14} /> USE THIS
                                </button>
                              </div>

                              {analysis.correction_summary && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5', fontStyle: 'italic', borderTop: '1px solid var(--border-soft)', paddingTop: '12px' }}>
                                  {analysis.correction_summary}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ color: '#27ae60', fontWeight: '700', fontSize: '0.95rem' }}>
                          ✨ Linguistic structure is impeccable.
                        </div>
                      )}
                    </div>

                    <div className="mb-10">
                      <h4 className="mb-4" style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Linguistic Breakdown</h4>
                      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
                        {analysis.breakdown.map((item: any, i: number) => (
                          <div key={i} className="p-5" style={{ background: 'var(--bg-main)', borderRadius: '18px', border: '1px solid var(--border-soft)' }}>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="devanagari" style={{ fontSize: '1.6rem', color: 'var(--primary)', lineHeight: 1 }}>{item.word}</div>
                                <AudioPronounceButton text={item.word || ''} size={16} title={`Pronounce ${item.word || 'Sanskrit word'}`} />
                                <div style={{ fontWeight: '700', fontSize: '1rem', marginTop: '6px' }}>{item.meaning}</div>
                              </div>
                              <span style={{ padding: '4px 10px', background: 'rgba(var(--primary-rgb), 0.08)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                {item.pos}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                              {Object.entries(item.analysis).map(([key, value]: [string, any]) => (
                                <div key={key}>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '2px' }}>{key.replace('_', ' ')}</span>
                                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dim)' }}>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
