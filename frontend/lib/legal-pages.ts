export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{ heading: string; body: string[] }>;
};

export const LEGAL_LAST_UPDATED = "2026-06-18";

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How GATEPrep Pro collects, uses, stores, and protects user data for an Indian SaaS learning platform.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect account details such as name, email address, authentication provider, profile preferences, study goals, uploaded learning material, notes, tests, flashcards, analytics events, billing metadata, and support messages.",
          "Payment data is processed by Razorpay. We store payment identifiers, order/subscription references, invoice metadata, payment status, and limited billing details needed for accounting, support, fraud prevention, and subscription access.",
        ],
      },
      {
        heading: "Use of information",
        body: [
          "We use data to provide study tools, personalize GATE EE preparation, enforce subscription limits, process payments, detect abuse, improve reliability, provide support, and comply with Indian legal, tax, and security obligations.",
          "AI features may process prompts and generated outputs. Users should avoid uploading sensitive personal data into prompts or study material.",
        ],
      },
      {
        heading: "Storage, security, and retention",
        body: [
          "Access is user-scoped on the server. Storage-heavy files use approved-account controls, quota checks, signed URLs or protected local routes, and path traversal protection.",
          "We retain account, billing, and security records as needed for service operation, legal claims, taxation, audit, and dispute handling. Users may contact support for deletion or correction requests subject to lawful retention duties.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You may request access, correction, export, or deletion of your personal data by contacting us. Transaction records may be retained where required by law.",
          "You can control browser cookies through browser settings. Some essential cookies are required for sign-in, security, and subscription state.",
        ],
      },
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    description: "Terms governing access to GATEPrep Pro study tools, subscriptions, AI features, and user content.",
    sections: [
      {
        heading: "Service scope",
        body: [
          "GATEPrep Pro provides SaaS learning tools for GATE Electrical Engineering preparation, including notes, flashcards, PYQs, tests, analytics, timetable planning, uploads, and AI-assisted coaching.",
          "The platform is not affiliated with, endorsed by, or sponsored by IITs, IISc, GATE, or any official examination authority.",
        ],
      },
      {
        heading: "User responsibilities",
        body: [
          "Users must provide accurate account and billing information, use the service lawfully, avoid uploading unlawful or infringing content, and protect their login credentials.",
          "Users may not bypass quotas, reverse engineer paid features, abuse AI or storage resources, interfere with service security, or resell access without written permission.",
        ],
      },
      {
        heading: "Subscriptions and access",
        body: [
          "Trial access is limited by quota. Premium access begins only after server-side payment verification or a verified Razorpay webhook confirms payment or subscription activation.",
          "We may change features, pricing, limits, or availability with reasonable notice where required. Continued use after changes means acceptance of the updated terms.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "The service is provided on an as-is and as-available basis. We do not guarantee exam selection, rank, marks, admission, scholarship, placement, or uninterrupted access.",
          "To the maximum extent permitted by Indian law, liability is limited to the amount paid by the user for the affected subscription period.",
        ],
      },
    ],
  },
  {
    slug: "refund-cancellation-policy",
    title: "Refund & Cancellation Policy",
    description: "Cancellation and refund terms for GATEPrep Pro Premium purchases and Razorpay subscriptions.",
    sections: [
      {
        heading: "Cancellations",
        body: [
          "Users may request cancellation through the subscription dashboard or by contacting support. Cancellation stops future renewals but does not automatically delete study data.",
          "Recurring access continues until the paid billing period ends unless the subscription is cancelled, refunded, or terminated for misuse.",
        ],
      },
      {
        heading: "Refund eligibility",
        body: [
          "Refunds are reviewed case by case for duplicate payments, technical failure preventing access, mistaken charges, or other legally required reasons under applicable Indian consumer protection principles.",
          "Refunds are generally not issued for partial usage, change of mind after substantial feature use, exam outcome dissatisfaction, or violations of the Terms of Service.",
        ],
      },
      {
        heading: "Processing",
        body: [
          "Approved refunds are processed to the original payment method through Razorpay or the payment provider. Bank and provider timelines may vary.",
          "Refund requests should include registered email, payment id, order/subscription id, invoice details, and a short reason.",
        ],
      },
    ],
  },
  {
    slug: "subscription-terms",
    title: "Subscription Terms",
    description: "Premium plan, renewal, trial quota, and billing terms for GATEPrep Pro.",
    sections: [
      {
        heading: "Trial plan",
        body: [
          "Trial access includes cost-optimized limits for AI usage, notes, flashcards, PYQs, mock tests, timetable generation, analytics, storage, exports, and advanced AI features.",
          "Trial limits are enforced server-side. Creating another route request or changing client code does not increase quota.",
        ],
      },
      {
        heading: "Premium plan",
        body: [
          "Premium unlocks unlimited access to core learning tools, advanced analytics, premium exports, study planner, and future premium features subject to fair use and technical safeguards.",
          "Premium status is granted only after verified payment, verified subscription charge, or manual admin action recorded in the billing system.",
        ],
      },
      {
        heading: "Renewal and expiry",
        body: [
          "Recurring subscriptions renew according to the Razorpay plan. One-time purchases grant access for the period shown during checkout.",
          "If renewal fails, subscription status may become pending, expired, or cancelled, and the account may return to trial limits.",
        ],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: "Cookie and local storage use for authentication, security, analytics, and preferences.",
    sections: [
      {
        heading: "Essential cookies",
        body: [
          "We use essential cookies and similar browser storage for sign-in, session security, CSRF protection, theme preference, and app functionality.",
          "Disabling essential cookies may prevent login, billing verification, and protected study tools from working correctly.",
        ],
      },
      {
        heading: "Analytics and performance",
        body: [
          "We may use privacy-conscious analytics and logs to understand performance, errors, and product usage. These help improve reliability and abuse prevention.",
          "Browser controls can delete or block cookies. Some preference and session behavior may reset after deletion.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description: "Educational, AI, exam, and content disclaimers for GATEPrep Pro.",
    sections: [
      {
        heading: "Educational use",
        body: [
          "GATEPrep Pro is an educational preparation tool. It does not guarantee GATE score, rank, admission, employment, scholarship, or any official outcome.",
          "Cutoff predictions, analytics, and AI responses are estimates generated from available inputs and should be verified with official sources and expert judgement.",
        ],
      },
      {
        heading: "AI and user content",
        body: [
          "AI-generated explanations, quizzes, timetables, and suggestions may contain mistakes. Users should review all generated material before relying on it.",
          "Users are responsible for uploaded content and for ensuring they have rights to use any material they store or process through the platform.",
        ],
      },
    ],
  },
  {
    slug: "contact-us",
    title: "Contact Us",
    description: "Contact GATEPrep Pro for support, billing, privacy, refunds, and compliance requests.",
    sections: [
      {
        heading: "Support",
        body: [
          "For account, subscription, billing, refund, privacy, or technical support, contact us at support@gateprep.pro.",
          "Include your registered email, payment id or subscription id when relevant, screenshots if useful, and a short description of the issue.",
        ],
      },
      {
        heading: "Response times",
        body: [
          "We aim to respond to support and billing requests within a reasonable working timeframe. Complex disputes, bank/payment-provider delays, and legal requests may take longer.",
          "For privacy or data requests, clearly mention the right you want to exercise: access, correction, export, deletion, consent withdrawal, or grievance escalation.",
        ],
      },
    ],
  },
  {
    slug: "about-us",
    title: "About Us",
    description: "About GATEPrep Pro and its mission for GATE Electrical Engineering preparation.",
    sections: [
      {
        heading: "Mission",
        body: [
          "GATEPrep Pro helps Electrical Engineering aspirants organize preparation with structured notes, PYQs, flashcards, tests, study planning, analytics, and AI coaching.",
          "The product is designed around focused preparation workflows rather than generic course browsing: plan, practice, revise, measure, and improve.",
        ],
      },
      {
        heading: "Product principles",
        body: [
          "We centralize subject names, user-scoped data access, server-side quota checks, and verified billing so learners get a predictable and secure SaaS experience.",
          "We continue to improve compliance, reliability, affordability, and accessibility for Indian students preparing for competitive exams.",
        ],
      },
    ],
  },
  {
    slug: "editorial-policy",
    title: "Editorial Policy",
    description: "How GATEPrep creates, reviews, updates, and corrects educational content.",
    sections: [
      {
        heading: "Content standards",
        body: [
          "Published content should be useful, accurate, exam-relevant, and clearly separated from user opinion or community discussion.",
          "Authors should prioritize official syllabus alignment, previous-year paper relevance, transparent assumptions, and regular updates when exam patterns or platform features change.",
        ],
      },
      {
        heading: "Review and corrections",
        body: [
          "Admin-managed content supports draft, review, published, and archived states. Corrections can be made through the content management workflow and republished with updated metadata.",
          "Readers may report errors through the contact page. Material corrections are prioritized when they affect formulas, answer keys, exam guidance, or billing and compliance information.",
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return LEGAL_PAGES.find((page) => page.slug === slug);
}
