import * as cheerio from 'cheerio';
import { NewsArticle, Device, TopDevice, Comparison } from './types';

export class GSMArenaScraper {
  private $: cheerio.CheerioAPI;

  constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  public scrapeFeaturedNews(): NewsArticle[] {
    const featuredNews: NewsArticle[] = [];
    
    this.$('.feat-item').each((index, element) => {
      const $el = this.$(element);
      const title = $el.find('.feat-item-title').text().trim();
      const url = $el.find('.feat-item-link').attr('href') || '';
      const timestamp = $el.find('.meta-item-time').text().trim();
      const commentsText = $el.find('.meta-item-comments').text().trim();
      const comments = parseInt(commentsText) || 0;
      const imageUrl = $el.find('.feat-item-image').css('background-image')?.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') || '';

      if (title) {
        featuredNews.push({
          title,
          url: this.makeAbsoluteUrl(url),
          summary: '', // Featured items don't have summaries
          timestamp,
          comments,
          imageUrl: this.makeAbsoluteUrl(imageUrl)
        });
      }
    });

    return featuredNews;
  }

  public scrapeRegularNews(): NewsArticle[] {
    const newsItems: NewsArticle[] = [];

    this.$('.news-item').each((index, element) => {
      const $el = this.$(element);
      const title = $el.find('h3').text().trim();
      const url = $el.find('a').attr('href') || '';
      const summary = $el.find('p').text().trim();
      const timestamp = $el.find('.meta-item-time').text().trim();
      const commentsText = $el.find('.meta-item-comments').text().trim();
      const comments = parseInt(commentsText) || 0;
      const imageUrl = $el.find('.news-item-media-wrap img').attr('src') || '';

      if (title) {
        newsItems.push({
          title,
          url: this.makeAbsoluteUrl(url),
          summary,
          timestamp,
          comments,
          imageUrl: this.makeAbsoluteUrl(imageUrl)
        });
      }
    });

    return newsItems;
  }

  public scrapeLatestDevices(): Device[] {
    const devices: Device[] = [];

    this.$('.module-phones-link').each((index, element) => {
      const $el = this.$(element);
      const name = $el.find('br').next().text().trim();
      const url = $el.attr('href') || '';
      const imageUrl = $el.find('img').attr('src') || '';

      if (name && url) {
        devices.push({
          name,
          url: this.makeAbsoluteUrl(url),
          imageUrl: this.makeAbsoluteUrl(imageUrl)
        });
      }
    });

    return devices;
  }

  public scrapeTopDevicesByInterest(): TopDevice[] {
    return this.scrapeTopDevicesTable('.module-fit.green');
  }

  public scrapeTopDevicesByFans(): TopDevice[] {
    return this.scrapeTopDevicesTable('.module-fit.blue');
  }

  public scrapePopularComparisons(): Comparison[] {
    const comparisons: Comparison[] = [];

    this.$('.module-fit.purple a').each((index, element) => {
      const $el = this.$(element);
      const title = $el.text().trim();
      const url = $el.attr('href') || '';

      if (title && url) {
        comparisons.push({
          title,
          url: this.makeAbsoluteUrl(url)
        });
      }
    });

    return comparisons;
  }

  private scrapeTopDevicesTable(selector: string): TopDevice[] {
    const topDevices: TopDevice[] = [];

    this.$(selector).find('tbody tr').each((index, element) => {
      const $el = this.$(element);
      const rankText = $el.find('td:nth-child(1)').text().trim();
      const rank = parseInt(rankText.replace('.', '')) || 0;
      const name = $el.find('td:nth-child(2) a').text().trim();
      const url = $el.find('td:nth-child(2) a').attr('href') || '';
      const hitsText = $el.find('td:nth-child(3)').text().trim();
      const hits = parseInt(hitsText.replace(/,/g, '')) || undefined;

      if (name && url) {
        topDevices.push({
          rank,
          name,
          url: this.makeAbsoluteUrl(url),
          hits
        });
      }
    });

    return topDevices;
  }

  private makeAbsoluteUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    return `https://www.gsmarena.com/${url.replace(/^\//, '')}`;
  }
}