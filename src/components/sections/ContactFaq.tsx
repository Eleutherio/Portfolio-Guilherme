import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  title: string;
  items: FaqItem[];
};

export function ContactFaq({ title, items }: Props) {
  return (
    <section
      data-contact-faq
      aria-labelledby="contact-faq-heading"
      className="contact-faq section-content-reveal section-content-reveal-late"
    >
      <header className="contact-faq__header">
        <h3 id="contact-faq-heading" className="contact-faq__title">
          {title}
        </h3>
      </header>

      <ol className="contact-faq__list">
        {items.map((item, index) => (
          <li key={item.question} data-contact-faq-item className="contact-faq__item">
            <details className="contact-faq__details">
              <summary className="contact-faq__summary">
                <span aria-hidden="true" className="contact-faq__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="contact-faq__question">{item.question}</span>
                <ChevronDown aria-hidden="true" className="contact-faq__chevron" />
              </summary>
              <p className="contact-faq__answer">{item.answer}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
