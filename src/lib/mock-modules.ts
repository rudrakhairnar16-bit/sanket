// Mock ISL lesson modules used as a fallback when MongoDB Atlas is
// unreachable (local dev / pre-seed deploy). Mirrors the seeded modules.

export interface MockModule {
  _id: string;
  title: string;
  videoUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  order: number;
  active: boolean;
}

export const MOCK_MODULES: MockModule[] = [
  {
    _id: "mm-1",
    title: "Sign: Thank You",
    videoUrl: "https://www.youtube.com/embed/neE5Fg4FVtA",
    question: "What does this sign mean?",
    options: ["Please", "Thank You", "Sorry", "Hello"],
    correctAnswer: "Thank You",
    order: 1,
    active: true,
  },
  {
    _id: "mm-2",
    title: "Sign: Please Wait",
    videoUrl: "https://www.youtube.com/embed/neE5Fg4FVtA",
    question: "What does this sign mean?",
    options: ["Come Here", "Go Away", "Please Wait", "Sit Down"],
    correctAnswer: "Please Wait",
    order: 2,
    active: true,
  },
  {
    _id: "mm-3",
    title: "Sign: Sign Here",
    videoUrl: "https://www.youtube.com/embed/5vHmvYA8Z6Q",
    question: "This sign instructs the citizen to:",
    options: ["Pay Here", "Sign Here", "Stand Here", "Wait Here"],
    correctAnswer: "Sign Here",
    order: 3,
    active: true,
  },
  {
    _id: "mm-4",
    title: "Sign: Water Bill",
    videoUrl: "https://www.youtube.com/embed/5vHmvYA8Z6Q",
    question: "Which department does this sign relate to?",
    options: ["Property Tax", "Police", "Water Bill", "Health"],
    correctAnswer: "Water Bill",
    order: 4,
    active: true,
  },
  {
    _id: "mm-5",
    title: "Sign: Submit",
    videoUrl: "https://www.youtube.com/embed/5vHmvYA8Z6Q",
    question: "What action does this sign indicate?",
    options: ["Cancel", "Submit", "Delete", "Print"],
    correctAnswer: "Submit",
    order: 5,
    active: true,
  },
];
