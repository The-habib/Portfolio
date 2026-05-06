import { Timestamp } from "firebase/firestore";

export interface LocalBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  createdAt: Timestamp;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  readingTime: number;
  published: boolean;
}

const createTimestamp = (dateString: string) => Timestamp.fromDate(new Date(dateString));

export const localBlogPosts: LocalBlogPost[] = [
  {
    id: "local-1",
    title: "How to Build a Bio Link App Clone from Scratch",
    slug: "how-to-build-bio-link-app",
    excerpt: "A comprehensive guide on building a high-performance, full-stack Linktree alternative using React, Node.js, and Firebase.",
    coverImage: "https://res.cloudinary.com/djo33javr/image/upload/v1773247852/Create_a_google_play_store_feature_graphic_1024x50_delpmaspu_ttvbcd.jpg",
    createdAt: createTimestamp("2026-03-20T10:00:00Z"),
    seoTitle: "How to Build a Bio Link App Clone (React & Firebase Tutorial)",
    seoDescription: "Learn how to build a free, high-performance Linktree clone from scratch using React, Node.js, and Firebase. Step-by-step full-stack tutorial.",
    tags: ["React", "Firebase", "Tutorial", "Full Stack"],
    readingTime: 12,
    published: true,
    content: `
## The Rise of Bio Link Applications in the Creator Economy

In today's digital landscape, the creator economy is booming. Whether you are a YouTuber, a freelance designer, or a software engineer, having a single, unified landing page is absolutely essential. While platforms like Linktree dominate the market, building your own **Bio Link App** gives you complete control over your data, design, and monetization strategies. 

In this comprehensive, production-grade guide, I will walk you through the architecture, database design, and implementation details of building a high-performance bio link application. You can see the final, polished result in my [Bio Link Project Case Study](/project/bio-link).

### 1. Architectural Decisions: Choosing the Right Tech Stack

When designing a bio link app, two things matter above all else: **performance** and **real-time updates**. The public-facing profile page must load in milliseconds, while the admin dashboard needs to feel snappy and responsive.

Here is the tech stack I chose for this architecture:

*   **Frontend:** React (via Vite) for a snappy, component-driven UI. We use Framer Motion for buttery-smooth drag-and-drop animations.
*   **Backend/Database:** Firebase Firestore. As a NoSQL database with real-time WebSocket capabilities, it's perfect for instantly syncing link reordering.
*   **Styling:** Tailwind CSS. Utility-first CSS allows us to build dynamic theming engines easily.
*   **Hosting:** Vercel or Firebase Hosting for edge caching and global CDN distribution.

### 2. Database Schema Design (Firestore)

Using a NoSQL database like Firestore allows for flexible schema design, but we must structure it carefully to avoid excessive reads. Our primary collection is \`users\`, and each user document contains their profile information and an array of links.

Here is the TypeScript interface defining our schema:

\`\`\`typescript
interface UserProfile {
  uid: string;
  username: string; // Used for the custom URL (e.g., biolink.us.cc/username)
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: {
    backgroundColor: string;
    buttonColor: string;
    textColor: string;
    fontFamily: string;
  };
  links: BioLink[];
  analytics: {
    totalViews: number;
    totalClicks: number;
  };
}

interface BioLink {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
  clicks: number;
}
\`\`\`

Notice that we embed the \`links\` array directly inside the \`UserProfile\` document. Since a user typically has fewer than 50 links, this easily fits within Firestore's 1MB document limit and allows us to fetch the entire profile in a single database read.

### 3. Implementing Real-Time Previews

One of the most engaging features of a bio link builder is the real-time preview. As the user edits their links on the left side of the screen, the mobile mockup on the right should update instantly.

By leveraging Firestore's \`onSnapshot\` listener, we can bind our React state directly to the database. 

\`\`\`typescript
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";

function useProfileData(uid: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      }
    });
    return () => unsub();
  }, [uid]);

  return profile;
}
\`\`\`

When a user updates a link, the change is optimistically rendered and synced to the cloud, triggering an update on the preview component via the snapshot listener.

### 4. Drag and Drop Functionality

To allow users to reorder their links, we implement a drag-and-drop interface. Libraries like \`@dnd-kit/core\` are perfect for this in modern React applications. 

When a drag operation ends, we calculate the new array order, update the \`order\` property of the affected links, and perform a batch write to Firestore to ensure data consistency.

### 5. Performance Optimization & Core Web Vitals

Bio link pages must load instantly, especially on mobile networks (3G/4G). If your page takes longer than 2.5 seconds to load, you will lose visitors and your LCP (Largest Contentful Paint) score will suffer.

Here are the critical optimizations we applied:
*   **Image Optimization:** Serve avatars via a CDN with automatic WebP/AVIF conversion. Never load a 2MB PNG for a 100x100 avatar.
*   **Code Splitting:** Ensure the public-facing profile page is decoupled from the heavy admin dashboard bundle. We use \`React.lazy()\` for this.
*   **Server-Side Rendering (SSR):** Injecting meta tags on the server ensures Twitter and iMessage unfurl the links correctly with the user's avatar.

### Conclusion

Building a bio link app is a fantastic full-stack project that touches on real-time data, complex UI interactions, and performance optimization. It forces you to think about both the creator's experience (the dashboard) and the consumer's experience (the public profile).

If you're interested in finding more data sources for your next project, check out my curated [Free API List for Developers](/blog/free-api-list-for-developers). Or, if you want to see how AI is changing the way we build these apps, dive into the world of [Vibe Coding Tools](/blog/vibe-coding-tools).
    `
  },
  {
    id: "local-2",
    title: "The Ultimate Free API List for Developers in 2026",
    slug: "free-api-list-for-developers",
    excerpt: "A curated list of the best free APIs for your next side project, covering weather, finance, machine learning, and more.",
    coverImage: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2089&auto=format&fit=crop",
    createdAt: createTimestamp("2026-03-22T10:00:00Z"),
    seoTitle: "Best Free API List for Developers (2026 Update)",
    seoDescription: "Discover the ultimate curated list of free APIs for developers. Build your next React, Node.js, or Python project without spending a dime.",
    tags: ["API", "Resources", "Development"],
    readingTime: 10,
    published: true,
    content: `
## Why Use Free APIs for Side Projects?

When building side projects, hackathon prototypes, or portfolio pieces, you rarely want to pay for data. You need reliable, fast, and well-documented endpoints to populate your UI and test your logic. Fortunately, the internet is full of generous platforms offering robust free tiers. 

In this comprehensive guide, I've compiled the ultimate list of free APIs you can use to build your next big idea. I frequently use these APIs when experimenting in my [Creative Lab](/lab) or when building complex architectures like my [Solo Dev Blog Platform](/project/solo-dev).

### 1. Data & Utility APIs (The Essentials)

Every developer needs a solid set of utility APIs for mocking data and handling basic tasks.

*   **JSONPlaceholder:** The holy grail for frontend developers. It provides fake REST API endpoints for posts, comments, users, and todos. It is absolutely perfect for testing React components, loading states, and pagination logic without writing a backend.
*   **OpenWeatherMap:** Offers a generous free tier for current weather data, 5-day forecasts, and historical data. Essential for any dashboard or travel-related project.
*   **REST Countries:** Get comprehensive information about countries via a RESTful API. Includes data on population, borders, currencies, and SVG flags.
*   **RandomUser.me:** Generates random user data (names, emails, avatars, addresses). Great for populating a fake user directory or testing UI layouts.

### 2. Machine Learning & AI APIs

With the rapid rise of AI, integrating intelligence into your apps has never been easier. If you are interested in how AI is fundamentally changing software development, read my deep dive on [Vibe Coding Tools](/blog/vibe-coding-tools).

*   **Hugging Face Inference API:** Access thousands of pre-trained open-source models for text classification, image generation, summarization, and translation for free.
*   **Google Gemini API:** Google offers a highly capable free tier for their Gemini models (like Gemini 1.5 Flash and Pro). It is perfect for text generation, multimodal tasks (analyzing images/video), and building chatbots.
*   **Groq API:** Known for its blistering fast inference speeds (LPU technology), Groq offers a generous free tier for running open-source models like Llama 3 and Mixtral.

### 3. Finance & Cryptocurrency APIs

Building a fintech dashboard? You need reliable market data.

*   **CoinGecko API:** The most comprehensive free cryptocurrency API available. Get live prices, historical charts, market cap data, and exchange volumes without even needing an API key for the public tier.
*   **Alpha Vantage:** Provides free APIs for real-time and historical stock market data, forex, and cryptocurrencies. Note that the free tier has strict rate limits (e.g., 5 requests per minute).
*   **ExchangeRate-API:** A simple and reliable API for currency conversion and historical exchange rates.

### 4. Entertainment & Media APIs

*   **The Movie Database (TMDB):** A fantastic, community-built movie and TV database. Their API is free, incredibly detailed, and provides high-quality poster images. Perfect for building a Netflix clone.
*   **PokeAPI:** The RESTful Pokémon API. A classic choice for learning how to consume APIs, handle pagination, and build Pokedex applications.
*   **Spotify Web API:** While it requires OAuth authentication, Spotify's API allows you to fetch metadata about tracks, albums, artists, and even control playback for premium users.

### Best Practices: How to Secure Your API Keys

Even when using free APIs, you must protect your keys. A leaked API key can result in your account being banned or, worse, unexpected charges if you have a credit card on file.

1.  **Never commit keys to GitHub:** Always use \`.env\` files and add them to your \`.gitignore\`.
2.  **Use a Proxy Server:** If an API requires a secret key, **never** call it directly from your React/Vite frontend. Instead, proxy your requests through a Node.js/Express backend. 
3.  **Implement Rate Limiting:** Protect your own proxy endpoints to prevent abuse.

For an example of a highly secure backend implementation with WebSocket communication, check out the architecture of my [Atpukur Boys Messaging App](/project/atpukur-boys).

### Conclusion

The barrier to entry for building data-rich applications has never been lower. Pick an API from this list, spin up a Vite project, and start building. The best way to learn is by doing.
    `
  },
  {
    id: "local-3",
    title: "Vibe Coding: The Future of AI-Assisted Development",
    slug: "vibe-coding-tools",
    excerpt: "Exploring the paradigm shift of 'Vibe Coding'—how AI tools are changing the way we write, architect, and think about software.",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop",
    createdAt: createTimestamp("2026-03-25T10:00:00Z"),
    seoTitle: "What is Vibe Coding? Best Tools & Workflows for Developers",
    seoDescription: "Learn about Vibe Coding, the new AI-assisted development paradigm. Discover the best tools, workflows, and how it accelerates full-stack engineering.",
    tags: ["AI", "Vibe Coding", "Productivity"],
    readingTime: 14,
    published: true,
    content: `
## What Exactly is "Vibe Coding"?

"Vibe Coding" is a term that has rapidly gained traction in the developer community over the last year. It describes a state of flow where a developer works in tandem with advanced AI models to architect, write, and debug code at unprecedented speeds. 

Instead of getting bogged down in syntax errors, boilerplate setup, and manual refactoring, you focus on the *vibe*—the high-level architecture, the user experience, the business logic, and the overall aesthetic of the application. The AI handles the tedious implementation details.

I heavily utilized vibe coding principles when building my [Solo Dev Blog Platform](/project/solo-dev) and the [Bio Link App](/project/bio-link), reducing development time by over 60%.

### The Core Philosophy: AI as an Exoskeleton

Vibe coding isn't about letting AI do all the work while you sit back. It's about treating **AI as an exoskeleton** that amplifies your existing engineering skills. 

1.  **High-Level Direction:** You act as the lead architect. You provide the vision, define the data models, and prompt the AI with deep context about the system requirements.
2.  **Rapid Iteration:** The AI generates the boilerplate, complex algorithms, or intricate CSS grid layouts in seconds.
3.  **Human Curation & Auditing:** This is the most crucial step. You review, refine, and integrate the generated code. You ensure it meets security standards, handles edge cases, and fits seamlessly into the existing codebase.

### Essential Vibe Coding Tools for 2026

To achieve this state of flow, you need the right environment. Standard text editors are no longer enough. Here are the tools defining the vibe coding era:

#### 1. AI-First IDEs (Cursor & Windsurf)
Tools like Cursor and Windsurf are game-changers. Unlike standard plugins, these IDEs are built from the ground up around AI. They index your entire codebase, allowing you to ask complex, context-aware questions:
*   *"Where is the authentication bug causing the infinite redirect?"*
*   *"Refactor this entire React component to use Tailwind CSS and Framer Motion."*
*   *"Generate a test suite for the \`utils.ts\` file."*

#### 2. Frontier Models (Claude 3.5 Sonnet & Gemini 1.5 Pro)
The underlying models power the experience. Claude 3.5 Sonnet is currently renowned for its coding capabilities and adherence to complex instructions. Gemini 1.5 Pro offers massive context windows (up to 2 million tokens), allowing you to paste entire API documentations, massive log files, or multiple repositories for deep architectural analysis.

#### 3. Inline Autocomplete (GitHub Copilot)
While IDEs handle the big architectural changes, tools like GitHub Copilot Enterprise remain the standard for inline autocomplete. It predicts your next lines of code with eerie accuracy, effectively typing out your thoughts as you form them.

### The Shift in Developer Skills

As vibe coding becomes the industry norm, the skills required to be a senior engineer are fundamentally shifting. Memorizing specific API syntax is becoming less important than:

*   **Prompt Engineering & Context Management:** Knowing how to ask the right questions, provide the right constraints, and manage the AI's context window effectively.
*   **Code Review & Security Auditing:** The ability to quickly read, verify, and secure AI-generated code. AI can hallucinate vulnerabilities; the human must catch them.
*   **Systems Architecture:** Understanding how different pieces of a full-stack application fit together. You need to know *what* to build before you can tell the AI *how* to build it.

### Practical Workflow: Building a Feature

Let's say you want to integrate a weather widget using an endpoint from our [Free API List for Developers](/blog/free-api-list-for-developers). 

In the past, you would read the docs, set up \`fetch\` calls, handle loading states, write the CSS, and handle errors. 

With Vibe Coding, you open your AI IDE and prompt: 
> *"Create a React component \`WeatherWidget.tsx\`. Fetch data from the OpenWeatherMap API using the key in \`.env\`. Handle loading/error states. Style it with Tailwind CSS to match the dark theme of the app, and use Framer Motion for a fade-in effect."*

Within 15 seconds, you have a 90% complete component. You spend the next 2 minutes tweaking the animation timing and adjusting the padding. Feature complete.

### Conclusion

Vibe coding is not a fad; it is the new baseline for developer productivity. By embracing these tools, you can build faster, reduce burnout, and focus on what truly matters: solving user problems and crafting beautiful digital experiences.
    `
  }
];
