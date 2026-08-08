'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Headphones, X, Send, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby5qvqRe-wLDQa7kyuSe1PPIjv8WNGYPrJOcXOW530sMBXNlfEeLQlgqr5G9EK3sIkP/exec';

const FREQUENCY_CAP_DAYS = 7;

export function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage frequency cap
    const checkFrequencyCap = () => {
      const submittedFlag = localStorage.getItem('bharatsaver_lead_submitted');
      if (submittedFlag === 'true') return true;

      const dismissedTime = localStorage.getItem('bharatsaver_lead_dismissed_time');
      if (dismissedTime) {
        const elapsedDays = (Date.now() - parseInt(dismissedTime, 10)) / (1000 * 60 * 60 * 24);
        if (elapsedDays < FREQUENCY_CAP_DAYS) {
          return true; // Cap active, do not auto-open
        }
      }
      return false;
    };

    if (checkFrequencyCap() || hasTriggered) return;

    // 1. Time Dwell Trigger (25 seconds)
    const dwellTimer = setTimeout(() => {
      if (!hasTriggered && !checkFrequencyCap()) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    }, 25000);

    // 2. Desktop Exit-Intent Trigger
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasTriggered && !checkFrequencyCap()) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    // 3. Mobile Scroll Depth Trigger (70%)
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      if (scrollPosition / totalHeight > 0.7 && !hasTriggered && !checkFrequencyCap()) {
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
    if (!email || !phone || !comment) return;

    setLoading(true);

    const payload = {
      email: email.trim(),
      phone: phone.trim(),
      comment: comment.trim(),
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
        setEmail('');
        setPhone('');
        setComment('');
      }, 4000);
    } catch (err) {
      console.error('Lead submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Persistent Floating Widget Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Ask Financial Expert"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-teal-800 active:scale-95 md:bottom-24 md:right-6 md:px-5 md:py-3"
      >
        <Headphones className="h-5 w-5 animate-pulse text-emerald-200" />
        <span className="font-semibold text-xs md:text-sm">Get Free Expert Help</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full bg-black/20 p-1 text-white/80 transition-colors hover:bg-black/40 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-100">
                <ShieldCheck className="h-4 w-4" /> 100% Free CFP Financial Consultation
              </div>
              <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">
                Have Policy Questions? Talk to an Expert
              </h3>
              <p className="mt-1 text-xs text-emerald-50/90">
                Get unbiased guidance on LIC calculation rates, tax savings, or yield optimization.
              </p>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    Request Received Successfully!
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Our Certified Financial Planner (CFP) team has received your query and will contact you via WhatsApp / Call within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Phone / WhatsApp Number <span className="text-emerald-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210 (10 Digits)"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      What do you need help with? <span className="text-emerald-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="e.g. Want to calculate maturity returns for Jeevan Labh 936 with ₹10 Lakh sum assured..."
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Reviewed by Mahesh Chaube, Certified Financial Planner (CFP). No spam ever.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-98 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <span>Submit & Request Expert Call</span>
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
