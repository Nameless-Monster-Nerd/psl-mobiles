export interface NewsArticle {
    title: string;
    url: string;
    summary: string;
    timestamp: string;
    comments: number;
    imageUrl?: string;
  }
  
  export interface Device {
    name: string;
    url: string;
    imageUrl: string;
  }
  
  export interface TopDevice {
    rank: number;
    name: string;
    url: string;
    hits?: number;
    favorites?: number;
  }
  
  export interface Comparison {
    title: string;
    url: string;
  }