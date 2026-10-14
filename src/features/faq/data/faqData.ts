import { siteConfig } from "@/config/site";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: "About" | "Recommendations & Affiliates" | "Trust & Policies" | "Contact";
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 1,
    question: "What is SiddhyySpace?",
    answer:
      "SiddhyySpace is a personal lifestyle and product discovery platform created by Siddhi Singh. It features beauty, skincare, lifestyle essentials, shopping recommendations, and helpful product guides to make discovering interesting products easier.",
    category: "About",
  },
  {
    id: 2,
    question: "Who is Siddhi Singh?",
    answer:
      "Siddhi Singh is the creator of SiddhyySpace. Through this platform, she shares product discoveries, lifestyle inspiration, and useful shopping guides to help readers explore products that suit their interests and needs.",
    category: "About",
  },
  {
    id: 3,
    question: "What can I find on SiddhyySpace?",
    answer:
      "On SiddhyySpace, you can explore beauty and skincare products, lifestyle essentials, product recommendations, shopping guides, and blog articles covering useful products and everyday discoveries.",
    category: "About",
  },
  {
    id: 4,
    question: "Does SiddhyySpace sell products directly?",
    answer:
      "No. SiddhyySpace shares product information and recommendations. Some links may take you to third-party shopping websites where you can check product details, prices, availability, and complete your purchase.",
    category: "Recommendations & Affiliates",
  },
  {
    id: 5,
    question: "Are the product links on SiddhyySpace affiliate links?",
    answer:
      "Some links on SiddhyySpace are affiliate links. This means the website may earn a commission when you make an eligible purchase through these links, at no additional cost to you.",
    category: "Recommendations & Affiliates",
  },
  {
    id: 6,
    question: "How does Siddhi Singh choose products to recommend?",
    answer:
      "Product recommendations are based on available product information, features, intended use, and other relevant details. The goal is to provide helpful information so readers can make informed shopping decisions. Recommendations should not be considered a substitute for checking the latest product details.",
    category: "Recommendations & Affiliates",
  },
  {
    id: 7,
    question: "Are product prices and offers on SiddhyySpace up to date?",
    answer:
      "Prices, discounts, and availability may change over time. Always visit the linked retailer's website to confirm the latest price, offers, specifications, and availability before purchasing.",
    category: "Trust & Policies",
  },
  {
    id: 8,
    question: "Can I trust the product information shared on SiddhyySpace?",
    answer:
      "SiddhyySpace aims to provide useful and clear product information. However, product details and claims may vary by brand or retailer. We encourage readers to review the official product listing, ingredients, specifications, and customer reviews before making a purchase.",
    category: "Trust & Policies",
  },
  {
    id: 9,
    question: "How can I contact Siddhi Singh?",
    answer:
      "For questions, feedback, or business enquiries related to SiddhyySpace, please use the contact information provided on the website's Contact page.",
    category: "Contact",
  },
  {
    id: 10,
    question: "Where can I find more content from SiddhyySpace?",
    answer:
      "You can explore the blogs and product guides on SiddhyySpace and follow its official social media profiles for more product discoveries, shopping inspiration, and lifestyle content.",
    category: "About",
  },
];

export function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: "Frequently Asked Questions – SiddhyySpace",
    url: `${siteConfig.url}/faq`,
    description:
      "Frequently asked questions and answers about SiddhyySpace, Siddhi Singh, product recommendations, shopping guides, and affiliate disclosure.",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
