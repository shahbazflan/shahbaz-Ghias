import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Linkedin,
  ExternalLink,
  GraduationCap,
  Wrench,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Award,
  Globe,
} from 'lucide-react';
import { PERSONAL_INFO, SKILL_CATEGORIES, EDUCATION_LIST, GATEWAY_IMAGES } from '../data/portfolioData';

export const AboutView: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
      contactSubject || 'Portfolio Project Inquiry'
    )}&body=${encodeURIComponent(contactMessage)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
    >
      {/* Hero Profile Introduction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl p-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-end relative group">
              {/* Creative Studio & Profile Visual */}
              <img
                src={GATEWAY_IMAGES.profileExpertise}
                alt={PERSONAL_INFO.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="relative z-10 w-full p-4 text-center space-y-0.5">
                <span className="font-normal text-base sm:text-lg text-white block">Shahbaz Ahmed</span>
                <span className="text-xs text-neutral-300 font-light block">Senior Visual Director</span>
              </div>

              <div className="absolute top-3 right-3 py-1 px-2.5 rounded-full bg-black/70 backdrop-blur-md border border-neutral-700/60 flex items-center gap-1.5 text-[10px] font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">Available</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/60 text-center">
                <span className="font-extrabold text-xl text-[#d85d3a] block">15+</span>
                <span className="text-[11px] text-neutral-400 font-light">Years Experience</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/60 text-center">
                <span className="font-extrabold text-xl text-white block">UAE</span>
                <span className="text-[11px] text-neutral-400 font-light">Market Experience</span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="space-y-2 mt-4 pt-4 border-t border-neutral-800/80">
              <button
                id="copy-email-btn"
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-light bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-[#d85d3a] shrink-0" />
                  <span className="truncate">{PERSONAL_INFO.email}</span>
                </div>
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              </button>

              <a
                id="linkedin-profile-link"
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-light bg-[#0077b5]/15 border border-[#0077b5]/30 text-white hover:bg-[#0077b5]/25 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-[#0077b5]" />
                  <span>LinkedIn Profile</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <a
                id="canva-portfolio-link"
                href={PERSONAL_INFO.canvaPortfolio}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-light bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#d85d3a]" />
                  <span>Interactive Brand Portfolio</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Narrative */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d85d3a]/15 text-[#d85d3a] border border-[#d85d3a]/30 text-xs font-light uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>Executive Profile</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hi, I'm <span className="text-[#d85d3a] font-extrabold">Shahbaz Ahmed</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 font-light">
              Senior Motion Graphics Designer &amp; Visual Director
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
            <p>{PERSONAL_INFO.bioFull}</p>
          </div>

          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-[#d85d3a]">
              <Award className="w-4 h-4" />
              <h3 className="text-xs font-normal uppercase tracking-wider text-white">
                Market Heritage
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              {PERSONAL_INFO.profileStatement}
            </p>
          </div>

          {/* Education & Credentials */}
          <div className="space-y-4 pt-4 border-t border-neutral-800/80">
            <div className="flex items-center gap-2 text-[#d85d3a]">
              <GraduationCap className="w-4 h-4" />
              <h3 className="text-xs font-normal uppercase tracking-wider text-white">
                Education &amp; Academic Training
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EDUCATION_LIST.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1"
                >
                  <span className="text-xs font-normal text-white block">
                    {edu.institution}
                  </span>
                  <p className="text-xs text-[#d85d3a] font-light">{edu.degree}</p>
                  <p className="text-[11px] text-neutral-500 font-light">
                    {edu.location} {edu.period ? `• ${edu.period}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Software & Generative AI Toolkit */}
      <div className="space-y-8 pt-8 border-t border-neutral-800/80">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-light uppercase tracking-widest text-[#d85d3a]">
            <Wrench className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Software &amp; Generative AI Expertise
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            A comprehensive dual-engine mastery bridging traditional broadcast software with next-generation generative AI pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <h3 className="text-base font-normal text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d85d3a]" />
                  {cat.title}
                </h3>
                {cat.description && (
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                {cat.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between p-2 rounded-lg bg-neutral-800/60 border border-neutral-700/40 text-xs font-light"
                  >
                    <span className="text-neutral-200">{skill.name}</span>
                    {skill.level && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-light ${
                          skill.highlight
                            ? 'bg-[#d85d3a]/20 text-[#d85d3a]'
                            : 'bg-neutral-700/60 text-neutral-400'
                        }`}
                      >
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contact Form */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 max-w-4xl mx-auto shadow-2xl space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <span className="text-xs font-light uppercase tracking-widest text-[#d85d3a]">
            Direct Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Start a Conversation
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            For commercial broadcast briefs, brand visual direction, or custom motion pipelines, drop a direct note.
          </p>
        </div>

        <form onSubmit={handleSendEmail} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-light uppercase tracking-wider text-neutral-300">
              Subject / Project Type
            </label>
            <input
              type="text"
              required
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              placeholder="e.g. Broadcast Commercial / Motion Visual Direction / Full-time Role"
              className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-sm font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-light uppercase tracking-wider text-neutral-300">
              Message
            </label>
            <textarea
              rows={4}
              required
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Tell me about your project scope, timeline, or vision..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-sm font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-neutral-400 font-light">
              Sends directly to <span className="text-[#d85d3a] font-normal">{PERSONAL_INFO.email}</span>
            </p>
            <button
              id="submit-contact-email-btn"
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-light text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-colors shadow-lg shadow-[#d85d3a]/25 uppercase tracking-wider"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
