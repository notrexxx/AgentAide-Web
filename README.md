# 🌐 AgentAide Web: Digital Property Dossiers

![Next.js](https://img.shields.io/badge/Framework-Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/UI-React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Hosting-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

A lightning-fast, Server-Side Rendered (SSR) microservice designed as the public-facing storefront for the **AgentAide** mobile application. Built with Next.js App Router, this web viewer intercepts WhatsApp bots to dynamically generate rich Open Graph image previews, while providing human clients with a premium, responsive Tailwind CSS property gallery.

## ✨ Core Architecture

- **Dynamic Metadata Injection:** Utilizes Next.js `generateMetadata` to fetch property details from Supabase instantly, injecting `<meta property="og:image">` tags server-side to guarantee massive, rich visual cards in WhatsApp and iMessage.
- **Supabase Real-Time Read Replicas:** Connects directly to the `public_dossiers` table populated by the mobile application.
- **Edge-to-Edge Tailwind UI:** Designed to mimic premium hospitality platforms (like Airbnb). Features responsive masonry galleries, hero banners, and quick-stat semantic grids.
- **Server-Side Rendered (SSR):** Next.js 15 asynchronous route params ensure zero loading spinners for clients; the HTML is generated natively on the server before hitting the browser.

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone [https://github.com/notrexxx/AgentAide-Web.git](https://github.com/notrexxx/AgentAide-Web.git)
cd AgentAide-Web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000/property/[id]` to view a dynamic dossier.

## Author

👤 **Andres Leon**

- GitHub: [@notrexxx](https://github.com/notrexxx)
- LinkedIn: [Emigdio Leon](https://linkedin.com/in/emigdio-leon-689109195)