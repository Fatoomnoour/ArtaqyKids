// Style reminder: Follow the «حديقة هادئة» direction—calm editorial RTL composition, mint circular motifs, deep teal hierarchy, and clear parent-first conversion paths.

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  Instagram,
  Languages,
  MapPin,
  Menu,
  MessageCircle,
  Palette,
  Baby,
  BookMarked,
  Bus,
  CalendarClock,
  FileText,
  Gamepad2,
  GraduationCap,
  HelpCircle,
  MapPinned,
  UsersRound,
  Phone,
  Send,
  Sparkles,
  Star,
  X,
  Facebook,
  ThumbsUp,
  ThumbsDown,
  Share2,
} from "lucide-react";
import { SITE_DATA, PROGRAMS, FAQS, BLOG_POSTS } from "@/lib/siteData";
import { trpc } from "@/lib/trpc";

const ASSETS = {
  hero: "/manus-storage/artaqy-hero_5d908a17.jpg",
  activity: "/manus-storage/artaqy-activity_eac203fb.jpg",
  space: "/manus-storage/artaqy-space_18c2ca43.jpg",
  childBook: "/manus-storage/artaqy-child-book_6602b9cc.jpg",
  mark: "/manus-storage/artaqy-mark_a50de34e.png",
};

const iconMap = {
  sparkles: Sparkles,
  orbit: Heart,
  book: BookOpen,
  language: Languages,
  palette: Palette,
  heart: Heart,
};

const faqIconMap = {
  age: Baby,
  hours: CalendarClock,
  english: Languages,
  curriculum: GraduationCap,
  activities: Gamepad2,
  visit: CalendarDays,
  location: MapPinned,
  followup: UsersRound,
  documents: FileText,
  transport: Bus,
};

type FaqRecord = { question: string; answer: string; icon: string; category: string };

const faqCategories = [
  { id: "all", label: "كل الأسئلة" },
  { id: "registration", label: "التسجيل" },
  { id: "programs", label: "البرامج" },
  { id: "day", label: "اليوم الدراسي" },
  { id: "location", label: "الموقع والتواصل" },
] as const;

const FAQ_CATEGORY_STORAGE_KEY = "artaqy-kids-faq-category";
const FAQ_SEARCH_STORAGE_KEY = "artaqy-kids-faq-search";
const FAQ_OPEN_STORAGE_KEY = "artaqy-kids-faq-open";
const FAQ_FEEDBACK_STORAGE_KEY = "artaqy-kids-faq-feedback";
const FAQ_FEEDBACK_NOTES_STORAGE_KEY = "artaqy-kids-faq-feedback-notes";
const getInitialFaqCategory = (): (typeof faqCategories)[number]["id"] => {
  try {
    const stored = window.localStorage.getItem(FAQ_CATEGORY_STORAGE_KEY);
    return faqCategories.some((category) => category.id === stored) ? (stored as (typeof faqCategories)[number]["id"]) : "all";
  } catch {
    return "all";
  }
};

const getInitialFaqSearch = () => {
  try {
    return window.localStorage.getItem(FAQ_SEARCH_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

const getInitialFaqFeedback = (): Record<string, "yes" | "no"> => {
  try {
    const stored = window.sessionStorage.getItem(FAQ_FEEDBACK_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        return Object.fromEntries(Object.entries(parsed).filter(([question, value]) => FAQS.some((item) => item.question === question) && (value === "yes" || value === "no"))) as Record<string, "yes" | "no">;
      }
    }
  } catch {
    // Ignore session storage failures so feedback controls remain available.
  }
  return {};
};

const getInitialFaqFeedbackNotes = (): Record<string, string> => {
  try {
    const stored = window.sessionStorage.getItem(FAQ_FEEDBACK_NOTES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        return Object.fromEntries(Object.entries(parsed).filter(([question, value]) => FAQS.some((item) => item.question === question) && typeof value === "string")) as Record<string, string>;
      }
    }
  } catch {
    // Ignore session storage failures so note-taking remains optional.
  }
  return {};
};

const getInitialOpenFaqs = () => {
  try {
    const stored = window.sessionStorage.getItem(FAQ_OPEN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.filter((question): question is string => typeof question === "string" && FAQS.some((item) => item.question === question));
    }
  } catch {
    // Ignore session storage failures and use the first FAQ as the initial open item.
  }
  return FAQS[0]?.question ? [FAQS[0].question] : [];
};

function getFaqAnswerExcerpt(answer: string, maxLength = 120) {
  return answer.length > maxLength ? `${answer.slice(0, maxLength).trim()}…` : answer;
}

function highlightFaqAnswer(text: string, query: string): ReactNode {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const normalizedText = text.toLocaleLowerCase("ar");
  const normalizedQuery = trimmedQuery.toLocaleLowerCase("ar");
  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery);
  let matchNumber = 0;

  while (matchIndex !== -1) {
    if (matchIndex > cursor) parts.push(text.slice(cursor, matchIndex));
    parts.push(<mark className="faq-highlight" key={`faq-match-${matchNumber}`}>{text.slice(matchIndex, matchIndex + trimmedQuery.length)}</mark>);
    cursor = matchIndex + trimmedQuery.length;
    matchNumber += 1;
    matchIndex = normalizedText.indexOf(normalizedQuery, cursor);
  }

  if (!parts.length) return text;
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<string[]>(getInitialOpenFaqs);
  const [faqFeedback, setFaqFeedback] = useState<Record<string, "yes" | "no">>(getInitialFaqFeedback);
  const [faqFeedbackNotes, setFaqFeedbackNotes] = useState<Record<string, string>>(getInitialFaqFeedbackNotes);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [copiedFaq, setCopiedFaq] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState(getInitialFaqSearch);
  const [faqCategory, setFaqCategory] = useState<(typeof faqCategories)[number]["id"]>(getInitialFaqCategory);
  const [whatsappNotice, setWhatsappNotice] = useState(false);
  const { data: managedFaqs } = trpc.faq.listPublished.useQuery();
  const faqItems: readonly FaqRecord[] = managedFaqs?.length
    ? managedFaqs.map((item) => ({ question: item.question, answer: item.answer, icon: item.icon, category: item.category }))
    : FAQS;

  useEffect(() => {
    try {
      window.localStorage.setItem(FAQ_CATEGORY_STORAGE_KEY, faqCategory);
      window.localStorage.setItem(FAQ_SEARCH_STORAGE_KEY, faqSearch);
    } catch {
      // Ignore storage failures so FAQ filtering remains available in private browsing modes.
    }
  }, [faqCategory, faqSearch]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(FAQ_OPEN_STORAGE_KEY, JSON.stringify(openFaqs));
    } catch {
      // Ignore session storage failures so FAQ interaction remains available.
    }
  }, [openFaqs]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(FAQ_FEEDBACK_STORAGE_KEY, JSON.stringify(faqFeedback));
      window.sessionStorage.setItem(FAQ_FEEDBACK_NOTES_STORAGE_KEY, JSON.stringify(faqFeedbackNotes));
    } catch {
      // Ignore session storage failures so feedback remains available for the current view.
    }
  }, [faqFeedback, faqFeedbackNotes]);
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const childAge = String(form.get("childAge") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (!name || !phone || !childAge) {
      setFormState("error");
      return;
    }
    const whatsappText = `مرحبًا حضانة أرتقي، أرغب في حجز زيارة.\nالاسم: ${name}\nرقم الهاتف: ${phone}\nعمر الطفل: ${childAge}${message ? `\nالاستفسار: ${message}` : ""}`;
    const whatsappUrl = `${SITE_DATA.contact.whatsappBase}?text=${encodeURIComponent(whatsappText)}`;
    setFormState("success");
    event.currentTarget.reset();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const closeMenu = () => setMenuOpen(false);
  const normalizedFaqSearch = faqSearch.trim().toLocaleLowerCase("ar");
  const categoryFilteredFaqs = faqItems.filter((item) => faqCategory === "all" || item.category === faqCategory);
  const filteredFaqs = categoryFilteredFaqs.filter((item) => `${item.question} ${item.answer}`.toLocaleLowerCase("ar").includes(normalizedFaqSearch));
  const firstFilteredFaqQuestion = filteredFaqs[0]?.question ?? "";
  useEffect(() => {
    if (!normalizedFaqSearch || !firstFilteredFaqQuestion) return;
    const timer = window.setTimeout(() => {
      const target = Array.from(document.querySelectorAll<HTMLElement>("[data-faq-question]"))
        .find((node) => node.dataset.faqQuestion === firstFilteredFaqQuestion);
      target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }, 90);
    return () => window.clearTimeout(timer);
  }, [normalizedFaqSearch, firstFilteredFaqQuestion]);
  const allFaqsOpen = filteredFaqs.length > 0 && filteredFaqs.every((item) => openFaqs.includes(item.question));
  const faqCountLabel = `${filteredFaqs.length} ${filteredFaqs.length === 1 ? "سؤال" : "أسئلة"}`;
  useEffect(() => {
    if (!firstFilteredFaqQuestion) return;
    setOpenFaqs((current) => current.includes(firstFilteredFaqQuestion) ? current : [...current, firstFilteredFaqQuestion]);
  }, [faqCategory, normalizedFaqSearch, firstFilteredFaqQuestion]);

  const handleQuestionWhatsApp = () => setWhatsappNotice(true);
  const handleFaqFeedback = (question: string, value: "yes" | "no") => {
    setFaqFeedback((current) => ({ ...current, [question]: value }));
    if (value === "yes") setFaqFeedbackNotes((current) => { const { [question]: _removed, ...rest } = current; return rest; });
    setFeedbackNotice(question);
    window.setTimeout(() => setFeedbackNotice((current) => current === question ? null : current), 2200);
  };
  const handleFaqFeedbackNote = (question: string, note: string) => setFaqFeedbackNotes((current) => ({ ...current, [question]: note }));
  const handleShareFaq = async (item: FaqRecord) => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${item.icon}`;
    const shareText = `${item.question}\n${item.answer}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.question, text: shareText, url });
        setShareNotice("تم فتح خيارات المشاركة.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedFaq(item.question);
        setShareNotice("تم نسخ رابط الإجابة.");
        window.setTimeout(() => setCopiedFaq((current) => current === item.question ? null : current), 2400);
      } else {
        throw new Error("share-unavailable");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      window.open(`${SITE_DATA.contact.whatsappBase}?text=${encodeURIComponent(`${shareText}\n${url}`)}`, "_blank", "noopener,noreferrer");
      setShareNotice("تم تجهيز مشاركة الإجابة عبر واتساب.");
    }
    window.setTimeout(() => setShareNotice(null), 2600);
  };
  const handleShowAllFaqs = () => {
    setFaqCategory("all");
    setFaqSearch("");
    setOpenFaqs(faqItems[0]?.question ? [faqItems[0].question] : []);
  };
  const handleToggleAllFaqs = () => setOpenFaqs(allFaqsOpen ? [] : filteredFaqs.map((item) => item.question));
  const faqToggleLabel = `${allFaqsOpen ? "طي" : "فتح"} ${faqCountLabel}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.filter((item) => !item.answer.startsWith("TODO")).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="site-shell" dir="rtl">
      <div className="topline">
        <div className="container topline-inner">
          <span><span className="topline-accent">أرتقي</span> — مساحة آمنة لبدايات كبيرة</span>
          <span>دمياط الجديدة • جامعة دمياط • شارع المكتبة • خلف مزايا</span>
        </div>
      </div>

      <header className="navbar">
        <div className={`container nav-inner${menuOpen ? " menu-open" : ""}`}>
          <a className="brand" href="#الرئيسية" aria-label="العودة إلى الصفحة الرئيسية" onClick={closeMenu}>
            <img className="brand-mark" src={ASSETS.mark} alt="رمز أرتقي" />
            <span className="brand-wordmark"><strong>حضانة أرتقي</strong><span>Artaqy Kids</span></span>
          </a>
          <nav className="nav-links" aria-label="التنقل الرئيسي">
            <a className="nav-link" href="#من-نحن" onClick={closeMenu}>من نحن</a>
            <a className="nav-link" href="#البرامج" onClick={closeMenu}>البرامج</a>
            <a className="nav-link" href="#يوم-الطفل" onClick={closeMenu}>يوم الطفل</a>
            <a className="nav-link" href="#المعرض" onClick={closeMenu}>المعرض</a>
            <a className="nav-link" href="#الأسئلة" onClick={closeMenu}>الأسئلة الشائعة</a>
          </nav>
          <div className="nav-actions">
            <a className="button-primary button-small" href="#تواصل" onClick={closeMenu}>احجز زيارة <ArrowLeft size={15} /></a>
            <button className="menu-button" aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <section id="الرئيسية" className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="hero-kicker"><span /> حضانة أرتقي • دمياط الجديدة</span>
              <h1>أول خطواته… <em>تستحق</em> مكانًا يطمئنك.</h1>
              <p className="hero-description">مسيرة تعليمية راقية من بداية حياة الطفل؛ رعاية دافئة، بيئة آمنة، وبدايات تساعده على اكتشاف العالم بثقة.</p>
              <div className="hero-actions">
                <a className="button-primary" href="#تواصل">احجز زيارة <ArrowLeft size={17} /></a>
                <a className="button-secondary" href={SITE_DATA.contact.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} /> تواصل عبر واتساب</a>
                <a className="button-ghost" href="#البرامج">تعرّف على برامجنا <ArrowUpLeft size={16} /></a>
              </div>
              <div className="hero-note"><Check size={17} strokeWidth={2.5} /> خبرة أكثر من 5 سنوات في رعاية وتعليم الأطفال</div>
            </div>
            <div className="hero-visual">
              <span className="hero-photo-tag">TODO • صورة المكان الحقيقية</span>
              <img className="hero-photo" src={ASSETS.hero} alt="مساحة تعليمية هادئة بلمسات نعناع وخشب في حضانة أرتقي" />
              <div className="hero-mark"><img src={ASSETS.mark} alt="شعار أرتقي" /><span className="hero-mark-caption">أرتقي</span></div>
              <div className="hero-seed-row" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="hero-curve" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="أرقام وحقائق عن الحضانة">
          <div className="container trust-inner">
            <div className="trust-intro"><Star size={21} fill="currentColor" /><p>ثقة تُبنى بهدوء، من أول زيارة إلى كل خطوة جديدة.</p></div>
            {SITE_DATA.stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
          </div>
        </section>

        <section id="من-نحن" className="section-space mint-section">
          <div className="container about-grid">
            <div className="about-visual">
              <img src={ASSETS.childBook} alt="طفل يحمل كتابًا مفتوحًا عند صدره في أجواء هادئة بألوان أرتقي" />
              <span className="editorial-note">صورة هوية تجريبية</span>
              <div className="about-badge"><div><strong>+5</strong><span>سنوات من الخبرة</span></div></div>
            </div>
            <div className="about-copy">
              <span className="eyebrow">لماذا أرتقي؟</span>
              <h2 className="section-title">لأن البداية الهادئة تصنع فرقًا كبيرًا.</h2>
              <p className="section-copy">في أرتقي نؤمن أن الطفل يحتاج إلى مكان يشعر فيه بالأمان أولًا، ثم يجد حوله ما يشجعه على السؤال، التجربة، والتعبير عن نفسه بطريقته.</p>
              <div className="feature-list">
                <div className="feature"><span className="feature-number">01</span><div><h3>أمان يسبق كل شيء</h3><p>روتين واضح وبيئة مرتبة تساعد الطفل على الشعور بالاستقرار.</p></div></div>
                <div className="feature"><span className="feature-number">02</span><div><h3>تعلم قريب من عالمه</h3><p>أنشطة وتجارب بسيطة تحول الفضول الطبيعي إلى مهارات قابلة للنمو.</p></div></div>
                <div className="feature"><span className="feature-number">03</span><div><h3>شراكة مع الأسرة</h3><p>تواصل مباشر يساعد ولي الأمر على متابعة البدايات بثقة ووضوح.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="البرامج" className="section-space programs">
          <div className="container">
            <div className="section-header">
              <SectionIntro eyebrow="برامجنا" title="مساحات صغيرة، مهارات تكبر." copy="برامج قابلة للتعديل والتوسع بحسب احتياج الأطفال والبيانات المعتمدة من إدارة الحضانة." />
              <div className="growth-line" aria-hidden="true"><span>01</span><b /><span>02</span><b /><span>03</span></div>
              <a className="button-ghost" href="#تواصل">اسألينا عن التفاصيل <ArrowLeft size={16} /></a>
            </div>
            <div className="programs-grid">
              {PROGRAMS.map((program) => {
                const Icon = iconMap[program.icon as keyof typeof iconMap];
                return <article className="program-card" key={program.number}><span className="program-index">{program.number}</span><span className="program-icon"><Icon size={20} strokeWidth={1.8} /></span><h3>{program.title}</h3><p>{program.description}</p><ArrowUpLeft className="program-arrow" size={18} /></article>;
              })}
            </div>
          </div>
        </section>

        <section className="section-space stages" aria-labelledby="stages-title">
          <div className="container">
            <div className="growth-line growth-line-light" aria-hidden="true"><span>نمو</span><b /><span>اكتشاف</span><b /><span>أثر</span></div>
            <div className="section-header">
              <SectionIntro eyebrow="الأعمار والمراحل" title="نترك لكل مرحلة وقتها." copy="قسم جاهز لإضافة الأعمار والمراحل والبرامج التفصيلية بعد اعتمادها من الحضانة." />
              <span className="todo-note">TODO • يحتاج بيانات الحضانة</span>
            </div>
            <div className="stage-track" id="المراحل">
              <article className="stage"><span className="stage-number">01 / TODO</span><h3>مرحلة البدايات</h3><p>أضيفوا هنا الفئة العمرية الأولى ووصفًا قصيرًا لطبيعة الرعاية.</p></article>
              <article className="stage"><span className="stage-number">02 / TODO</span><h3>مرحلة الاكتشاف</h3><p>أضيفوا هنا ما يميز أنشطة الاستكشاف والتفاعل في هذه المرحلة.</p></article>
              <article className="stage"><span className="stage-number">03 / TODO</span><h3>مرحلة التأسيس</h3><p>أضيفوا هنا العمر والمهارات والبرامج المعتمدة لهذه المرحلة.</p></article>
            </div>
          </div>
        </section>

        <section id="يوم-الطفل" className="section-space">
          <div className="container day-grid">
            <div className="day-intro"><span className="eyebrow">يوم الطفل</span><h2 className="section-title">إيقاع يومي يوازن بين التعلم واللعب.</h2><p className="section-copy">هذا القسم قابل للتعديل ليعكس اليوم الحقيقي داخل الحضانة دون افتراض مواعيد أو تفاصيل غير مؤكدة.</p><span className="todo-note">TODO • أضيفوا المواعيد والتفاصيل</span></div>
            <div className="day-timeline">
              <div className="day-item"><span className="day-time">TODO</span><div><h3>الاستقبال والتهيئة</h3><p>وقت هادئ للترحيب والانتقال إلى أجواء اليوم.</p></div></div>
              <div className="day-item"><span className="day-time">TODO</span><div><h3>نشاط تعليمي</h3><p>تجربة قصيرة مناسبة للمرحلة واهتمامات الأطفال.</p></div></div>
              <div className="day-item"><span className="day-time">TODO</span><div><h3>لعب وحركة</h3><p>مساحة للتفريغ، الحركة، والتفاعل مع الآخرين.</p></div></div>
              <div className="day-item"><span className="day-time">TODO</span><div><h3>ختام ومشاركة</h3><p>ترتيب اليوم والاستعداد للعودة مع لحظة مشاركة بسيطة.</p></div></div>
            </div>
          </div>
        </section>

        <section id="المعرض" className="section-space gallery">
          <div className="container">
            <div className="section-header"><div className="gallery-heading"><SectionIntro eyebrow="من أجواء أرتقي" title="صور تقول الكثير، حين تكون حقيقية." copy="استخدمنا صورًا تجريبية مؤقتة للحفاظ على شكل المعرض. استبدالها لاحقًا سهل ومنظم." /><span className="seed-dot" aria-hidden="true" /></div><a className="button-ghost" href="#تواصل">أرسلوا صوركم <ArrowLeft size={16} /></a></div>
            <div className="gallery-grid">
              <div className="gallery-item"><span className="editorial-note">صورة تجريبية</span><img src={ASSETS.activity} alt="أيدٍ صغيرة تنفذ نشاطًا إبداعيًا" /><div className="gallery-overlay" /><span className="gallery-caption">مساحة للتجربة</span></div>
              <div className="gallery-item"><span className="editorial-note">صورة تجريبية</span><img src={ASSETS.hero} alt="ركن هادئ في بيئة تعليمية" /><div className="gallery-overlay" /><span className="gallery-caption">بدايات هادئة</span></div>
              <div className="gallery-item"><span className="editorial-note">صورة تجريبية</span><img src={ASSETS.space} alt="رفوف ومواد تعليمية في ركن القراءة" /><div className="gallery-overlay" /><span className="gallery-caption">نتعلم باللمس</span></div>
            </div>
          </div>
        </section>

        <section id="التقييمات" className="section-space" aria-labelledby="rating-title">
          <div className="container review-grid">
            <div className="rating-card"><span className="rating-symbol">✦</span><span className="rating-score">100%</span><p>توصية على صفحة فيسبوك بناءً على 8 آراء موثقة.</p></div>
            <div className="review-copy"><span className="eyebrow">آراء وتقييمات أولياء الأمور</span><h2 id="rating-title" className="section-title">الثقة تبدأ من تجربة حقيقية.</h2><p>نعرض التقييم المؤكد من صفحة الحضانة الرسمية كما هو، ونترك مساحة لإضافة مراجعات موثقة مستقبلًا دون إنشاء أسماء أو اقتباسات غير حقيقية.</p><div className="review-actions"><a className="button-primary" href={SITE_DATA.contact.facebookReviews} target="_blank" rel="noreferrer"><Facebook size={17} /> عرض آراء فيسبوك</a><a className="button-ghost" href={SITE_DATA.contact.googleReviews}>اترك تقييمًا على Google <ArrowLeft size={16} /></a></div><div className="review-proof-grid" aria-label="ملخص التقييم الحالي"><div><strong>100%</strong><span>توصية على فيسبوك</span></div><div><strong>8</strong><span>آراء موثقة</span></div><div><strong>FB</strong><span>المصدر الرسمي</span></div></div><div className="quote-placeholder"><strong>مساحة لمراجعات موثقة</strong><br />يمكن قراءة الآراء الحالية من المصدر الرسمي أو إضافة مراجعات حقيقية هنا بعد اعتمادها وربطها بالحساب.</div><a className="review-facebook-link" href={SITE_DATA.contact.facebookReviews} target="_blank" rel="noreferrer"><Facebook size={16} /> فتح صفحة Facebook وقراءة المزيد <ArrowLeft size={15} /></a></div>
          </div>
        </section>

        <section id="الأسئلة" className="section-space faq">
          <div className="container faq-grid"><div><SectionIntro eyebrow="الأسئلة الشائعة" title="كل ما تحتاج معرفته قبل الزيارة." copy="ابحثي عن إجابتك بسرعة، أو افتحي السؤال لقراءة التفاصيل. المعلومات التي تحتاج تأكيدًا واضحة بعلامة TODO." /><a className="button-secondary" href="#تواصل" style={{ marginTop: "1.5rem" }}>لديك سؤال آخر؟ <MessageCircle size={17} /></a></div><div><div className="faq-controls"><div className="faq-categories" role="tablist" aria-label="تصنيف الأسئلة الشائعة">{faqCategories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={faqCategory === category.id} className={`faq-category${faqCategory === category.id ? " active" : ""}`} onClick={() => setFaqCategory(category.id)}>{category.label}</button>)}</div><div className="faq-search-wrap"><label className="sr-only" htmlFor="faq-search">ابحث في الأسئلة الشائعة</label><input id="faq-search" className="faq-search" type="search" value={faqSearch} onChange={(event) => setFaqSearch(event.target.value)} placeholder="ابحثي مثلًا: الأعمار، المواعيد…" /><span className="faq-search-count" aria-live="polite">{filteredFaqs.length} {filteredFaqs.length === 1 ? "نتيجة" : "نتائج"}</span>{faqSearch ? <button type="button" className="faq-clear" aria-label="مسح البحث وعرض كل الأسئلة" onClick={handleShowAllFaqs}><X size={13} /> مسح</button> : null}</div><div className="faq-toolbar-actions"><button type="button" className="faq-show-all" onClick={handleShowAllFaqs} aria-label="عرض كل الأسئلة الشائعة">عرض الكل <ArrowLeft size={14} /></button><button type="button" className="faq-toggle-all" onClick={handleToggleAllFaqs} disabled={!filteredFaqs.length} aria-label={allFaqsOpen ? `طي ${faqCountLabel}` : `فتح ${faqCountLabel}`}>{faqToggleLabel} <ChevronDown size={14} /></button></div></div><div className="faq-list">{filteredFaqs.length ? filteredFaqs.map((item) => { const isOpen = openFaqs.includes(item.question); const FaqIcon = faqIconMap[item.icon as keyof typeof faqIconMap] ?? HelpCircle; return <div className="faq-item" id={`faq-${item.icon}`} data-faq-question={item.question} key={item.question}><button className="faq-button" aria-expanded={isOpen} onClick={() => setOpenFaqs((current) => isOpen ? current.filter((question) => question !== item.question) : [...current, item.question])}><span className="faq-question-label"><span className="faq-question-icon"><FaqIcon size={17} strokeWidth={1.8} /></span><span>{highlightFaqAnswer(item.question, faqSearch)}</span></span><ChevronDown size={18} /></button><div className={`faq-answer${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>{highlightFaqAnswer(item.answer, faqSearch)}{isOpen ? <div className="faq-feedback" aria-label={`هل كانت إجابة سؤال ${item.question} مفيدة؟`}><span className="faq-feedback-prompt">هل كانت الإجابة مفيدة؟</span><div className="faq-feedback-actions"><button type="button" className={`faq-feedback-button${faqFeedback[item.question] === "yes" ? " selected" : ""}`} aria-pressed={faqFeedback[item.question] === "yes"} onClick={() => handleFaqFeedback(item.question, "yes")}><ThumbsUp size={14} /> نعم</button><button type="button" className={`faq-feedback-button${faqFeedback[item.question] === "no" ? " selected" : ""}`} aria-pressed={faqFeedback[item.question] === "no"} onClick={() => handleFaqFeedback(item.question, "no")}><ThumbsDown size={14} /> لا</button><button type="button" className="faq-feedback-button faq-share-button" aria-label="نسخ رابط الإجابة أو مشاركتها عبر واتساب" title="نسخ رابط الإجابة أو مشاركتها عبر واتساب" data-tooltip="نسخ الرابط أو مشاركته عبر واتساب" onClick={() => handleShareFaq(item)}><Share2 size={14} /> مشاركة</button>{copiedFaq === item.question ? <span className="faq-copy-success" role="status"><Check size={12} /> تم النسخ</span> : null}<a className="faq-feedback-button faq-whatsapp-share" href={`${SITE_DATA.contact.whatsappBase}?text=${encodeURIComponent(`${item.question}\n${getFaqAnswerExcerpt(item.answer)}\n${window.location.origin}${window.location.pathname}#faq-${item.icon}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /> واتساب</a></div>{feedbackNotice === item.question ? <span className="faq-feedback-status faq-feedback-thanks" role="status">شكرًا على تقييمك، يساعدنا رأيك في تحسين الإجابات.</span> : null}{faqFeedback[item.question] === "no" ? <div className="faq-feedback-note"><label htmlFor={`faq-note-${item.icon}`}>كيف يمكن تحسين الإجابة؟ <span>اختياري</span></label><textarea id={`faq-note-${item.icon}`} value={faqFeedbackNotes[item.question] ?? ""} onChange={(event) => handleFaqFeedbackNote(item.question, event.target.value)} maxLength={500} placeholder="اكتب ملاحظتك هنا…" /></div> : null}{shareNotice ? <span className="faq-feedback-status" role="status">{shareNotice}</span> : null}</div> : null}</div></div>; }) : <div className="faq-empty" role="status"><strong>لم نجد سؤالًا مطابقًا، ولا يهمك.</strong><span>جرّبي كلمة أخرى مثل «زيارة» أو «إنجليزي»، أو اطرحي سؤالك مباشرة على فريق الحضانة.</span><div className="faq-empty-actions"><button className="button-ghost" type="button" onClick={handleShowAllFaqs}>عرض كل الأسئلة <ArrowLeft size={16} /></button><a className="faq-empty-whatsapp" href={SITE_DATA.contact.whatsappQuestionHref} target="_blank" rel="noreferrer" onClick={handleQuestionWhatsApp}><MessageCircle size={16} /> اطرحي سؤالك عبر واتساب</a></div></div>}</div><div className="faq-contact"><div><strong>لم تجدي إجابتك؟</strong><span>اطرحِي سؤالك مباشرة وسنساعدك عبر واتساب.</span></div><a className="button-secondary" href={SITE_DATA.contact.whatsappQuestionHref} target="_blank" rel="noreferrer" onClick={handleQuestionWhatsApp}><MessageCircle size={17} /> اطرحي سؤالًا عبر واتساب</a></div>{whatsappNotice ? <div className="whatsapp-notice" role="status"><Check size={16} /> تم فتح واتساب برسالة جاهزة. اكتبي سؤالك وسنساعدك مباشرة.</div> : null}</div></div>
        </section>

        <section className="section-space journal" aria-labelledby="journal-title">
          <div className="container"><div className="section-header"><SectionIntro eyebrow="من المدونة" title="أفكار تساعدك في رحلة الاختيار." copy="قسم مهيأ لـ SEO مع مقالات أولية قابلة للتحرير وإضافة المدينة عند تأكيدها." /><a className="button-ghost" href="#تواصل">اطلب مقالًا جديدًا <ArrowLeft size={16} /></a></div><div className="blog-grid">{BLOG_POSTS.map((post) => <article className="blog-card" key={post.title}><div><span className="blog-category">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p></div><div className="blog-footer"><span>{post.date}</span><ArrowUpLeft size={16} color="#146B63" /></div></article>)}</div></div>
        </section>

        <section id="تواصل" className="contact-section section-space">
          <div className="container contact-grid"><div className="contact-copy"><span className="eyebrow">تواصل معنا</span><h2 className="section-title">خطوتك الأولى تبدأ برسالة.</h2><p>اتركي بياناتك وسنعود إليك لتنسيق زيارة أو الإجابة عن استفسارك. الحقول الضرورية واضحة، ورسالتك تصلح كبداية بسيطة.</p><div className="contact-list"><a className="contact-item" href={SITE_DATA.contact.phoneHref}><Phone size={18} /> {SITE_DATA.contact.phoneDisplay}</a><a className="contact-item" href={SITE_DATA.contact.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} /> تواصل مباشر عبر واتساب</a><span className="contact-item"><MapPin size={18} /> {SITE_DATA.contact.location}</span><span className="contact-item"><Clock3 size={18} /> {SITE_DATA.contact.hours}</span></div></div><form className="contact-form" onSubmit={handleSubmit} noValidate><div className="form-grid"><div className="form-field"><label htmlFor="name">الاسم الكريم</label><input id="name" name="name" placeholder="اكتب الاسم" autoComplete="name" /></div><div className="form-field"><label htmlFor="phone">رقم الهاتف</label><input id="phone" name="phone" placeholder="01xxxxxxxxx" inputMode="tel" autoComplete="tel" /></div><div className="form-field"><label htmlFor="childAge">عمر الطفل</label><select id="childAge" name="childAge" defaultValue="" required><option value="" disabled>اختر العمر</option><option value="أقل من سنتين">أقل من سنتين</option><option value="من سنتين إلى 3 سنوات">من سنتين إلى 3 سنوات</option><option value="من 4 إلى 5 سنوات">من 4 إلى 5 سنوات</option><option value="6 سنوات أو أكثر">6 سنوات أو أكثر</option><option value="يُحدد لاحقًا">يُحدد لاحقًا</option></select></div><div className="form-field full"><label htmlFor="message">كيف يمكننا مساعدتك؟</label><textarea id="message" name="message" placeholder="أرغب في معرفة المزيد عن…" /></div></div><button className="button-primary" type="submit" style={{ marginTop: "1rem", width: "100%" }}>{formState === "success" ? <><Check size={17} /> تم استلام طلبك</> : <>إرسال طلب الزيارة <Send size={16} /></>}</button>{formState === "success" ? <div className="form-status success" role="status">شكرًا لك. سيتم فتح واتساب برسالة مجهزة بالبيانات التي أدخلتها لتسهيل التواصل المباشر مع الحضانة.</div> : null}{formState === "error" ? <div className="form-status error" role="alert">يرجى كتابة الاسم ورقم الهاتف وتحديد عمر الطفل حتى نتمكن من التواصل معك.</div> : null}<p className="form-footnote">سيتم فتح واتساب تلقائيًا برسالة جاهزة بعد الضغط على إرسال طلب الزيارة.</p></form></div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid"><div><a className="brand" href="#الرئيسية"><img className="brand-mark" src={ASSETS.mark} alt="رمز أرتقي" /><span className="brand-wordmark"><strong>حضانة أرتقي</strong><span>Artaqy Kids</span></span></a><p className="footer-copy">مسيرة تعليمية راقية من بداية حياة الطفل. رعاية دافئة وبدايات تستحق أن تُروى.</p></div><div><h3>استكشف</h3><nav className="footer-links"><a href="#من-نحن">من نحن</a><a href="#البرامج">البرامج</a><a href="#المعرض">المعرض</a><a href="#الأسئلة">الأسئلة الشائعة</a></nav></div><div><h3>ابقَ على تواصل</h3><nav className="footer-links"><a href={SITE_DATA.contact.phoneHref}>الهاتف</a><a href={SITE_DATA.contact.whatsappHref} target="_blank" rel="noreferrer">واتساب</a><a href={SITE_DATA.contact.facebook} target="_blank" rel="noreferrer">فيسبوك</a><a href="#تواصل">احجز زيارة</a></nav></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} حضانة أرتقي. جميع الحقوق محفوظة.</span><span>مصمم بعناية لبدايات أكثر هدوءًا.</span></div>
      </footer>

      <a className="whatsapp-float" href={SITE_DATA.contact.whatsappHref} target="_blank" rel="noreferrer" aria-label="التواصل مع حضانة أرتقي عبر واتساب"><MessageCircle size={22} /></a>
    </div>
  );
}
