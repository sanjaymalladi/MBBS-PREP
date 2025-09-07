<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dkVFDF_oEWwPVq2ucQ3hDeKMKqiUWK0O

## Run Locally

**Prerequisites:** Node.js, Convex account, Clerk account

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Convex:**
   - Create a [Convex](https://www.convex.dev/) account
   - Run `npx convex dev` to initialize and get your deployment URL
   - Copy the deployment URL to your environment variables

3. **Set up Clerk Authentication:**
   - Create a [Clerk](https://clerk.com/) account
   - Create a new application
   - Copy the publishable key and secret key

4. **Environment Variables:**
   - Copy `env.example` to `.env` and fill values
   ```bash
   cp env.example .env
   ```
   - Required vars:
     - `VITE_CONVEX_URL` — your Convex deployment URL
     - `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
     - `CLERK_SECRET_KEY` — Clerk secret key (not used on client, keep locally)
     - `GEMINI_API_KEY` — Google AI key

5. **Deploy Convex functions:**
   ```bash
   npx convex deploy
   ```

6. **Run the app:**
   ```bash
   npm run dev
   ```

## GitHub Setup

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "chore: init repo with Convex + Clerk setup"
   ```
2. Create a GitHub repo and push:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

This repo includes a `.gitignore` to exclude `node_modules`, build artifacts, and `.env` files. Keep secrets only in `.env` and never commit them.

## Features

- **AI-Powered Practice Sessions:** Generate realistic MBBS questions using authentic question paper content
- **Comprehensive Question Types:** Long essays, short notes, MCQs, and reasoning questions
- **Error Log:** Automatically track all attempts with detailed analytics
- **Authentication:** Secure user authentication with Clerk
- **Progress Tracking:** View statistics and improvement over time
- **Smart Filtering:** Filter by subject, correctness, and question type
- **PDF Integration:** Uses real MBBS question papers for authentic content generation

## Error Log Features

- **Automatic Saving:** All MCQ attempts are saved to the error log by default
- **Review Mode:** Expand questions to see explanations and your answers
- **Statistics:** Track total attempts, accuracy rate, and subject-wise performance
- **Filtering:** Filter by subject and correctness status
- **Data Management:** Clear all logs when needed

## PDF Content Integration

The application uses authentic MBBS question paper content from "1st Professional MBBS Chapter-wise Questions" to generate realistic practice sessions. The content includes:

### Subjects Covered
- **Anatomy:** Superior/Inferior Extremity, Thorax, Abdomen
- **Physiology:** General, Blood, Cardiovascular, Respiratory
- **Biochemistry:** Carbohydrates, Proteins, Lipids

### Question Types
- **Long Essay Questions (12 marks):** Detailed anatomical/physiological descriptions
- **Short Notes (8 marks):** Applied anatomy and clinical correlations
- **Applied Questions (5 marks):** Clinical scenarios and case studies
- **MCQs (1 mark each):** Single best answer questions
- **Reasoning Questions (3 marks):** "Explain Why" style questions

### Content Features
- **Authentic Patterns:** Based on real NTRUHS question papers
- **Clinical Focus:** Emphasis on clinical anatomy and applied physiology
- **Mark Distribution:** Realistic marking schemes (12, 8, 5, 3, 1 marks)
- **Topic Coverage:** Comprehensive coverage of 1st year MBBS curriculum

The AI uses this content to generate new, unique questions while maintaining the same style, difficulty level, and clinical relevance as the original question papers.

## How PDF Content is Used

### 🔍 **Topic Weightage Analysis**
The system analyzes the PDF content to understand:
- **Frequently tested topics** within each subject area
- **Mark distribution patterns** (12, 8, 5, 3, 1 marks)
- **Clinical focus areas** and applied scenarios
- **Question difficulty progression** from basic to advanced

### 🎯 **AI Question Generation**
The enhanced prompt instructs the AI to:
- Study the reference patterns carefully
- Identify high-yield topics and clinical scenarios
- Maintain authentic question structures
- Generate unique questions following the same patterns
- Ensure CBME curriculum alignment

### 📊 **Content Insights**
Based on the PDF analysis:
- **Anatomy**: Focus on extremities, thorax, abdomen with clinical correlations
- **Physiology**: Emphasis on cardiovascular, respiratory, and nervous systems
- **Biochemistry**: Metabolism, enzymes, and clinical biochemistry
- **Question Types**: Mix of theoretical, clinical, and applied questions
- **Clinical Integration**: Strong emphasis on applied anatomy and clinical scenarios

This ensures that generated practice sessions are authentic, exam-relevant, and educationally valuable.
