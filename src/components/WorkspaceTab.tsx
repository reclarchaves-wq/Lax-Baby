import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  FileText,
  Table,
  CheckSquare,
  HardDrive,
  Mail,
  Presentation,
  FormInput,
  MessageSquare,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Loader2,
  LogOut,
  FolderOpen,
} from 'lucide-react';
import {
  createGoogleDoc,
  createGoogleSheet,
  createGoogleTask,
  saveTextFileToDrive,
  sendEmailViaGmail,
  createGoogleSlideDeck,
  createGoogleQuizForm,
} from '../services/workspaceService';
import confetti from 'canvas-confetti';

interface WorkspaceTabProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isLoggingIn: boolean;
}

export const WorkspaceTab: React.FC<WorkspaceTabProps> = ({
  user,
  onSignIn,
  onSignOut,
  isLoggingIn,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; link?: string } | null>(null);

  // Form states
  const [docTitle, setDocTitle] = useState('Sir Lax Math & Science Study Notes');
  const [docContent, setDocContent] = useState(
    'Key Lesson Summary:\n- Education is the key for change!\n- Math Formula: 34 x 12 = 408\n- Science: Photosynthesis converts sunlight, water, and air into sugar.'
  );

  const [sheetTitle, setSheetTitle] = useState('Student 3-Envelope Baon Budget');
  const [taskTitle, setTaskTitle] = useState('Review Chapter 4 Math Homework with Sir Lax');
  const [taskNotes, setTaskNotes] = useState('Solve questions 1 to 10 using the mango counting analogy.');

  const [gmailTo, setGmailTo] = useState('');
  const [gmailSubject, setGmailSubject] = useState('Excuse Letter / Study Report for School');
  const [gmailBody, setGmailBody] = useState(
    'Dear Teacher,\n\nPlease excuse my absence yesterday as I was helping my family. I have completed my homework using Chat Sir Lax.\n\nRespectfully,\nStudent'
  );

  const [slideTitle, setSlideTitle] = useState('Science Fair Recycled Bottle Project Presentation');
  const [formTitle, setFormTitle] = useState('Grade 2 Science Quick Quiz on Animals');

  const triggerSuccess = (text: string, link?: string) => {
    setStatusMessage({ type: 'success', text, link });
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
      });
    } catch (_) {}
  };

  // Google Docs Creation with User Confirmation
  const handleCreateDoc = async () => {
    if (!window.confirm(`Create a new Google Doc titled "${docTitle}" in your Google Drive?`)) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await createGoogleDoc(docTitle, docContent);
      triggerSuccess(`Successfully created Google Doc!`, res.url);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to create Google Doc' });
    } finally {
      setLoading(false);
    }
  };

  // Google Sheets Creation with User Confirmation
  const handleCreateSheet = async () => {
    if (!window.confirm(`Create a new Google Spreadsheet titled "${sheetTitle}" in your Google Drive?`)) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      const rows = [
        ['Category', 'Percentage', 'Daily Amount (PHP)', 'Notes'],
        ['Envelope 1: Pamasahe & Lunch (Needs)', '60%', '60.00', 'Daily Jeepney fare and lunch'],
        ['Envelope 2: Study Emergency', '20%', '20.00', 'Photocopies and notebooks'],
        ['Envelope 3: Piggy Bank / Ipon', '20%', '20.00', 'Do not touch - future college fund'],
        ['Total Daily Allowance', '100%', '=SUM(C2:C4)', 'Managed via Sir Lax Budget Rules'],
      ];
      const res = await createGoogleSheet(sheetTitle, rows);
      triggerSuccess(`Successfully created Google Sheet!`, res.url);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to create Google Sheet' });
    } finally {
      setLoading(false);
    }
  };

  // Google Task Creation with User Confirmation
  const handleCreateTask = async () => {
    if (!window.confirm(`Add task "${taskTitle}" to your Google Tasks?`)) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      await createGoogleTask(taskTitle, taskNotes);
      triggerSuccess(`Task "${taskTitle}" added to your Google Tasks list!`);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to create Google Task' });
    } finally {
      setLoading(false);
    }
  };

  // Google Drive File Save with User Confirmation
  const handleSaveToDrive = async () => {
    if (!window.confirm(`Save "${docTitle}.txt" directly to your Google Drive root folder?`)) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await saveTextFileToDrive(docTitle, docContent);
      triggerSuccess(`Saved to Google Drive!`, res.webViewLink);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to save to Google Drive' });
    } finally {
      setLoading(false);
    }
  };

  // Gmail Send with User Confirmation
  const handleSendEmail = async () => {
    if (!gmailTo.trim()) {
      alert('Please enter a recipient email address.');
      return;
    }
    if (!window.confirm(`Send email to "${gmailTo}" with subject "${gmailSubject}" via your Gmail account?`)) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      await sendEmailViaGmail(gmailTo, gmailSubject, gmailBody);
      triggerSuccess(`Email sent successfully via your Gmail account to ${gmailTo}!`);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to send email via Gmail' });
    } finally {
      setLoading(false);
    }
  };

  // Google Slides Creation with User Confirmation
  const handleCreateSlides = async () => {
    if (!window.confirm(`Create a new Google Slides presentation deck titled "${slideTitle}"?`)) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await createGoogleSlideDeck(slideTitle);
      triggerSuccess(`Presentation deck created in Google Slides!`, res.url);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to create Google Slides' });
    } finally {
      setLoading(false);
    }
  };

  // Google Forms Creation with User Confirmation
  const handleCreateForm = async () => {
    if (!window.confirm(`Generate a new Google Form quiz titled "${formTitle}" in your account?`)) {
      return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await createGoogleQuizForm(formTitle);
      triggerSuccess(`Google Form quiz generated!`, res.responderUri);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to create Google Form' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-3 px-3 sm:px-4 space-y-6">
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-sky-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl border-2 border-blue-400/40 relative overflow-hidden">
        <div className="max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white text-blue-900 uppercase tracking-wider shadow-sm">
              <Sparkles size={14} className="text-blue-600 fill-blue-600" /> Google Workspace Integration
            </span>
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/25 text-emerald-200 px-3 py-1 rounded-full border border-emerald-400/30 font-bold">
              <ShieldCheck size={13} /> Official Google OAuth 2.0
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-['Fredoka',sans-serif] tracking-tight text-white drop-shadow-sm">
            Google Workspace Hub for Students &amp; Youth 📂
          </h2>
          <p className="mt-2 text-blue-100 text-xs sm:text-sm font-medium leading-relaxed">
            Connect your Google account with permission to save study notes to <strong>Google Drive</strong>,
            export essays to <strong>Google Docs</strong>, manage your daily allowance in <strong>Google Sheets</strong>,
            track homework deadlines in <strong>Google Tasks</strong>, and send teacher excuse notes via <strong>Gmail</strong>.
          </p>

          {/* Account Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            {user ? (
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={user.displayName || 'Google User'}
                  className="w-11 h-11 rounded-full border-2 border-emerald-400 shadow-sm object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-white">
                      {user.displayName || 'Connected Student'}
                    </span>
                    <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                      Signed In
                    </span>
                  </div>
                  <span className="text-xs text-blue-200">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <HardDrive size={20} className="text-blue-200" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Sign in to Connect Your Google Apps</div>
                  <span className="text-xs text-blue-200">
                    Enables direct 1-click export to Drive, Docs, Sheets, Tasks &amp; Gmail
                  </span>
                </div>
              </div>
            )}

            <div>
              {user ? (
                <button
                  onClick={onSignOut}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-white/30"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={onSignIn}
                  disabled={isLoggingIn}
                  className="gsi-material-button bg-white hover:bg-stone-50 text-stone-900 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md transition transform hover:scale-105 flex items-center gap-2.5 cursor-pointer border border-white"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-blue-600" />
                      <span>Connecting Google Account...</span>
                    </>
                  ) : (
                    <>
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 border-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          {statusMessage.link && (
            <a
              href={statusMessage.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1 shrink-0 shadow-xs"
            >
              <span>Open in Google</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {/* Grid of Workspace Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Google Docs */}
        <div className="bg-white rounded-3xl border-2 border-blue-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <FileText size={26} />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif]">
              Google Docs (Study Notes &amp; Essays)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Export your chat answers, homework explanations, and essays straight into a formatted Google Doc.
            </p>

            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Document Title"
                className="w-full text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                rows={3}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Content text..."
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
              />
            </div>
          </div>

          <button
            onClick={user ? handleCreateDoc : onSignIn}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            <span>{user ? 'Create Google Doc' : 'Sign in to Create Doc'}</span>
          </button>
        </div>

        {/* 2. Google Sheets */}
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Table size={26} />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif]">
              Google Sheets (3-Envelope Budget)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Create an automated spreadsheet with the 3-envelope allowance budgeting formulas (Needs, Emergency, Savings).
            </p>

            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={sheetTitle}
                onChange={(e) => setSheetTitle(e.target.value)}
                placeholder="Spreadsheet Title"
                className="w-full text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="bg-emerald-50 text-emerald-900 text-[11px] p-2.5 rounded-xl font-medium border border-emerald-200">
                📊 Includes pre-configured formulas for 60% daily baon, 20% photocopies, and 20% piggy bank savings!
              </div>
            </div>
          </div>

          <button
            onClick={user ? handleCreateSheet : onSignIn}
            disabled={loading}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            <span>{user ? 'Create Budget Sheet' : 'Sign in to Create Sheet'}</span>
          </button>
        </div>

        {/* 3. Google Tasks */}
        <div className="bg-white rounded-3xl border-2 border-indigo-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
              <CheckSquare size={26} />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif]">
              Google Tasks (Study Checklist)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Add homework assignments, exam prep milestones, and daily review routines directly to your Google Tasks.
            </p>

            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder="Task notes / hints"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={user ? handleCreateTask : onSignIn}
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            <span>{user ? 'Add to Google Tasks' : 'Sign in to Add Task'}</span>
          </button>
        </div>

        {/* 4. Google Drive */}
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <HardDrive size={26} />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif]">
              Google Drive (Cloud Storage)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Save study pack files and notes straight to your Google Drive for safe keeping and offline access.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
              📁 Saves a timestamped <code>[Sir Lax]</code> study file directly to your primary Google Drive root folder.
            </div>
          </div>

          <button
            onClick={user ? handleSaveToDrive : onSignIn}
            disabled={loading}
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <FolderOpen size={14} />}
            <span>{user ? 'Save to Google Drive' : 'Sign in to Use Drive'}</span>
          </button>
        </div>

        {/* 5. Gmail */}
        <div className="bg-white rounded-3xl border-2 border-rose-200 p-5 shadow-xs flex flex-col justify-between hover:border-rose-400 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Mail size={26} />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif]">
              Gmail (Send Excuse Letter / Report)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Send formal excuse notes, homework submissions, or feeding drive reports directly from your Gmail.
            </p>

            <div className="mt-4 space-y-2">
              <input
                type="email"
                value={gmailTo}
                onChange={(e) => setGmailTo(e.target.value)}
                placeholder="Recipient email (e.g. teacher@school.edu)"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              />
              <input
                type="text"
                value={gmailSubject}
                onChange={(e) => setGmailSubject(e.target.value)}
                placeholder="Subject line"
                className="w-full text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <button
            onClick={user ? handleSendEmail : onSignIn}
            disabled={loading}
            className="mt-4 w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            <span>{user ? 'Send via Gmail' : 'Sign in to Use Gmail'}</span>
          </button>
        </div>

        {/* 6. Google Slides & Forms */}
        <div className="bg-white rounded-3xl border-2 border-yellow-200 p-5 shadow-xs flex flex-col justify-between hover:border-yellow-400 transition">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center mb-3">
              <Presentation size={26} />
            </div>
            <h3 className="text-lg font-black text-stone-900 font-['Fredoka',sans-serif]">
              Google Slides &amp; Forms
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Generate presentation slide decks for DIY school projects or Google Form quizzes for student self-testing.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={user ? handleCreateSlides : onSignIn}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Presentation size={14} />
                <span>New Google Slides Deck</span>
              </button>

              <button
                onClick={user ? handleCreateForm : onSignIn}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FormInput size={14} />
                <span>New Google Form Quiz</span>
              </button>
            </div>
          </div>

          <span className="text-[10px] text-stone-400 mt-4 text-center">
            Requires explicit confirmation before creating any file.
          </span>
        </div>
      </div>
    </div>
  );
};
