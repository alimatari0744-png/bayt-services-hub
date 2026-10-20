import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RequestForm } from "./RequestForm";
import type { Service } from "@/lib/services";

export function RequestDialog({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full">اطلب الخدمة</Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle className="text-right">طلب: {service.title}</DialogTitle>
        </DialogHeader>
        <RequestForm serviceId={service.id} onSent={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
