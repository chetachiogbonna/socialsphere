<div align="center">
  <br />
    <a target="_blank">
      <img src="/client/public/assets/images/banner-image.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Firebase-black?style=for-the-badge&logoColor=white&logo=firebase&color=red" alt="firebase" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-React_Query-black?style=for-the-badge&logoColor=white&logo=reactquery&color=FF4154" alt="reactquery" />
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
  </div>

  <h3 align="center">A Social Media Application</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

Explore social media with this user-friendly platform that has a nice look and lots of features. Easily create and interact posts, and enjoy a strong authentication system and quick data fetching using React Query for a smooth user experience with AI voice contro system.

## <a name="tech-stack">⚙️ Tech Stack</a>

- React.js
- Firebase
- React Query
- TypeScript
- Shadcn
- Tailwind CSS

## <a name="features">🔋 Features</a>

👉 **Authentication System**: A robust authentication system ensuring security and user privacy

👉 **Like and Save Functionality**: Enable users to like and save posts, with dedicated pages for managing liked and saved content

👉 **Detailed Post Page**: A detailed post page displaying content and related posts for an immersive user experience

👉 **Profile Page**: A user profile page showcasing liked posts and providing options to edit the profile

👉 **Browse Other Users**: Allow users to browse and explore other users' profiles and posts

👉 **Create Post Page**: Implement a user-friendly create post page with effortless file management, storage, and drag-drop feature

👉 **Edit Post Functionality**: Provide users with the ability to edit the content of their posts at any time

👉 **Responsive UI with Bottom Bar**: A responsive UI with a bottom bar, enhancing the mobile app feel for seamless navigation

👉 **React Query Integration**: Incorporate the React Query (Tanstack Query) data fetching library for, Auto caching to enhance performance, Parallel queries for efficient data retrieval, First-class Mutations, etc

👉 **Backend as a Service (BaaS) - Firebase**: Utilize Appwrite as a Backend as a Service solution for streamlined backend development, offering features like authentication, database, file storage, and more

👉 **Voice-Activated Navigation**: Move seamlessly between pages by simply speaking your commands, making your social media experience more intuitive and hands-free. 

👉 **Voice-Driven Post Creation**: Craft and share your thoughts without typing. Dictate your posts, and SocialSphere will transcribe and publish them for you. 

👉 **Voice-Controlled Engagement**: Like and interact with posts using voice commands, streamlining your engagement with content. * AI-Assisted Post Editing: Enhance your content with the help of AI, which offers suggestions and edits to ensure your posts are polished and impactful. 

👉 **AI-Enhanced Friend Chat**: Communicate with friends through an AI-powered chat system that understands and responds to your voice inputs, making conversations more natural and efficient. 

and many more, including code architecture and reusability 

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/chetachiogbonna/socialsphere.git
```

**Installation**

**Client**

Change directory to the client folder

```bash
cd client
```

Install the project dependencies using npm:

```bash
npm install
```

**Server**

Change directory to the client folder

```bash
cd server
```

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

**Client**

```env
# FIREBASE
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_TOKEN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEARSUREMENT_ID=

```

**Server**

```env
PORT=3500
HUGGINGFACE_API_TOKEN=
GOOGLE_GEMINI_API_KEY=

```

Replace the placeholder values with your actual Firebase credentials. You can obtain these credentials by signing up on the [Firebase website](https://console.firebase.google.com/).

Replace the placeholder values with your actual Huggingface credentials. You can obtain these credentials by signing up on the [Huggingface website](https://huggingface.co/).

Replace the placeholder values with your actual Google Gemini credentials. You can obtain these credentials by signing up on the [Google Gemini website](https://ai.google.dev/api?lang=node.)

**Running the Project**

**Client**

```bash
npm run dev
```

**Server**

```bash
npm start 
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the client code project.

Open [http://localhost:3500](http://localhost:3500) in your browser to view the server code response.