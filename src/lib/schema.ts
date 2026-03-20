export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Neurithm',
    description: 'AI Transformation Agency — empowering enterprises to harness AI strategically, intelligently, and efficiently.',
    url: 'https://neurithm.ai',
    logo: 'https://neurithm.ai/logo.png',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@neurithm.ai',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'AI Readiness Assessment',
        description: 'Free AI readiness assessment scoring organizations across 5 dimensions.',
      },
      {
        '@type': 'Offer',
        name: 'AI Strategy & Consulting',
        description: 'End-to-end AI strategy consulting from assessment through deployment.',
      },
      {
        '@type': 'Offer',
        name: 'AI Agent Development',
        description: 'Custom AI agent development for automation, customer service, sales, and operations.',
      },
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Neurithm',
    url: 'https://neurithm.ai',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://neurithm.ai/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Neurithm',
    description: 'AI transformation consulting, agent development, and process automation.',
    url: 'https://neurithm.ai',
    priceRange: '$$$$',
    areaServed: 'Global',
    serviceType: ['AI Consulting', 'AI Agent Development', 'Process Automation', 'AI Training'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Transformation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Strategy & Consulting',
            description: 'AI readiness assessment, technology roadmap, use case identification, and ROI modeling.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Agent Development',
            description: 'Custom AI agents for workflow automation, lead qualification, and 24/7 operations.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Process Automation',
            description: 'Intelligent automation transforming operations with measurable efficiency gains.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Training & Enablement',
            description: 'AI skills training, literacy workshops, and change management.',
          },
        },
      ],
    },
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function articleSchema(article: {
  title: string
  description: string
  url: string
  datePublished: string
  author: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Neurithm',
      url: 'https://neurithm.ai',
    },
  }
}

export function softwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Readiness Assessment',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free AI readiness assessment that scores your organization across 5 dimensions and provides a personalized transformation roadmap.',
  }
}
