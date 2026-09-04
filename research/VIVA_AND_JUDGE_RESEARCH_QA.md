# Research Viva & Judge Q&A

## Q1. Is SANKET just a sign-language translator?

**Answer:** No. Recognition is one component. SANKET is designed as accessibility infrastructure for government counters, combining immediate assistance, clerk learning, institutional readiness and human escalation.

## Q2. Why not use a huge deep-learning model?

A larger model is not automatically better when the dataset is small or homogeneous. The current lightweight baseline makes inference transparent and allows rigorous incremental data collection and calibration.

## Q3. How do you prevent wrong predictions?

Through hand-quality checks, distance thresholds, class-margin checks, vote ratios and temporal stability. Unknown observations can be rejected rather than forced into the nearest class.

## Q4. How do you measure accuracy?

Using held-out test data after calibration on validation data. We report more than accuracy: precision, recall, F1, macro-F1, confusion matrix and open-set diagnostics where negative samples exist.

## Q5. Why 20–50 samples per sign?

It is a practical prototype data-collection target, not a scientific guarantee. The goal is to replace the original synthetic-only baseline with real camera evidence.

## Q6. What about dynamic signs?

The current frame-based baseline is limited. Dynamic signs require sequence modeling. We explicitly do not claim that the static model solves continuous ISL.

## Q7. Are your SVGs official ISLRTC signs?

No, unless independently validated and appropriately sourced. Prototype assets are labelled with provenance and validation status.

## Q8. Does Google Translation translate ISL?

Not by itself. Human-language translation services should not be described as native ISL translation. SANKET's core ISL recognition remains a separate pipeline.

## Q9. What happens when AI is uncertain?

The system should ask for retry/confirmation or escalate to a human interpreter.

## Q10. What is the research contribution?

The contribution is the counter-level accessibility architecture and evidence workflow around recognition: uncertainty, communication routing, learning, institutional measurement and human escalation.

## Q11. Is this production ready?

It is a national-level prototype. Field validation, broader datasets, ISL-expert review and production interpreter infrastructure are still required.

## Q12. What would you do next?

Conduct signer-aware field validation, expand the dataset, model dynamic signs, involve Deaf/ISL experts, and measure real service-completion outcomes.
