'use client';

import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, ArrowRight, CheckCircle2, FileSpreadsheet, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby5qvqRe-wLDQa7kyuSe1PPIjv8WNGYPrJOcXOW530sMBXNlfEeLQlgqr5G9EK3sIkP/exec';

type InlineLeadBannerProps = {
  title?: string;
  subtitle?: string;
  calculatorName?: string;
};

export function InlineLeadBanner({
  title = 'Want a Detailed Policy Payout Summary on WhatsApp?',
  subtitle = 'Get an actuarially verified breakdown of guaranteed bonuses, tax savings under Section 10(10D), and year-by-year cashflow tables.',
  calculatorName = 'Financial Calculator',
}: InlineLeadBannerProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);

    const payload = {
      phone: phone.trim(),
      email: 'N/A (Inline Banner)',
      comment: `Inline WhatsApp Request: ${calculatorName}`,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      pageTitle: typeof document !== 'undefined' ? document.title : calculatorName,
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('bharatsaver_lead_submitted', 'true');
      }
    } catch (err) {
      console.error('Inline lead submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 rounded-2xl border-2 border-emerald-500/25 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Offer & Benefits */}
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Free CFP Actuarial Payout Summary</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 100% Free Consultation
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp Direct Delivery
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-emerald-600" /> Zero Sales Spam
            </span>
          </div>
        </div>

        {/* Right Side: Form Box */}
        <div className="w-full lg:w-auto shrink-0 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
          {submitted ? (
            <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 py-3 px-2">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Report Requested!</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Our CFP team will WhatsApp your calculation report shortly.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full sm:w-80">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Mobile Number <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{loading ? 'Sending Request...' : 'Get Free WhatsApp Report'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
