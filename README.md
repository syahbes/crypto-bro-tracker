# Cryptocurrency Portfolio Tracker

A modern, responsive web application built with Next.js and TypeScript that allows users to browse cryptocurrencies and manage their investment portfolio.

## Live Demo
[https://crypto-bro-tracker.vercel.app/](https://crypto-bro-tracker.vercel.app/)


## Features

### Core Functionality
- **Cryptocurrency List Page (SSR)**: Browse cryptocurrencies with server-side rendering for optimal performance
- **Search & Filter**: Find cryptocurrencies by name or symbol with real-time filtering
- **Sorting Options**: Sort by market cap, price, or performance metrics
- **Detailed Crypto Views (CSR)**: Client-side rendered detail pages for enhanced interactivity
- **Portfolio Management**: Add cryptocurrencies to your personal portfolio with smooth UX transitions

### UI/UX Enhancements
- **Modern Design**: Clean, professional interface using Material-UI components
- **Dark Mode**: Toggle between light and dark themes for better user experience
- **Mobile Responsive**: Fully optimized for mobile, tablet, and desktop devices
- **Loading States**: Skeleton screens and loading indicators for better perceived performance
- **Error Handling**: Graceful error states with user-friendly messages

### Performance & Development
- **State Management**: Redux for global state with efficient data flow
- **API Integration**: Real-time cryptocurrency data from public APIs (CoinGecko)
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Code Quality**: ESLint + Prettier
- **React Query**: Efficient data fetching and caching

## Prerequisites

Before running this project, make sure you have:

- Node.js (version 22.18.0 or higher)
- npm package manager
- Git

## Running the Project

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:syahbes/crypto-bro-tracker.git
   cd crypto-portfolio-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.


## Known Issues

- API rate limiting may affect data freshness during high usage
- Example of error:
```
Access to fetch at 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,whitebit,bitcoin,tron&order=market_cap_desc&per_page=250&page=1&sparkline=false&locale=en' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
coingecko.ts:102  GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,whitebit,bitcoin,tron&order=market_cap_desc&per_page=250&page=1&sparkline=false&locale=en net::ERR_FAILED 429 (Too Many Requests)
```

**Made with ❤️ and ☕ by Shlomi**