import { InvitationData, TemplatePreset, MusicTrack } from '../types';

export const DEFAULT_INVITATION_DATA: InvitationData = {
  groomName: 'Rahul Sharma',
  brideName: 'Anjali Patil',
  engagementDate: '2026-11-28',
  engagementTime: '11:30 AM',
  venueName: 'The Grand Hyatt Ballroom',
  venueAddress: 'Senapati Bapat Marg, Mumbai, Maharashtra 400055',
  googleMapLink: 'https://maps.google.com/?q=Grand+Hyatt+Mumbai',
  familyDetailsGroom: 'S/o Mr. Suresh & Mrs. Sunita Sharma',
  familyDetailsBride: 'D/o Mr. Madhukar & Mrs. Mangal Patil',
  contactNumber: '+91 98765 43210',
  dressCode: 'Royal Traditional / Pastel Ethnic Wear',
  rsvpDetails: 'Please RSVP by October 30th to Sharma & Patil Families',
  customMessage: 'We request the honor of your presence as we exchange rings and pledge our love forever.',
  language: 'en',
  bgMusicId: 'piano',
  templateId: 'royal-gold',
  primaryColor: '#c59b27',
  secondaryColor: '#fbf8eb',
  couplePhotoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
  backgroundPhotoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  familyPhotoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
  ringPhotoUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
  rsvpFormActive: true,
  weddingWebsiteActive: true,
  weddingWebsiteUrl: 'https://rahulwedsanjali.com'
};

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'piano', name: 'Royal Love (Grand Piano)', url: 'piano', category: 'Western Classical' },
  { id: 'shehnai', name: 'Traditional Shehnai & Sitar', url: 'shehnai', category: 'Traditional Indian' },
  { id: 'flute', name: 'Divine Bansuri Melody', url: 'flute', category: 'Devotional Ambient' },
  { id: 'acoustic', name: 'Infinite Promises (Acoustic Guitar)', url: 'acoustic', category: 'Modern Instrumental' }
];

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    nameMarathi: 'शाही सुवर्ण',
    primaryColor: '#c59b27',
    secondaryColor: '#fbf8eb',
    fontConfig: {
      headerFont: 'font-display',
      bodyFont: 'font-serif',
      accentFont: 'font-script'
    },
    backgroundUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    ringUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    description: 'A magnificent design adorned with fine golden borders, royal crests, and classical serif typography.'
  },
  {
    id: 'traditional-indian',
    name: 'Traditional Indian',
    nameMarathi: 'पारंपारिक भारतीय',
    primaryColor: '#c2410c',
    secondaryColor: '#fef3c7',
    fontConfig: {
      headerFont: 'font-serif',
      bodyFont: 'font-serif',
      accentFont: 'font-script'
    },
    backgroundUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800',
    ringUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
    description: 'Saffron and turmeric shades embellished with beautiful mandalas and traditional oil lamp iconography.'
  },
  {
    id: 'marathi-theme',
    name: 'Marathi Shubh Sakharpuda',
    nameMarathi: 'मराठी शुभ साखरपुडा',
    primaryColor: '#b91c1c',
    secondaryColor: '#fffbeb',
    fontConfig: {
      headerFont: 'font-marathi',
      bodyFont: 'font-serif',
      accentFont: 'font-script'
    },
    backgroundUrl: 'https://images.unsplash.com/photo-1532375811409-905115e345e5?auto=format&fit=crop&q=80&w=800',
    ringUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
    description: 'Featuring traditional Sanai-Choughada elements, auspicious Kalash motif, and ethnic Marathi script text.'
  },
  {
    id: 'floral',
    name: 'Floral Romance',
    nameMarathi: 'पुष्प बहार',
    primaryColor: '#be185d',
    secondaryColor: '#fdf2f8',
    fontConfig: {
      headerFont: 'font-serif',
      bodyFont: 'font-sans',
      accentFont: 'font-script'
    },
    backgroundUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
    ringUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
    description: 'Delicate pink and white floral watercolor frames with romantic, light typography, ideal for pastel themes.'
  },
  {
    id: 'modern-luxury',
    name: 'Modern Luxury',
    nameMarathi: 'आधुनिक भव्यता',
    primaryColor: '#cca521',
    secondaryColor: '#111827',
    fontConfig: {
      headerFont: 'font-display',
      bodyFont: 'font-sans',
      accentFont: 'font-script'
    },
    backgroundUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    ringUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    description: 'A striking dark design with geometry inspired by Art Deco, high-contrast gold text, and sleek lines.'
  },
  {
    id: 'dark-elegant',
    name: 'Dark Midnight Gold',
    nameMarathi: 'मध्यरात्री सुवर्ण',
    primaryColor: '#eab308',
    secondaryColor: '#0f172a',
    fontConfig: {
      headerFont: 'font-display',
      bodyFont: 'font-serif',
      accentFont: 'font-script'
    },
    backgroundUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800',
    ringUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    description: 'Deep navy and charcoal canvas emphasizing radiant gold highlights and delicate starry effects.'
  },
  {
    id: 'minimal-white',
    name: 'Minimalist Ivory',
    nameMarathi: 'शांत हस्तिदंत',
    primaryColor: '#1e293b',
    secondaryColor: '#fafaf9',
    fontConfig: {
      headerFont: 'font-serif',
      bodyFont: 'font-sans',
      accentFont: 'font-script'
    },
    backgroundUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    ringUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    description: 'A clean, modern classic setup using generous white space, delicate dark accents, and beautiful sans-serif fonts.'
  }
];

export const TRANSLATIONS = {
  en: {
    // Editor UI
    appTitle: 'Engagement Invitation Studio',
    subtitle: 'Craft, Preview & Generate Premium Flutter App Invitations',
    home: 'Home',
    builder: 'Builder',
    preview: 'Live Invitation Preview',
    flutterCode: 'Flutter Code Exporter',
    savedDrafts: 'Saved Drafts',
    createNew: 'Create New Invitation',
    groomDetails: 'Groom Details',
    brideDetails: 'Bride Details',
    engagementDetails: 'Engagement Details',
    familyContacts: 'Family & Contacts',
    mediaMusic: 'Media & Audio',
    themeCustomize: 'Theme Customization',
    rsvpConfig: 'RSVP Configuration',
    
    // Form fields
    groomName: "Groom's Full Name",
    brideName: "Bride's Full Name",
    engagementDate: 'Engagement Date',
    engagementTime: 'Engagement Time',
    venueName: 'Venue Name',
    venueAddress: 'Venue Address',
    mapLink: 'Google Maps Location Link',
    familyGroom: "Groom's Family Details (e.g. Parents)",
    familyBride: "Bride's Family Details (e.g. Parents)",
    contactNum: 'Contact Number for RSVP',
    dressCode: 'Dress Code Guideline',
    rsvpNotes: 'RSVP Target Date / Custom Notes',
    customMessage: 'Personal Invitation Message',
    languageSelect: 'Invitation Language',
    musicSelect: 'Background Ambient Tune',
    templateSelect: 'Premium Card Theme',
    primaryColor: 'Primary Color Accent',
    secondaryColor: 'Background/Surface Color',
    weddingWebsiteUrl: 'Wedding/RSVP Website URL',
    enableRsvpForm: 'Include Interactive RSVP Form',
    enableWebsiteLink: 'Include Wedding Website Link',

    // Preview
    countdownTitle: 'Days to Rings Exchange',
    countdownFinished: 'The Celebration Begun!',
    venueLocation: 'Venue Location',
    howToReach: 'How to Reach / View Map',
    rsvpFormTitle: 'Kindly Confirm Your Attendance',
    rsvpName: 'Your Full Name',
    rsvpGuests: 'Number of Guests',
    rsvpStatus: 'Will you attend?',
    rsvpYes: 'Yes, looking forward!',
    rsvpNo: 'Regretfully, No',
    rsvpSubmit: 'Submit Confirmation',
    rsvpSuccess: 'Thank you! Your RSVP has been submitted successfully.',
    draftSaved: 'Draft saved successfully!',
    playMusic: 'Play Ambient Sound',
    pauseMusic: 'Pause Sound',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',

    // Code generator
    architectureTitle: 'Clean Flutter Architecture (MVVM + Provider + Firebase)',
    exportIntro: 'Copy or export the generated code directly to your Flutter project. It is structured into high-quality widgets, views, and viewmodels with state management.',
    viewFile: 'View File Content',
    copyCode: 'Copy Code',
    copied: 'Copied to Clipboard!',
    downloadZip: 'Download Flutter Source ZIP'
  },
  mr: {
    // Editor UI
    appTitle: 'शुभ साखरपुडा निमंत्रण डिझायनर',
    subtitle: 'प्रीमियम साखरपुडा डिजिटल आमंत्रण तयार करा आणि फ्लटर कोड मिळवा',
    home: 'मुख्यपृष्ठ',
    builder: 'आमंत्रण फॉर्म',
    preview: 'डिजिटल आमंत्रण पूर्वावलोकन',
    flutterCode: 'फ्लटर कोड एक्सपोर्टर',
    savedDrafts: 'जतन केलेले मसुदे',
    createNew: 'नवीन आमंत्रण तयार करा',
    groomDetails: 'नवरदेवाचे तपशील',
    brideDetails: 'नवरीचे तपशील',
    engagementDetails: 'साखरपुडा कार्यक्रम तपशील',
    familyContacts: 'कुटुंब आणि संपर्क',
    mediaMusic: 'संगीत आणि मीडिया',
    themeCustomize: 'थीम आणि रंग',
    rsvpConfig: 'RSVP (आर.एस.व्ही.पी) नोंदणी',
    
    // Form fields
    groomName: 'नवरदेवाचे नाव (चि.)',
    brideName: 'नवरीचे नाव (चि.सौ.कां.)',
    engagementDate: 'साखरपुड्याची तारीख',
    engagementTime: 'साखरपुड्याची वेळ',
    venueName: 'कार्यालयाचे नाव / हॉल',
    venueAddress: 'हॉलचा पूर्ण पत्ता',
    mapLink: 'गुगल मॅप्स लोकेशन लिंक',
    familyGroom: 'नवरदेवाचे कौटुंबिक तपशील (उदा. आई-वडील)',
    familyBride: 'नवरीचे कौटुंबिक तपशील (उदा. आई-वडील)',
    contactNum: 'संपर्क क्रमांक (RSVP साठी)',
    dressCode: 'पोशाख (ड्रेस कोड)',
    rsvpNotes: 'RSVP शेवटची तारीख / विशेष नोंद',
    customMessage: 'विशेष निमंत्रण संदेश',
    languageSelect: 'आमंत्रण भाषा',
    musicSelect: 'पार्श्वभूमी संगीत',
    templateSelect: 'प्रीमियम आमंत्रण डिझाइन',
    primaryColor: 'मुख्य रंग',
    secondaryColor: 'पृष्ठभाग रंग',
    weddingWebsiteUrl: 'वेडिंग वेबसाईट लिंक',
    enableRsvpForm: 'आमंत्रणात RSVP फॉर्म समाविष्ट करा',
    enableWebsiteLink: 'वेडिंग वेबसाईट समाविष्ट करा',

    // Preview
    countdownTitle: 'शुभ साखरपुड्याचे उर्वरित दिवस',
    countdownFinished: 'समारंभ सुरू झाला आहे!',
    venueLocation: 'समारंभ स्थळ',
    howToReach: 'गुगल मॅपवर रस्ता पहा',
    rsvpFormTitle: 'कृपया आपली उपस्थिती निश्चित करा',
    rsvpName: 'आपले पूर्ण नाव',
    rsvpGuests: 'एकूण येणारे पाहुणे',
    rsvpStatus: 'आपण उपस्थित राहणार का?',
    rsvpYes: 'होय, नक्कीच येणार!',
    rsvpNo: 'क्षमस्व, येणे जमणार नाही',
    rsvpSubmit: 'उपस्थिती निश्चित करा',
    rsvpSuccess: 'धन्यवाद! आपली RSVP नोंदणी यशस्वीरीत्या जमा झाली आहे.',
    draftSaved: 'मसुदा यशस्वीरीत्या जतन झाला!',
    playMusic: 'संगीत चालू करा',
    pauseMusic: 'संगीत बंद करा',
    days: 'दिवस',
    hours: 'तास',
    minutes: 'मिनिटे',
    seconds: 'सेकंद',

    // Code generator
    architectureTitle: 'स्वच्छ फ्लटर आर्किटेक्चर (MVVM + Provider + Firebase)',
    exportIntro: 'तयार केलेला फ्लटर कोड थेट कॉपी करा. हे प्रोजेक्ट उत्तम दर्जाच्या विजेट्स, व्ह्यूज आणि स्टेट मॅनेजमेंटने सुसज्ज आहे.',
    viewFile: 'फाईल पहा',
    copyCode: 'कोड कॉपी करा',
    copied: 'यशस्वीरीत्या कॉपी केले!',
    downloadZip: 'फ्लटर प्रोजेक्ट झिप डाउनलोड करा'
  }
};
