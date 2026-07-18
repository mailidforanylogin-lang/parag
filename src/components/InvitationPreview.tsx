import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { InvitationData } from '../types';
import { TEMPLATE_PRESETS, MUSIC_TRACKS, TRANSLATIONS } from '../utils/constants';
import { startWeddingMusic, stopWeddingMusic } from '../utils/audioSynth';
import { Volume2, VolumeX, MapPin, Calendar, Clock, Sparkles, Heart, Users, CheckCircle, Smartphone, PartyPopper, Share2, Download, FileImage, FileText, Check, Loader2, Mail, QrCode, Link, X, Printer, Music, ExternalLink } from 'lucide-react';

interface InvitationPreviewProps {
  data: InvitationData;
  activeMusic: boolean;
  setActiveMusic: (active: boolean) => void;
  onSubmitRsvp: (guestName: string, guestCount: number, attending: boolean) => void;
  rsvpSubmissions: Array<{ name: string; count: number; attending: boolean; date: string }>;
}

export default function InvitationPreview({
  data,
  activeMusic,
  setActiveMusic,
  onSubmitRsvp,
  rsvpSubmissions,
}: InvitationPreviewProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpAttending, setRsvpAttending] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Share & Export Simulated Modal states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [socialToast, setSocialToast] = useState<string | null>(null);

  const resetExportStates = () => {
    setIsExporting(false);
    setExportComplete(false);
    setExportProgress(0);
    setExportStatusText('');
    setExportType(null);
  };

  const startExportSimulation = (type: 'png' | 'pdf') => {
    setExportType(type);
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);
    
    const steps = [
      { progress: 12, text: 'Initializing high-fidelity layout engine...' },
      { progress: 30, text: `Mapping template specifications for "${activeTemplate.name}"...` },
      { progress: 50, text: 'Rendering couple photo and applying shape mask alignment...' },
      { progress: 70, text: 'Vectorizing traditional borders and custom calligraphy...' },
      { progress: 90, text: `Applying primary palette ${data.primaryColor} in ultra-cmyk vector wrap...` },
      { progress: 100, text: 'Compiling physical layout wrapper and triggering asset download...' },
    ];

    let currentStepIndex = 0;
    
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setExportProgress(step.progress);
        setExportStatusText(step.text);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setIsExporting(false);
        setExportComplete(true);
        // Play success confetti!
        handleCelebrate();
      }
    }, 700);
  };

  const handleCopyShareLink = () => {
    const groomSafe = (data.groomName || 'Groom').trim().toLowerCase().replace(/\s+/g, '-');
    const brideSafe = (data.brideName || 'Bride').trim().toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `https://royal-invitations.com/rsvp/${groomSafe}-and-${brideSafe}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(() => {
      // Fallback if clipboard fails in iframe
      setSocialToast('Link copied to clipboard (Simulated)');
      setTimeout(() => setSocialToast(null), 2500);
    });
  };

  const handleSocialShare = (platform: string) => {
    setSocialToast(`Opening ${platform} and composing draft invitation with layout link...`);
    setTimeout(() => setSocialToast(null), 3000);
  };

  const t = TRANSLATIONS[data.language];
  const activeTemplate = TEMPLATE_PRESETS.find((p) => p.id === data.templateId) || TEMPLATE_PRESETS[0];

  // Music Trigger
  useEffect(() => {
    if (activeMusic) {
      startWeddingMusic(data.bgMusicId);
    } else {
      stopWeddingMusic();
    }
    return () => {
      stopWeddingMusic();
    };
  }, [activeMusic, data.bgMusicId]);

  // Real-time Countdown Timer Calculation
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(data.engagementDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [data.engagementDate]);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    onSubmitRsvp(rsvpName, rsvpCount, rsvpAttending);
    setRsvpSubmitted(true);
    setRsvpName('');
    setTimeout(() => {
      setRsvpSubmitted(false);
    }, 6000);
  };

  const handleCelebrate = () => {
    // Left corner pop
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.8 },
      colors: [data.primaryColor, '#f59e0b', '#fbbf24', '#ffffff']
    });

    // Right corner pop
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.8 },
      colors: [data.primaryColor, '#b45309', '#fef3c7', '#ffffff']
    });

    // Center high burst
    setTimeout(() => {
      confetti({
        particleCount: 85,
        spread: 100,
        origin: { y: 0.55 },
        colors: [data.primaryColor, '#fbbf24', '#f59e0b', '#ffffff']
      });
    }, 220);
  };

  // Font class resolutions
  const headerFontClass = 
    data.templateId === 'marathi-theme' ? 'font-marathi' :
    activeTemplate.fontConfig.headerFont === 'font-display' ? 'font-display' :
    activeTemplate.fontConfig.headerFont === 'font-serif' ? 'font-serif' : 'font-sans';

  const bodyFontClass = activeTemplate.fontConfig.bodyFont === 'font-serif' ? 'font-serif' : 'font-sans';
  const accentFontClass = 'font-script';

  // Card theme style mapping
  const isDarkTheme = data.templateId === 'modern-luxury' || data.templateId === 'dark-elegant';
  
  const cardBgStyle = isDarkTheme 
    ? { backgroundColor: data.secondaryColor } 
    : { backgroundColor: data.secondaryColor };

  const textAlignClass = data.textAlignment === 'left' ? 'text-left' : data.textAlignment === 'right' ? 'text-right' : 'text-center';
  const flexAlignClass = data.textAlignment === 'left' ? 'items-start justify-start' : data.textAlignment === 'right' ? 'items-end justify-end' : 'items-center justify-center';
  const justifyAlignClass = data.textAlignment === 'left' ? 'justify-start' : data.textAlignment === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Elegant Share & Export Toolbar */}
      <div className="w-full max-w-[390px] flex justify-between items-center bg-white/80 backdrop-blur-md border border-gold-200/40 p-3 rounded-2xl mb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preview Active</span>
        </div>
        <button
          onClick={() => {
            resetExportStates();
            setIsShareModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 active:scale-95 text-white text-xs font-bold transition-all shadow-md cursor-pointer uppercase tracking-wider select-none"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share & Export</span>
        </button>
      </div>

      {/* Mobile Frame Container Mockup */}
      <div className="relative w-full max-w-[390px] aspect-[9/18.5] rounded-[50px] shadow-2xl border-[10px] border-slate-900 bg-slate-950 overflow-hidden flex flex-col group">
        
        {/* Speaker / Earphone Slot & Camera notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 flex justify-center items-center z-50">
          <div className="w-16 h-3.5 bg-black rounded-b-xl flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full ml-1.5"></div>
          </div>
        </div>

        {/* Music Simulation Overlay Bar */}
        <div className="absolute top-8 left-4 right-4 z-40 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center justify-between border border-gold-200/50 transition-all">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gold-500 text-white shadow-inner animate-pulse">
              <Sparkles className="w-4 h-4 text-gold-100" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-wider text-slate-400">PLAYING TEMPLATE AUDIO</p>
              <p className="text-xs font-semibold text-slate-800 max-w-[150px] truncate">
                {MUSIC_TRACKS.find((m) => m.id === data.bgMusicId)?.name || 'Royal Tone'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveMusic(!activeMusic)}
            id="music-toggle-btn"
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              activeMusic 
                ? 'bg-amber-100 text-gold-600 hover:bg-amber-200' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {activeMusic ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Device screen contents */}
        <div 
          className="flex-1 overflow-y-auto scrollbar-none pt-16 pb-8 px-5 transition-all relative"
          style={cardBgStyle}
          id="invitation-scrollable-body"
        >
          {/* Top Elegant Ornament */}
          <div className="w-full flex justify-center py-4">
            {data.templateId === 'marathi-theme' ? (
              // Marathi Shubh Sakharpuda Kalash Motif
              <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15C53 15 56 12 50 5C44 12 47 15 50 15Z" fill={data.primaryColor} />
                <path d="M35 30H65V35C65 48 60 55 50 55C40 55 35 48 35 35V30Z" fill={data.primaryColor} opacity="0.8" />
                <circle cx="50" cy="40" r="15" stroke={data.primaryColor} strokeWidth="2" />
                <path d="M50 20V55M35 35H65" stroke={data.primaryColor} strokeWidth="1.5" />
                <path d="M30 30C30 30 40 22 50 25C60 22 70 30 70 30" stroke={data.primaryColor} strokeWidth="2" />
                <circle cx="50" cy="40" r="3" fill={data.primaryColor} />
              </svg>
            ) : data.templateId === 'traditional-indian' ? (
              // Mandala Ganesha / Oil lamp layout
              <svg className="w-16 h-16 animate-float" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="30" stroke={data.primaryColor} strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M50 20C40 35 40 45 50 55C60 45 60 35 50 20Z" fill={data.primaryColor} />
                <circle cx="50" cy="40" r="4" fill="#ffffff" />
                <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
                <path d="M42 62H58C58 62 56 70 50 70C44 70 42 62 42 62Z" fill={data.primaryColor} />
              </svg>
            ) : (
              // Premium Gold / Heart / Diamond Rings
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute w-10 h-10 border-2 rounded-full transform -rotate-12 translate-x-1" style={{ borderColor: data.primaryColor }}></div>
                <div className="absolute w-10 h-10 border-2 rounded-full transform rotate-12 -translate-x-1" style={{ borderColor: data.primaryColor }}></div>
                <Heart className="w-4 h-4 absolute z-10" style={{ color: data.primaryColor }} />
              </div>
            )}
          </div>

          {/* Invitation Header Text */}
          <div className={`${textAlignClass} mt-2 px-1`}>
            <h4 
              className={`text-[11px] uppercase tracking-[0.3em] font-medium`}
              style={{ color: data.primaryColor }}
            >
              {data.templateId === 'marathi-theme' ? '।। शुभ साखरपुडा ।।' : 'ENGAGEMENT CELEBRATION'}
            </h4>
            
            <p className="text-[12px] font-sans italic text-slate-500 mt-2">
              {data.templateId === 'marathi-theme' ? 'श्री. व सौ. यांच्या सुविद्य विनंतीवरून,' : 'With joyful hearts, we invite you to share our joy'}
            </p>
          </div>

          {/* Large Names Typography */}
          <div className={`my-6 flex flex-col gap-1 ${textAlignClass} ${flexAlignClass}`}>
            <span 
              className={`${headerFontClass} text-3xl font-bold tracking-tight px-2 leading-tight`}
              style={{ color: data.primaryColor }}
            >
              {data.groomName}
            </span>
            
            <span className={`${accentFontClass} text-4xl text-amber-600 my-0.5`} style={{ color: data.primaryColor }}>
              {data.templateId === 'marathi-theme' ? 'आणि' : '&'}
            </span>
            
            <span 
              className={`${headerFontClass} text-3xl font-bold tracking-tight px-2 leading-tight`}
              style={{ color: data.primaryColor }}
            >
              {data.brideName}
            </span>
          </div>

          {/* Decorative Divider */}
          <div className={`flex items-center gap-2 my-4 ${justifyAlignClass}`}>
            <div className="h-[1px] w-12" style={{ backgroundColor: `${data.primaryColor}40` }}></div>
            <Heart className="w-3.5 h-3.5" style={{ color: data.primaryColor }} />
            <div className="h-[1px] w-12" style={{ backgroundColor: `${data.primaryColor}40` }}></div>
          </div>

          {/* Custom Message */}
          <div className={`${textAlignClass} px-4 my-5`}>
            <p className={`${bodyFontClass} text-xs leading-relaxed text-slate-600 font-light italic`}>
              "{data.customMessage}"
            </p>
          </div>

          {/* Countdown Clock Panel */}
          <div className="rounded-2xl p-3 my-6 text-center border shadow-xs" style={{ borderColor: `${data.primaryColor}30`, backgroundColor: `${data.primaryColor}08` }}>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-2 text-slate-500">
              {t.countdownTitle}
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-base font-semibold font-mono text-slate-800">{timeLeft.days}</span>
                <span className="text-[9px] text-slate-400 font-sans uppercase">{t.days}</span>
              </div>
              <span className="text-slate-400 font-mono">:</span>
              <div className="flex flex-col items-center">
                <span className="text-base font-semibold font-mono text-slate-800">{timeLeft.hours}</span>
                <span className="text-[9px] text-slate-400 font-sans uppercase">{t.hours}</span>
              </div>
              <span className="text-slate-400 font-mono">:</span>
              <div className="flex flex-col items-center">
                <span className="text-base font-semibold font-mono text-slate-800">{timeLeft.minutes}</span>
                <span className="text-[9px] text-slate-400 font-sans uppercase">{t.minutes}</span>
              </div>
              <span className="text-slate-400 font-mono">:</span>
              <div className="flex flex-col items-center">
                <span className="text-base font-semibold font-mono text-slate-800">{timeLeft.seconds}</span>
                <span className="text-[9px] text-slate-400 font-sans uppercase">{t.seconds}</span>
              </div>
            </div>
          </div>

          {/* SVG Clip Path definitions for custom frames */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
                <path d="M0.5,0.18 C0.5,0.18 0.42,0 0.25,0 C0.11,0 0,0.11 0,0.25 C0,0.5 0.5,0.9 0.5,0.9 C0.5,0.9 1,0.5 1,0.25 C1,0.11 0.89,0 0.75,0 C0.58,0 0.5,0.18 0.5,0.18 Z" />
              </clipPath>
            </defs>
          </svg>

          {/* Couple Image Placeholder if URL or preset */}
          {data.couplePhotoUrl && (() => {
            const cropScale = data.photoCropScale ?? 1;
            const cropX = data.photoCropX ?? 0;
            const cropY = data.photoCropY ?? 0;
            const cropRotate = data.photoCropRotate ?? 0;
            const frameShape = data.photoFrameShape ?? 'rect';
            const frameSize = data.photoFrameSize ?? 'medium';

            let circleSizeClass = 'h-44 w-44';
            if (frameSize === 'small') circleSizeClass = 'h-32 w-32';
            if (frameSize === 'large') circleSizeClass = 'h-52 w-52';

            let archSizeClass = 'h-56 w-44';
            if (frameSize === 'small') archSizeClass = 'h-44 w-32';
            if (frameSize === 'large') archSizeClass = 'h-64 w-52';

            let heartSizeClass = 'h-44 w-44';
            if (frameSize === 'small') heartSizeClass = 'h-32 w-32';
            if (frameSize === 'large') heartSizeClass = 'h-52 w-52';

            let rectSizeClass = 'h-44 w-full';
            if (frameSize === 'small') rectSizeClass = 'h-32 w-full';
            if (frameSize === 'large') rectSizeClass = 'h-56 w-full';

            if (frameShape === 'circle') {
              return (
                <div className={`my-6 rounded-full overflow-hidden border-2 shadow-sm relative mx-auto bg-slate-50 ${circleSizeClass}`} style={{ borderColor: `${data.primaryColor}60` }}>
                  <img 
                    src={data.couplePhotoUrl} 
                    alt="Engaged Couple" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    style={{
                      transform: `scale(${cropScale}) translate(${cropX}%, ${cropY}%) rotate(${cropRotate}deg)`,
                      transformOrigin: 'center center',
                    }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              );
            }

            if (frameShape === 'arch') {
              return (
                <div className={`my-6 rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 shadow-sm relative mx-auto bg-slate-50 ${archSizeClass}`} style={{ borderColor: `${data.primaryColor}60` }}>
                  <img 
                    src={data.couplePhotoUrl} 
                    alt="Engaged Couple" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    style={{
                      transform: `scale(${cropScale}) translate(${cropX}%, ${cropY}%) rotate(${cropRotate}deg)`,
                      transformOrigin: 'center center',
                    }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              );
            }

            if (frameShape === 'heart') {
              return (
                <div className={`my-6 overflow-hidden relative mx-auto bg-slate-50 ${heartSizeClass}`} style={{ clipPath: 'url(#heart-clip)' }}>
                  <img 
                    src={data.couplePhotoUrl} 
                    alt="Engaged Couple" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    style={{
                      transform: `scale(${cropScale}) translate(${cropX}%, ${cropY}%) rotate(${cropRotate}deg)`,
                      transformOrigin: 'center center',
                      clipPath: 'url(#heart-clip)',
                    }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1 1" preserveAspectRatio="none">
                    <path 
                      d="M0.5,0.18 C0.5,0.18 0.42,0 0.25,0 C0.11,0 0,0.11 0,0.25 C0,0.5 0.5,0.9 0.5,0.9 C0.5,0.9 1,0.5 1,0.25 C1,0.11 0.89,0 0.75,0 C0.58,0 0.5,0.18 0.5,0.18 Z" 
                      fill="none" 
                      stroke={data.primaryColor} 
                      strokeWidth="0.03" 
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              );
            }

            // Default 'rect'
            return (
              <div className={`my-6 rounded-2xl overflow-hidden border-2 shadow-sm relative bg-slate-50 ${rectSizeClass}`} style={{ borderColor: `${data.primaryColor}60` }}>
                <img 
                  src={data.couplePhotoUrl} 
                  alt="Engaged Couple" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  style={{
                    transform: `scale(${cropScale}) translate(${cropX}%, ${cropY}%) rotate(${cropRotate}deg)`,
                    transformOrigin: 'center center',
                  }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            );
          })()}

          {/* Event Date Grid */}
          <div className="rounded-2xl p-4 my-5 border flex flex-col gap-3" style={{ borderColor: `${data.primaryColor}40`, backgroundColor: '#ffffff' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gold-50" style={{ color: data.primaryColor }}>
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Date</p>
                <p className="text-xs font-semibold text-slate-800">{data.engagementDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gold-50" style={{ color: data.primaryColor }}>
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Time</p>
                <p className="text-xs font-semibold text-slate-800">{data.engagementTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gold-50" style={{ color: data.primaryColor }}>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.venueLocation}</p>
                <p className="text-xs font-bold text-slate-800">{data.venueName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{data.venueAddress}</p>
              </div>
            </div>
          </div>

          {/* Dress Code Block */}
          {data.dressCode && (
            <div className="my-5 text-center px-4 py-3 rounded-xl border border-dashed" style={{ borderColor: `${data.primaryColor}50` }}>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{data.language === 'mr' ? 'पोशाख' : 'Dress Code'}</p>
              <p className="text-xs text-slate-700 font-medium mt-1">{data.dressCode}</p>
            </div>
          )}

          {/* Family & Relatives */}
          <div className="rounded-xl p-4 my-5 bg-slate-50/50 border border-slate-100 flex flex-col gap-2 text-left">
            <h5 className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{data.language === 'mr' ? 'निमंत्रक कुटुंब' : 'With Warm Blessings'}</h5>
            <div className="text-xs text-slate-700">
              <p className="font-semibold text-slate-800">{data.language === 'mr' ? 'वर पक्ष परिवार:' : "Groom's Side:"}</p>
              <p className="font-light text-slate-500 mb-2">{data.familyDetailsGroom}</p>
              <p className="font-semibold text-slate-800">{data.language === 'mr' ? 'वधू पक्ष परिवार:' : "Bride's Side:"}</p>
              <p className="font-light text-slate-500">{data.familyDetailsBride}</p>
            </div>
          </div>

          {/* QR Code section */}
          <div className="flex flex-col items-center text-center p-4 my-6 bg-white border border-slate-100 rounded-2xl shadow-xs">
            <div className="p-2 border border-slate-100 rounded-lg">
              {/* Premium Simulated QR Code using CSS grid */}
              <div className="w-24 h-24 grid grid-cols-6 gap-[1px] bg-slate-800 p-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1px] ${
                      i % 7 === 0 || i < 6 || i === 11 || i === 18 || i > 30 || (i % 5 === 0 && i > 12)
                        ? 'bg-slate-900'
                        : 'bg-white'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">MAP NAVIGATION QR</p>
            <a
              href={data.googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold underline mt-1 block"
              style={{ color: data.primaryColor }}
            >
              {t.howToReach}
            </a>
          </div>

          {/* Interactive RSVP Form inside Mobile Mockup */}
          {data.rsvpFormActive && (
            <div className="rounded-2xl p-4 my-6 border bg-white" style={{ borderColor: `${data.primaryColor}50` }}>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" style={{ color: data.primaryColor }} />
                <h5 className="text-xs font-bold text-slate-800">{t.rsvpFormTitle}</h5>
              </div>

              {rsvpSubmitted ? (
                <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100 animate-pulse">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-emerald-800">{t.rsvpSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">{t.rsvpName}</label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Anand Deshmukh"
                      className="w-full text-xs px-2.5 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">{t.rsvpGuests}</label>
                      <select
                        value={rsvpCount}
                        onChange={(e) => setRsvpCount(Number(e.target.value))}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg focus:outline-none bg-slate-50 text-slate-800"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">{t.rsvpStatus}</label>
                      <select
                        value={rsvpAttending ? 'yes' : 'no'}
                        onChange={(e) => setRsvpAttending(e.target.value === 'yes')}
                        className="w-full text-xs px-2.5 py-2 border rounded-lg focus:outline-none bg-slate-50 text-slate-800 font-semibold"
                        style={{ color: rsvpAttending ? '#10b981' : '#ef4444' }}
                      >
                        <option value="yes">Yes, Attend</option>
                        <option value="no">No, Regrets</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-xs py-2.5 rounded-lg text-white font-bold tracking-wide mt-1 cursor-pointer transition-all hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: data.primaryColor }}
                  >
                    {t.rsvpSubmit}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Invitation Footer Contact */}
          <div className="text-center mt-6 mb-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{data.language === 'mr' ? 'आर.एस.व्ही.पी संपर्क' : 'RSVP CONTACT'}</p>
            <p className="text-xs font-bold text-slate-800 mt-1">{data.contactNumber}</p>
            <p className="text-[10px] text-slate-400 font-light mt-0.5">{data.rsvpDetails}</p>
          </div>

          <div className="flex justify-center mt-6">
            <Heart className="w-5 h-5 text-amber-500 animate-bounce" />
          </div>

        </div>

        {/* Celebrate Floating Action Button */}
        <button
          onClick={handleCelebrate}
          className="absolute bottom-8 right-6 z-40 hover:scale-110 active:scale-95 text-white rounded-full px-4 py-2.5 shadow-xl transition-all cursor-pointer flex items-center gap-1.5 border border-white/20 font-bold text-[11px] uppercase tracking-wider select-none hover:brightness-110"
          style={{ 
            background: `linear-gradient(135deg, ${data.primaryColor}, ${data.primaryColor}dd)`,
            boxShadow: `0 8px 25px -4px ${data.primaryColor}80`
          }}
          title={data.language === 'mr' ? 'अभिनंदन करा!' : 'Celebrate! 🎉'}
        >
          <PartyPopper className="w-4 h-4 text-white animate-pulse" />
          <span>{data.language === 'mr' ? 'अभिनंदन' : 'Celebrate'}</span>
        </button>

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 bg-slate-900 flex justify-center items-center">
          <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
        </div>

      </div>

      {/* Screen Frame Indicator */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 font-medium">
        <Smartphone className="w-4 h-4 text-slate-400" />
        <span>Live Interactive Invitation Card Preview</span>
      </div>

      {/* Share & Export Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Modal Container */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden relative flex flex-col max-h-[90vh]">
            
            {/* Custom Modal Notification Toast */}
            {socialToast && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/95 text-amber-200 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-amber-500/20 animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>{socialToast}</span>
              </div>
            )}

            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4.5 h-4.5 text-gold-600" />
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide text-slate-800 uppercase">Share & Export Studio</h3>
                  <p className="text-[10px] text-slate-400">Generate high-fidelity invitation cards for guests</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsShareModalOpen(false);
                  resetExportStates();
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              
              {!isExporting && !exportComplete ? (
                <>
                  {/* Part 1: Selected Invitation Asset Specs */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl overflow-hidden relative border border-slate-200 bg-white flex items-center justify-center flex-shrink-0">
                      {data.couplePhotoUrl ? (
                        <img src={data.couplePhotoUrl} alt="Couple" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gold-50 flex items-center justify-center text-gold-500">
                          <Heart className="w-6 h-6 fill-gold-100" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-1">
                        <span className="text-[8px] font-bold text-white tracking-widest uppercase font-mono">
                          {data.groomName[0] || 'G'}&{data.brideName[0] || 'B'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate">
                        {data.groomName} & {data.brideName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                        Theme: {activeTemplate.name}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[9px] bg-amber-50 text-gold-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {data.language === 'mr' ? 'मराठी' : 'English'}
                        </span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          RSVP: {data.rsvpFormActive ? 'Active' : 'Inactive'}
                        </span>
                        {data.weddingWebsiteActive && (
                          <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Web Link
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Part 2: Simulation Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Select Export Format</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Export PNG */}
                      <button
                        onClick={() => startExportSimulation('png')}
                        className="p-4 border border-slate-200/80 hover:border-gold-300 bg-white hover:bg-gold-50/5 rounded-2xl text-left transition-all cursor-pointer group flex flex-col gap-3 shadow-2xs hover:shadow-sm"
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="p-2 bg-amber-50 rounded-xl text-gold-600">
                            <FileImage className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Instant
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Export as High-Res PNG</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            Lossless raster image. Optimized for social messaging sharing like WhatsApp.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gold-600 group-hover:translate-x-1 transition-transform mt-1">
                          <span>Simulate Download</span>
                          <Download className="w-3 h-3" />
                        </div>
                      </button>

                      {/* Export PDF */}
                      <button
                        onClick={() => startExportSimulation('pdf')}
                        className="p-4 border border-slate-200/80 hover:border-gold-300 bg-white hover:bg-gold-50/5 rounded-2xl text-left transition-all cursor-pointer group flex flex-col gap-3 shadow-2xs hover:shadow-sm"
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Print Ready
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Export print-ready PDF</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            Vectorized PDF wrapper with full quality, perfect for high-grade color printing.
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gold-600 group-hover:translate-x-1 transition-transform mt-1">
                          <span>Simulate Download</span>
                          <Download className="w-3 h-3" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Part 3: Live Sharing Simulation Link */}
                  <div className="border-t border-slate-100 pt-5 flex flex-col gap-3">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Mock Web Invitation Link</span>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-50 border rounded-xl px-3 py-2 flex items-center justify-between text-[11px] font-mono text-slate-600 truncate">
                        <span>
                          https://royal-invites.com/rsvp/{(data.groomName || 'groom').trim().toLowerCase().replace(/\s+/g, '-')}-and-{(data.brideName || 'bride').trim().toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyShareLink}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Social Media Sharing Simulated Shortcuts */}
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {[
                        { name: 'WhatsApp', color: 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200' },
                        { name: 'Telegram', color: 'hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200' },
                        { name: 'Instagram', color: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200' },
                        { name: 'Facebook', color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200' },
                        { name: 'Email', color: 'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200' }
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleSocialShare(item.name)}
                          className={`py-2 px-1 text-[9px] font-bold border border-slate-100 rounded-xl text-slate-500 bg-white transition-all text-center truncate cursor-pointer ${item.color}`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : isExporting ? (
                /* Interactive Compiling Progress bar & state */
                <div className="py-12 flex flex-col items-center justify-center text-center gap-6">
                  <div className="relative flex items-center justify-center">
                    {/* Glowing golden circular loading halo */}
                    <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-gold-500 animate-spin"></div>
                    <div className="absolute text-xs font-mono font-bold text-gold-600">
                      {exportProgress}%
                    </div>
                  </div>

                  <div className="max-w-xs flex flex-col gap-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Compiling Elegant {exportType?.toUpperCase()}...
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed h-12 flex items-center justify-center">
                      {exportStatusText}
                    </p>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="w-full max-w-sm bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-gold-500 to-amber-500 h-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                /* Download Complete & Success State details */
                <div className="py-6 flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center gap-3 bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-md shadow-emerald-200">
                      <Check className="w-6 h-6 stroke-[3px]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wide">Royal Export Complete!</h4>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1">
                        The template has been compiled with ultra high quality configurations.
                      </p>
                    </div>
                  </div>

                  {/* Generated File Metadata */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">Compiled Document Specifications</span>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">File Name</span>
                        <span className="font-mono font-semibold text-slate-700 truncate block">
                          invitation_{data.groomName.toLowerCase().replace(/\s+/g, '_')}_{data.brideName.toLowerCase().replace(/\s+/g, '_')}.{exportType}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">Estimated File Size</span>
                        <span className="font-semibold text-slate-700">
                          {exportType === 'png' ? '3.45 MB' : '1.82 MB'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">Quality Rating</span>
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>300 DPI UHD</span>
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase">Format Standard</span>
                        <span className="font-semibold text-slate-700 uppercase">
                          {exportType === 'png' ? 'Lossless RGB PNG' : 'Vector CMYK PDF'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Options to export again or reset */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={resetExportStates}
                      className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold rounded-xl transition-all text-center cursor-pointer uppercase tracking-wider"
                    >
                      Export New Format
                    </button>
                    <button
                      onClick={() => setIsShareModalOpen(false)}
                      className="flex-1 py-2.5 px-4 bg-gold-500 hover:bg-gold-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all text-center cursor-pointer uppercase tracking-wider"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Royal Wedding Stationery Suite
              </span>
              <button
                onClick={() => {
                  setIsShareModalOpen(false);
                  resetExportStates();
                }}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
