import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getSiteContent } from "./site-content.functions";

// Every editable text and image on the public site lives here as its default value.
// Rows in the site_content table override these; the dashboard writes those rows.
export const SITE_CONTENT_DEFAULTS = {
  "site.name": "مركز الخدمات الشاملة",
  "site.tagline": "كل خدماتك في مكان واحد",
  "site.logo_image": "",
  "site.logo_letter": "ش",

  "home.hero.badge": "كل خدماتك في مكان واحد",
  "home.hero.title": "مركز الخدمات",
  "home.hero.title_accent": "الشاملة",
  "home.hero.subtitle": "نختصر عليك الوقت والجهد، من المعاملات اليومية إلى إيجاد منزلك القادم ومساندتك في مسيرتك الدراسية.",
  "home.hero.image": "",

  "home.card.general.title": "الخدمات العامة",
  "home.card.general.desc": "معاملات حكومية، طباعة، ترجمة وأكثر.",
  "home.card.real_estate.title": "الخدمات العقارية",
  "home.card.real_estate.desc": "شقق، فلل، أراضٍ ومحلات تجارية.",
  "home.card.student.title": "الخدمات الطلابية",
  "home.card.student.desc": "أبحاث، عروض، دروس وقبول جامعي.",
  "home.browse": "تصفّح الخدمات",

  "home.feature.1.title": "إنجاز سريع",
  "home.feature.1.desc": "ننجز طلبك في أقصر وقت ممكن.",
  "home.feature.2.title": "موثوقية",
  "home.feature.2.desc": "خبرة وأمانة في كل معاملة.",
  "home.feature.3.title": "دعم متواصل",
  "home.feature.3.desc": "فريقنا جاهز للرد على استفساراتك.",

  "nav.home": "الرئيسية",
  "nav.contact": "تواصل معنا",
  "nav.sections": "الأقسام",

  "section.general.label": "الخدمات العامة",
  "section.general.tagline": "معاملات حكومية، طباعة، ترجمة وكل ما تحتاجه في مكان واحد",
  "section.real_estate.label": "الخدمات العقارية",
  "section.real_estate.tagline": "شقق، فلل، أراضٍ ومحلات تجارية للبيع والإيجار",
  "section.student.label": "الخدمات الطلابية",
  "section.student.tagline": "أبحاث، عروض تقديمية، دروس خصوصية وقبول جامعي",

  "search.placeholder": "اكتب أي تلميح... مثلاً: اقامة، شقه، بحث",
  "search.empty": "لا توجد نتائج مطابقة، جرّب كلمة أخرى",
  "search.count": "خدمة",
  "contact.other_request": "طلب خدمة أخرى",

  "service.specifications_title": "مواصفات الخدمة",
  "service.price_label": "السعر",
  "service.location_label": "الموقع",
  "service.map_label": "الموقع الجغرافي",
  "service.call_label": "اتصال",
  "service.price_fallback": "حسب الطلب",
  "service.spec_fallback": "تواصل معنا للاستفسار عن تفاصيل هذه الخدمة.",
  "service.not_found": "الخدمة غير متاحة",
  "service.details_prefix": "تفاصيل",

  "contact.title": "تواصل معنا",
  "contact.intro": "طلب خدمة",
  "contact.name_label": "الاسم",
  "contact.phone_label": "رقم الجوال",
  "contact.message_label_general": "الخدمة المطلوبة وتفاصيل الطلب",
  "contact.message_label_service": "تفاصيل إضافية (اختياري)",
  "contact.submit": "إرسال الطلب",
  "contact.sending": "جارٍ الإرسال...",
  "contact.success": "تم استلام طلبك، سنتواصل معك قريباً",
  "contact.another": "طلب جديد",
  "contact.invalid": "يرجى إدخال الاسم ورقم الجوال وتفاصيل الطلب",
  "contact.failed": "تعذّر إرسال الطلب، حاول مجدداً",
  "contact.phone": "+966 53 622 2494",
  "contact.email": "",
  "contact.address": "",
  "contact.hours": "",
  "contact.whatsapp_label": "واتساب",
  "contact.call_label": "اتصل بنا",

  "login.title_in": "دخول الإدارة",
  "login.title_up": "إنشاء حساب",
  "login.identity_placeholder": "رقم الجوال أو البريد الإلكتروني",
  "login.password_placeholder": "كلمة المرور",
  "login.submit_in": "دخول",
  "login.submit_up": "إنشاء الحساب",
  "login.switch_up": "ليس لديك حساب؟ أنشئ حساباً",
  "login.switch_in": "لديك حساب؟ سجّل الدخول",
  "login.invalid": "أدخل رقم جوال صحيحاً أو بريداً إلكترونياً",
  "login.wrong": "بيانات الدخول غير صحيحة",
  "login.created": "تم إنشاء الحساب",

  "footer.about": "نقدّم خدمات عامة وعقارية وطلابية بجودة وسرعة، لنوفّر وقتك وجهدك.",
  "footer.sections_title": "الأقسام",
  "footer.contact_title": "تواصل معنا",
  "footer.contact_link": "تواصل معنا واطلب خدمة",
  "footer.admin_link": "لوحة الإدارة",
  "footer.rights": "جميع الحقوق محفوظة.",

  "admin.title": "لوحة الإدارة",
} as const satisfies Record<string, string>;

export type SiteContentKey = keyof typeof SITE_CONTENT_DEFAULTS;
export type SiteContent = Record<SiteContentKey, string>;

export type ContentField = { key: SiteContentKey; label: string; type?: "text" | "textarea" | "image"; hint?: string };
export type ContentGroup = { id: string; label: string; description: string; fields: ContentField[] };

export const CONTENT_GROUPS: ContentGroup[] = [
  {
    id: "identity",
    label: "الهوية والشعار",
    description: "اسم المركز وعبارته وشعاره الظاهر في أعلى وأسفل كل صفحة.",
    fields: [
      { key: "site.name", label: "اسم المركز" },
      { key: "site.tagline", label: "العبارة التعريفية" },
      { key: "site.logo_letter", label: "حرف الشعار", hint: "حرف واحد يظهر داخل مربّع الشعار" },
      { key: "site.logo_image", label: "صورة الشعار", type: "image", hint: "اتركها فارغة لاستخدام الشعار المرسوم" },
    ],
  },
  {
    id: "home",
    label: "الصفحة الرئيسية",
    description: "الصورة الكبيرة في الأعلى، البطاقات الثلاث، والمزايا الثلاث.",
    fields: [
      { key: "home.hero.badge", label: "الشارة فوق العنوان" },
      { key: "home.hero.title", label: "العنوان الرئيسي" },
      { key: "home.hero.title_accent", label: "الكلمة الملوّنة في العنوان" },
      { key: "home.hero.subtitle", label: "النص تحت العنوان", type: "textarea" },
      { key: "home.hero.image", label: "صورة الواجهة", type: "image", hint: "اتركها فارغة لاستخدام الصورة الحالية" },
      { key: "home.card.general.title", label: "بطاقة العامة — العنوان" },
      { key: "home.card.general.desc", label: "بطاقة العامة — الوصف", type: "textarea" },
      { key: "home.card.real_estate.title", label: "بطاقة العقارية — العنوان" },
      { key: "home.card.real_estate.desc", label: "بطاقة العقارية — الوصف", type: "textarea" },
      { key: "home.card.student.title", label: "بطاقة الطلابية — العنوان" },
      { key: "home.card.student.desc", label: "بطاقة الطلابية — الوصف", type: "textarea" },
      { key: "home.browse", label: "نص زر تصفّح الخدمات" },
      { key: "home.feature.1.title", label: "ميزة 1 — العنوان" },
      { key: "home.feature.1.desc", label: "ميزة 1 — الوصف", type: "textarea" },
      { key: "home.feature.2.title", label: "ميزة 2 — العنوان" },
      { key: "home.feature.2.desc", label: "ميزة 2 — الوصف", type: "textarea" },
      { key: "home.feature.3.title", label: "ميزة 3 — العنوان" },
      { key: "home.feature.3.desc", label: "ميزة 3 — الوصف", type: "textarea" },
    ],
  },
  {
    id: "sections",
    label: "الأقسام والبحث",
    description: "أسماء الأقسام الثلاثة، وصف كل قسم، ونصوص شريط البحث.",
    fields: [
      { key: "section.general.label", label: "القسم العام — الاسم" },
      { key: "section.general.tagline", label: "القسم العام — الوصف", type: "textarea" },
      { key: "section.real_estate.label", label: "القسم العقاري — الاسم" },
      { key: "section.real_estate.tagline", label: "القسم العقاري — الوصف", type: "textarea" },
      { key: "section.student.label", label: "القسم الطلابي — الاسم" },
      { key: "section.student.tagline", label: "القسم الطلابي — الوصف", type: "textarea" },
      { key: "search.placeholder", label: "نص شريط البحث" },
      { key: "search.empty", label: "رسالة لا توجد نتائج" },
      { key: "search.count", label: "كلمة العدّ بجانب النتائج" },
      { key: "contact.other_request", label: "زر طلب خدمة أخرى" },
      { key: "nav.home", label: "رئيسية شريط التنقل" },
      { key: "nav.contact", label: "تواصل معنا في شريط التنقل" },
      { key: "nav.sections", label: "عنوان قائمة الأقسام" },
    ],
  },
  {
    id: "service",
    label: "صفحة الخدمة",
    description: "النصوص داخل صفحة تفاصيل أي خدمة.",
    fields: [
      { key: "service.specifications_title", label: "عنوان المواصفات" },
      { key: "service.price_label", label: "خانة السعر" },
      { key: "service.location_label", label: "خانة الموقع" },
      { key: "service.map_label", label: "زر الموقع الجغرافي" },
      { key: "service.call_label", label: "زر الاتصال" },
      { key: "service.price_fallback", label: "السعر عند عدم تحديده" },
      { key: "service.spec_fallback", label: "نص عند غياب المواصفات", type: "textarea" },
      { key: "service.not_found", label: "رسالة الخدمة غير المتوفرة" },
      { key: "service.details_prefix", label: "بداية وصف رابط التفاصيل" },
    ],
  },
  {
    id: "contact",
    label: "تواصل معنا",
    description: "صفحة طلب خدمة، بيانات التواصل، ونصوص النموذج.",
    fields: [
      { key: "contact.title", label: "عنوان الصفحة" },
      { key: "contact.intro", label: "العنوان الفرعي" },
      { key: "contact.name_label", label: "خانة الاسم" },
      { key: "contact.phone_label", label: "خانة رقم الجوال" },
      { key: "contact.message_label_general", label: "خانة الطلب (عام)" },
      { key: "contact.message_label_service", label: "خانة الطلب (على خدمة)" },
      { key: "contact.submit", label: "زر الإرسال" },
      { key: "contact.sending", label: "نص أثناء الإرسال" },
      { key: "contact.success", label: "رسالة نجاح الطلب" },
      { key: "contact.another", label: "زر طلب جديد" },
      { key: "contact.invalid", label: "رسالة بيانات ناقصة" },
      { key: "contact.failed", label: "رسالة فشل الإرسال" },
      { key: "contact.phone", label: "رقم التواصل", hint: "يظهر في صفحة التواصل والتذييل" },
      { key: "contact.whatsapp_label", label: "زر واتساب — النص" },
      { key: "contact.call_label", label: "زر الاتصال — النص" },
      { key: "contact.email", label: "البريد الإلكتروني" },
      { key: "contact.address", label: "العنوان" },
      { key: "contact.hours", label: "ساعات العمل" },
    ],
  },
  {
    id: "footer",
    label: "التذييل",
    description: "النصوص أسفل كل صفحة.",
    fields: [
      { key: "footer.about", label: "نبذة المركز", type: "textarea" },
      { key: "footer.sections_title", label: "عنوان قائمة الأقسام" },
      { key: "footer.contact_title", label: "عنوان قائمة التواصل" },
      { key: "footer.contact_link", label: "رابط تواصل معنا" },
      { key: "footer.admin_link", label: "رابط لوحة الإدارة" },
      { key: "footer.rights", label: "سطر الحقوق" },
    ],
  },
  {
    id: "login",
    label: "دخول الإدارة",
    description: "نصوص صفحة تسجيل الدخول.",
    fields: [
      { key: "login.title_in", label: "عنوان الدخول" },
      { key: "login.title_up", label: "عنوان إنشاء الحساب" },
      { key: "login.identity_placeholder", label: "خانة رقم الجوال/البريد" },
      { key: "login.password_placeholder", label: "خانة كلمة المرور" },
      { key: "login.submit_in", label: "زر الدخول" },
      { key: "login.submit_up", label: "زر إنشاء الحساب" },
      { key: "login.switch_up", label: "رابط إنشاء حساب" },
      { key: "login.switch_in", label: "رابط تسجيل الدخول" },
      { key: "login.invalid", label: "رسالة بيانات غير صحيحة" },
      { key: "login.wrong", label: "رسالة فشل الدخول" },
      { key: "login.created", label: "رسالة إنشاء الحساب" },
    ],
  },
];

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: async (): Promise<Record<string, string>> => {
    try {
      return await getSiteContent();
    } catch {
      return {};
    }
  },
  placeholderData: () => ({ ...SITE_CONTENT_DEFAULTS }) as Record<string, string>,
  staleTime: 60 * 1000,
});

export function useSiteContent(): SiteContent {
  const { data } = useQuery(siteContentQuery);
  return useMemo(
    () => ({ ...SITE_CONTENT_DEFAULTS, ...(data ?? {}) }) as SiteContent,
    [data],
  );
}

export function sectionText(content: SiteContent, section: string, field: "label" | "tagline") {
  return content[`section.${section}.${field}` as SiteContentKey];
}
