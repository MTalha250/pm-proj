# PM Standards Comparison Platform

A comprehensive web application for exploring, comparing, and applying project management standards including PMBOK 7th Edition, PRINCE2, ISO 21500, and ISO 21502.

## Features

### 1. **Standards Repository**

- Browse and search through PM standards documentation
- Hierarchical navigation with chapter/section structure
- Full-text search across all standards
- Bookmark sections for quick reference
- Deep linking to specific sections

### 2. **Comparison Engine**

- Side-by-side comparison of how different standards address topics
- View similarities, differences, and unique points
- Direct links to source sections in each standard
- Organized by categories (Risk Management, Stakeholder Engagement, etc.)

### 3. **Insights Dashboard**

- Statistical overview of comparisons
- Standard coverage analysis
- Category-wise breakdown of similarities and differences
- Visual representation of insights

### 4. **Process Generator**

- Rule-based questionnaire for project profiling
- Generates tailored PM processes based on:
  - Project type (Software, Construction, etc.)
  - Project size (Small, Medium, Large)
  - Complexity level (Low, Medium, High)
  - Industry sector
- Evidence-based recommendations with references to standards
- Downloadable process templates

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**

```bash
git clone <repo-url>
cd pm
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure MongoDB**

```bash
# Create env file
cp .env.local

# Edit .env.local and set MongoDB connection string
MONGODB_URI=mongodb+srv://....
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Setup

The database comes pre-populated with:

- ✅ 5 PM Standards (PMBOK, PRINCE2, ISO 21500, ISO 21502, Process Groups)
- ✅ 664 Sections with full content
- ✅ Sample comparisons and process templates

If you need to reset or import additional data, use MongoDB Compass or mongosh:

```bash
# Example: Import standards
mongoimport --db pm-standards --collection standards --file sample-data/standards.json --jsonArray
```

### Database Collections

**Standards Collection**

```json
{
  "name": "PMBOK",
  "fullName": "A Guide to the Project Management Body of Knowledge",
  "version": "7th Edition",
  "description": "PMI's guide to project management practices",
  "fileName": "pmbok-7.pdf",
  "fileType": "pdf"
}
```

**Sections Collection**

```json
{
  "standardId": "...",
  "title": "Risk Management",
  "content": "Full text content...",
  "sectionNumber": "11.1",
  "pageNumber": 397,
  "chapterNumber": 11,
  "level": 2,
  "keywords": ["risk", "management", "assessment"]
}
```

**Comparisons Collection** - See `/app/admin/page.tsx` for structure

**Process Templates Collection** - See `/app/admin/page.tsx` for structure

## 🏗️ Project Structure

```
pm/
├── app/
│   ├── api/              # API routes
│   │   ├── standards/
│   │   ├── sections/
│   │   ├── comparisons/
│   │   ├── bookmarks/
│   │   └── process-generator/
│   ├── repository/       # Standards browser
│   ├── compare/          # Comparison engine
│   ├── insights/         # Dashboard
│   └── process-generator/# Process generator
├── components/          # React components
├── models/             # Mongoose schemas
├── lib/                # Utilities
│   ├── mongodb.ts      # DB connection
│   ├── types.ts        # TypeScript types
│   └── session.ts      # Session management
└── store/              # Zustand state management
```

## 🔧 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **State Management**: Zustand
- **Icons**: React Icons

## 📚 Standards Included

The platform is designed to work with:

- ✅ PMBOK Guide 7th Edition
- ✅ Process Groups Practice Guide (PMI)
- ✅ PRINCE2 (2023 Edition)
- ✅ ISO 21500:2021 - Context and concepts
- ✅ ISO 21502:2020 - Guidance on project management

## 🎓 Usage

### For Students

1. Use the **Repository** to read and search standards
2. Use **Bookmarks** to save important sections
3. Explore **Comparisons** to understand different approaches
4. Review the **Insights Dashboard** for summaries

### For Project Managers

1. Use the **Process Generator** to create tailored processes
2. Compare standards in the **Comparison Engine**
3. Reference specific sections with **Deep Links**
4. Export generated processes for documentation

### For Researchers

1. Analyze similarities and differences via **Insights**
2. Cross-reference sections across standards
3. Export data for further analysis

## 🔗 API Endpoints

- `GET /api/standards` - List all standards
- `GET /api/standards/:id` - Get standard details
- `GET /api/sections?standardId=...` - Get sections by standard
- `GET /api/sections?search=...` - Search sections
- `GET /api/comparisons` - List comparisons
- `GET /api/comparisons?category=...` - Filter by category
- `POST /api/process-generator` - Generate process
- `GET /api/bookmarks?sessionId=...` - Get user bookmarks
- `POST /api/bookmarks` - Create bookmark
