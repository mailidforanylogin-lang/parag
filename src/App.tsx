import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InvitationData, TemplatePreset, SavedDraft } from './types';
import { DEFAULT_INVITATION_DATA, TEMPLATE_PRESETS, MUSIC_TRACKS, TRANSLATIONS } from './utils/constants';
import InvitationPreview from './components/InvitationPreview';
import FlutterExporter from './components/FlutterExporter';
import { 
  Heart, 
  Sparkles, 
  Plus, 
  Trash2, 
  Settings, 
  Calendar, 
  MapPin, 
  User, 
  Music, 
  Code, 
  Smartphone, 
  CheckCircle, 
  Save, 
  FileText, 
  Layout, 
  ChevronRight, 
  Music4, 
  Languages, 
  PartyPopper,
  Users,
  ExternalLink,
  Copy,
  FolderSync,
  Crop,
  Sliders,
  RotateCw,
  Upload,
  Image
} from 'lucide-react';

export default function App() {
  // Current active draft data
  const [data, setData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [activeTab, setActiveTab] = useState<'creator' | 'code' | 'rsvps'>('creator');
  const [activeMusic, setActiveMusic] = useState<boolean>(false);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string>('default');
  const [editorLang, setEditorLang] = useState<'en' | 'mr'>('en');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live RSVP responses collected in the session/localStorage
  const [rsvpSubmissions, setRsvpSubmissions] = useState<Array<{ name: string; count: number; attending: boolean; date: string }>>([
    { name: 'Shubham Patil', count: 2, attending: true, date: '2026-07-18' },
    { name: 'Neelam & Ramesh Sharma', count: 4, attending: true, date: '2026-07-17' },
    { name: 'Dr. Vikrant Deshmukh', count: 1, attending: false, date: '2026-07-16' },
  ]);

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load saved drafts and RSVPs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wedding_invitation_drafts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedDrafts(parsed);
      } catch (e) {
        console.error('Failed to parse drafts', e);
      }
    } else {
      const defaultDraft: SavedDraft = {
        id: 'default',
        title: 'Rahul & Anjali Sakharpuda',
        updatedAt: new Date().toLocaleDateString(),
        data: DEFAULT_INVITATION_DATA
      };
      setSavedDrafts([defaultDraft]);
      localStorage.setItem('wedding_invitation_drafts', JSON.stringify([defaultDraft]));
    }

    const savedRsvps = localStorage.getItem('wedding_invitation_rsvps');
    if (savedRsvps) {
      try {
        setRsvpSubmissions(JSON.parse(savedRsvps));
      } catch (e) {
        console.error('Failed to parse RSVPs', e);
      }
    }
  }, []);

  // Auto-save Status States
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSaved, setLastSaved] = useState<string>('');

  // Refs for periodic auto-saving without stale closures
  const dataRef = useRef<InvitationData>(data);
  const activeDraftIdRef = useRef<string>(activeDraftId);
  const saveStatusRef = useRef<'saved' | 'saving' | 'dirty'>(saveStatus);
  const prevActiveDraftIdRef = useRef<string>(activeDraftId);

  // Sync refs to avoid re-triggering the timer on state changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    activeDraftIdRef.current = activeDraftId;
  }, [activeDraftId]);

  useEffect(() => {
    saveStatusRef.current = saveStatus;
  }, [saveStatus]);

  // Sync draft edits to active state
  useEffect(() => {
    const hasDraftChanged = prevActiveDraftIdRef.current !== activeDraftId;
    prevActiveDraftIdRef.current = activeDraftId;

    // We only load from savedDrafts if:
    // 1. The active draft ID actually changed (user switched drafts).
    // 2. OR, we are in a 'saved' state (fully synchronized).
    if (hasDraftChanged || saveStatus === 'saved') {
      const active = savedDrafts.find((d) => d.id === activeDraftId);
      if (active) {
        setData(active.data);
      }
      if (hasDraftChanged) {
        setSaveStatus('saved');
      }
    }
  }, [activeDraftId, savedDrafts, saveStatus]);

  // Perform saving action to LocalStorage
  const performSave = useCallback(() => {
    const currentData = dataRef.current;
    const currentDraftId = activeDraftIdRef.current;

    setSaveStatus('saving');

    setSavedDrafts((prev) => {
      const updated = prev.map((draft) => {
        if (draft.id === currentDraftId) {
          return {
            ...draft,
            title: `${currentData.groomName} & ${currentData.brideName}`,
            updatedAt: new Date().toLocaleDateString(),
            data: currentData,
          };
        }
        return draft;
      });
      localStorage.setItem('wedding_invitation_drafts', JSON.stringify(updated));
      return updated;
    });

    // Elegant feedback transition
    setTimeout(() => {
      setSaveStatus('saved');
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  }, []);

  // Periodic Auto-Save Timer (runs every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (saveStatusRef.current === 'dirty') {
        performSave();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [performSave]);

  const handleFieldChange = (field: keyof InvitationData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus('dirty');
  };

  // Auto-arrange logic based on couple's name length for visual balance
  const handleAutoArrange = () => {
    const groomLength = (data.groomName || '').trim().length;
    const brideLength = (data.brideName || '').trim().length;
    const totalLength = groomLength + brideLength;

    // Determine photo frame size based on name length
    let size: 'small' | 'medium' | 'large' = 'medium';
    if (totalLength > 32) {
      size = 'small';
    } else if (totalLength < 18) {
      size = 'large';
    }

    setData((prev) => ({
      ...prev,
      textAlignment: 'center', // Center text elements
      photoFrameSize: size,     // Set photo frame size automatically
    }));

    setSaveStatus('dirty');
    triggerToast(
      `✨ Auto-Arranged: Centered text elements and updated photo frame size to '${size}' based on name length (${totalLength} characters) for visual balance.`
    );
  };

  // Apply visual preset configuration when template changes
  const handleTemplateChange = (presetId: string) => {
    const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setData((prev) => ({
        ...prev,
        templateId: preset.id,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
        backgroundPhotoUrl: preset.backgroundUrl,
        ringPhotoUrl: preset.ringUrl,
      }));
      setSaveStatus('dirty');
      triggerToast(`Applied Preset Theme: ${preset.name}`);
    }
  };

  // Drag and Drop States and Handlers for Image Selection
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        triggerToast('Please upload an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        triggerToast('Image is too large. Max size is 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          handleFieldChange('couplePhotoUrl', result);
          triggerToast('Successfully loaded custom photo!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        triggerToast('Image is too large. Max size is 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          handleFieldChange('couplePhotoUrl', result);
          triggerToast('Successfully loaded custom photo!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create new draft
  const handleCreateNew = () => {
    const newId = `draft-${Date.now()}`;
    const newDraft: SavedDraft = {
      id: newId,
      title: 'New Couple Invitation',
      updatedAt: new Date().toLocaleDateString(),
      data: {
        ...DEFAULT_INVITATION_DATA,
        groomName: 'Groom Name',
        brideName: 'Bride Name',
        engagementDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }
    };
    const updated = [newDraft, ...savedDrafts];
    setSavedDrafts(updated);
    setActiveDraftId(newId);
    localStorage.setItem('wedding_invitation_drafts', JSON.stringify(updated));
    triggerToast('Created a fresh invitation draft!');
  };

  // Delete draft
  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedDrafts.length <= 1) {
      triggerToast('You must keep at least one active draft.');
      return;
    }
    const updated = savedDrafts.filter((d) => d.id !== id);
    setSavedDrafts(updated);
    if (activeDraftId === id) {
      setActiveDraftId(updated[0].id);
    }
    localStorage.setItem('wedding_invitation_drafts', JSON.stringify(updated));
    triggerToast('Draft deleted.');
  };

  // Submit RSVP response inside simulator
  const handleRsvpSubmit = (name: string, count: number, attending: boolean) => {
    const newRsvp = {
      name,
      count,
      attending,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newRsvp, ...rsvpSubmissions];
    setRsvpSubmissions(updated);
    localStorage.setItem('wedding_invitation_rsvps', JSON.stringify(updated));
    triggerToast('RSVP Confirmation Received!');
  };

  // Clear RSVP list
  const handleClearRsvps = () => {
    setRsvpSubmissions([]);
    localStorage.removeItem('wedding_invitation_rsvps');
    triggerToast('Cleared RSVP Guest responses.');
  };

  // Aesthetic image asset selection array
  const aestheticCouplePhotos = [
    { name: 'Traditional Romance', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Pastel Handhold', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sparkling Rings Exchange', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vintage Wedding Decor', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' }
  ];

  // Quick preset color picker helpers
  const premiumAccentColors = [
    { hex: '#c59b27', name: 'Royal Gold' },
    { hex: '#b91c1c', name: 'Saffron Sangeet' },
    { hex: '#c2410c', name: 'Marigold Turmeric' },
    { hex: '#be185d', name: 'Rose Petal' },
    { hex: '#1e293b', name: 'Slate Onyx' },
    { hex: '#0f766e', name: 'Emerald Forest' }
  ];

  const t = TRANSLATIONS[data.language];

  return (
    <div className="min-h-screen bg-[#fafaf6] text-slate-800 font-sans antialiased flex flex-col">
      
      {/* Premium Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-gold-100 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-gold-400/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Luxury Header Bar */}
      <header className="bg-white border-b border-gold-200/40 sticky top-0 z-50 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="relative w-12 h-12 bg-gold-50 border border-gold-300/60 rounded-2xl flex items-center justify-center text-gold-600 shadow-inner">
              <Heart className="w-6 h-6 animate-pulse text-amber-500" />
              <div className="absolute inset-0 border border-gold-400/20 rounded-2xl scale-90"></div>
            </div>
            <div>
              <h1 className="font-display text-lg md:text-xl font-extrabold tracking-wider text-gold-700 flex items-center gap-2 justify-center md:justify-start">
                <span>ENGAGEMENT INVITATION STUDIO</span>
                <span className="text-[10px] bg-amber-100 text-gold-800 px-2 py-0.5 rounded-full font-mono">FLUTTER READY</span>
              </h1>
              <p className="text-xs text-slate-400">Design Royal Digital Wedding Stationery & Generate Clean Dart MVVM Source Code</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Elegant Auto-save Status Indicator */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-500 font-medium select-none">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  saveStatus === 'dirty' ? 'bg-amber-400' : saveStatus === 'saving' ? 'bg-blue-400' : 'bg-emerald-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  saveStatus === 'dirty' ? 'bg-amber-500' : saveStatus === 'saving' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}></span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                {saveStatus === 'dirty' && 'Unsaved changes'}
                {saveStatus === 'saving' && 'Auto-saving...'}
                {saveStatus === 'saved' && (lastSaved ? `Saved ${lastSaved}` : 'Saved')}
              </span>
              {saveStatus === 'dirty' && (
                <button
                  onClick={performSave}
                  title="Save now"
                  className="ml-1 text-gold-600 hover:text-gold-700 hover:bg-gold-50 p-1 rounded-lg transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Creator Language Select */}
            <div className="flex items-center bg-slate-50 border rounded-xl p-1 text-xs font-semibold text-slate-600">
              <span className="px-2 py-1 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                <span>Language:</span>
              </span>
              <button 
                onClick={() => handleFieldChange('language', 'en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${data.language === 'en' ? 'bg-white text-gold-600 shadow-xs font-bold' : 'hover:text-slate-900'}`}
              >
                English
              </button>
              <button 
                onClick={() => handleFieldChange('language', 'mr')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${data.language === 'mr' ? 'bg-white text-gold-600 shadow-xs font-bold' : 'hover:text-slate-900'}`}
              >
                मराठी
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Primary Dashboard Navigation Tabs */}
      <nav className="bg-slate-50 border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-6 flex justify-start items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('creator')}
            id="nav-tab-creator"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'creator'
                ? 'bg-gold-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-800 border border-slate-200 shadow-2xs'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{t.builder} & Live Preview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('code');
              setActiveMusic(false); // Stop simulation music to read code in peace
            }}
            id="nav-tab-code"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-600 hover:text-slate-800 border border-slate-200 shadow-2xs'
            }`}
          >
            <Code className="w-4 h-4 text-amber-500" />
            <span>Generate Flutter Code</span>
          </button>

          <button
            onClick={() => setActiveTab('rsvps')}
            id="nav-tab-rsvps"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'rsvps'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-800 border border-slate-200 shadow-2xs'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>RSVP Submissions ({rsvpSubmissions.length})</span>
          </button>
        </div>
      </nav>

      {/* Main Body Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* TAB 1: DESIGN CREATOR WORKSPACE */}
        {activeTab === 'creator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: EDITOR SETTINGS PANEL (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Drafts Manager Accordion Card */}
              <div className="bg-white rounded-3xl p-5 border border-gold-200/30 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-gold-600" />
                    <h3 className="font-display font-bold text-xs tracking-wider text-slate-700">SAVED WEDDING PROJECTS ({savedDrafts.length})</h3>
                  </div>
                  <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-1 text-[11px] font-bold text-gold-600 hover:text-gold-700 bg-gold-50/60 px-3 py-1.5 rounded-xl border border-gold-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>NEW COUPLE</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {savedDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => {
                        setActiveDraftId(draft.id);
                        triggerToast(`Switched draft to: ${draft.title}`);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                        draft.id === activeDraftId
                          ? 'border-gold-500 bg-gold-50/30 shadow-inner'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 max-w-[80%]">
                        <Heart className={`w-3.5 h-3.5 ${draft.id === activeDraftId ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-300'}`} />
                        <div className="truncate text-xs">
                          <p className="font-bold text-slate-800">{draft.title}</p>
                          <p className="text-[10px] text-slate-400">Updated: {draft.updatedAt}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteDraft(draft.id, e)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Theme Presets Gallery */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Layout className="w-4.5 h-4.5 text-gold-600" />
                  <h3 className="font-display font-bold text-xs tracking-wider text-slate-700">SELECT CARD TEMPLATE PRESET</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TEMPLATE_PRESETS.map((p) => {
                    const isSelected = data.templateId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleTemplateChange(p.id)}
                        className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between aspect-[1.1] cursor-pointer ${
                          isSelected 
                            ? 'border-gold-500 ring-2 ring-gold-100 bg-slate-50' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{p.name}</p>
                          <p className="text-[10px] font-mono mt-0.5 text-slate-400 font-light truncate">{p.nameMarathi}</p>
                        </div>

                        {/* Theme Visual Representation Strip */}
                        <div className="flex items-center gap-1.5 mt-3">
                          <div className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: p.primaryColor }}></div>
                          <div className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: p.secondaryColor }}></div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-gold-500 text-white rounded-full p-0.5 shadow-md">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Form: Customization Accordion */}
              <div className="flex flex-col gap-4">
                
                {/* Accordion 1: Couple Details */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                    <User className="w-4 h-4 text-gold-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.groomDetails} & {t.brideDetails}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.groomName}</label>
                      <input
                        type="text"
                        value={data.groomName}
                        onChange={(e) => handleFieldChange('groomName', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.brideName}</label>
                      <input
                        type="text"
                        value={data.brideName}
                        onChange={(e) => handleFieldChange('brideName', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.customMessage}</label>
                      <textarea
                        rows={2}
                        value={data.customMessage}
                        onChange={(e) => handleFieldChange('customMessage', e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                        placeholder="Invite wording"
                      />
                    </div>
                  </div>
                </div>

                {/* Accordion 2: Date, Time & Google Maps Venue */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.engagementDetails}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.engagementDate}</label>
                      <input
                        type="date"
                        value={data.engagementDate}
                        onChange={(e) => handleFieldChange('engagementDate', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.engagementTime}</label>
                      <input
                        type="text"
                        value={data.engagementTime}
                        onChange={(e) => handleFieldChange('engagementTime', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.venueName}</label>
                      <input
                        type="text"
                        value={data.venueName}
                        onChange={(e) => handleFieldChange('venueName', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.mapLink}</label>
                      <input
                        type="url"
                        value={data.googleMapLink}
                        onChange={(e) => handleFieldChange('googleMapLink', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.venueAddress}</label>
                      <input
                        type="text"
                        value={data.venueAddress}
                        onChange={(e) => handleFieldChange('venueAddress', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Accordion 3: Family details & RSVP contacts */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                    <Users className="w-4 h-4 text-gold-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.familyContacts}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.familyGroom}</label>
                      <input
                        type="text"
                        value={data.familyDetailsGroom}
                        onChange={(e) => handleFieldChange('familyDetailsGroom', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                        placeholder="Groom Parents names"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.familyBride}</label>
                      <input
                        type="text"
                        value={data.familyDetailsBride}
                        onChange={(e) => handleFieldChange('familyDetailsBride', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                        placeholder="Bride Parents names"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.contactNum}</label>
                      <input
                        type="text"
                        value={data.contactNumber}
                        onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.dressCode}</label>
                      <input
                        type="text"
                        value={data.dressCode}
                        onChange={(e) => handleFieldChange('dressCode', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                        placeholder="Royal Traditional / Pastel ethnic"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.rsvpNotes}</label>
                      <input
                        type="text"
                        value={data.rsvpDetails}
                        onChange={(e) => handleFieldChange('rsvpDetails', e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Accordion 4: Music Select & Ambient Settings */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-gold-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.mediaMusic}</h4>
                    </div>

                    {/* Quick play toggle */}
                    <button
                      onClick={() => setActiveMusic(!activeMusic)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeMusic ? 'bg-amber-100 text-gold-700 font-extrabold animate-pulse' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {activeMusic ? 'MIDI SYNTH: PLAYING' : 'MIDI SYNTH: MUTED'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2">{t.musicSelect}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {MUSIC_TRACKS.map((track) => {
                        const isSelected = data.bgMusicId === track.id;
                        return (
                          <button
                            key={track.id}
                            onClick={() => {
                              handleFieldChange('bgMusicId', track.id);
                              setActiveMusic(true); // Auto play newly selected
                              triggerToast(`Loaded: ${track.name}`);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-0.5 cursor-pointer ${
                              isSelected 
                                ? 'border-gold-500 bg-gold-50/20' 
                                : 'border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <Music4 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />
                              {track.name}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">{track.category}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Accordion 5: Theme Colors & Layout */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                    <Settings className="w-4 h-4 text-gold-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.themeCustomize}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.primaryColor}</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={data.primaryColor}
                          onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                          className="w-10 h-10 border rounded-lg cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={data.primaryColor}
                          onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                          className="flex-1 text-xs px-2.5 py-2 border rounded-xl focus:outline-none bg-slate-50 font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">{t.secondaryColor}</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={data.secondaryColor}
                          onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                          className="w-10 h-10 border rounded-lg cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={data.secondaryColor}
                          onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                          className="flex-1 text-xs px-2.5 py-2 border rounded-xl focus:outline-none bg-slate-50 font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Preset Color Accent Palette</label>
                      <div className="flex flex-wrap gap-2">
                        {premiumAccentColors.map((col) => (
                          <button
                            key={col.hex}
                            onClick={() => {
                              handleFieldChange('primaryColor', col.hex);
                              triggerToast(`Selected: ${col.name}`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs transition-all cursor-pointer"
                          >
                            <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: col.hex }}></span>
                            <span className="font-medium text-slate-600">{col.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Accordion 6: Couple Photo Studio & Alignment Lab */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                      <Crop className="w-4.5 h-4.5 text-gold-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">COUPLE PHOTO STUDIO & ALIGNMENT LAB</h4>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Interactive Crop
                    </span>
                  </div>

                  {/* Visual Drag and Drop Upload Area */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                      isDragging 
                        ? 'border-amber-500 bg-amber-50/40 scale-[0.99]' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Drag & Drop Your Couple Photo</p>
                      <p className="text-[10px] text-slate-400">Supports PNG, JPG (Max 5MB)</p>
                      
                      <label className="mt-2 text-[11px] font-bold text-white bg-gold-500 hover:bg-gold-600 px-4 py-2 rounded-xl cursor-pointer transition-all shadow-xs uppercase tracking-wide">
                        Choose From Device
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>

                  {/* Or Custom URL and Presets */}
                  <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Or Paste Custom Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={data.couplePhotoUrl}
                          onChange={(e) => handleFieldChange('couplePhotoUrl', e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="flex-1 text-xs px-3 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-slate-700"
                        />
                        {data.couplePhotoUrl && (
                          <button
                            onClick={() => {
                              handleFieldChange('couplePhotoUrl', '');
                              triggerToast('Cleared photo URL');
                            }}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-xs font-bold transition-all"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pre-selected Presets */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-2">Or Select Elegant Placeholder Gallery</label>
                      <div className="grid grid-cols-2 gap-2">
                        {aestheticCouplePhotos.map((photo) => {
                          const isSelected = data.couplePhotoUrl === photo.url;
                          return (
                            <button
                              key={photo.url}
                              onClick={() => {
                                handleFieldChange('couplePhotoUrl', photo.url);
                                triggerToast(`Updated image to: ${photo.name}`);
                              }}
                              className={`p-1.5 rounded-xl border text-left transition-all overflow-hidden flex gap-2 items-center cursor-pointer ${
                                isSelected ? 'border-gold-500 bg-gold-50/10' : 'border-slate-100 hover:bg-slate-50'
                              }`}
                            >
                              <img src={photo.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="text-[10px] font-bold text-slate-700 leading-tight truncate">{photo.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Cropping and Alignment sliders if a photo is active */}
                  {data.couplePhotoUrl && (
                    <div className="border-t border-slate-100 pt-4 mt-1 flex flex-col gap-4">
                      <div className="flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-gold-600" />
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Alignment & Framing Controls</h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Live studio preview window */}
                        <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 min-h-[220px]">
                          <span className="text-[9px] font-mono font-bold text-slate-400 mb-3 uppercase tracking-wider">
                            Studio Align Preview
                          </span>
                          
                          {/* Render exactly with shape and adjustments */}
                          {(() => {
                            const cropScale = data.photoCropScale ?? 1;
                            const cropX = data.photoCropX ?? 0;
                            const cropY = data.photoCropY ?? 0;
                            const cropRotate = data.photoCropRotate ?? 0;
                            const frameShape = data.photoFrameShape ?? 'rect';

                            const imgStyle = {
                              transform: `scale(${cropScale}) translate(${cropX}%, ${cropY}%) rotate(${cropRotate}deg)`,
                              transformOrigin: 'center center',
                            };

                            if (frameShape === 'circle') {
                              return (
                                <div className="rounded-full overflow-hidden border-2 shadow-sm relative h-36 w-36 bg-white" style={{ borderColor: `${data.primaryColor}60` }}>
                                  <img src={data.couplePhotoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={imgStyle} />
                                </div>
                              );
                            }

                            if (frameShape === 'arch') {
                              return (
                                <div className="rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 shadow-sm relative h-44 w-36 bg-white" style={{ borderColor: `${data.primaryColor}60` }}>
                                  <img src={data.couplePhotoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={imgStyle} />
                                </div>
                              );
                            }

                            if (frameShape === 'heart') {
                              return (
                                <div className="overflow-hidden relative h-36 w-36 bg-white" style={{ clipPath: 'url(#heart-clip)' }}>
                                  <img src={data.couplePhotoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ ...imgStyle, clipPath: 'url(#heart-clip)' }} />
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

                            return (
                              <div className="rounded-2xl overflow-hidden border-2 shadow-sm relative h-36 w-full bg-white" style={{ borderColor: `${data.primaryColor}60` }}>
                                <img src={data.couplePhotoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" style={imgStyle} />
                              </div>
                            );
                          })()}

                          <span className="text-[10px] font-sans text-slate-400 mt-3 font-medium text-center">
                            Shows how the photo appears dynamically on the card
                          </span>
                        </div>

                        {/* Sliders and Shape selectors */}
                        <div className="flex flex-col gap-3">
                          
                          {/* Shape selector */}
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                              Frame Mask & Shape
                            </span>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[
                                { id: 'rect', name: 'Rectangle' },
                                { id: 'circle', name: 'Circle' },
                                { id: 'arch', name: 'Royal Arch' },
                                { id: 'heart', name: 'Heart' },
                              ].map((sh) => {
                                const isSelected = (data.photoFrameShape ?? 'rect') === sh.id;
                                return (
                                  <button
                                    key={sh.id}
                                    onClick={() => {
                                      handleFieldChange('photoFrameShape', sh.id);
                                      triggerToast(`Applied shape frame: ${sh.name}`);
                                    }}
                                    className={`py-1.5 px-1 text-[10px] rounded-lg font-bold border text-center transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'border-gold-500 bg-gold-500 text-white' 
                                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white'
                                    }`}
                                  >
                                    {sh.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Text Layout Alignment */}
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                              Text Alignment
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'left', name: 'Left' },
                                { id: 'center', name: 'Center' },
                                { id: 'right', name: 'Right' },
                              ].map((al) => {
                                const isSelected = (data.textAlignment ?? 'center') === al.id;
                                return (
                                  <button
                                    key={al.id}
                                    onClick={() => {
                                      handleFieldChange('textAlignment', al.id);
                                      triggerToast(`Aligned text to the ${al.name}`);
                                    }}
                                    className={`py-1.5 px-1 text-[10px] rounded-lg font-bold border text-center transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'border-gold-500 bg-gold-500 text-white' 
                                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white'
                                    }`}
                                  >
                                    {al.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Photo Frame Size */}
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                              Photo Frame Size
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'small', name: 'Small' },
                                { id: 'medium', name: 'Medium' },
                                { id: 'large', name: 'Large' },
                              ].map((sz) => {
                                const isSelected = (data.photoFrameSize ?? 'medium') === sz.id;
                                return (
                                  <button
                                    key={sz.id}
                                    onClick={() => {
                                      handleFieldChange('photoFrameSize', sz.id);
                                      triggerToast(`Applied photo frame size: ${sz.name}`);
                                    }}
                                    className={`py-1.5 px-1 text-[10px] rounded-lg font-bold border text-center transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'border-gold-500 bg-gold-500 text-white' 
                                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white'
                                    }`}
                                  >
                                    {sz.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Auto-Arrange Layout Button */}
                          <div className="pt-1 pb-2 border-b border-slate-100">
                            <button
                              onClick={handleAutoArrange}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-600 hover:to-gold-600 active:scale-[0.98] text-white text-[11px] font-extrabold transition-all shadow-md uppercase tracking-wider cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-100 animate-pulse" />
                              <span>Auto-Arrange Layout</span>
                            </button>
                            <p className="text-[9px] text-slate-400 text-center mt-1">
                              Balances alignment and frame size based on couple names length
                            </p>
                          </div>

                          {/* Zoom Scale */}
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                              <span>ZOOM LEVEL</span>
                              <span className="font-mono text-gold-600">{(data.photoCropScale ?? 1).toFixed(1)}x</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="3"
                              step="0.1"
                              value={data.photoCropScale ?? 1}
                              onChange={(e) => handleFieldChange('photoCropScale', parseFloat(e.target.value))}
                              className="w-full accent-gold-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                            />
                          </div>

                          {/* Move X */}
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                              <span>HORIZONTAL ALIGN (X)</span>
                              <span className="font-mono text-gold-600">{data.photoCropX ?? 0}%</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={data.photoCropX ?? 0}
                              onChange={(e) => handleFieldChange('photoCropX', parseInt(e.target.value))}
                              className="w-full accent-gold-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                            />
                          </div>

                          {/* Move Y */}
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                              <span>VERTICAL ALIGN (Y)</span>
                              <span className="font-mono text-gold-600">{data.photoCropY ?? 0}%</span>
                            </div>
                            <input
                              type="range"
                              min="-100"
                              max="100"
                              step="1"
                              value={data.photoCropY ?? 0}
                              onChange={(e) => handleFieldChange('photoCropY', parseInt(e.target.value))}
                              className="w-full accent-gold-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                            />
                          </div>

                          {/* Rotation */}
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                              <span>ROTATE PHOTO</span>
                              <span className="font-mono text-gold-600">{data.photoCropRotate ?? 0}°</span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <input
                                type="range"
                                min="-180"
                                max="180"
                                step="1"
                                value={data.photoCropRotate ?? 0}
                                onChange={(e) => handleFieldChange('photoCropRotate', parseInt(e.target.value))}
                                className="flex-1 accent-gold-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                              />
                              <button
                                onClick={() => handleFieldChange('photoCropRotate', 0)}
                                className="p-1 border hover:bg-slate-50 rounded-lg text-slate-500 transition-all cursor-pointer"
                                title="Reset rotation"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Reset Controls Button */}
                          <button
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                photoCropScale: 1,
                                photoCropX: 0,
                                photoCropY: 0,
                                photoCropRotate: 0,
                                photoFrameShape: 'rect',
                                textAlignment: 'center',
                                photoFrameSize: 'medium'
                              }));
                              setSaveStatus('dirty');
                              triggerToast('Reset alignment controls to default.');
                            }}
                            className="mt-2 py-2 px-3 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl text-[10px] font-bold text-slate-500 text-center hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            RESET ALIGNMENT & FRAME SHAPE
                          </button>

                        </div>

                      </div>
                    </div>
                  )}

                </div>

                {/* Accordion 7: RSVP & Wedding Website url Link */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
                    <Smartphone className="w-4 h-4 text-gold-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.rsvpConfig}</h4>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.enableRsvpForm}</p>
                        <p className="text-[10px] text-slate-400">Inserts interactive guest registration into the layout</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={data.rsvpFormActive}
                        onChange={(e) => handleFieldChange('rsvpFormActive', e.target.checked)}
                        className="w-4 h-4 text-gold-600 accent-gold-500 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.enableWebsiteLink}</p>
                        <p className="text-[10px] text-slate-400">Link RSVP to external wedding website</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={data.weddingWebsiteActive}
                        onChange={(e) => handleFieldChange('weddingWebsiteActive', e.target.checked)}
                        className="w-4 h-4 text-gold-600 accent-gold-500 rounded cursor-pointer"
                      />
                    </div>

                    {data.weddingWebsiteActive && (
                      <div className="mt-2 animate-float">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">{t.weddingWebsiteUrl}</label>
                        <input
                          type="url"
                          value={data.weddingWebsiteUrl}
                          onChange={(e) => handleFieldChange('weddingWebsiteUrl', e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-slate-50 border rounded-xl focus:outline-none text-slate-800 font-mono"
                          placeholder="https://our-wedding-website.com"
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: INTERACTIVE MOBILE CARD PREVIEW (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <InvitationPreview 
                data={data}
                activeMusic={activeMusic}
                setActiveMusic={setActiveMusic}
                onSubmitRsvp={handleRsvpSubmit}
                rsvpSubmissions={rsvpSubmissions}
              />
            </div>

          </div>
        )}

        {/* TAB 2: FLUTTER CODE GENERATOR WINDOW */}
        {activeTab === 'code' && (
          <div className="animate-float">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 text-amber-500" />
                  <span>Flutter Code Exporter (Production Ready)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ready to compile beautiful hybrid Android/iOS wedding invitations! Click files on the left to copy complete widgets, views, and Firebase models.
                </p>
              </div>
              <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100 flex items-center gap-2">
                <FolderSync className="w-4 h-4 text-amber-600 animate-spin" />
                <span className="text-[10px] font-mono font-bold text-slate-500">DYNAMIC VALUES COMPILING ACTIVE</span>
              </div>
            </div>

            <FlutterExporter data={data} />
          </div>
        )}

        {/* TAB 3: RSVP SUBMISSIONS DASHBOARD */}
        {activeTab === 'rsvps' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6 animate-float">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Live RSVP Attendance Dashboard</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Track real-time digital RSVPs from mockup card invitations instantly.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClearRsvps}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Clear Guest Responses
                </button>
              </div>
            </div>

            {/* Attendance Analytics Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl text-center">
                <p className="text-2xl font-bold text-emerald-800">
                  {rsvpSubmissions.filter((r) => r.attending).reduce((sum, r) => sum + r.count, 0)}
                </p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-600 mt-1">Confirmed Guests Attending</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {rsvpSubmissions.length}
                </p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mt-1">Total RSVP Responses</p>
              </div>

              <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl text-center">
                <p className="text-2xl font-bold text-red-800">
                  {rsvpSubmissions.filter((r) => !r.attending).length}
                </p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-red-600 mt-1">Declined Invites</p>
              </div>
            </div>

            {/* RSVPs Table List */}
            {rsvpSubmissions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm font-semibold">No Guest RSVP submissions registered yet.</p>
                <p className="text-xs text-slate-400 mt-1">Use the RSVP form inside the digital mockup preview to register attendees.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Total Pack Count</th>
                      <th className="py-3 px-4">Attending</th>
                      <th className="py-3 px-4">Submission Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {rsvpSubmissions.map((guest, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="py-3 px-4 font-bold text-slate-900">{guest.name}</td>
                        <td className="py-3 px-4 font-mono">{guest.count} {guest.count === 1 ? 'Person' : 'People'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${guest.attending ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {guest.attending ? 'Yes, Confirmed' : 'No, Regret'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">{guest.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Dynamic CSV Simulator / Copy JSON */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-slate-500">RAW JSON EXPORT (SUITABLE FOR FIREBASE IMPORT)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(rsvpSubmissions, null, 2));
                    triggerToast('Copied Raw RSVPs JSON!');
                  }}
                  className="text-[10px] font-bold text-gold-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy raw JSON</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto max-h-24 bg-white p-2.5 rounded-lg border">
                {JSON.stringify(rsvpSubmissions, null, 2)}
              </pre>
            </div>

          </div>
        )}

      </main>

      {/* Elegant Wedding Decorative Footer */}
      <footer className="mt-auto bg-white border-t border-gold-200/40 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-gold-500">
            <div className="h-[1px] w-8 bg-gold-200"></div>
            <Heart className="w-4 h-4 fill-gold-200" />
            <div className="h-[1px] w-8 bg-gold-200"></div>
          </div>
          <p className="font-display font-medium tracking-widest text-gold-600 text-xs">।। शुभ विवाह आणि साखरपुडा सोहळा ।।</p>
          <p>© 2026 Engagement Invitation Studio. All rights reserved. Designed for professional photography studios and couples.</p>
        </div>
      </footer>

    </div>
  );
}
