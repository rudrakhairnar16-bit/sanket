#!/usr/bin/env bash
set -euo pipefail
mkdir -p external-datasets

echo "SANKET dataset downloader"
echo "This downloads upstream archives locally; it does not bundle them into the production web app."

echo ""
echo "RealSign (CC0-1.0, alphabet):"
echo "  https://github.com/RealSign62/RealSign-Indian-Sign-Language-Dataset"
echo ""
echo "INCLUDE (CC BY 4.0, 4,292 isolated-sign videos):"
echo "  https://zenodo.org/records/4010759"
echo ""
echo "OpenHands INCLUDE pose data:"
echo "  https://openhands.ai4bharat.org/en/latest/instructions/datasets.html"
echo ""
echo "FDMSE-ISL (license must be checked with upstream before redistribution):"
echo "  https://paperswithcode.com/dataset/fdmse-isl"
echo ""
echo "ISLRTC official dictionary/reference:"
echo "  https://islrtc.nic.in/isl-dictionary/"
echo ""
echo "NOTE: FDMSE-ISL and INCLUDE can be large. The SANKET web bundle intentionally does not ship raw third-party datasets."
