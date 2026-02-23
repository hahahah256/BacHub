import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  FileText, 
  ExternalLink, 
  ChevronRight,
  LayoutDashboard,
  Youtube,
  PlayCircle,
  X
} from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resumes' | 'explanations'>('dashboard');
  
  // Resumes & Explanations State
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  const CHAPTERS = [
    { 
      id: 'c1', 
      title: 'تركيب البروتين', 
      description: 'دراسة آليات الاستنساخ والترجمة، ودور الأنزيمات والـ ARN في التعبير المورثي.',
      pdfPath: '/resumes/protein_synthesis.pdf', 
      videoUrl: 'https://www.youtube.com/embed/QM92NXQBncg' 
    },
    { 
      id: 'c2', 
      title: 'العلاقة بين بنية ووظيفة البروتين', 
      description: 'كيف يحدد تتابع الأحماض الأمينية البنية الفراغية للبروتين وبالتالي وظيفته.',
      pdfPath: '/resumes/protein_structure.pdf', 
      videoUrl: 'https://www.youtube.com/embed/1tFiEnhSvpc' 
    },
    { 
      id: 'c3', 
      title: 'النشاط الأنزيمي للبروتينات', 
      description: 'دراسة الأنزيمات كوسائط حيوية، تأثير الـ pH والحرارة على نشاطها.',
      pdfPath: '/resumes/enzymes.pdf', 
      videoUrl: 'https://www.youtube.com/embed/3KjRoZxTk9w' 
    },
    { 
      id: 'c4', 
      title: 'دور البروتينات في الدفاع عن الذات (المناعة)', 
      description: 'الاستجابة المناعية الخلطية والخلوية، التعرف على اللاذات (نظام HLA).',
      pdfPath: '/resumes/immunology.pdf', 
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    },
    { 
      id: 'c5', 
      title: 'دور البروتينات في الاتصال العصبي', 
      description: 'النقل المشبكي، كمون الراحة وكمون العمل، وتأثير المخدرات.',
      pdfPath: '/resumes/nerve_communication.pdf', 
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    },
    { 
      id: 'c6', 
      title: 'آليات تحويل الطاقة الضوئية إلى طاقة كيميائية كامنة', 
      description: 'المرحلة الكيموضوئية والكيموحيوية في عملية التركيب الضوئي.',
      pdfPath: '/resumes/photosynthesis.pdf', 
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    },
    { 
      id: 'c7', 
      title: 'آليات تحويل الطاقة الكيميائية الكامنة في الجزيئات العضوية إلى ATP', 
      description: 'دراسة التنفس الخلوي والتخمر كمصدر للطاقة الحيوية.',
      pdfPath: '/resumes/respiration.pdf', 
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    },
    { 
      id: 'c8', 
      title: 'الجيولوجيا', 
      description: 'دراسة بنية الكرة الأرضية، تكتونية الصفائح والظواهر الجيولوجية المرتبطة بها.',
      pdfPath: '/resumes/geology.pdf', 
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" dir="rtl">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg md:rounded-xl text-white">
            <GraduationCap size={20} className="md:w-6 md:h-6" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">Bachub</h1>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg md:rounded-xl overflow-x-auto no-scrollbar">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={18} />}
            label="الرئيسية"
          />
          <NavButton 
            active={activeTab === 'resumes'} 
            onClick={() => setActiveTab('resumes')}
            icon={<FileText size={18} />}
            label="الملخصات"
          />
          <NavButton 
            active={activeTab === 'explanations'} 
            onClick={() => setActiveTab('explanations')}
            icon={<Youtube size={18} />}
            label="الشروحات"
          />
        </div>

        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">المستوى</p>
            <p className="text-xs font-bold text-slate-900">بكالوريا علوم تجريبية</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-3xl font-black text-slate-900">مرحباً بك في Bachub</h2>
                <p className="text-slate-500 font-medium">استعرض ملخصات الدروس ومواضيع البكالوريا السابقة.</p>
              </header>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <BookOpen size={20} className="text-indigo-600" />
                    الفصول الدراسية
                  </h3>
                  <div className="space-y-3">
                    {CHAPTERS.map((chapter) => (
                      <button 
                        key={chapter.id} 
                        onClick={() => {
                          setSelectedChapterId(chapter.id);
                          setActiveTab('resumes');
                        }}
                        className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group transition-all hover:border-indigo-200 hover:shadow-md"
                      >
                        <div className="flex items-center gap-5">
                          <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <BookOpen size={24} />
                          </div>
                          <div className="text-right">
                            <h4 className="font-black text-slate-800 text-lg">{chapter.title}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مادة العلوم الطبيعية</p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <MessageSquare size={20} className="text-indigo-600" />
                    نصيحة اليوم
                  </h3>
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="space-y-4">
                      <p className="font-bold text-slate-900 text-lg leading-relaxed">كيف تراجع مادة العلوم بفعالية؟</p>
                      <div className="p-6 bg-indigo-50 rounded-2xl text-sm text-indigo-900 border border-indigo-100">
                        <p className="font-black mb-2 uppercase tracking-wider text-[10px]">نصيحة منهجية:</p>
                        <p className="leading-relaxed">لا تكتفِ بحفظ المعلومات، بل ركز على فهم الآليات والرسومات التخطيطية. حاول حل تمارين البكالوريا السابقة للتعود على منهجية الإجابة الدقيقة.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'resumes' && (
            <motion.div
              key="resumes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="text-center md:text-right">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">ملخصات الدروس</h2>
                <p className="text-slate-500 font-medium text-sm md:text-base">اختر فصلاً لمراجعة ملخصه بصيغة PDF.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Sidebar Chapters List */}
                <div className="lg:col-span-1 space-y-2 md:space-y-3 max-h-[300px] lg:max-h-none overflow-y-auto pr-1 lg:pr-0">
                  {CHAPTERS.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterId(chapter.id)}
                      className={cn(
                        "w-full text-right p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all flex items-center justify-between group",
                        selectedChapterId === chapter.id 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                      )}
                    >
                      <span className="font-bold text-xs md:text-sm leading-tight">{chapter.title}</span>
                      <ChevronRight size={16} className={cn(
                        "transition-transform shrink-0",
                        selectedChapterId === chapter.id ? "rotate-90" : ""
                      )} />
                    </button>
                  ))}
                </div>

                {/* PDF Viewer Area */}
                <div className="lg:col-span-3">
                  {selectedChapterId ? (
                    <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-[500px] md:h-[700px] flex flex-col">
                      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-black text-slate-900 text-sm md:text-base truncate ml-2">
                          {CHAPTERS.find(c => c.id === selectedChapterId)?.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedChapterId(null)}
                            className="lg:hidden p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                          >
                            <X size={18} />
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                            <ExternalLink size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 bg-slate-100">
                        <iframe 
                          src={CHAPTERS.find(c => c.id === selectedChapterId)?.pdfPath}
                          className="w-full h-full border-none"
                          title={CHAPTERS.find(c => c.id === selectedChapterId)?.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-dashed border-slate-300 h-[300px] md:h-[700px] flex flex-col items-center justify-center text-center p-6 md:p-12">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 text-slate-300 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-4 md:h-6">
                        <FileText size={32} className="md:w-12 md:h-12" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-400">اختر فصلاً للعرض</h3>
                      <p className="text-slate-400 font-medium mt-2 text-xs md:text-base">يرجى اختيار أحد الفصول من القائمة الجانبية لمشاهدة الملخص.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'explanations' && (
            <motion.div
              key="explanations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="text-center md:text-right">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">شروحات الدروس</h2>
                <p className="text-slate-500 font-medium text-sm md:text-base">اختر فصلاً لمشاهدة شرح الفيديو الخاص به.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Sidebar Chapters List */}
                <div className="lg:col-span-1 space-y-2 md:space-y-3 max-h-[300px] lg:max-h-none overflow-y-auto pr-1 lg:pr-0">
                  {CHAPTERS.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterId(chapter.id)}
                      className={cn(
                        "w-full text-right p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all flex items-center justify-between group",
                        selectedChapterId === chapter.id 
                          ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100" 
                          : "bg-white border-slate-200 text-slate-700 hover:border-rose-300"
                      )}
                    >
                      <span className="font-bold text-xs md:text-sm leading-tight">{chapter.title}</span>
                      <ChevronRight size={16} className={cn(
                        "transition-transform shrink-0",
                        selectedChapterId === chapter.id ? "rotate-90" : ""
                      )} />
                    </button>
                  ))}
                </div>

                {/* Video Viewer Area */}
                <div className="lg:col-span-3">
                  {selectedChapterId ? (
                    <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-[400px] md:h-[700px] flex flex-col">
                      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-black text-slate-900 text-sm md:text-base truncate ml-2">
                          {CHAPTERS.find(c => c.id === selectedChapterId)?.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedChapterId(null)}
                            className="lg:hidden p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                          >
                            <X size={18} />
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                            <Youtube size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 bg-black">
                        <iframe 
                          src={CHAPTERS.find(c => c.id === selectedChapterId)?.videoUrl}
                          className="w-full h-full border-none"
                          title={CHAPTERS.find(c => c.id === selectedChapterId)?.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-dashed border-slate-300 h-[300px] md:h-[700px] flex flex-col items-center justify-center text-center p-6 md:p-12">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 text-slate-300 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-4">
                        <PlayCircle size={32} className="md:w-12 md:h-12" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-400">اختر فصلاً للعرض</h3>
                      <p className="text-slate-400 font-medium mt-2 text-xs md:text-base">يرجى اختيار أحد الفصول من القائمة الجانبية لمشاهدة الشرح.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Sub-components
function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all font-black text-xs md:text-sm shrink-0",
        active 
          ? "bg-white text-indigo-600 shadow-sm" 
          : "text-slate-500 hover:text-indigo-500"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{active ? label : ''}</span>
    </button>
  );
}
