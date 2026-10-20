import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <Logo light />
          <p className="max-w-xs text-sm text-primary-foreground/70">
            نقدّم خدمات عامة وعقارية وطلابية بجودة وسرعة، لنوفّر وقتك وجهدك.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-gold">الأقسام</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/general" className="hover:text-gold">الخدمات العامة</Link></li>
            <li><Link to="/real-estate" className="hover:text-gold">الخدمات العقارية</Link></li>
            <li><Link to="/students" className="hover:text-gold">الخدمات الطلابية</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-gold">تواصل معنا</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>الهاتف: 0500000000</li>
            <li>البريد: info@example.com</li>
            <li><Link to="/admin" className="hover:text-gold">لوحة الإدارة</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} مركز الخدمات الشاملة. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
