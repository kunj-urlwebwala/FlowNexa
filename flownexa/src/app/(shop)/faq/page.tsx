"use client";

import SectionHeader from "@/components/shared/SectionHeader";
import PageTransition from "@/components/shared/PageTransition";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is FlowNexa's shipping policy?",
      a: "We offer free standard shipping on all orders over $50 within the United States. For orders below $50, a flat shipping fee of $9.99 applies. Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available at checkout for an additional fee.",
    },
    {
      q: "What warranty comes with FlowNexa products?",
      a: "All FlowNexa devices and flagship releases are covered by a comprehensive 2-year manufacturer warranty. This covers any internal software/hardware defects, sound component drops, and connectivity bugs. It does not cover accidental physical damage.",
    },
    {
      q: "How do I return or exchange a product?",
      a: "We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, you can request a return through our support team within 30 days of delivery. The item must be returned in its original packaging with all included accessories.",
    },
    {
      q: "Which payment methods are accepted?",
      a: "We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover) processed securely via Stripe. We also support digital wallets like Apple Pay and Cash on Delivery (COD) in select shipping zones.",
    },
    {
      q: "Can I cancel or modify my order?",
      a: "Orders are processed quickly at our fulfillment centers. You can cancel or modify your order within 1 hour of placing it by contacting our customer care line or sending an email to support@flownexa.com.",
    },
  ];

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white py-10 font-sans min-h-screen">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          
          <SectionHeader
            title="FAQs & Help Desk"
            subtitle="Common questions about our products, shipping, returns, and billing details."
            badge="FAQ Panel"
            align="center"
          />

          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8 mt-6">
            <Accordion type="single" collapsible className="w-full divide-y divide-white/5">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-none py-2.5 first:pt-0 last:pb-0">
                  <AccordionTrigger className="text-sm font-bold text-white hover:text-flownexa-lime hover:no-underline text-left transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
