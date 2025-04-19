import { GSMArenaScraper } from "@/modules/scraper/gsmArena/home/home";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const res = await fetch('https://www.gsmarena.com');
  const html = await res.text();
  const scraper = new GSMArenaScraper(html);

  const [
    featuredNews,
    regularNews,
    latestDevices,
    topByInterest,
    comparisons
  ] = await Promise.all([
    scraper.scrapeFeaturedNews(),
    scraper.scrapeRegularNews(),
    scraper.scrapeLatestDevices(),
    scraper.scrapeTopDevicesByInterest(),
    scraper.scrapePopularComparisons()
  ]);

  return (
    <div className="min-h-screen p-8 bg-background">
      {/* Featured News Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredNews.map((article, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48">
                  <img
                    src={article.imageUrl || '/placeholder.jpg'}
                    alt={article.title}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                  <span>{article.timestamp}</span>
                  <span>{article.comments} comments</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularNews.map((article, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                  <span>{article.timestamp}</span>
                  <span>{article.comments} comments</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Devices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">New Devices</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestDevices.map((device, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-4">
                <div className="relative h-32 mb-4">
                  <img
                    src={device.imageUrl}
                    alt={device.name}
                    className="object-contain w-full h-full"
                  />
                </div>
                <CardTitle className="text-base">{device.name}</CardTitle>
                <Button variant="link" size="sm" className="mt-2" asChild>
                  <a href={device.url} target="_blank" rel="noopener noreferrer">
                    View specs
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Devices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Top Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Most Popular</CardTitle>
            </CardHeader>
            <CardContent>
              {topByInterest.map((device, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-2 border-b"
                >
                  <span className="text-muted-foreground">
                    #{device.rank} {device.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {device.hits} views
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparisons Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Popular Comparisons</h2>
        <Card>
          <CardContent className="p-6">
            {comparisons.map((comparison, index) => (
              <a
                key={index}
                href={comparison.url}
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-sm">{comparison.title}</span>
                <span className="text-primary">→</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}