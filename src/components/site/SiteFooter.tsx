import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { useSiteContent } from "@/lib/site-content";
import { contactLinks } from "@/lib/contact-links";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const content = useSiteContent();
  const links = contactLinks(content["contact.phone"]);

  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <Logo light />
          <p className="max-w-xs text-sm text-primary-foreground/70">{content["footer.about"]}</p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-gold">{content["footer.sections_title"]}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/general" className="hover:text-gold">{content["section.general.label"]}</Link></li>
            <li><Link to="/real-estate" className="hover:text-gold">{content["section.real_estate.label"]}</Link></li>
            <li><Link to="/students" className="hover:text-gold">{content["section.student.label"]}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-gold">{content["footer.contact_title"]}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/contact" className="hover:text-gold">{content["footer.contact_link"]}</Link></li>
            <li><Link to="/admin" className="hover:text-gold">{content["footer.admin_link"]}</Link></li>
            {content["contact.phone"] && (
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <a href={links.call} dir="ltr" className="hover:text-gold">{content["contact.phone"]}</a>
              </li>
            )}
            {links.whatsapp && <li>
              <Button asChild variant="ghost" size="sm" className="px-0 text-primary-foreground hover:bg-transparent hover:text-gold">
                <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" title={content["contact.whatsapp_label"]}><MessageCircle />{content["contact.whatsapp_label"]}</a>
              </Button>
            </li>}
            {content["contact.email"] && (
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <a href={`mailto:${content["contact.email"]}`} dir="ltr" className="hover:text-gold">{content["contact.email"]}</a>
              </li>
            )}
            {content["contact.address"] && (
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{content["contact.address"]}</li>
            )}
            {content["contact.hours"] && (
              <li className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{content["contact.hours"]}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {content["site.name"]}. {content["footer.rights"]}
      </div>
    </footer>
  );
}
