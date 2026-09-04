type Locale = 'en' | 'hi';

const translations: Record<string, Record<Locale, string>> = {
  'app.name': { en: 'Sanket 2.0', hi: 'संकेत 2.0' },
  'app.tagline': { en: 'Government Counter Accessibility', hi: 'सरकारी काउंटर पहुंच' },
  'login.title': { en: 'Clerk Login', hi: 'क्लर्क लॉगिन' },
  'login.username': { en: 'Username', hi: 'उपयोगकर्ता नाम' },
  'login.password': { en: 'Password', hi: 'पासवर्ड' },
  'login.button': { en: 'Sign In', hi: 'साइन इन' },
  'login.demo': { en: 'Demo Users', hi: 'डेमो उपयोगकर्ता' },
  'dashboard.start_sahayak': { en: 'START SAHAYAK', hi: 'सहायक शुरू करें' },
  'dashboard.readiness': { en: 'Accessibility Readiness', hi: 'पहुंच तत्परता' },
  'dashboard.sessions': { en: "Today's Sessions", hi: 'आज के सत्र' },
  'dashboard.streak': { en: 'Learning Streak', hi: 'सीखने की लकीर' },
  'assist.session_started': { en: 'Session started', hi: 'सत्र शुरू हुआ' },
  'assist.session_ended': { en: 'Session completed', hi: 'सत्र पूरा हुआ' },
  'assist.confidence_high': { en: 'High confidence', hi: 'उच्च विश्वास' },
  'assist.confidence_medium': { en: 'Possible match', hi: 'संभावित मिलान' },
  'assist.confidence_low': { en: 'Low confidence', hi: 'कम विश्वास' },
  'assist.call_interpreter': { en: 'Call Interpreter', hi: 'दुभाषिया को कॉल करें' },
  'assist.end_session': { en: 'End Session', hi: 'सत्र समाप्त करें' },
  'assist.quick_replies': { en: 'Quick Replies', hi: 'त्वरित उत्तर' },
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.error': { en: 'Something went wrong', hi: 'कुछ गलत हो गया' },
  'common.retry': { en: 'Try Again', hi: 'फिर से कोशिश करें' },
  'common.save': { en: 'Save', hi: 'सहेजें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.confirm': { en: 'Confirm', hi: 'पुष्टि करें' },
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem('sanket-locale', locale);
  }
}

export function getLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sanket-locale') as Locale;
    if (stored && (stored === 'en' || stored === 'hi')) {
      currentLocale = stored;
    }
  }
  return currentLocale;
}

export function t(key: string): string {
  return translations[key]?.[currentLocale] || translations[key]?.['en'] || key;
}
