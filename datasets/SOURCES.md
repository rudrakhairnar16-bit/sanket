# SANKET External ISL Dataset Integration

SANKET uses external ISL datasets as **offline model-development inputs**, not as assets shipped to the browser.

## Approved sources

### 1. INCLUDE — primary external ISL recognition source
- Source: AI4Bharat / Zenodo
- 4,292 isolated-sign videos, 263 word signs
- License: CC BY 4.0
- Use: offline landmark extraction and research benchmarking
- Source: https://zenodo.org/records/4010759
- Metadata: https://huggingface.co/datasets/ai4bharat/INCLUDE

### 2. INCLUDE via OpenHands pose release
- Source: AI4Bharat OpenHands
- Indian pose dataset release is supported by the project
- Use: pose/landmark experiments and benchmarking
- Source: https://openhands.ai4bharat.org/en/latest/instructions/datasets.html

### 3. RealSign
- Source: RealSign62
- 26 ISL fingerspelled alphabets, with train/test/validation images
- License: CC0-1.0 according to the repository
- Use: optional A-Z/fingerspelling module; **not** mixed into the municipal-word classifier
- Source: https://github.com/RealSign62/RealSign-Indian-Sign-Language-Dataset

### 4. ISLRTC Dictionary
- Source: Indian Sign Language Research and Training Centre, Government of India
- 10,000 terms; video dictionary
- Use: vocabulary/reference validation and sign-content provenance
- Source: https://islrtc.nic.in/isl-dictionary/

### 5. FDMSE-ISL
- Large isolated ISL research dataset: 40,033 videos across 2,002 words
- License should be verified from the dataset owner before redistribution or deployment
- Use: future large-scale offline training/benchmarking; do not bundle into the web app
- Reference: https://paperswithcode.com/dataset/fdmse-isl

## Why raw videos are not bundled

Raw datasets can be hundreds of MB to many GB, and their licenses differ. SANKET therefore keeps only:
- dataset source metadata,
- label mappings,
- conversion scripts,
- processed landmark import support,
- and locally captured deployment-calibration samples.

This keeps the production web bundle small and avoids silently redistributing third-party datasets.
