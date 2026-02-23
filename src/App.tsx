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
import { generateExamContent, generateQCMs } from './services/geminiService';
import { ExamData, Topic, Question, Resource } from './types';
import { cn } from './lib/utils';

const EXAM_URL = "https://www.dzexams.com/ar/bac/sciences-naturelles/se";

const INITIAL_EXAM_DATA: ExamData = {
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
    { id: 'r2025', title: 'موضوع بكالوريا 2025 التجريبي - علوم طبيعية', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se', content: '### تفاصيل موضوع بكالوريا 2025 (تجريبي)\n\n**الموضوع الأول:**\n- **التمرين 1 (05 نقاط):** دراسة استهداف أنواع الـ ARN باستعمال مادة الـ RIP وتأثيرها على تركيب البروتين في علاج الأورام السرطانية.\n- **التمرين 2 (07 نقاط):** دراسة الخصائص البنيوية للصانعات الخضراء عند طحالب T.pseudonana وآلية استغلال الـ CO2.\n- **التمرين 3 (08 نقاط):** تأثير مادة الأدينوزين (Ado) على النشاط العصبي ودور مادة الميثيل ثيوبورومين (Mtb) الموجودة في الشاي الأخضر.\n\n**الموضوع الثاني:**\n- **التمرين 1 (05 نقاط):** تحويل الطاقة الكيميائية الكامنة في الغلوكوز وتأثير مادة 2-DG (2-Desoxyglucose).\n- **التمرين 2 (07 نقاط):** نشاط أنزيم SOD (Superoxide dismutase) وعلاقته بمرض التصلب الجانبي الضموري (ALS).\n- **التمرين 3 (08 نقاط):** دراسة نظام الـ ABO والآليات المناعية في تحقيق التسامح المناعي عند نقل الدم.' },
    { id: 'r2024', title: 'موضوع بكالوريا 2024 - علوم طبيعية', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se/2024', content: '### تفاصيل موضوع بكالوريا 2024\n\n**الموضوع الأول:**\n- **التمرين 1:** فيروس VIH وخلايا LT4 وتأثير دواء Zalcitabine.\n- **التمرين 2:** التوازن الشاردي في العصبونات، قنوات الصوديوم الفولطية Scn1a ومرض الصرع.\n- **التمرين 3:** العلاقة بين مادة Benzopyrene وسرطان الرئة ودور بروتين P53.\n\n**الموضوع الثاني:**\n- **التمرين 1:** تأثير المضادات الحيوية (Tetracycline و Oxazolidinone) على مراحل الترجمة.\n- **التمرين 2:** تأثير عامل الظلام ومركب CA1P على نشاط أنزيم Rubisco في نبات الفاصوليا.\n- **التمرين 3:** الاستجابة المناعية الخلطية ضد بكتيريا Staphylococcus aureus ودور بروتين SPA.' },
    { id: 'r2023', title: 'موضوع بكالوريا 2023 - علوم طبيعية', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se/2023', content: '### تفاصيل موضوع بكالوريا 2023\n\n**الموضوع الأول:**\n- **التمرين 1:** دور البروتينات الغشائية في عمل المشابك وتأثير توكسين الكزاز (Tetanus).\n- **التمرين 2:** تأثير دواء ML901 على طفيلي الملاريا (Plasmodium) وعملية تنشيط الأحماض الأمينية.\n- **التمرين 3:** دور أنزيم الأروماتاز ومستقبل الأستراديول في سرطان الثدي وتأثير مادة الكيرستين (Quercetin).\n\n**الموضوع الثاني:**\n- **التمرين 1:** استقرار التسلسل النيكليوتيدي والبنية الفراغية للبروتين.\n- **التمرين 2:** آلية عمل بروتين البرفورين (Perforin) وكيفية حماية خلايا LTc لنفسها.\n- **التمرين 3:** تأثير مبيد الأعشاب DCMU على المرحلة الكيموضوئية في التركيب الضوئي.' },
    { id: 'r2022', title: 'موضوع بكالوريا 2022 - علوم طبيعية', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se/2022', content: '### تفاصيل موضوع بكالوريا 2022\n\n**الموضوع الأول:**\n- **التمرين 1:** دراسة بنية الغشاء الهيولي ودور الغليكوبروتينات في تحديد الذات (نظام HLA و ABO و Rh).\n- **التمرين 2:** الاتصال العصبي، دراسة المشابك التنبيهية (Glutamate) والتثبيطية (GABA) ودور القنوات الفولطية.\n- **التمرين 3:** تأثير المضاد الحيوي الجينتاميسين (Gentamicine) على آلية الترجمة وعلاج مرض انحلال البشرة الفقاعي.\n\n**الموضوع الثاني:**\n- **التمرين 1:** مصدر كمون الراحة ودور مضخة Na+/K+ وتأثير مادة السيانور على إنتاج الـ ATP.\n- **التمرين 2:** دراسة آلية تأثير مادة α-amanitine المستخرجة من فطر أمانيت فالويد على أنزيم ARN بوليميراز.\n- **التمرين 3:** دور الأنزيمات في هضم السليلوز عند الأبقار وتأثير المكمل الغذائي 3-NOP في التقليل من انبعاث غاز الميثان.' },
    { id: 'r2021', title: 'موضوع بكالوريا 2021 - علوم طبيعية', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se/2021', content: '### تفاصيل موضوع بكالوريا 2021\n\n**الموضوع الأول:**\n- **التمرين 1:** مراحل تركيب البروتين (الاستنساخ والترجمة) ومستويات البنية الفراغية.\n- **التمرين 2:** دراسة بنية ووظيفة أنزيم الريبونكلياز (A) وتأثير الـ pH والحرارة على نشاطه.\n- **التمرين 3:** فيروس VIH وتأثيره على خلايا LT4 وفقدان المناعة المكتسبة.\n\n**الموضوع الثاني:**\n- **التمرين 1:** مراحل الاستجابة المناعية النوعية (التعرف، التنشيط، التنفيذ).\n- **التمرين 2:** استثناءات الشفرة الوراثية في كائن Tetrahymena وكيفية استغلالها في العلاج.\n- **التمرين 3:** آلية نقل رسائل الألم وتأثير سم العنكبوت (Psp3TX1) على القنوات الفولطية للكالسيوم.' },
    { id: 'r2020', title: 'موضوع بكالوريا 2020 - علوم طبيعية', type: 'pdf', url: 'https://www.dzexams.com/ar/bac/sciences-naturelles/se/2020', content: '### تفاصيل موضوع بكالوريا 2020\n\n**الموضوع الأول:**\n- **التمرين 1:** البنية الداخلية للكرة الأرضية، المعطيات الزلزالية والانقطاعات (موهو، غوتنبرغ، ليمان).\n- **التمرين 2:** التأثير النوعي المزدوج للأنزيم، دراسة أنزيمات Cox-1 و Cox-2 وتأثير دواء الإيبوبروفان.\n- **التمرين 3:** سرطان الثدي، دور بروتين Her2 وتأثير دواء Trastuzumab (العلاج المناعي).\n\n**الموضوع الثاني:**\n- **التمرين 1:** الانتقاء النسيلي للمفاويات ودور الخلايا العارضة (CPA).\n- **التمرين 2:** تأثير مادة الريسين (Ricin) المستخرجة من بذور الخروع على تركيب البروتين.\n- **التمرين 3:** نضج المشابك المثبطة (GABA) عند المولود الجديد ودور مضخات الكلور (NKCC1 و KCC2).' }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library' | 'qcm'>('dashboard');
  const [examData, setExamData] = useState<ExamData>(INITIAL_EXAM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'link'>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  // QCM State
  const [qcmTopic, setQcmTopic] = useState('');
  const [generatedQCMs, setGeneratedQCMs] = useState<Question[]>([]);
  const [isGeneratingQCM, setIsGeneratingQCM] = useState(false);
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, string>>({});
  const [showQcmResults, setShowQcmResults] = useState(false);

  useEffect(() => {
    // Background update if needed, but don't block
    const updateData = async () => {
      try {
        const data = await generateExamContent(EXAM_URL);
        if (data && data.topics && data.topics.length > 0) {
          setExamData(prev => ({
            ...data,
            resources: [
              ...(data.resources || []),
              ...prev.resources.filter(r => r.type === 'video') // Keep our videos
            ]
          }));
        }
      } catch (error) {
        console.error("Background data update failed:", error);
      }
    };

    updateData();
  }, []);

  const handleGenerateQCM = async () => {
    if (!qcmTopic.trim()) return;
    setIsGeneratingQCM(true);
    setGeneratedQCMs([]);
    setQcmAnswers({});
    setShowQcmResults(false);
    try {
      const questions = await generateQCMs(qcmTopic);
      setGeneratedQCMs(questions);
    } catch (error) {
      console.error("Failed to generate QCMs:", error);
    } finally {
      setIsGeneratingQCM(false);
    }
  };

  const filteredResources = examData?.resources?.filter(r => {
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
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Bachub</h1>
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
          <NavButton 
            active={activeTab === 'qcm'} 
            onClick={() => setActiveTab('qcm')}
            icon={<BrainCircuit size={18} />}
            label="مولد QCM"
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
                      {examData?.topics?.map((topic, index) => (
                        <TopicCard 
                          key={topic.id || `topic-${index}`} 
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
                    filteredResources.map((resource, index) => (
                      <ResourceCard 
                        key={resource.id || `res-${index}`} 
                        resource={resource} 
                        onClick={() => setSelectedResource(resource)}
                      />
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

            {activeTab === 'qcm' && (
              <motion.div
                key="qcm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 max-w-4xl mx-auto"
              >
                <header className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900">مولد أسئلة QCM الذكي</h2>
                  <p className="text-slate-500">أدخل موضوعاً في العلوم الطبيعية وسأقوم بتوليد أسئلة لك.</p>
                </header>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="مثال: تركيب البروتين، المناعة، الاتصال العصبي..."
                      className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-lg"
                      value={qcmTopic}
                      onChange={(e) => setQcmTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerateQCM()}
                    />
                    <button 
                      onClick={handleGenerateQCM}
                      disabled={isGeneratingQCM || !qcmTopic.trim()}
                      className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGeneratingQCM ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                      توليد
                    </button>
                  </div>
                </div>

                {generatedQCMs.length > 0 && (
                  <div className="space-y-6">
                    {generatedQCMs.map((q, qIdx) => (
                      <div key={qIdx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold text-slate-900">{qIdx + 1}. {q.text}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Array.isArray(q.options) && q.options.map((opt, optIdx) => {
                            const letter = String.fromCharCode(65 + optIdx);
                            const isSelected = qcmAnswers[qIdx] === letter;
                            const isCorrect = q.correctAnswer === letter;
                            
                            let bgColor = "bg-slate-50 border-slate-200 hover:border-brand-300";
                            if (showQcmResults) {
                              if (isCorrect) bgColor = "bg-emerald-50 border-emerald-500 text-emerald-700";
                              else if (isSelected) bgColor = "bg-red-50 border-red-500 text-red-700";
                            } else if (isSelected) {
                              bgColor = "bg-brand-50 border-brand-500 text-brand-700";
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => !showQcmResults && setQcmAnswers(prev => ({ ...prev, [qIdx]: letter }))}
                                className={cn(
                                  "text-right p-4 rounded-2xl border-2 transition-all flex items-center gap-4",
                                  bgColor
                                )}
                              >
                                <span className="w-8 h-8 rounded-lg bg-white border border-inherit flex items-center justify-center font-bold shrink-0">
                                  {letter}
                                </span>
                                <span className="font-medium">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        {showQcmResults && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 bg-brand-50 rounded-2xl border border-brand-100 text-brand-800 text-sm"
                          >
                            <p className="font-bold mb-1">التفسير:</p>
                            {q.explanation}
                          </motion.div>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-center pt-4">
                      {!showQcmResults ? (
                        <button 
                          onClick={() => setShowQcmResults(true)}
                          disabled={Object.keys(qcmAnswers).length < generatedQCMs.length}
                          className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                        >
                          تصحيح الإجابات
                        </button>
                      ) : (
                        <button 
                          onClick={handleGenerateQCM}
                          className="px-12 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl"
                        >
                          محاولة مرة أخرى بموضوع جديد
                        </button>
                      )}
                    </div>
                  </div>
                )}
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

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900">{selectedResource.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <ChevronRight className="rotate-90 text-slate-400" size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {selectedResource.content ? (
                  <div className="prose prose-slate max-w-none prose-headings:text-brand-700 prose-p:text-slate-600">
                    <Markdown>{selectedResource.content}</Markdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Search size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">لا يوجد عرض مسبق</h4>
                      <p className="text-slate-500">هذا المصدر متاح فقط عبر الرابط الخارجي.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                <a 
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
                >
                  <ExternalLink size={20} />
                  فتح الرابط الأصلي
                </a>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="py-3 px-6 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  إغلاق
                </button>
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

function ResourceCard({ resource, onClick }: { resource: Resource, onClick?: () => void }) {
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
    <button 
      onClick={onClick}
      className="w-full text-right bg-white p-4 rounded-xl border border-slate-200 shadow-sm card-hover flex flex-col gap-3 group"
    >
      <div className="flex items-center justify-between">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          getColors()
        )}>
          {getIcon()}
        </div>
        <div className="flex items-center gap-2">
          {resource.content && (
            <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold uppercase">متوفر للعرض</span>
          )}
          <ExternalLink size={16} className="text-slate-300 group-hover:text-brand-600 transition-colors" />
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{resource.title}</h4>
        <p className="text-xs text-slate-500 font-medium mt-1">{getTypeText()}</p>
      </div>
    </button>
  );
}

