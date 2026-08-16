'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Headphones, X, Send, CheckCircle2, ShieldCheck, UserCheck, MessageSquare, PhoneCall } from 'lucide-react';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby5qvqRe-wLDQa7kyuSe1PPIjv8WNGYPrJOcXOW530sMBXNlfEeLQlgqr5G9EK3sIkP/exec';

const FREQUENCY_CAP_DAYS = 3;

const QUICK_TOPICS = [
  'LIC Maturity Payout Calculation',
  'Check Policy Status / Lapsed Policy',
  'LIC vs Mutual Fund / SIP Advice',
  'Tax Saving (80C / 10(10D))',
  'Other Policy Question',
];

export function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(QUICK_TOPICS[0]);
  const [customNote, setCustomNote] = useState('');
  const [contactPref, setContactPref] = useState<'whatsapp' | 'call'>('whatsapp');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkFrequencyCap = () => {
      const submittedFlag = localStorage.getItem('bharatsaver_lead_submitted');
      if (submittedFlag === 'true') return true;

      const dismissedTime = localStorage.getItem('bharatsaver_lead_dismissed_time');
      if (dismissedTime) {
        const elapsedDays = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
        if (elapsedDays < FREQUENCY_CAP_DAYS) {
          return true;
        }
      }
      return false;
    };

    if (checkFrequencyCap() || hasTriggered) return;

    // 1. Time Dwell Trigger (12 seconds)
    const dwellTimer = setTimeout(() => {
      if (!hasTriggered && !checkFrequencyCap()) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    }, 12000);

    // 2. Desktop Exit-Intent Trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasTriggered && !checkFrequencyCap()) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    // 3. Mobile Scroll Depth Trigger (50%)
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      if (scrollPosition / totalHeight > 0.5 && !hasTriggered && !checkFrequencyCap()) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(dwellTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered, pathname]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('bharatsaver_lead_dismissed_time', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);

    const fullComment = `Topic: ${selectedTopic} | Pref: ${contactPref.toUpperCase()}${customNote ? ` | Note: ${customNote.trim()}` : ''}`;

    const payload = {
      phone: phone.trim(),
      email: email.trim() || 'N/A',
      comment: fullComment,
      pageUrl: typeof window !== 'undefined' ? window.location.href : pathname,
      pageTitle: typeof document !== 'undefined' ? document.title : 'BharatSaver',
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      localStorage.setItem('bharatsaver_lead_submitted', 'true');

      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setPhone('');
        setEmail('');
        setCustomNote('');
      }, 4000);
    } catch (err) {
      console.error('Lead submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Persistent Floating Widget Button on Right */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Get Free Financial Guidance"
        className="fixed bottom-5 left-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-teal-800 active:scale-95 sm:bottom-6 sm:left-6 ring-2 ring-white/30"
      >
        <Headphones className="h-5 w-5 animate-pulse text-emerald-200 shrink-0" />
        <span className="font-bold text-xs sm:text-sm">Get Free Expert Help</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-5 sm:p-6 text-white relative">
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-black/20 p-1.5 text-white/80 transition-colors hover:bg-black/40 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide text-white mb-2">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Free • Verified CFP Guidance
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Need Help With Your Payout or Policy?
              </h3>
              <p className="mt-1 text-xs text-emerald-50/90 leading-relaxed">
                Get an instant, unbiased consultation from our Certified Financial Planner team on WhatsApp or Call.
              </p>
            </div>

            {/* Content Area */}
            <div className="p-5 sm:p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    Request Submitted Successfully!
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Our CFP expert team will reach out via <span className="font-bold text-emerald-600">{contactPref.toUpperCase()}</span> within 24 hours. No sales spam guaranteed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Topic Selection Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Your Need:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_TOPICS.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setSelectedTopic(topic)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                            selectedTopic === topic
                              ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phone Input (Required) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mobile / WhatsApp Number <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Preferred Contact Mode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Mode of Contact:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setContactPref('whatsapp')}
                        className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all ${
                          contactPref === 'whatsapp'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 text-emerald-600" />
                        <span>WhatsApp Reply</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setContactPref('call')}
                        className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all ${
                          contactPref === 'call'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <PhoneCall className="h-4 w-4 text-emerald-600" />
                        <span>Direct Phone Call</span>
                      </button>
                    </div>
                  </div>

                  {/* Optional Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@gmail.com"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Trust Footer */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Reviewed by Mahesh Chaube, CFP. Privacy guaranteed. No spam calls.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-98 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <span>Request Free Expert Guidance</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
