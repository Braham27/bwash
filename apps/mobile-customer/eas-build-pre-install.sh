#!/bin/bash
# EAS Build pre-install hook
# Creates .npmrc with hoisted node-linker for Expo autolinking compatibility
# This only runs during EAS builds, not on Vercel
echo "node-linker=hoisted" > "$EAS_BUILD_WORKINGDIR/.npmrc"
