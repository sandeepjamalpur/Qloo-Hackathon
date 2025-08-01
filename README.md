# KALA - Cultural Discovery Application

Welcome to KALA, a sophisticated cultural discovery application designed to be your personal guide to the rich tapestry of Indian culture. This application is built with Next.js, Tailwind CSS, ShadCN UI, and Google's Genkit for AI-powered features.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#1-prerequisites)
  - [Installation](#2-installation)
  - [Environment Variables Setup](#3-environment-variables-setup)
  - [Running the Development Servers](#4-running-the-development-servers)
  - [Supabase Database Setup](#5-supabase-database-setup)
- [Project Structure](#project-structure)
- [AI Flows Overview](#ai-flows-overview)

## Features

- **AI-Powered Recommendations**: Users can get personalized cultural recommendations on the homepage by entering a simple text prompt.
- **Categorical Exploration**: Dedicated pages for **Food**, **Temples**, **Festivals**, and **Places**, each with its own specialized search and filter capabilities.
- **Detailed Search**: Users can perform specific searches for cultural items or browse broader categories. Search results can be filtered by location and other criteria like diet.
- **AI-Generated Insights**: View AI-generated summaries, sentiment analysis based on mock reviews, and key positive/negative themes for each cultural item.
- **Recipe Generation**: For any food item, users can get a detailed, AI-generated recipe, including ingredients and step-by-step instructions.
- **User Authentication & Profiles**: Secure user authentication (email/password & Google OAuth) handled by Supabase. New users are guided to create a profile to help tailor their experience.
- **Liked Items**: Users can "like" cultural items and save them to a personal, persistent list for future reference.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/) for components.
- **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit) orchestrates AI flows, using the [Gemini API](https://deepmind.google/technologies/gemini/) for content and image generation.
- **Backend & Database**: [Supabase](https://supabase.io/) for user authentication and database storage (PostgreSQL).
- **QA & NLP**: [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index) for specialized question-answering tasks.

## Getting Started

Follow these instructions to get the application running on your local machine.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 2. Installation

Clone the repository and install the dependencies.

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the project's root directory and populate it with your credentials.

#### `.env.local` example

```
# Supabase Credentials (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Google AI (Gemini) API Key (from Google AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# Hugging Face API Key (from your Hugging Face account)
NEXT_PUBLIC_HUGGING_FACE_API_KEY="your-hugging-face-api-key"
```

### 4. Running the Development Servers

Run the web app and the AI server in two separate terminals.

- **Terminal 1: Next.js Web App**

  ```bash
  npm run dev
  ```
  The app will be available at `http://localhost:3000`.

- **Terminal 2: Genkit AI Flows**

  ```bash
  npm run genkit:watch
  ```
  This starts the Genkit server and watches for changes in your AI flows.

### 5. Supabase Database Setup

Run the following SQL in the Supabase SQL Editor to create the necessary `profiles` table and policies.

```sql
-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  favorite_artists TEXT,
  preferred_cuisines TEXT,
  style_inspirations TEXT,
  current_mood TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

## Project Structure

```
.
├── ai/                    # Genkit AI flows and configuration
│   ├── flows/             # Individual AI flow definitions
│   └── genkit.ts          # Genkit plugin initialization
├── app/                   # Next.js App Router pages and routes
│   ├── (main)/            # Main app routes
│   │   ├── [category]/page.tsx # Dynamic pages for food, temples, etc.
│   │   └── page.tsx       # Homepage
│   ├── auth/              # Auth-related routes (callback)
│   ├── layout.tsx         # Root layout
│   └── login/             # Login page
├── components/            # Reusable React components
│   ├── ui/                # ShadCN UI components
│   └── AppLayout.tsx      # Main application layout with header/footer
├── contexts/              # React Context providers (Auth, LikedItems)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and library instances
├── public/                # Static assets
└── services/              # Server-side logic (Supabase, external APIs)
```

## AI Flows Overview

The application's AI capabilities are powered by Genkit flows located in `ai/flows/`.

- **`generate-initial-recommendations.ts`**: Powers the homepage search. It takes a user's prompt, generates a list of 12 diverse cultural recommendations, and then generates a unique, photorealistic image for each item.
- **`search-by-category.ts`**: A unified search flow that handles queries on the category-specific pages (Food, Temples, etc.). It can handle keyword searches, filtered searches by state/diet, and returns a list of relevant items with generated images.
- **`summarize-cultural-item.ts`**: When a user requests details on an item, this flow analyzes its description and reviews to generate a concise narrative summary, positive/negative themes, and a sentiment score.
- **`get-recipe.ts`**: Fetches a detailed recipe for a given food dish using the Hugging Face QA model for precise, context-based answers.
- **`generate-image-url.ts`**: A dedicated flow that uses Gemini to generate a high-quality, artistic image for a given cultural query.
- **`answer-food-question.ts`**: Uses the Hugging Face question-answering model to provide specific answers to user questions about food, using a predefined context of food items.
