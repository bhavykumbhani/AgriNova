export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Marketplace', path: '/marketplace' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'About', path: '/about' },
  { name: 'Support', path: '/support' },
  { name: 'Contact', path: '/contact' },
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Create Your Account',
    description: 'Join AgriNova as a farmer or buyer in minutes with secure verification.',
    tag: 'Quick Onboarding',
  },
  {
    step: 2,
    title: 'List or Search Crops',
    description: 'Farmers publish available produce with photos and grade, while buyers discover verified crops.',
    tag: 'Direct Discovery',
  },
  {
    step: 3,
    title: 'Connect & Negotiate',
    description: 'Discuss quantity, quality specs, delivery terms, and fair pricing without intermediaries.',
    tag: 'Transparent Chat',
  },
  {
    step: 4,
    title: 'Trade & Deliver',
    description: 'Finalize the deal with verified agreements and arrange convenient transport or farm pickup.',
    tag: 'Secure Settlement',
  },
];

export const WHY_CHOOSE_ITEMS = [
  {
    id: 'better-prices',
    title: 'Better Prices',
    description: 'Connect directly with more buyers and discover premium selling opportunities without middleman commissions.',
    icon: 'Leaf',
    badge: 'Higher Margins',
  },
  {
    id: 'data-driven',
    title: 'Data-Driven Decisions',
    description: 'Access hyperlocal weather forecasts, live mandi prices, and actionable agricultural insights for timely harvesting.',
    icon: 'BarChart3',
    badge: 'Smart Intelligence',
  },
  {
    id: 'direct-transparent',
    title: 'Direct & Transparent',
    description: 'Communicate openly between farmers and verified buyers with clear quality standards and price transparency.',
    icon: 'ShieldCheck',
    badge: 'Zero Hidden Fees',
  },
  {
    id: 'stronger-communities',
    title: 'Stronger Communities',
    description: 'Support sustainable farming ecosystems, empower rural entrepreneurship, and drive regional agricultural growth.',
    icon: 'Users',
    badge: 'Rural Empowerment',
  },
];

export const DECISION_SUPPORT_ITEMS = [
  {
    id: 'weather-intelligence',
    title: 'Weather Intelligence',
    description: 'Hyperlocal micro-climate forecasts, rainfall probabilities, and tailored spray or harvest windows.',
    icon: 'CloudSun',
    status: 'Active Preview',
  },
  {
    id: 'crop-price-insights',
    title: 'Crop Price Insights',
    description: 'Historical price trends across regional APMC mandis to forecast the most profitable selling dates.',
    icon: 'TrendingUp',
    status: 'Active Preview',
  },
  {
    id: 'buyer-demand',
    title: 'Buyer Demand Mapping',
    description: 'Real-time visibility into high-demand crops and institutional buyer requests in your district.',
    icon: 'Target',
    status: 'In Development',
  },
  {
    id: 'crop-recommendations',
    title: 'Crop Recommendations',
    description: 'AI-assisted suitability analysis considering soil parameters, seasonal rainfall, and market economics.',
    icon: 'Sparkles',
    status: 'Upcoming Module',
  },
  {
    id: 'market-trends',
    title: 'Market Trends & Analytics',
    description: 'Aggregated trade volume indices and commodity arrival alerts to prevent distressed sales.',
    icon: 'PieChart',
    status: 'In Development',
  },
];

export const TRUST_ITEMS = [
  {
    title: 'Verified Users',
    description: 'Designed for verified farmer and buyer accounts with identity validation.',
    icon: 'UserCheck',
  },
  {
    title: 'Secure Platform',
    description: 'End-to-end data encryption and protected negotiation channels.',
    icon: 'Lock',
  },
  {
    title: 'Transparent Marketplace',
    description: 'Clear pricing, verified produce grading, and open market records.',
    icon: 'Eye',
  },
  {
    title: 'Data Privacy',
    description: 'Strict adherence to user data protection standards without third-party sharing.',
    icon: 'Shield',
  },
  {
    title: 'Community Support',
    description: 'Dedicated assistance in regional Indian languages for farmers and buyers.',
    icon: 'Headphones',
  },
];

export const FOOTER_LINKS = {
  marketplace: [
    { name: 'Marketplace', path: '/marketplace', key: 'footer.marketplace' },
    { name: 'How It Works', path: '/how-it-works', key: 'footer.howItWorks' },
    { name: 'Farmer Registration', path: '/register/farmer', key: 'footer.farmerReg' },
    { name: 'Buyer Registration', path: '/register/buyer', key: 'footer.buyerReg' },
  ],
  resources: [
    { name: 'FAQ', path: '/faq', key: 'footer.faq' },
    { name: 'Farming Tips', path: '/farming-tips', key: 'footer.farmingTips' },
    { name: 'Support', path: '/support', key: 'footer.support' },
    { name: 'Contact', path: '/contact', key: 'footer.contact' },
  ],
  company: [
    { name: 'About', path: '/about', key: 'footer.about' },
    { name: 'Our Mission', path: '/about#mission', key: 'footer.ourMission' },
  ],
  legal: [
    { name: 'Terms & Conditions', path: '/terms', key: 'footer.terms' },
    { name: 'Privacy Policy', path: '/privacy', key: 'footer.privacy' },
  ],
};
