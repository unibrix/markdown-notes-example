# Inklify – Your AI‑Powered Markdown Notebook

Inklify helps you turn quick thoughts into clear, beautiful notes.  
Write in Markdown, preview instantly, and let AI help you refine your ideas — all in one clean, responsive workspace.

---

## 🚀 Currently hosted at:
### https://inklify.netlify.app/

---

## ✨ What You Can Do with Inklify

### **📝 Write Markdown with Ease**
A simple editor that supports headings, lists, tables, code blocks, and more.  
Your note appears in a live preview so you always see the final look.

<img alt="Inklify main page" src="./readme/assets/Screenshot%202025-12-04%20at%2013.49.14.png">

### **💾 Never Lose Your Work**
Inklify autosaves after a short pause, so everything you write is safely stored.

### **🖥️ Great on Large Screens**
A desktop‑style layout shows your notes list, editor, and preview side‑by‑side.  
Resize panels however you like.

<img alt="Resize panels" src="./readme/assets/Screenshot%202025-12-04%20at%2013.50.25.png">

### **📱 Optimized for Mobile**
On phones, the workspace switches to tabs:  
**Notes → Edit → Preview** — with an AI button always easy to reach.

<img alt="Inklify responsive" src="./readme/assets/Screenshot%202025-12-04%20at%2013.55.00.png">

### **🤖 AI That Helps You Write**
Select text or press the AI button to:
- Improve writing
- Expand ideas
- Summarize content
- Generate from scratch
  All powered by a Supabase Edge Function.

### **⭐️ Expand Your Ideas**
<img alt="Expand text with AI" src="./readme/assets/Screenshot%202025-12-04%20at%2014.01.38.png">

<img alt="Expand text with AI" src="./readme/assets/Screenshot%202025-12-04%20at%2014.02.20.png">

### **🛠️ Create with AI Assistance**
<img alt="Create text with AI" src="./readme/assets/Screenshot%202025-12-04%20at%2014.05.05.png">

<img alt="Create text with AI" src="./readme/assets/Screenshot%202025-12-04%20at%2014.05.42.png">

### **⬇️ Export Your Notes**
Download any note as a `.md` file with a single click.

---

## 🧰 What’s Inside (High‑Level Overview)

- **Frontend:** React + Vite + Tailwind for a fast and pleasant UI
- **Storage:** Supabase for authentication and syncing your notes
- **AI:** A Supabase Edge Function that sends prompts to the Lovable AI Gateway
- **Responsive Layout:** Works smoothly on both widescreen desktops and phones

---

## 🚀 Getting Started

### 1. Install the project
```bash
git clone <repo>
cd inklify
npm install
```

### 2. Add your environment variables
Create a file named `.env`:
```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
```

Make sure your Supabase project includes the database migration and the `ai-assist` Edge Function.

### 3. Run Inklify locally
```bash
npm run dev
```
Open the printed URL and sign up or sign in.

---

## 🧭 How to Use Inklify

- **Create, search, and delete notes** from the sidebar
- **Write using Markdown** in a clean editor
- **See changes instantly** in the live preview
- **Let AI help** when you need inspiration or editing
- **Export** your final note as a Markdown file
- **Use mobile mode** for a smooth, compact writing flow

---

Enjoy writing with Inklify! ✍️
