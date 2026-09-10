"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const painPoints = [
  { icon: "🔇", title: "No Communication Bridge", description: "Deaf citizens arrive at counters and face a wall of silence. Clerks have no tools to understand or respond in ISL." },
  { icon: "📱", title: "Lessons Are Off-Counter", description: "ISL courses exist on apps and in classrooms, but never reach the clerk at the exact moment of service." },
  { icon: "📊", title: "Zero Measurement", description: "No department can quantify how accessible their counters are. Without data, there is no accountability." },
  { icon: "🫂", title: "Citizen Frustration", description: "Deaf citizens often leave government offices without being served, or rely on random bystanders to interpret." },
  { icon: "⏰", title: "Long Wait Times", description: "Communication breakdowns cause delays, repeated visits, and wasted time for both citizens and clerks." },
  { icon: "🏛️", title: "Policy-Practice Gap", description: "The RPwD Act 2016 mandates accessibility, but ground-level implementation at counters remains near zero." },
];

const innovations = [
  { icon: "Moment", title: "Moment-Based Design", description: "Sanket doesn't ask clerks to change habits. It injects ISL support into the 30-second service moment." },
  { icon: "Habit", title: "Habit Formation", description: "3-minute daily micro-learning builds ISL familiarity over time. XP, streaks, and badges make learning sticky." },
  { icon: "Score", title: "Measurable Accessibility", description: "The Sugamya Score quantifies compliance, satisfaction, participation, and safety net — turning abstract goals into concrete numbers." },
];

export default function ProblemStatementPage() {
  return (
    <div className="min-h-screen bg-navy-900">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,169,97,0.06),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            ← Back to Home
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs text-gold-400 mb-6">
            Problem Statement — Smart India Hackathon
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Making Government Counters
            <br />
            <span className="gradient-text">Accessible for Every Citizen</span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl">
            A detailed look at the communication barrier Deaf citizens face at government service counters,
            and how Sanket 2.0 bridges the gap.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* Core Problem */}
        <section className="glass-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold-400" />
          <div className="pl-4">
            <h2 className="text-xl font-bold text-white mb-3">The Core Problem</h2>
            <p className="text-white/60 leading-relaxed">
              Deaf and hard-of-hearing citizens may encounter communication barriers when accessing
              government services. Government accessibility policies and rights exist, but the practical problem
              occurs <strong className="text-white">at the service counter</strong>.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: "~18M", label: "Deaf & Hard-of-Hearing Citizens", source: "Census 2011", icon: "🤟" },
            { value: "~3.5M", label: "Government Clerks Nationwide", source: "Govt Records", icon: "🏛️" },
            { value: "<5%", label: "Basic ISL Proficiency Among Clerks", source: "ISLRTC Estimates", icon: "📉" },
          ].map((s) => (
            <div key={s.label} className="bento-card text-center">
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <p className="text-3xl font-black gradient-text mb-2">{s.value}</p>
              <p className="text-white/60 text-sm font-medium mb-1">{s.label}</p>
              <p className="text-white/25 text-xs">{s.source}</p>
            </div>
          ))}
        </section>

        {/* Root Cause */}
        <section className="glass-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-400" />
          <div className="pl-4">
            <h2 className="text-xl font-bold text-white mb-3">Root Cause</h2>
            <p className="text-white/60 leading-relaxed mb-4">
              ISL lessons exist <strong className="text-white">OFF the counter</strong> — in apps, courses, and videos.
              Clerks never see them because the need is only visible <strong className="text-white">AT the counter</strong>.
              No tool is installed WHERE service happens. No accountability. No data. No measurement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03]">
                <span className="text-lg shrink-0">❌</span>
                <div>
                  <p className="text-white/70 text-sm font-medium">Off-Counter Learning</p>
                  <p className="text-white/40 text-xs">ISL apps and courses that clerks never use</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03]">
                <span className="text-lg shrink-0">✅</span>
                <div>
                  <p className="text-white/70 text-sm font-medium">On-Counter Assistance</p>
                  <p className="text-white/40 text-xs">Real-time ISL support where service happens</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Pain Points</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {painPoints.map((p) => (
              <div key={p.title} className="glass-card group hover:border-red-500/20 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{p.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">{p.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{p.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Framework */}
        <section className="glass-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
          <div className="pl-4">
            <h2 className="text-xl font-bold text-white mb-3">Legal Framework</h2>
            <ul className="space-y-3 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">⚖️</span>
                <div>
                  <strong className="text-white">RPwD Act 2016</strong> — Rights of Persons with Disabilities Act mandates accessibility in government services for persons with hearing impairment.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">🇮🇳</span>
                <div>
                  <strong className="text-white">Sugamya Bharat Abhiyan</strong> — National accessibility initiative aiming to make India barrier-free for persons with disabilities.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">🤟</span>
                <div>
                  <strong className="text-white">ISLRTC</strong> — Indian Sign Language Research and Training Centre under the Ministry of Social Justice &amp; Empowerment.
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Solution */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Our Solution: Sanket 2.0</h2>
          <div className="glass-card relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 via-transparent to-teal-500/5 pointer-events-none" />
            <div className="relative">
              <p className="text-white/60 leading-relaxed text-lg">
                Sanket equips government clerks with <strong className="text-white">real-time ISL assistance</strong>,
                <strong className="text-white"> micro-learning</strong>, and
                <strong className="text-white"> measurable accessibility insights</strong> —
                directly at the service counter. From <strong className="text-gold-400">30 days of training</strong> to
                <strong className="text-gold-400"> 30 seconds of service</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Innovation Highlights */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Innovation Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {innovations.map((item, i) => (
              <div key={item.title} className="bento-card text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gold-400/10 text-gold-400 text-sm font-black mb-3">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sustainability */}
        <section className="glass-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-400" />
          <div className="pl-4">
            <h2 className="text-xl font-bold text-white mb-3">Sustainability Model</h2>
            <ul className="space-y-2 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Integration with existing government service infrastructure — no new hardware required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Data-driven approach enables continuous improvement and policy feedback loops</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Gamification ensures long-term clerk engagement without mandatory training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Sugamya Score creates institutional accountability and measurable KPIs</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/login">
            <Button size="lg" className="text-base px-8 py-4 shadow-lg shadow-gold-400/20">
              Try the Demo →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
