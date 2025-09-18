git clone https://github.com/Blue-Chocolate/impact-track-dashboard.git
cd impact-track-dashboard
2. Install dependencies
bash
Copy code
npm install
3. Start JSON Server (mock API)
bash
Copy code
npm run server
Runs at http://localhost:4000

Mock endpoints for projects, impactEntries, donors, settings

4. Start the development server
bash
Copy code
npm run dev
Runs Vite dev server at http://localhost:5173

5. Storybook (UI component library)
bash
Copy code
npm run storybook
Runs Storybook at http://localhost:6006

6. Testing
Unit / Integration tests:

bash
Copy code
npm run test
Vitest UI:

bash
Copy code
npm run test:ui
Cypress E2E:

bash
Copy code
npm run cy:open   # open Cypress GUI
npm run cy:run    # run headless
⚡ Scripts Overview
Script	Description
dev	Start Vite dev server
server	Start JSON Server (mock API)
build	Build production bundle
preview	Preview production build
storybook	Run Storybook dev server
build-storybook	Build Storybook static files
test	Run Vitest tests
test:ui	Run Vitest UI
cy:open	Open Cypress GUI
cy:run	Run Cypress headless

🔗 Notes
Project uses TypeScript and React 19.x

State management: Redux Toolkit

UI: TailwindCSS + shadcn/ui + HeroIcons

Charts: Recharts

PDF export: jsPDF + html2canvas

Notifications: react-hot-toast

Form validation: Zod + react-hook-form

