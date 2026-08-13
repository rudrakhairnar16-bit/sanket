/**
 * @deprecated Use the kNN-based classifier (knn-classifier.ts) instead.
 * This rule-based classifier only recognises 5 signs and is kept for
 * backward compatibility with SignPractice. New code should import
 * `classifier` from `@/lib/knn-classifier`.
 */
const SIGNS = {
  NAMASTE: "Namaste",
  THANK_YOU: "Thank You",
  WAIT: "Wait",
  YES: "Yes",
  NO: "No",
} as const;

export type SignName = (typeof SIGNS)[keyof typeof SIGNS];

export interface ClassificationResult {
  sign: SignName | null;
  confidence: number;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function fingerExtended(
  tip: { x: number; y: number },
  pip: { x: number; y: number },
  mcp: { x: number; y: number }
): boolean {
  return distance(tip, pip) > distance(pip, mcp) * 1.4;
}

function thumbExtended(
  tip: { x: number; y: number },
  ip: { x: number; y: number },
  mcp: { x: number; y: number }
): boolean {
  return distance(tip, ip) > distance(ip, mcp) * 1.2;
}

export function classifySign(
  landmarks: { x: number; y: number }[]
): ClassificationResult {
  if (landmarks.length < 21) return { sign: null, confidence: 0 };

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];
  const indexTip = landmarks[8];
  const indexPip = landmarks[6];
  const indexMcp = landmarks[5];
  const middleTip = landmarks[12];
  const middlePip = landmarks[10];
  const middleMcp = landmarks[9];
  const ringTip = landmarks[16];
  const ringPip = landmarks[14];
  const ringMcp = landmarks[13];
  const pinkyTip = landmarks[20];
  const pinkyPip = landmarks[18];
  const pinkyMcp = landmarks[17];

  const thumbExt = thumbExtended(thumbTip, thumbIp, thumbMcp);
  const indexExt = fingerExtended(indexTip, indexPip, indexMcp);
  const middleExt = fingerExtended(middleTip, middlePip, middleMcp);
  const ringExt = fingerExtended(ringTip, ringPip, ringMcp);
  const pinkyExt = fingerExtended(pinkyTip, pinkyPip, pinkyMcp);

  const extendedCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;
  const allExtended = indexExt && middleExt && ringExt && pinkyExt;

  const thumbTipToWrist = distance(thumbTip, wrist);
  const indexTipToWrist = distance(indexTip, wrist);

  const thumbToIndexTip = distance(thumbTip, indexTip);

  if (allExtended && thumbExt) {
    return { sign: SIGNS.WAIT, confidence: 0.85 };
  }

  if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
    if (!thumbExt) {
      return { sign: SIGNS.YES, confidence: 0.8 };
    }
    if (thumbExt && thumbTip.y < wrist.y) {
      return { sign: SIGNS.YES, confidence: 0.7 };
    }
  }

  if (indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) {
    return { sign: SIGNS.NO, confidence: 0.75 };
  }

  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    if (indexTipToWrist < thumbTipToWrist) {
      return { sign: SIGNS.NAMASTE, confidence: 0.6 };
    }
  }

  return { sign: null, confidence: 0 };
}

export function classifyTwoHands(
  hands: { x: number; y: number }[][]
): ClassificationResult {
  if (hands.length < 2) return { sign: null, confidence: 0 };

  const leftPalm = {
    x: (hands[0][9].x + hands[0][0].x) / 2,
    y: (hands[0][9].y + hands[0][0].y) / 2,
  };
  const rightPalm = {
    x: (hands[1][9].x + hands[1][0].x) / 2,
    y: (hands[1][9].y + hands[1][0].y) / 2,
  };

  const palmDist = distance(leftPalm, rightPalm);

  if (palmDist < 0.15) {
    const leftFingers = hands[0].slice(4, 21);
    const rightFingers = hands[1].slice(4, 21);
    const avgTipDist =
      leftFingers.reduce((sum, lf, i) => sum + distance(lf, rightFingers[i]), 0) /
      leftFingers.length;

    if (avgTipDist < 0.1) {
      return { sign: SIGNS.NAMASTE, confidence: 0.9 };
    }
  }

  return { sign: null, confidence: 0 };
}

export const SIGN_REFERENCE: Record<
  SignName,
  { description: string; icon: string; hint: string }
> = {
  Namaste: {
    description: "Press both palms together in front of chest",
    icon: "🙏",
    hint: "Both hands, palms touching, fingers pointing up",
  },
  "Thank You": {
    description: "Open palm facing out near chin, move slightly outward",
    icon: "👋",
    hint: "One hand, all fingers open, palm facing camera",
  },
  Wait: {
    description: "Open palm facing outward, fingers together",
    icon: "✋",
    hint: "One hand, palm facing camera, all fingers extended",
  },
  Yes: {
    description: "Make a fist and nod slightly",
    icon: "✊",
    hint: "Closed fist, thumb may be on top",
  },
  No: {
    description: "Point index finger up and wag side to side",
    icon: "☝️",
    hint: "Index finger pointing up, other fingers closed",
  },
};

export function getTargetSign(moduleTitle: string): SignName {
  const title = moduleTitle.toLowerCase();
  if (title.includes("namaste") || title.includes("hello")) return SIGNS.NAMASTE;
  if (title.includes("thank")) return SIGNS.THANK_YOU;
  if (title.includes("wait")) return SIGNS.WAIT;
  if (title.includes("yes")) return SIGNS.YES;
  if (title.includes("no")) return SIGNS.NO;
  return SIGNS.WAIT;
}
