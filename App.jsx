import React, { useState, useRef } from 'react';
import { 
  Zap, PenTool, Archive, Link as LinkIcon, BarChart2, LogOut, 
  Save, Send, ImagePlus, Smile, Hash, Bot, Calendar, 
  Check, X, ChevronLeft, ChevronRight, Loader2, FileText, BarChart3, Plus 
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const PLATFORM_CONFIG = {
  instagram: { name: 'Instagram', icon: 'fa-brands fa-instagram', color: 'text-[#E1306C]', permissions: 'Read/Write/Analytics' },
  twitter: { name: 'X (Twitter)', icon: 'fa-brands fa-twitter', color: 'text-[#1DA1F2]', permissions: 'Read/Write/Post' },
  facebook: { name: 'Facebook', icon: 'fa-brands fa-facebook', color: 'text-[#1877F2]', permissions: 'Pages & Groups' },
  linkedin: { name: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', color: 'text-[#0077B5]', permissions: 'Page Management' },
  youtube: { name: 'YouTube Studio', icon: 'fa-brands fa-youtube', color: 'text-[#FF0000]', permissions: 'Upload/Analytics' }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentView, setCurrentView] = useState('compose');
  const [drafts, setDrafts] = useState([]);
  const [accounts, setAccounts] = useState({
    instagram: [{ id: 1, username: 'lumiere_official', isActive: true, connectedAt: '12/15/2025' }],
    linkedin: [{ id: 2, username: 'omnistream_corp', isActive: true, connectedAt: '12/10/2025' }],
    twitter: [], youtube: [], facebook: []
  });

  // Modals State
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', desc: '' });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [loginModal, setLoginModal] = useState({ isOpen: false, platform: null });
  const [accountListModal, setAccountListModal] = useState({ isOpen: false, platform: null });

  // Composer State
  const [postText, setPostText] = useState('');
  const [activePlatforms, setActivePlatforms] = useState([]);
  const [media, setMedia] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(null);
  const fileInputRef = useRef(null);

  // --- Actions ---

  const handleLogin = () => setCurrentPage('dashboard');

  const showSuccess = (title, desc) => {
    setSuccessModal({ isOpen: true, title, desc });
    setTimeout(() => setSuccessModal({ isOpen: false, title: '', desc: '' }), 2000);
  };

  const togglePlatform = (p) => {
    setActivePlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setMedia(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveDraft = () => {
    if (!postText && !media) return alert("Empty draft");
    const newDraft = {
      id: Date.now(),
      text: postText,
      media,
      platforms: activePlatforms,
      date: new Date().toLocaleDateString()
    };
    setDrafts(prev => [...prev, newDraft]);
    showSuccess("Draft Saved", "Content secured in mission archives.");
    setPostText(''); setMedia(null); setActivePlatforms([]);
  };

  const handlePublish = () => {
    if (activePlatforms.length === 0) return alert("Select a platform node.");
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      showSuccess("Transmission Complete", `Deployed to ${activePlatforms.length} platforms.`);
      setPostText(''); setMedia(null); setActivePlatforms([]);
    }, 2000);
  };

  const handleResumeDraft = (draft) => {
    setPostText(draft.text);
    setMedia(draft.media);
    setActivePlatforms(draft.platforms);
    setCurrentView('compose');
  };

  // --- Render ---

  if (currentPage === 'login') {
    return (
      <section className="flex h-screen bg-[#020617]">
        <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200" 
               className="object-cover w-full h-full opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
          <div className="absolute bottom-16 left-16 z-10">
            <h1 className="text-6xl font-light tracking-tight text-white">Amplify <span className="font-bold text-blue-500 block mt-2">Your Voice.</span></h1>
            <p className="mt-6 text-slate-300 max-w-lg text-lg leading-relaxed">"The only platform where your narrative synchronizes across the digital universe instantly."</p>
          </div>
        </div>

        <div className="w-full lg:w-2/5 flex flex-col justify-center px-12 lg:px-20 bg-[#020617] relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="mb-12 relative z-10">
            <h2 className="text-4xl font-bold mb-3 text-white">OmniStream</h2>
            <p className="text-slate-400">Enter your command center.</p>
          </div>
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
              <input type="email" defaultValue="admin@omnistream.io" className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 focus:bg-white/10 transition text-white" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Password</label>
              <input type="password" defaultValue="password" className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-blue-500 focus:bg-white/10 transition text-white" />
            </div>
            <button onClick={handleLogin} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition transform active:scale-95">
              Access Dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-white">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-[#020617] flex flex-col justify-between py-8 px-4 z-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2 lg:px-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden lg:block tracking-tight">OmniStream</span>
          </div>

          <nav className="space-y-2 mt-8">
            <NavButton icon={PenTool} label="Composer" active={currentView === 'compose'} onClick={() => setCurrentView('compose')} />
            <NavButton icon={Archive} label="Drafts" active={currentView === 'drafts'} onClick={() => setCurrentView('drafts')} />
            <NavButton icon={LinkIcon} label="Connections" active={currentView === 'connections'} onClick={() => setCurrentView('connections')} />
            <NavButton icon={BarChart2} label="Analytics" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />
          </nav>
        </div>
        <div className="px-2 lg:px-4">
          <button onClick={() => setCurrentPage('login')} className="flex items-center gap-3 text-slate-500 hover:text-red-400 transition w-full">
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:block text-sm font-medium">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-8 lg:p-12">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* COMPOSER VIEW */}
        {currentView === 'compose' && (
          <div className="max-w-7xl mx-auto relative z-10">
            <header className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-4xl font-bold mb-2">Universal Composer</h2>
                <p className="text-slate-400">Create once. Distribute everywhere.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={handleSaveDraft} className="px-6 py-3 bg-white/5 text-slate-300 border border-white/10 font-medium rounded-xl hover:bg-white/10 transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> <span>Save Draft</span>
                </button>
                <button onClick={handlePublish} disabled={isPublishing} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-blue-500 hover:text-white transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-70">
                  {isPublishing ? <><Loader2 className="w-4 h-4 animate-spin"/> Uploading...</> : <><span className="hidden sm:inline">Launch</span><Send className="w-4 h-4" /></>}
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="glass p-6 rounded-3xl">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Target Channels</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['instagram', 'twitter', 'facebook', 'linkedin'].map(p => (
                      <div key={p} onClick={() => togglePlatform(p)} className={cn("glass p-4 rounded-2xl cursor-pointer flex items-center gap-3 transition-all hover:bg-white/5", activePlatforms.includes(p) ? "bg-blue-600/15 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "")}>
                        <i className={`${PLATFORM_CONFIG[p].icon} text-xl ${activePlatforms.includes(p) ? 'text-blue-400' : 'text-slate-400'}`}></i>
                        <span className="text-sm font-medium">{PLATFORM_CONFIG[p].name}</span>
                        <div className={cn("ml-auto w-2 h-2 rounded-full transition-all", activePlatforms.includes(p) ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]" : "bg-slate-700")}></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass p-8 rounded-[40px] relative group">
                  <textarea value={postText} onChange={(e) => setPostText(e.target.value)} className="w-full h-48 bg-transparent border-none outline-none text-xl placeholder-slate-600 resize-none leading-relaxed text-white" placeholder="What's your story today?" />
                  <div onClick={() => fileInputRef.current?.click()} className="mt-4 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 hover:border-blue-500/50 transition cursor-pointer relative overflow-hidden">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
                    {media ? (
                      <div className="relative h-48 w-full"><img src={media} className="h-full w-full object-contain" /><button onClick={(e) => {e.stopPropagation(); setMedia(null)}} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"><X className="w-4 h-4"/></button></div>
                    ) : (
                      <>
                        <ImagePlus className="mx-auto w-8 h-8 text-slate-500 mb-2" />
                        <p className="text-sm text-slate-400">Drop Images or 4K Video here</p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                    <div className="flex gap-4">
                      <button className="text-slate-400 hover:text-blue-400 transition"><Smile className="w-5 h-5"/></button>
                      <button className="text-slate-400 hover:text-blue-400 transition"><Hash className="w-5 h-5"/></button>
                      <button className="text-slate-400 hover:text-blue-400 transition"><Bot className="w-5 h-5"/></button>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{postText.length} chars</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="glass p-6 rounded-3xl">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                      <span className="text-sm font-medium">Post Type</span>
                      <select className="bg-[#020617] border border-white/10 rounded-lg text-xs px-2 py-1 outline-none text-white"><option>Standard Post</option><option>Reel / Short</option></select>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                      <span className="text-sm font-medium">Schedule</span>
                      <button onClick={() => setCalendarOpen(true)} className="bg-[#020617] border border-white/10 rounded-lg text-xs px-3 py-2 outline-none text-slate-400 hover:border-blue-500 transition flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> <span>{scheduleDate ? scheduleDate : 'Select Date'}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="glass-high-contrast p-6 rounded-3xl border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500"></div><div><p className="text-xs font-bold">Preview (Instagram)</p><p className="text-[10px] text-slate-400">tanishq_official</p></div></div>
                  <div className="aspect-square bg-black/50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">{media ? <img src={media} className="w-full h-full object-cover" /> : <span className="text-xs text-slate-600">Media Preview</span>}</div>
                  <div className="space-y-2">{postText ? <p className="text-xs text-slate-300 line-clamp-3">{postText}</p> : <><div className="h-2 bg-white/10 rounded w-3/4"></div><div className="h-2 bg-white/10 rounded w-1/2"></div></>}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DRAFTS VIEW */}
        {currentView === 'drafts' && (
          <div className="max-w-7xl mx-auto relative z-10">
             <header className="mb-10"><h2 className="text-4xl font-bold mb-2">Campaign Archives</h2><p className="text-slate-400">Work in progress and saved concepts.</p></header>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.length === 0 ? (
                   <div className="glass p-12 rounded-3xl text-center flex flex-col items-center justify-center col-span-full opacity-50 border-dashed border border-white/10">
                      <Archive className="w-12 h-12 text-slate-500 mb-4" /><h3 className="text-lg font-bold">No Drafts Found</h3><p className="text-sm text-slate-400">Save your work in the composer to see it here.</p>
                   </div>
                ) : drafts.map(draft => (
                   <div key={draft.id} className="glass p-6 rounded-3xl relative group hover:border-blue-500/50 transition">
                      <div className="absolute top-4 right-4 text-xs text-slate-500">{draft.date}</div>
                      <div className="h-40 w-full rounded-2xl bg-white/5 mb-4 flex items-center justify-center overflow-hidden">{draft.media ? <img src={draft.media} className="w-full h-full object-cover opacity-80" /> : <FileText className="text-slate-600" />}</div>
                      <p className="text-sm text-slate-300 line-clamp-2 mb-4 h-10">{draft.text || 'No text content'}</p>
                      <button onClick={() => handleResumeDraft(draft)} className="w-full py-2 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition">Resume</button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* CONNECTIONS VIEW */}
        {currentView === 'connections' && (
           <div className="max-w-7xl mx-auto relative z-10">
              <header className="mb-10"><h2 className="text-4xl font-bold mb-2">API Gateway</h2><p className="text-slate-400">Manage OAuth tokens and permission scopes.</p></header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Object.keys(PLATFORM_CONFIG).map(key => {
                    const accts = accounts[key] || [];
                    const isActive = accts.length > 0;
                    return (
                       <div key={key} onClick={() => !isActive ? setLoginModal({isOpen: true, platform: key}) : setAccountListModal({isOpen: true, platform: key})} className={`glass p-8 rounded-3xl border-t-4 relative overflow-hidden group cursor-pointer ${isActive ? 'border-emerald-500' : 'border-slate-700 opacity-80 hover:opacity-100'}`}>
                          <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}><div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>{isActive ? 'Active' : 'Inactive'}</div>
                          <i className={`${PLATFORM_CONFIG[key].icon} text-4xl mb-6 ${isActive ? 'text-white' : 'text-slate-500'}`}></i>
                          <h3 className={`text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>{PLATFORM_CONFIG[key].name}</h3>
                          <p className="text-xs text-slate-400 mb-6">Permission: {isActive ? PLATFORM_CONFIG[key].permissions : 'Not Granted'}</p>
                          <button className={`w-full py-3 rounded-xl text-sm font-medium ${isActive ? 'bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>{isActive ? 'Manage / Revoke' : 'Connect via OAuth'}</button>
                       </div>
                    )
                 })}
              </div>
           </div>
        )}

        {/* ANALYTICS VIEW */}
        {currentView === 'analytics' && (
           <div className="max-w-7xl mx-auto relative z-10">
              <header className="mb-10"><h2 className="text-4xl font-bold mb-2">Global Impact</h2><p className="text-slate-400">Real-time engagement metrics.</p></header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <StatCard label="Total Reach" value="1.2M" trend="+12.4%" good={true} />
                 <StatCard label="Engagement" value="48.5K" trend="+5.2%" good={true} />
                 <StatCard label="Link Clicks" value="8.2K" trend="-2.1%" good={false} />
                 <StatCard label="New Followers" value="1,402" trend="+0.8%" good={true} />
              </div>
              <div className="glass p-8 rounded-3xl h-96 flex items-center justify-center border-dashed border border-white/10"><div className="text-center"><BarChart3 className="w-12 h-12 text-slate-700 mx-auto mb-4" /><p className="text-slate-500">Visualization Module Loading...</p></div></div>
           </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* Success Modal */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
           <div className="bg-[#020617] border border-emerald-500/30 p-8 rounded-3xl shadow-2xl text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-emerald-500" /></div>
              <h3 className="text-2xl font-bold text-white mb-2">{successModal.title}</h3>
              <p className="text-slate-400">{successModal.desc}</p>
           </div>
        </div>
      )}

      {/* Simple Calendar Modal */}
      {calendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="glass-high-contrast p-6 rounded-3xl w-[350px]">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Pick Date</h3><button onClick={() => setCalendarOpen(false)}><X className="w-5 h-5"/></button></div>
              <input type="datetime-local" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white mb-4" onChange={(e) => setScheduleDate(e.target.value)} />
              <button onClick={() => setCalendarOpen(false)} className="w-full py-3 bg-blue-600 rounded-xl font-bold">Confirm</button>
           </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModal.isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass-high-contrast p-8 rounded-3xl w-full max-w-md">
               <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Connect {PLATFORM_CONFIG[loginModal.platform]?.name}</h3><button onClick={() => setLoginModal({isOpen: false, platform: null})}><X/></button></div>
               <div className="space-y-4">
                  <input type="text" placeholder="Username" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-white" />
                  <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-white" />
                  <button onClick={() => {
                     const newAcc = { id: Date.now(), username: 'demo_user', isActive: true, connectedAt: 'Just now' };
                     setAccounts(prev => ({...prev, [loginModal.platform]: [...prev[loginModal.platform], newAcc]}));
                     setLoginModal({isOpen: false, platform: null});
                     showSuccess("Connected", "Account linked successfully");
                  }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg">Connect Account</button>
               </div>
            </div>
         </div>
      )}

      {/* Account List Modal */}
      {accountListModal.isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass-high-contrast p-8 rounded-3xl w-full max-w-md">
               <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Manage Accounts</h3><button onClick={() => setAccountListModal({isOpen: false, platform: null})}><X/></button></div>
               <div className="space-y-3 mb-6">
                  {accounts[accountListModal.platform]?.map(acc => (
                     <div key={acc.id} className="glass p-4 rounded-2xl flex justify-between items-center">
                        <span className="font-bold">{acc.username}</span>
                        <button onClick={() => {
                           setAccounts(prev => ({...prev, [accountListModal.platform]: prev[accountListModal.platform].filter(a => a.id !== acc.id)}));
                           if(accounts[accountListModal.platform].length <= 1) setAccountListModal({isOpen: false, platform: null});
                        }} className="text-red-400 text-xs">Logout</button>
                     </div>
                  ))}
               </div>
               <button onClick={() => { setAccountListModal({isOpen: false}); setLoginModal({isOpen: true, platform: accountListModal.platform}); }} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> Add Another</button>
            </div>
         </div>
      )}

    </div>
  );
}

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-xl transition group", active ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" : "text-slate-400 hover:text-white hover:bg-white/5")}>
    <Icon className={cn("w-5 h-5 transition", active ? "" : "group-hover:text-blue-400")} />
    <span className="hidden lg:block font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, good }) => (
  <div className="glass p-6 rounded-3xl">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-end gap-2"><span className="text-3xl font-bold">{value}</span><span className={`text-xs font-bold mb-1 ${good ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</span></div>
  </div>
);