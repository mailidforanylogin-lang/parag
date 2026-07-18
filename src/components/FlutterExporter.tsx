import React, { useState } from 'react';
import { InvitationData } from '../types';
import { 
  generatePubspecYaml, 
  generateMainDart, 
  generateInvitationModel, 
  generateInvitationViewModel, 
  generateHomeView, 
  generateInvitationCardView, 
  generateLuxuryBorder, 
  generateCountdownTimer, 
  generateRsvpSheet, 
  generateReadme 
} from '../utils/flutterCodeGenerator';
import { Folder, FileCode, Copy, Check, Terminal, Download, ShieldCheck, Heart } from 'lucide-react';

interface FlutterExporterProps {
  data: InvitationData;
}

interface CodeFile {
  name: string;
  path: string;
  generate: (data: InvitationData) => string;
  language: string;
}

export default function FlutterExporter({ data }: FlutterExporterProps) {
  const [selectedFilePath, setSelectedFilePath] = useState('lib/main.dart');
  const [copied, setCopied] = useState(false);

  const files: CodeFile[] = [
    {
      name: 'pubspec.yaml',
      path: 'pubspec.yaml',
      generate: generatePubspecYaml,
      language: 'yaml',
    },
    {
      name: 'main.dart',
      path: 'lib/main.dart',
      generate: generateMainDart,
      language: 'dart',
    },
    {
      name: 'invitation.dart',
      path: 'lib/models/invitation.dart',
      generate: () => generateInvitationModel(),
      language: 'dart',
    },
    {
      name: 'invitation_viewmodel.dart',
      path: 'lib/viewmodels/invitation_viewmodel.dart',
      generate: () => generateInvitationViewModel(),
      language: 'dart',
    },
    {
      name: 'home_view.dart',
      path: 'lib/views/home_view.dart',
      generate: (d) => generateHomeView(d),
      language: 'dart',
    },
    {
      name: 'invitation_card_view.dart',
      path: 'lib/views/invitation_card_view.dart',
      generate: (d) => generateInvitationCardView(d),
      language: 'dart',
    },
    {
      name: 'rsvp_bottom_sheet.dart',
      path: 'lib/views/rsvp_bottom_sheet.dart',
      generate: () => generateRsvpSheet(),
      language: 'dart',
    },
    {
      name: 'luxury_border.dart',
      path: 'lib/widgets/luxury_border.dart',
      generate: () => generateLuxuryBorder(),
      language: 'dart',
    },
    {
      name: 'countdown_timer.dart',
      path: 'lib/widgets/countdown_timer.dart',
      generate: () => generateCountdownTimer(),
      language: 'dart',
    },
    {
      name: 'README.md',
      path: 'README.md',
      generate: generateReadme,
      language: 'markdown',
    },
  ];

  const currentFile = files.find((f) => f.path === selectedFilePath) || files[1];
  const generatedCode = currentFile.generate(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Directory Folder representation for interactive sidebar tree
  const folderStructure = [
    { name: 'Root', type: 'root', open: true },
    { name: 'android/app/', type: 'folder', indent: 1 },
    { name: 'ios/Runner/', type: 'folder', indent: 1 },
    { name: 'assets/audio/', type: 'folder', indent: 1 },
    { name: 'assets/ornaments/', type: 'folder', indent: 1 },
    { name: 'lib/', type: 'folder', indent: 1 },
    { name: 'models/', type: 'folder', indent: 2 },
    { name: 'invitation.dart', type: 'file', path: 'lib/models/invitation.dart', indent: 3 },
    { name: 'viewmodels/', type: 'folder', indent: 2 },
    { name: 'invitation_viewmodel.dart', type: 'file', path: 'lib/viewmodels/invitation_viewmodel.dart', indent: 3 },
    { name: 'views/', type: 'folder', indent: 2 },
    { name: 'home_view.dart', type: 'file', path: 'lib/views/home_view.dart', indent: 3 },
    { name: 'invitation_card_view.dart', type: 'file', path: 'lib/views/invitation_card_view.dart', indent: 3 },
    { name: 'rsvp_bottom_sheet.dart', type: 'file', path: 'lib/views/rsvp_bottom_sheet.dart', indent: 3 },
    { name: 'widgets/', type: 'folder', indent: 2 },
    { name: 'luxury_border.dart', type: 'file', path: 'lib/widgets/luxury_border.dart', indent: 3 },
    { name: 'countdown_timer.dart', type: 'file', path: 'lib/widgets/countdown_timer.dart', indent: 3 },
    { name: 'main.dart', type: 'file', path: 'lib/main.dart', indent: 2 },
    { name: 'pubspec.yaml', type: 'file', path: 'pubspec.yaml', indent: 1 },
    { name: 'README.md', type: 'file', path: 'README.md', indent: 1 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl text-slate-100">
      {/* Exporter header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider text-amber-300">FLUTTER PROJECT EXPORTER</h3>
            <p className="text-[10px] text-slate-400">Clean MVVM + Firebase Source Generator</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Quick Copy Action */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold rounded-lg text-slate-200 transition-all border border-slate-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY ACTIVE FILE</span>
              </>
            )}
          </button>

          {/* Quick Mock ZIP download */}
          <button
            onClick={() => {
              // Creating a simple mock download trigger for readme.md
              const element = document.createElement("a");
              const file = new Blob([generatedCode], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = currentFile.name;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-xs font-bold rounded-lg text-slate-950 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Left Side: Directory tree navigation */}
        <div className="w-full md:w-64 bg-slate-950/80 p-4 overflow-y-auto scrollbar-none flex flex-col gap-1.5 max-h-[300px] md:max-h-none">
          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mb-2 px-1">
            Flutter Project Files
          </div>
          
          <div className="flex flex-col gap-1">
            {folderStructure.map((item, idx) => {
              if (item.type === 'file' || item.type === 'file-special') {
                const isActive = item.path === selectedFilePath;
                return (
                  <button
                    key={idx}
                    onClick={() => item.path && setSelectedFilePath(item.path)}
                    style={{ paddingLeft: `${item.indent * 12}px` }}
                    className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-mono text-left transition-all ${
                      isActive 
                        ? 'bg-amber-500/10 border-l-2 border-amber-500 text-amber-300 font-semibold' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              } else {
                return (
                  <div
                    key={idx}
                    style={{ paddingLeft: `${(item.indent || 0) * 12}px` }}
                    className="flex items-center gap-2 py-1 px-2 text-xs font-mono text-slate-400 font-medium"
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-600" />
                    <span>{item.name}</span>
                  </div>
                );
              }
            })}
          </div>

          {/* Setup tips in footer */}
          <div className="mt-auto pt-6 border-t border-slate-800/60 hidden md:block">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Production Ready</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                This code is fully compatible with <strong>Flutter SDK 3.x</strong>. Live couple names, dates and coordinates are directly pre-compiled into constants.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Code Viewport Box */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {/* Active file tab path bar */}
          <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/80 flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="truncate text-[11px]">{selectedFilePath}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
              {currentFile.language}
            </span>
          </div>

          {/* Actual Code Display block */}
          <div className="flex-1 overflow-auto p-4 md:p-6 text-slate-300 font-mono text-[11px] md:text-xs leading-relaxed select-text select-all">
            <pre className="whitespace-pre scrollbar-none">{generatedCode}</pre>
          </div>

          {/* Wedding Accent Flourish background watermark */}
          <div className="absolute bottom-4 right-4 pointer-events-none opacity-5">
            <Heart className="w-24 h-24 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
