# Literature Review — Indian Sign Language Recognition and Translation

## Scope

This review focuses on research and authoritative resources relevant to SANKET's recognition and accessibility architecture.

## 1. ISLRTC Dictionary

ISLRTC states that the Indian Sign Language Dictionary contains 10,000 terms across everyday, academic, legal/administrative, medical, technical and agricultural categories. It also notes regional signs, synonyms and context-dependent meanings.

**Implication:** a label such as an English word is not always sufficient to represent an ISL sign.

ISLRTC further states that the dictionary can be used for research, teaching and technology development subject to non-resale/non-profiteering and acknowledgement conditions.

## 2. Image-Based ISL Recognition

The 2023 review “Image-based Indian Sign Language Recognition: A Practical Review using Deep Neural Networks” surveys image-based recognition and discusses CNN approaches for ISL.

**Relevance:** supports the feasibility of visual recognition while highlighting the broader communication problem.

## 3. Live / Deep Learning Recognition

“Indian Sign Language Detection Using Deep Learning” presents live-video-oriented ISL detection with a CNN-based approach.

**Relevance:** confirms that real-time recognition is an established research direction.

## 4. CNN + LSTM

“Translating the unspoken Deep learning approaches to Indian Sign Language recognition using CNN and LSTM networks” combines spatial and temporal modeling.

**Relevance:** temporal modeling is important when moving from isolated static signs toward sequences.

## 5. ISLTranslate

ISLTranslate introduces a continuous ISL-English dataset with roughly 30k/31k sentence or phrase pairs.

**Relevance:** useful for future continuous translation research. It is not interchangeable with SANKET's current isolated counter-sign task.

The repository states a CC-BY-NC license for its CISLR dataset material; licensing must therefore be respected and verified before redistribution or commercial use.

## 6. INCLUDE

INCLUDE is a word-level ISL video dataset reported with 4,292 videos and 263 word signs.

**Relevance:** useful for isolated word-level research and future benchmark expansion.

## 7. Research Synthesis

Across these resources, several themes recur:

- dataset scale matters;
- signer diversity matters;
- static and continuous recognition are different tasks;
- evaluation protocol matters;
- high benchmark accuracy does not equal field performance;
- linguistic context matters.

SANKET adopts these findings by emphasizing constrained vocabulary, real-camera validation, rejection, confusion analysis and explicit limitations.

## Research Gap Identified

Most recognition research optimizes recognition itself. SANKET focuses on the operational layer surrounding recognition at a government counter: communication direction, uncertainty, escalation, clerk learning and institutional readiness.

## References

See `REFERENCES.md`.
