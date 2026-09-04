export interface ServicePackData {
  id: string;
  serviceName: string;
  serviceNameHi: string;
  department: string;
  description: string;
  descriptionHi: string;
  supportedSigns: string[];
  commonReplies: string[];
  commonRepliesHi: string[];
  escalationRules: string[];
  active: boolean;
}

export const defaultServicePacks: ServicePackData[] = [
  {
    id: "water-tax",
    serviceName: "Water Tax",
    serviceNameHi: "जल कर",
    department: "Water Services",
    description: "Water tax payment, bill queries, and water-related services",
    descriptionHi: "जल कर भुगतान, बिल पूछताछ और जल संबंधी सेवाएं",
    supportedSigns: ["water", "tax", "bill", "payment", "name", "address", "number", "help", "wait", "yes", "no", "certificate"],
    commonReplies: [
      "Please wait a moment.",
      "Please show your water tax bill.",
      "Please show your identity document.",
      "Your payment has been received.",
      "Your application is being processed.",
      "Please enter your phone number.",
      "Please sign here.",
      "I will call an interpreter for you.",
      "Your water tax is due.",
      "Please check your bill amount.",
    ],
    commonRepliesHi: [
      "कृपया एक पल प्रतीक्षा करें।",
      "कृपया अपना जल कर बिल दिखाएं।",
      "कृपया अपना पहचान पत्र दिखाएं।",
      "आपका भुगतान प्राप्त हो गया है।",
      "आपका आवेदन संसाधित हो रहा है।",
      "कृपया अपना फ़ोन नंबर दर्ज करें।",
      "कृपया यहाँ साइन करें।",
      "मैं आपके लिए दुभाषिया बुलाऊंगा।",
      "आपका जल कर बकाया है।",
      "कृपया अपनी बिल राशि जांचें।",
    ],
    escalationRules: ["Low AI confidence (< 0.45)", "Citizen requests interpreter", "Complex bill dispute", "Technical issue"],
    active: true,
  },
  {
    id: "property-tax",
    serviceName: "Property Tax",
    serviceNameHi: "संपत्ति कर",
    department: "Property Services",
    description: "Property tax payment, assessment, and property-related documents",
    descriptionHi: "संपत्ति कर भुगतान, मूल्यांकन और संपत्ति संबंधी दस्तावेज़",
    supportedSigns: ["tax", "payment", "document", "certificate", "name", "address", "number", "help", "wait", "yes", "no", "form"],
    commonReplies: [
      "Please wait a moment.",
      "Please show your property tax receipt.",
      "Please show your property documents.",
      "Your payment has been received.",
      "Please fill out this form.",
      "Please enter your property ID.",
      "I will call an interpreter for you.",
      "Your property tax assessment is pending.",
    ],
    commonRepliesHi: [
      "कृपया एक पल प्रतीक्षा करें।",
      "कृपया अपनी संपत्ति कर रसीद दिखाएं।",
      "कृपया अपने संपत्ति दस्तावेज़ दिखाएं।",
      "आपका भुगतान प्राप्त हो गया है।",
      "कृपया यह फॉर्म भरें।",
      "कृपया अपनी संपत्ति ID दर्ज करें।",
      "मैं आपके लिए दुभाषिया बुलाऊंगा।",
      "आपका संपत्ति कर मूल्यांकन लंबित है।",
    ],
    escalationRules: ["Low AI confidence (< 0.45)", "Property dispute", "Complex assessment query"],
    active: true,
  },
  {
    id: "birth-certificate",
    serviceName: "Birth Certificate",
    serviceNameHi: "जन्म प्रमाणपत्र",
    department: "Citizen Certificates",
    description: "Birth certificate application, status, and correction",
    descriptionHi: "जन्म प्रमाणपत्र आवेदन, स्थिति और सुधार",
    supportedSigns: ["certificate", "form", "name", "address", "date", "number", "help", "wait", "yes", "no", "document"],
    commonReplies: [
      "Please wait a moment.",
      "Please fill out this application form.",
      "Please show your supporting documents.",
      "Your application number is:",
      "Your certificate is ready for collection.",
      "Please enter the date of birth.",
      "I will call an interpreter for you.",
      "Please check back in 7 working days.",
    ],
    commonRepliesHi: [
      "कृपया एक पल प्रतीक्षा करें।",
      "कृपया यह आवेदन पत्र भरें।",
      "कृपया अपने सहायक दस्तावेज़ दिखाएं।",
      "आपका आवेदन संख्या है:",
      "आपका प्रमाणपत्र लेने के लिए तैयार है।",
      "कृपया जन्म तिथि दर्ज करें।",
      "मैं आपके लिए दुभाषिया बुलाऊंगा।",
      "कृपया 7 कार्य दिवसों में वापस जांचें।",
    ],
    escalationRules: ["Low AI confidence (< 0.45)", "Document verification issue", "Complex correction request"],
    active: true,
  },
  {
    id: "complaint",
    serviceName: "Complaint Registration",
    serviceNameHi: "शिकायत पंजीकरण",
    department: "General Services",
    description: "File complaints, track status, and general citizen grievances",
    descriptionHi: "शिकायत दर्ज करें, स्थिति ट्रैक करें और सामान्य नागरिक शिकायतें",
    supportedSigns: ["complaint", "help", "name", "phone", "number", "address", "wait", "yes", "no", "emergency"],
    commonReplies: [
      "Please wait a moment.",
      "Please describe your complaint.",
      "Please enter your contact number.",
      "Your complaint has been registered.",
      "Your complaint number is:",
      "I will call an interpreter for you.",
      "Someone will contact you within 48 hours.",
    ],
    commonRepliesHi: [
      "कृपया एक पल प्रतीक्षा करें।",
      "कृपया अपनी शिकायत बताएं।",
      "कृपया अपना संपर्क नंबर दर्ज करें।",
      "आपकी शिकायत दर्ज हो गई है।",
      "आपकी शिकायत संख्या है:",
      "मैं आपके लिए दुभाषिया बुलाऊंगा।",
      "48 घंटे के भीतर कोई आपसे संपर्क करेगा।",
    ],
    escalationRules: ["Low AI confidence (< 0.45)", "Emergency complaint", "Safety concern"],
    active: true,
  },
  {
    id: "general-help",
    serviceName: "General Help",
    serviceNameHi: "सामान्य सहायता",
    department: "General Services",
    description: "General inquiries, directions, and office information",
    descriptionHi: "सामान्य पूछताछ, दिशा-निर्देश और कार्यालय की जानकारी",
    supportedSigns: ["help", "office", "name", "phone", "number", "time", "wait", "yes", "no", "understand", "dont-understand"],
    commonReplies: [
      "Please wait a moment.",
      "How can I help you?",
      "Please take a seat.",
      "The office is open from 10 AM to 5 PM.",
      "Please fill out this form.",
      "I will call an interpreter for you.",
      "Do you need any other help?",
    ],
    commonRepliesHi: [
      "कृपया एक पल प्रतीक्षा करें।",
      "मैं आपकी कैसे मदद कर सकता हूँ?",
      "कृपया बैठ जाइए।",
      "कार्यालय सुबह 10 बजे से शाम 5 बजे तक खुला है।",
      "कृपया यह फॉर्म भरें।",
      "मैं आपके लिए दुभाषिया बुलाऊंगा।",
      "क्या आपको कोई अन्य सहायता चाहिए?",
    ],
    escalationRules: ["Low AI confidence (< 0.45)", "Complex inquiry", "Language barrier"],
    active: true,
  },
];

export function getServicePackById(id: string): ServicePackData | undefined {
  return defaultServicePacks.find((p) => p.id === id);
}

export function getServicePacksByDepartment(department: string): ServicePackData[] {
  return defaultServicePacks.filter((p) => p.department === department);
}

export function getActiveServicePacks(): ServicePackData[] {
  return defaultServicePacks.filter((p) => p.active);
}
