// Style reminder: Keep all editable nursery facts centralized while preserving the calm mint, cream, and deep-teal visual system.

export const SITE_DATA = {
  brand: {
    nameAr: "حضانة أرتقي",
    nameEn: "Artaqy Kids",
    tagline: "مسيرة تعليمية راقية من بداية حياة الطفل",
    experience: "أكثر من 5 سنوات",
    ageRange: "من 3 إلى 6 سنوات",
    signatureColor: "#9EDFD2",
  },
  contact: {
    phoneDisplay: "+20 10 1857 8176",
    phoneHref: "tel:+201018578176",
    whatsappBase: "https://wa.me/201018578176",
    whatsappHref: "https://wa.me/201018578176?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D9%84%D8%AD%D8%B6%D8%A7%D9%86%D8%A9%20%D8%A3%D8%B1%D8%AA%D9%82%D9%8A",
    whatsappQuestionHref: "https://wa.me/201018578176?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%B3%D8%A4%D8%A7%D9%84%20%D8%AC%D8%AF%D9%8A%D8%AF%20%D8%B9%D9%86%20%D8%AD%D8%B6%D8%A7%D9%86%D8%A9%20Artaqy%20Kids%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%AA%D9%8A",
    location: "دمياط الجديدة • جامعة دمياط • شارع المكتبة • خلف مزايا",
    city: "دمياط الجديدة، مصر",
    hours: "من 8 صباحًا إلى 2 ظهرًا",
    facebook: "https://www.facebook.com/AmirKinderGarten",
    facebookReviews: "https://www.facebook.com/AmirKinderGarten/reviews",
    googleReviews: "#",
  },
  stats: [
    { value: "+5", label: "سنوات من الخبرة" },
    { value: "100%", label: "توصية على فيسبوك" },
    { value: "8", label: "آراء موثقة" },
  ],
} as const;

export const PROGRAMS = [
  { number: "01", title: "التعليم المبكر", description: "بدايات تعليمية مناسبة لفضول الطفل وإيقاعه الخاص.", icon: "sparkles" },
  { number: "02", title: "تنمية المهارات", description: "أنشطة صغيرة تساعد على الاستقلال، التركيز، والتعبير.", icon: "orbit" },
  { number: "03", title: "التأسيس العربي", description: "تمهيد واضح للحروف والكلمات من خلال اللعب والممارسة.", icon: "book" },
  { number: "04", title: "التأسيس الإنجليزي", description: "تعرض أولي للغة الإنجليزية في سياقات بسيطة ومحببة.", icon: "language" },
  { number: "05", title: "الأنشطة الإبداعية", description: "مساحة للرسم، التشكيل، وصناعة الأفكار باليد.", icon: "palette" },
  { number: "06", title: "الرعاية اليومية", description: "روتين يومي هادئ يضع راحة الطفل وأمانه أولًا.", icon: "heart" },
] as const;

export const FAQS = [
  { question: "ما أعمار الأطفال المقبولة؟", answer: "تستقبل Artaqy Kids الأطفال من عمر 3 إلى 6 سنوات.", icon: "age", category: "registration" },
  { question: "ما مواعيد الحضانة؟", answer: "مواعيد العمل من 8 صباحًا إلى 2 ظهرًا.", icon: "hours", category: "day" },
  { question: "هل يوجد تأسيس للغة الإنجليزية؟", answer: "نعم، يتضمن قسم البرامج تأسيسًا إنجليزيًا قابلًا للتطوير، بينما يتم تأكيد تفاصيل المنهج والمراحل مع الإدارة.", icon: "english", category: "programs" },
  { question: "ما المناهج التعليمية التي تقدمها الحضانة؟", answer: "تشمل البرامج المعروضة التعليم المبكر، والتأسيس العربي والإنجليزي، وتنمية المهارات، مع اعتماد الخطة التفصيلية من إدارة Artaqy Kids.", icon: "curriculum", category: "programs" },
  { question: "ما الأنشطة الترفيهية التي تقدمها الحضانة؟", answer: "تتضمن المجالات المعروضة أنشطة فنية وحركية وتعلمًا من خلال اللعب، بينما يتم تأكيد جدول الأنشطة الترفيهية الفعلي من الإدارة.", icon: "activities", category: "day" },
  { question: "هل يمكن حجز زيارة؟", answer: "نعم، يمكنكم تعبئة نموذج طلب الزيارة، وسيتم فتح واتساب برسالة جاهزة لتنسيق التواصل المباشر.", icon: "visit", category: "registration" },
  { question: "أين تقع الحضانة؟", answer: "تقع في دمياط الجديدة، أمام جامعة دمياط، شارع المكتبة، خلف محل مزايا.", icon: "location", category: "location" },
  { question: "كيف أتواصل مع الحضانة؟", answer: "يمكنكم التواصل عبر الهاتف أو واتساب من أزرار التواصل الظاهرة في الموقع.", icon: "followup", category: "location" },
  { question: "هل توجد متابعة مع ولي الأمر؟", answer: "نحرص على أن يكون التواصل مع الأسرة واضحًا ومباشرًا، وتُعتمد آلية المتابعة التفصيلية من إدارة الحضانة.", icon: "followup", category: "day" },
  { question: "ما الأوراق المطلوبة للتقديم؟", answer: "TODO: يتم إضافة قائمة الأوراق المطلوبة وخطوات التقديم بعد تأكيدها من الإدارة.", icon: "documents", category: "registration" },
  { question: "هل توجد خدمة نقل؟", answer: "TODO: يتم تأكيد توفر خدمة النقل ومناطق التغطية لاحقًا.", icon: "transport", category: "registration" },
] as const;

export const BLOG_POSTS = [
  { category: "دليل الأسرة", title: "كيفية اختيار الحضانة المناسبة لطفلك", excerpt: "أسئلة عملية تساعدك على تقييم المكان والبيئة قبل اتخاذ القرار.", date: "مقال قابل للتعديل" },
  { category: "التعليم المبكر", title: "لماذا تهم السنوات الأولى في رحلة التعلم؟", excerpt: "نظرة مبسطة على أثر الخبرات اليومية في بناء الفضول والثقة.", date: "مقال قابل للتعديل" },
  { category: "TODO: المنطقة", title: "أفضل حضانة في [المنطقة]", excerpt: "صفحة محلية جاهزة للتحرير بعد تأكيد المدينة والحي والكلمات المستهدفة.", date: "TODO: تاريخ النشر" },
] as const;
