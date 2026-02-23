/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Search, 
  FileText, 
  ExternalLink, 
  ChevronRight,
  Loader2,
  Send,
  BrainCircuit,
  LayoutDashboard,
  Library,
  Youtube,
  PlayCircle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { generateExamContent } from './services/geminiService';
import { ExamData, Topic, Question, Resource } from './types';
import { cn } from './lib/utils';

const EXAM_URL = "https://www.dzexams.com/ar/bac/sciences-naturelles/se";

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library'>('dashboard');
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'link'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await generateExamContent(EXAM_URL);
        // Merge extracted data with specific requested videos
        const enrichedData: ExamData = {
          ...data,
          resources: [
            ...(data.resources || []),
            { id: 'v1', title: 'مراجعة شاملة: تركيب البروتين', type: 'video', url: 'https://www.youtube.com/watch?v=QM92NXQBncg' },
            { id: 'v2', title: 'شرح مفصل: الاتصال العصبي', type: 'video', url: 'https://www.youtube.com/watch?v=1tFiEnhSvpc' },
            { id: 'v3', title: 'ملخص المناعة للبكالوريا', type: 'video', url: 'https://www.youtube.com/watch?v=3KjRoZxTk9w' }
          ]
        };
        setExamData(enrichedData);
      } catch (error) {
        console.error("Failed to fetch exam data:", error);
        // Fallback with specific requested data
        setExamData({
          topics: [
            { id: 't1', title: 'تركيب البروتين', description: 'دراسة آليات الاستنساخ والترجمة، ودور الأنزيمات والـ ARN في التعبير المورثي.', category: 'المجال الأول' },
            { id: 't2', title: 'الاتصال العصبي', description: 'النقل المشبكي، كمون الراحة وكمون العمل، وتأثير المخدرات والسموم على المشابك.', category: 'المجال الأول' },
            { id: 't3', title: 'الدفاع عن الذات (المناعة)', description: 'الاستجابة المناعية الخلطية والخلوية، التعرف على اللاذات وفقدان المناعة المكتسبة (VIH).', category: 'المجال الأول' },
            { id: 't4', title: 'التحولات الطاقوية', description: 'التنفس الخلوي، التخمر، والتركيب الضوئي وآليات تحويل الطاقة الكيميائية الكامنة.', category: 'المجال الثاني' }
          ],
          sample_questions: [
            { id: 'q1', text: 'اشرح دور بروتين P53 في تنظيم الانقسام الخلوي وعلاقته بمرض السرطان.', explanation: 'يعمل بروتين P53 كحارس للخلية، حيث يوقف الانقسام في حال وجود خلل في الـ ADN لإصلاحه، وفي حال تعذر الإصلاح يحفز الموت المبرمج للخلية. غيابه أو طفرته يؤدي لتكاثر عشوائي (سرطان).' },
            { id: 'q2', text: 'ما هو تأثير مادة الـ RIP على جزيئات الـ ARN خلال عملية تركيب البروتين؟', explanation: 'مادة الـ RIP هي مادة أنزيمية تكسر الرابطة بين القاعدة الآزوتية أدنين وسكر الريبوز في الـ ARN، مما يؤدي لتوقف عملية تركيب البروتين وموت الخلية.' }
          ],
          resources: [
            { id: 'v1', title: 'مراجعة شاملة: تركيب البروتين', type: 'video', url: 'https://www.youtube.com/watch?v=QM92NXQBncg' },
            { id: 'v2', title: 'شرح مفصل: الاتصال العصبي', type: 'video', url: 'https://www.youtube.com/watch?v=1tFiEnhSvpc' },
            { id: 'v3', title: 'ملخص المناعة للبكالوريا', type: 'video', url: 'https://www.youtube.com/watch?v=3KjRoZxTk9w' },
            { id: 'r1', title: 'موضوع بكالوريا 2024 - علوم طبيعية', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se' },
            { id: 'r2', title: 'الإجابة النموذجية بكالوريا 2023', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se' }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredResources = examData?.resources.filter(r => {
    const title = r.title || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || r.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 p-2 rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">BacHub</h1>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={18} />}
            label="لوحة التحكم"
          />
          <NavButton 
            active={activeTab === 'library'} 
            onClick={() => setActiveTab('library')}
            icon={<Library size={18} />}
            label="المكتبة"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-brand-600 transition-colors">
            <Search size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs">
            JD
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">جاري استخراج مواد الامتحان...</p>
          </div>
        ) : (
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
                  <h2 className="text-3xl font-bold text-slate-900">مرحباً بك مجدداً!</h2>
                  <p className="text-slate-500">إليك ما يحدث في تحضيراتك للبكالوريا.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard title="المواضيع المغطاة" value={examData?.topics.length || 0} icon={<BookOpen className="text-blue-500" />} />
                  <StatCard title="المصادر" value={examData?.resources.length || 0} icon={<FileText className="text-emerald-500" />} />
                  <StatCard title="ساعات الدراسة" value="12.5" icon={<GraduationCap className="text-amber-500" />} />
                </div>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <BookOpen size={20} className="text-brand-600" />
                      مواضيع الامتحان الرئيسية
                    </h3>
                    <div className="space-y-3">
                      {examData?.topics.map((topic) => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic} 
                          onClick={() => setSelectedTopic(topic)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <MessageSquare size={20} className="text-brand-600" />
                      ممارسة سريعة
                    </h3>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      {examData?.sample_questions[0] ? (
                        <div className="space-y-4">
                          <p className="font-medium text-slate-800">{examData.sample_questions[0].text}</p>
                          <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100">
                            <p className="font-bold mb-1">الشرح:</p>
                            {examData.sample_questions[0].explanation}
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">لا توجد أسئلة ممارسة متاحة حالياً.</p>
                      )}
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">مكتبة المصادر</h2>
                    <p className="text-slate-500">جميع موادك الدراسية في مكان واحد.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="بحث في المصادر..."
                        className="w-full sm:w-64 pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select 
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                    >
                      <option value="all">الكل</option>
                      <option value="pdf">ملفات PDF</option>
                      <option value="link">روابط خارجية</option>
                    </select>
                  </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                      <Library className="mx-auto text-slate-300 mb-2" size={48} />
                      <p className="text-slate-500">لم يتم العثور على مصادر تطابق بحثك.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTopic(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">{selectedTopic.category}</span>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedTopic.title}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedTopic(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="rotate-90 text-slate-400" size={24} />
                  </button>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {selectedTopic.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={() => {
                      setActiveTab('library');
                      setSelectedTopic(null);
                    }}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
                  >
                    <Library size={20} />
                    ابحث عن مصادر
                  </button>
                  <button 
                    onClick={() => setSelectedTopic(null)}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
        active ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between card-hover">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center [&_svg]:w-6 [&_svg]:h-6">
        {icon}
      </div>
    </div>
  );
}

function TopicCard({ topic, onClick }: { topic: Topic, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-right bg-white p-4 rounded-xl border border-slate-200 shadow-sm card-hover flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
          <BookOpen size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{topic.title}</h4>
          <p className="text-sm text-slate-500 line-clamp-1">{topic.description}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-300 group-hover:text-brand-600 transition-colors" size={20} />
    </button>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const getIcon = () => {
    switch (resource.type) {
      case 'pdf': return <FileText size={20} />;
      case 'video': return <Youtube size={20} />;
      default: return <ExternalLink size={20} />;
    }
  };

  const getColors = () => {
    switch (resource.type) {
      case 'pdf': return "bg-red-50 text-red-600";
      case 'video': return "bg-rose-50 text-rose-600";
      default: return "bg-blue-50 text-blue-600";
    }
  };

  const getTypeText = () => {
    switch (resource.type) {
      case 'pdf': return "ملف PDF";
      case 'video': return "فيديو تعليمي";
      default: return "رابط خارجي";
    }
  };

  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm card-hover flex flex-col gap-3 group"
    >
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          getColors()
        )}>
          {getIcon()}
        </div>
        <ExternalLink size={16} className="text-slate-300 group-hover:text-brand-600 transition-colors" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{resource.title}</h4>
        <p className="text-xs text-slate-500 font-medium mt-1">{getTypeText()}</p>
      </div>
    </a>
  );
}

