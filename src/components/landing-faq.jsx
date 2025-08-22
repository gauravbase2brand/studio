import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LandingFaq() {
  const faqs = [
    {
      question: "What is AdminSlice?",
      answer: "AdminSlice is a comprehensive admin panel designed for food delivery businesses to manage orders, track drivers, handle restaurant information, and analyze performance data all in one place.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial on our Pro plan. You can explore all the features without any commitment. No credit card is required to get started.",
    },
    {
      question: "Can I integrate AdminSlice with my existing website?",
      answer: "Absolutely. Our Enterprise plan includes API access and support for custom integrations to seamlessly connect AdminSlice with your existing systems and workflows.",
    },
    {
      question: "What kind of support do you offer?",
      answer: "We offer email support on the Starter plan, priority support on the Pro plan, and a dedicated account manager with 24/7/365 support for our Enterprise clients.",
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can easily upgrade or downgrade your plan at any time from your account settings to match the changing needs of your business.",
    },

  ];

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
            Find answers to common questions about AdminSlice.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
