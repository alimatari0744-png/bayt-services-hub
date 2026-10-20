CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.service_section AS ENUM ('general', 'real_estate', 'student');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_role AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section public.service_section NOT NULL,
  category text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price text,
  location text,
  image_url text,
  keywords text NOT NULL DEFAULT '',
  contact_phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active" ON public.services FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin insert" ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update" ON public.services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.requests TO anon, authenticated;
GRANT SELECT, DELETE ON public.requests TO authenticated;
GRANT ALL ON public.requests TO service_role;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request" ON public.requests FOR INSERT TO anon, authenticated WITH CHECK (length(name) BETWEEN 1 AND 100 AND length(phone) BETWEEN 5 AND 20 AND length(message) <= 1000);
CREATE POLICY "admin read requests" ON public.requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete requests" ON public.requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'service-images');
CREATE POLICY "admin upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.services (section, category, title, description, price, location, keywords) VALUES
('general','حكومية','تجديد الإقامة','إنجاز معاملات تجديد الإقامة بسرعة وبدون مراجعة.','150 ر.س','الرياض','اقامة جوازات تجديد مقيم'),
('general','حكومية','استخراج رخصة قيادة','متابعة طلب رخصة القيادة وحجز المواعيد.','200 ر.س','الرياض','رخصة سواقة مرور قيادة'),
('general','طباعة وتصوير','طباعة وتصوير مستندات','طباعة ملونة وأبيض وأسود وتغليف.','من 1 ر.س','المركز','طباعه تصوير ورق تغليف'),
('general','ترجمة','ترجمة معتمدة','ترجمة معتمدة للوثائق الرسمية بعدة لغات.','80 ر.س للصفحة','عن بُعد','ترجمه انجليزي وثائق'),
('real_estate','شقق','شقة 3 غرف للإيجار','شقة حديثة بحي النرجس، 3 غرف وصالة ومطبخ راكب.','45,000 ر.س سنوياً','حي النرجس','شقه ايجار سكن عوائل'),
('real_estate','فلل','فيلا دورين للبيع','فيلا فاخرة بمسبح وحديقة، مساحة 400م.','2,300,000 ر.س','حي الملقا','فله بيع مسبح'),
('real_estate','أراضي','أرض سكنية للبيع','أرض على شارعين، صك إلكتروني.','900,000 ر.س','شمال الرياض','ارض قطعه بيع صك'),
('real_estate','محلات تجارية','محل تجاري على شارع رئيسي','محل بواجهة زجاجية مساحة 80م.','60,000 ر.س سنوياً','طريق الملك فهد','محل تجاري ايجار'),
('student','أبحاث وتقارير','إعداد بحوث وتقارير','مساعدة في تنسيق وإعداد البحوث الجامعية.','من 100 ر.س','عن بُعد','بحث تقرير جامعه'),
('student','عروض تقديمية','تصميم عروض بوربوينت','عروض احترافية جذابة لمشاريع التخرج.','70 ر.س','عن بُعد','بوربوينت عرض تقديمي باوربوينت'),
('student','دروس خصوصية','دروس رياضيات وفيزياء','مدرسين متخصصين لجميع المراحل.','120 ر.س للساعة','حضوري / أونلاين','مدرس رياضيات فيزياء خصوصي'),
('student','قبول وتسجيل','التسجيل في الجامعات','متابعة القبول والتسجيل ورفع الوثائق.','150 ر.س','عن بُعد','قبول تسجيل جامعه منح');