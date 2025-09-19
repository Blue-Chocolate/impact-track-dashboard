# Impact Track Dashboard

A **Project/Program Management Dashboard** that allows users to view projects, create new projects, and update project details. Admin users have access to restricted actions, and authentication is required for protected routes.

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Blue-Chocolate/impact-track-dashboard.git
cd impact-track-dashboard
2. Install dependencies
bash
Copy code
npm install
3. Start JSON Server (mock API)
You can run the mock API on port 4000 or 4001:

bash
Copy code
# Default
npm run server
# or
json-server --watch src/features/projects/projects.json --port 4000
# or on custom path
npx json-server --watch "D:/xAMPP/htdocs/Hire Quest/impact-track-dashboard/db.json" --port 4001
Runs at: http://localhost:4000/

4. Start Development Server
bash
Copy code
npm run dev
Runs Vite dev server at: http://localhost:5173

5. Storybook (UI component library)
bash
Copy code
npm run storybook
Runs Storybook at: http://localhost:6006

6. Testing
bash
Copy code
npm run test
Runs unit and integration tests.

🌀 Project Flow
1. Overview
This dashboard allows users to manage projects efficiently:

View existing projects

Create new projects

Update project details

Admin users have extra privileges

2. Authentication Flow
Login Page:

Users enter email and password.

On success, a JWT token is created or user data is saved in AuthContext.

Redirects to Dashboard.

Protected Routes:

Pages like "Projects" and "Settings" require login.

Token validation is done before access.

Logout:

Clears user data from Context or Local Storage.

Redirects back to Login page.

3. Dashboard Flow
Projects List Page:

Displays all existing projects.

Shows name, description, number of beneficiaries, start & end dates.

Project Details / Edit:

Clicking a project opens its details.

Admins can edit or delete the project.

Create New Project:

"Create Project" button opens a form.

Form includes validation rules for all fields.

On submission, the project list updates automatically.

4. Settings & Profile Flow
Settings Tabs:

Profile: Edit user information

Security: Change password or manage security settings

Toast Notifications:

Shows short notifications for success or error messages.

5. Data Flow
Fetching Data:

Data comes from JSON Server (mock API).

Endpoints handle specific resources (Projects, Users, etc.).

State Management:

Managed using React Context and/or Redux.

Updates reflect immediately in the UI.

6. Component Flow
AuthContext: Manages login state and token

ProjectForm: Handles project creation & editing with validation

SettingsTabs: Divides settings page into multiple sections

ToastProvider: Shows notifications

Dashboard Components: Cards, tables, buttons for interaction

7. Running the Project
bash
Copy code
# Install dependencies
npm install

# Start JSON Server
npm run server

# Start Development Server
npm run dev
Open in your browser: http://localhost:5173

markdown
Copy code
