# 💰 Spendora

> **Transform your financial data into meaningful insights**

A modern, full-stack personal finance management platform that bridges the gap between raw transaction data and actionable financial understanding.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Live Demo

**[Visit Spendora →][Spendora](https://spendora-vue.vercel.app/)**

*Experience financial management that actually makes sense.*

---

## 🎯 The Problem

Most expense tracking applications focus on data collection rather than data comprehension. Users end up with spreadsheets full of numbers but no real understanding of their financial patterns or actionable insights for better decision-making.

## 💡 The Solution

Spendora transforms personal finance management by providing:

- **Intelligent Categorization** - Organize transactions with custom categories that make sense for your lifestyle
- **Visual Analytics** - Interactive charts that reveal spending patterns and trends over time  
- **Flexible Filtering** - Discover insights through powerful date ranges and transaction search
- **Clean Data Export** - Extract your financial data for external analysis and tax preparation
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices

---

## ✨ Key Features

### 📊 **Financial Overview Dashboard**
- Real-time calculation of total income, expenses, and net balance
- Visual breakdown of spending by category with progress indicators
- Customizable date ranges for period-specific analysis
- Clean, intuitive interface with consistent design language

### 📈 **Transaction History & Analytics**
- Interactive charts powered by Recharts for data visualization
- Monthly, yearly, and custom date range filtering
- Transaction search functionality with category and amount filters
- Export capabilities for external financial planning tools

### 🏷️ **Smart Category Management**
- Create and manage custom income and expense categories
- Visual category breakdown with spending distribution
- Organized transaction grouping for better financial clarity
- Icon-based category identification for quick recognition

### 🔧 **Account Management**
- Secure user authentication with Clerk integration
- Multi-currency support (INR default, expandable)
- User preference management and account settings
- Data privacy with user-specific transaction isolation

---

## 🛠️ Technical Architecture

### **Frontend Excellence**
```
Next.js 14 (App Router) + TypeScript
├── Server-side rendering for optimal performance
├── React Server/Client Components for hybrid rendering
├── Tailwind CSS + Shadcn UI for consistent design system
├── React Hook Form for validated user interactions
└── Recharts for interactive data visualization
```

### **Backend Reliability**
```
Next.js API Routes + PostgreSQL
├── Prisma ORM for type-safe database operations
├── Server Actions for optimized data mutations
├── Zod schemas for comprehensive input validation
└── RESTful API design with proper error handling
```

### **Security & Performance**
- **Authentication**: Clerk integration with secure session management
- **Data Validation**: Multi-layer validation with Zod schemas
- **Database Security**: Parameterized queries via Prisma ORM
- **Type Safety**: Full TypeScript implementation across the stack
- **Performance**: Optimized queries and server-side rendering

---

## 🏗️ Project Structure

```
spendora/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main application dashboard
│   ├── transactions/      # Transaction management
│   ├── manage/           # Settings and preferences
│   └── api/              # API routes and server actions
├── components/           # Reusable React components
│   ├── ui/              # Shadcn UI components
│   ├── charts/          # Chart components
│   └── forms/           # Form components
├── lib/                 # Utility functions and configurations
│   ├── db.ts           # Database connection
│   ├── validations.ts  # Zod schemas
│   └── utils.ts        # Helper functions
├── prisma/             # Database schema and migrations
└── public/             # Static assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sajal-kanwal/Spendora.git
cd spendora
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Configure your environment variables:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
```

4. **Database setup**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see Spendora in action.

---

## 📱 Screenshots

### Dashboard Overview
*Clean financial overview with actionable insights*

### Transaction History  
*Interactive charts revealing spending patterns*

### Category Management
*Organized expense tracking with custom categories*

---

## 🔮 Future Enhancements

- **Mobile App**: React Native implementation for native mobile experience
- **Advanced Analytics**: Spending pattern prediction and budget recommendations  
- **Data Import**: CSV/bank statement import functionality
- **Multi-Account**: Support for multiple bank accounts and credit cards
- **Collaborative Features**: Shared budgets for families and roommates

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the incredible full-stack framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Clerk](https://clerk.com/) for seamless authentication
- [Recharts](https://recharts.org/) for powerful data visualization

---

<div align="center">

**Built with ❤️ using modern web technologies**

*Transforming financial complexity into clarity, one transaction at a time.*

</div>
