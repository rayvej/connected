# AGENTS.md — Workspace Rules for Connected PWA

## Project Overview
- **Name**: Connected — Personal Touchpoints & Memory Log PWA
- **Architecture**: Single HTML5 entrypoint (`index.html`), Vanilla JS (`app.js`), FontAwesome 6 icons, Tailwind CSS / DaisyUI, custom `style.css` HIG design tokens, Firebase Auth v10 SDK.
- **Live URL**: `https://rayvej.github.io/connected/`
- **GitHub Repo**: `https://github.com/rayvej/connected`

## Command Execution & Sandbox Approval Rules
- **Auto-Approve Git & Curl**: Always execute `git add .`, `git commit`, `git push origin main`, `git push -f origin main:gh-pages`, and `curl -s "https://rayvej.github.io/connected/"` directly.
- **Fixed URL Strings**: Use the exact fixed URL string `curl -s "https://rayvej.github.io/connected/"` for status checks to prevent sandbox popup prompts.
- **Zero Ghost Tasks**: Always verify 0 background tasks remain running upon turn completion.
