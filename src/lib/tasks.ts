export interface Task {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  type: "mandatory" | "recommended";
  completed: boolean;
  action: string;
  icon: string;
}

export function getOnboardingTasks(completedCount: number, assistCount: number, lessonCompleted: boolean): Task[] {
  return [
    {
      id: "profile",
      title: "Complete your profile",
      titleHi: "अपनी प्रोफ़ाइल पूरी करें",
      description: "Add your department and designation",
      descriptionHi: "अपना विभाग और पदनाम जोड़ें",
      type: "mandatory",
      completed: completedCount > 0,
      action: "/dashboard/profile",
      icon: "👤",
    },
    {
      id: "first-lesson",
      title: "Complete your first lesson",
      titleHi: "अपना पहला पाठ पूरा करें",
      description: "Start learning basic ISL signs",
      descriptionHi: "बुनियादी ISL संकेत सीखना शुरू करें",
      type: "mandatory",
      completed: lessonCompleted,
      action: "/learn",
      icon: "📚",
    },
    {
      id: "first-assist",
      title: "Try Sanket Sahayak",
      titleHi: "संकेत सहायक आज़माएं",
      description: "Help a citizen at the service desk",
      descriptionHi: "सेवा डेस्क पर एक नागरिक की मदद करें",
      type: "mandatory",
      completed: assistCount > 0,
      action: "/assist",
      icon: "🤝",
    },
    {
      id: "practice",
      title: "Practice a sign",
      titleHi: "एक संकेत का अभ्यास करें",
      description: "Use your camera to practice ISL",
      descriptionHi: "ISL का अभ्यास करने के लिए अपने कैमरे का उपयोग करें",
      type: "recommended",
      completed: false,
      action: "/practice",
      icon: "✋",
    },
    {
      id: "leaderboard",
      title: "Check the leaderboard",
      titleHi: "लीडरबोर्ड देखें",
      description: "See how you rank among colleagues",
      descriptionHi: "देखें आप सहकर्मियों में कैसे रैंक करते हैं",
      type: "recommended",
      completed: false,
      action: "/dashboard/leaderboard",
      icon: "🏆",
    },
  ];
}
