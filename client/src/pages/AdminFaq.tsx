import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, MessageSquareText, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

const emptyForm = { question: "", answer: "", category: "registration", icon: "help", sortOrder: 0, isPublished: true };
type FaqForm = typeof emptyForm;

export default function AdminFaq() {
  const [form, setForm] = useState<FaqForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const utils = trpc.useUtils();
  const faqsQuery = trpc.faq.adminList.useQuery();
  const createFaq = trpc.faq.create.useMutation({ onSuccess: async () => { await utils.faq.adminList.invalidate(); setForm(emptyForm); } });
  const updateFaq = trpc.faq.update.useMutation({ onSuccess: async () => { await utils.faq.adminList.invalidate(); setEditingId(null); setForm(emptyForm); } });
  const deleteFaq = trpc.faq.remove.useMutation({ onSuccess: () => utils.faq.adminList.invalidate() });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (editingId) {
      updateFaq.mutate({ id: editingId, data: form });
    } else {
      createFaq.mutate(form);
    }
  };

  const handleEdit = (item: NonNullable<typeof faqsQuery.data>[number]) => {
    setEditingId(item.id);
    setForm({ question: item.question, answer: item.answer, category: item.category, icon: item.icon, sortOrder: item.sortOrder, isPublished: Boolean(item.isPublished) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <div dir="rtl" className="admin-faq-page">
        <header className="admin-faq-header">
          <div>
            <span className="admin-eyebrow">Artaqy Kids · لوحة الإدارة</span>
            <h1>إدارة الأسئلة الشائعة</h1>
            <p>حدّثي الأسئلة والإجابات المنشورة مباشرة من هنا، دون تعديل الكود.</p>
          </div>
          <div className="admin-faq-count"><MessageSquareText size={18} /> {faqsQuery.data?.length ?? 0} سؤال</div>
        </header>

        <section className="admin-faq-form-card" aria-labelledby="faq-form-title">
          <div className="admin-card-heading"><div><span className="admin-eyebrow">{editingId ? "تعديل محتوى" : "إضافة محتوى"}</span><h2 id="faq-form-title">{editingId ? "تعديل السؤال الحالي" : "إضافة سؤال جديد"}</h2></div>{editingId ? <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>إلغاء التعديل</Button> : null}</div>
          <form onSubmit={handleSubmit} className="admin-faq-form">
            <label>السؤال<input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="مثال: ما أعمار الأطفال المقبولة؟" /></label>
            <label>الإجابة<textarea required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="اكتبي الإجابة التي ستظهر لأولياء الأمور." /></label>
            <div className="admin-faq-form-grid">
              <label>الفئة<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="registration">التسجيل</option><option value="programs">البرامج</option><option value="day">اليوم الدراسي</option><option value="location">الموقع والتواصل</option></select></label>
              <label>مفتاح الأيقونة<input required value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="age أو visit" /></label>
              <label>الترتيب<input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></label>
            </div>
            <label className="admin-publish-toggle"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> نشر السؤال على الموقع العام</label>
            <Button type="submit" disabled={createFaq.isPending || updateFaq.isPending}><Save size={16} /> {editingId ? "حفظ التعديلات" : "إضافة السؤال"}</Button>
          </form>
          {createFaq.error || updateFaq.error ? <p className="admin-error" role="alert">تعذر حفظ التغييرات. تأكدي من تسجيل الدخول بصلاحية الإدارة ثم حاولي مرة أخرى.</p> : null}
        </section>

        <section className="admin-faq-list" aria-labelledby="faq-list-title">
          <div className="admin-card-heading"><div><span className="admin-eyebrow">المحتوى الحالي</span><h2 id="faq-list-title">الأسئلة المنشورة والمسودات</h2></div></div>
          {faqsQuery.isLoading ? <p className="admin-muted">جارٍ تحميل الأسئلة…</p> : faqsQuery.error ? <p className="admin-error" role="alert">لا يمكن فتح لوحة الإدارة. يلزم تسجيل الدخول بحساب مالك أو مسؤول.</p> : <div className="admin-faq-items">{faqsQuery.data?.map((item) => <article className={`admin-faq-item${item.isPublished ? "" : " is-draft"}`} key={item.id}><div className="admin-faq-item-copy"><div className="admin-faq-item-meta"><span>{item.category}</span>{item.isPublished ? <span><Eye size={13} /> منشور</span> : <span><EyeOff size={13} /> مسودة</span>}</div><h3>{item.question}</h3><p>{item.answer}</p></div><div className="admin-faq-item-actions"><Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Pencil size={14} /> تعديل</Button><Button size="sm" variant="destructive" onClick={() => { if (window.confirm("حذف هذا السؤال؟")) deleteFaq.mutate({ id: item.id }); }}><Trash2 size={14} /> حذف</Button></div></article>)}</div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
