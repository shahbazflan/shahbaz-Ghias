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
  MessageCircle,
  Phone,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { PERSONAL_INFO, SKILL_CATEGORIES, EDUCATION_LIST, GATEWAY_IMAGES } from '../data/portfolioData';

const PROJECT_TYPE_PILLS = [
  'Broadcast TVC',
  'Motion Graphics',
  'Generative AI / VFX',
  'UGC Video Campaign',
  'Brand Identity',
  'Full-Time Role',
];

export const AboutView: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactChannel, setContactChannel] = useState<'email' | 'whatsapp'>('email');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedInquiry, setCopiedInquiry] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getFormattedEmailBody = () => {
    return `Hello Shahbaz,

Here is a project inquiry from your portfolio website:

• SENDER / CLIENT: ${senderName || 'Anonymous / Prospective Client'}
• EMAIL ADDRESS: ${senderEmail || 'Not provided'}
• WHATSAPP / PHONE: ${senderPhone || 'Not provided'}
• INQUIRY TYPE: ${contactSubject || 'General Motion Design'}
• PREFERRED CHANNEL: ${contactChannel.toUpperCase()}

PROJECT BRIEF:
${contactMessage}

---
Sent via Shahbaz Ahmed Portfolio`;
  };

  const getFormattedWhatsAppText = () => {
    return `*NEW PROJECT INQUIRY FOR SHAHBAZ AHMED*

👤 *Client / Studio:* ${senderName || 'Prospective Client'}
✉️ *Email:* ${senderEmail || 'Not provided'}
📱 *WhatsApp/Phone:* ${senderPhone || 'Not provided'}
🎯 *Scope:* ${contactSubject || 'Motion Design / Commercial'}

📝 *Brief:*
${contactMessage}`;
  };

  const handleSendEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!senderEmail || !contactMessage) return;

    // Automatically copy formatted brief to clipboard for the client
    const text = getFormattedEmailBody();
    navigator.clipboard.writeText(text);
    setCopiedInquiry(true);
    setTimeout(() => setCopiedInquiry(false), 2500);

    // Transition smoothly to the in-page Dispatch & Delivery Hub
    setIsSubmitted(true);
  };

  const handleTriggerDesktopMailto = () => {
    const subject = `[Project Inquiry] ${contactSubject || 'Motion Design Brief'} - ${senderName || 'Client'}`;
    const body = getFormattedEmailBody();
    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?cc=${PERSONAL_INFO.hiddenBackupEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleSendGmailWeb = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!senderEmail || !contactMessage) {
      // Focus or trigger form submit validation
      const form = document.querySelector('form');
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    const subject = `[Project Inquiry] ${contactSubject || 'Motion Design Brief'} - ${senderName || 'Client'}`;
    const body = getFormattedEmailBody();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL_INFO.email)}&cc=${encodeURIComponent(PERSONAL_INFO.hiddenBackupEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  const handleOpenOutlookApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!senderEmail || !contactMessage) {
      const form = document.querySelector('form');
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    const subject = `[Project Inquiry] ${contactSubject || 'Motion Design Brief'} - ${senderName || 'Client'}`;
    const body = getFormattedEmailBody();

    // Automatically copy brief to clipboard in case needed
    navigator.clipboard.writeText(body);
    setCopiedInquiry(true);
    setTimeout(() => setCopiedInquiry(false), 2500);

    // Deep link directly to Microsoft Outlook desktop application
    const outlookAppUrl = `ms-outlook://compose?to=${encodeURIComponent(PERSONAL_INFO.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    const link = document.createElement('a');
    link.href = outlookAppUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSubmitted(true);
  };

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!contactMessage) return;

    const text = getFormattedWhatsAppText();
    const whatsappUrl = `https://wa.me/${PERSONAL_INFO.whatsappClean}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  const handleCopyInquiry = () => {
    const textToCopy = contactChannel === 'whatsapp' ? getFormattedWhatsAppText() : getFormattedEmailBody();
    navigator.clipboard.writeText(textToCopy);
    setCopiedInquiry(true);
    setTimeout(() => setCopiedInquiry(false), 2500);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
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
                <span className="font-normal text-base sm:text-lg text-white hover:text-[#f59e0b] transition-colors duration-300 cursor-default block">Shahbaz Ahmed</span>
                <span className="text-xs text-neutral-300 font-light block">Senior Motion Designer</span>
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
                id="whatsapp-direct-link"
                href={`https://wa.me/${PERSONAL_INFO.whatsappClean}?text=${encodeURIComponent("Hi Shahbaz, I'm reaching out regarding a motion graphics / video project.")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-light bg-[#25d366]/15 border border-[#25d366]/35 text-white hover:bg-[#25d366]/25 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25d366]" />
                  <span>WhatsApp ({PERSONAL_INFO.whatsapp})</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <a
                id="linkedin-profile-link"
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium bg-[#0a66c2]/15 border border-[#0a66c2]/40 text-[#38bdf8] hover:bg-[#0a66c2]/25 hover:border-[#0a66c2] hover:text-white transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                  <span>LinkedIn Profile</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
              </a>

              <a
                id="canva-portfolio-link"
                href={PERSONAL_INFO.canvaPortfolio}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-[#00c4cc]/15 via-[#5d3bf6]/15 to-[#7d2ae8]/15 border border-[#00c4cc]/40 text-[#00c4cc] hover:border-[#7d2ae8] hover:bg-gradient-to-r hover:from-[#00c4cc]/25 hover:to-[#7d2ae8]/25 hover:text-white transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00c4cc]" />
                  <span>Interactive Brand Portfolio (Canva)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#00c4cc]" />
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
              Hi, I'm <span className="text-[#d85d3a] hover:text-[#f59e0b] transition-colors duration-300 font-extrabold cursor-default">Shahbaz Ahmed</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 font-light">
              Senior Motion Graphics Designer
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

      {/* Direct Contact Form & Dispatch Suite */}
      <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900/90 border border-neutral-800 max-w-4xl mx-auto shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-sm">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#d85d3a]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#25d366]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-lg mx-auto space-y-2">
          <span className="text-xs font-light uppercase tracking-widest text-[#d85d3a]">
            Direct Inquiries &amp; Commissions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Start a Conversation
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Whether for broadcast TVCs, brand identity motion, UGC performance campaigns, or full-time roles, connect directly via Email or WhatsApp.
          </p>
        </div>

        {/* Channel Selector Switcher */}
        <div className="relative z-10 flex p-1 rounded-2xl bg-neutral-950 border border-neutral-800 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setContactChannel('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs font-semibold transition-all duration-200 ${
              contactChannel === 'email'
                ? 'bg-gradient-to-r from-[#d85d3a] to-[#c24524] text-white shadow-lg shadow-[#d85d3a]/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>EMAIL DISPATCH</span>
          </button>
          <button
            type="button"
            onClick={() => setContactChannel('whatsapp')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs font-semibold transition-all duration-200 ${
              contactChannel === 'whatsapp'
                ? 'bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white shadow-lg shadow-[#25d366]/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WHATSAPP CONNECT</span>
          </button>
        </div>

        {/* Submitted Confirmation Card */}
        {isSubmitted ? (
          <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-700/80 space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-syne text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                Inquiry Prepared &amp; Dispatched!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Your message details have been formatted. You can open your mail client, launch Gmail in browser, chat on WhatsApp, or copy the formatted brief below.
              </p>
            </div>

            {/* Sender Summary Pill Box */}
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-left max-w-lg mx-auto text-xs font-mono space-y-2 text-neutral-300">
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-800 pb-1">
                DISPATCH SUMMARY
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">CLIENT:</span>
                <span className="text-white font-medium">{senderName || 'Prospective Client'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">EMAIL:</span>
                <span className="text-white font-medium">{senderEmail || 'Not provided'}</span>
              </div>
              {senderPhone && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">PHONE/WHATSAPP:</span>
                  <span className="text-white font-medium">{senderPhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">SUBJECT:</span>
                <span className="text-[#d85d3a] font-medium">{contactSubject || 'General Motion Inquiry'}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-800/80 pt-1.5 mt-1.5">
                <span className="text-neutral-500">SENDING TO:</span>
                {contactChannel === 'email' ? (
                  <span className="text-[#d85d3a] font-medium">{PERSONAL_INFO.email}</span>
                ) : (
                  <span className="text-emerald-400 font-medium">Shahbaz ({PERSONAL_INFO.whatsapp})</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendGmailWeb}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-colors shadow-md shadow-[#d85d3a]/25"
              >
                <Mail className="w-3.5 h-3.5 text-white" />
                <span>GMAIL (WEB)</span>
              </button>

              <button
                type="button"
                onClick={handleOpenOutlookApp}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-white bg-[#0078d4] hover:bg-[#006cbd] transition-colors shadow-md shadow-[#0078d4]/25 cursor-pointer"
                title="Launches Microsoft Outlook desktop application"
              >
                <Mail className="w-3.5 h-3.5 text-white" />
                <span>OUTLOOK APP</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerDesktopMailto}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
                title="Opens your Mac's default email reader"
              >
                <Send className="w-3.5 h-3.5 text-neutral-400" />
                <span>APPLE MAIL / APP</span>
              </button>

              <a
                href={`https://wa.me/${PERSONAL_INFO.whatsappClean}?text=${encodeURIComponent(getFormattedWhatsAppText())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs text-white bg-[#25d366]/20 hover:bg-[#25d366]/30 border border-[#25d366]/50 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WHATSAPP</span>
              </a>

              <button
                type="button"
                onClick={handleCopyInquiry}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
              >
                {copiedInquiry ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInquiry ? 'COPIED' : 'COPY BRIEF'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-mono text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>NEW INQUIRY</span>
              </button>
            </div>

            {/* macOS System Default Helper Notice */}
            <div className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 text-[11px] text-neutral-400 max-w-lg mx-auto text-left leading-relaxed">
              <span className="text-[#d85d3a] font-semibold font-mono">MAC NOTICE:</span> If clicking &ldquo;Apple Mail / App&rdquo; opens Opera, your Mac has Opera assigned as the default email reader. To fix this: open <span className="text-white font-medium">Apple Mail &gt; Settings &gt; General</span>, and change <span className="text-white font-medium">&ldquo;Default email reader&rdquo;</span> to <span className="text-emerald-400 font-medium">Mail</span> or <span className="text-emerald-400 font-medium">Microsoft Outlook</span>.
            </div>
          </div>
        ) : (
          <form onSubmit={contactChannel === 'whatsapp' ? handleSendWhatsApp : handleSendEmail} className="relative z-10 space-y-4">
            {/* Sender Identity Row (Crucial for connecting back!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                  <span>Your Name / Studio</span>
                  <span className="text-[10px] text-neutral-500 lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Alex Vance / Apex Media"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-700/80 text-sm font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                  <span>Your Email Address</span>
                  <span className="text-[10px] text-[#d85d3a] font-semibold">*Required for email</span>
                </label>
                <input
                  type="email"
                  required={contactChannel === 'email'}
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="e.g. alex@apexmedia.ae"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-700/80 text-sm font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors"
                />
              </div>
            </div>

            {/* Phone & Subject Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                  <span>Your WhatsApp / Phone</span>
                  <span className="text-[10px] text-neutral-500 lowercase">(with country code)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. +971 50 123 4567 or +1 ..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-700/80 text-sm font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors"
                  />
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Subject / Project Scope
                </label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. 30s Broadcast TVC Commercial"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-700/80 text-sm font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors"
                />
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Quick Project Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {PROJECT_TYPE_PILLS.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setContactSubject(pill)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      contactSubject === pill
                        ? 'bg-[#d85d3a] text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Project Brief &amp; Deliverables
              </label>
              <textarea
                rows={4}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your creative vision, timeline, target platforms, and reference styles..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-950/80 border border-neutral-700/80 text-sm font-light text-white placeholder-neutral-500 focus:outline-none focus:border-[#d85d3a] transition-colors resize-none"
              />
            </div>

            {/* Submit & Dispatch Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-neutral-800">
              <div className="text-xs text-neutral-400 space-y-0.5 text-center sm:text-left">
                {contactChannel === 'email' ? (
                  <div>
                    <div>
                      Sending to inbox:{' '}
                      <span className="text-[#d85d3a] font-mono font-medium">{PERSONAL_INFO.email}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Your Email:{' '}
                      {senderEmail ? (
                        <span className="text-neutral-300 font-mono">{senderEmail}</span>
                      ) : (
                        <span className="italic">Enter your email above</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      Sending directly to:{' '}
                      <span className="text-emerald-400 font-mono font-medium">{PERSONAL_INFO.whatsapp}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Your WhatsApp / Phone:{' '}
                      {senderPhone ? (
                        <span className="text-neutral-300 font-mono">{senderPhone}</span>
                      ) : (
                        <span className="italic">Enter your number above</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="text-[11px] text-neutral-500 font-mono">
                  Guaranteed response within 24 hours (UAE Time GST)
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {contactChannel === 'email' ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSendGmailWeb}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl font-mono text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700"
                      title="Open and compose directly in Gmail Web in browser"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#d85d3a]" />
                      <span>GMAIL</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenOutlookApp}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl font-mono text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700 hover:border-[#0078d4]/60 cursor-pointer"
                      title="Open and compose directly in Microsoft Outlook desktop application"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0078d4]" />
                      <span>OUTLOOK APP</span>
                    </button>

                    <button
                      id="submit-contact-email-btn"
                      type="submit"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold text-white bg-[#d85d3a] hover:bg-[#c24e2d] transition-colors shadow-lg shadow-[#d85d3a]/25 uppercase tracking-wider cursor-pointer"
                      title="Submit brief and choose dispatch channel"
                    >
                      <Send className="w-4 h-4" />
                      <span>DISPATCH INQUIRY</span>
                    </button>
                  </>
                ) : (
                  <button
                    id="submit-contact-whatsapp-btn"
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-mono text-xs font-bold text-white bg-[#25d366] hover:bg-[#1faa4b] transition-colors shadow-lg shadow-[#25d366]/30 uppercase tracking-wider"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>LAUNCH WHATSAPP CHAT</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};
