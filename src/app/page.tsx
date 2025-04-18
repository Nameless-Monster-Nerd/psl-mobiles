import { GSMArenaScraper } from "@/modules/scraper/gsmArena/home/home";

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
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Featured News Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredNews.map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={article.imageUrl || '/placeholder.jpg'}
                  alt={article.title}
                  // fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{article.timestamp}</span>
                  <span>{article.comments} comments</span>
                </div>
                <a
                  href={article.url}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularNews.map((article, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.summary}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{article.timestamp}</span>
                <span>{article.comments} comments</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Devices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">New Devices</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestDevices.map((device, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="relative h-32 mb-4">
                <img
                  src={device.imageUrl}
                  alt={device.name}
                  // fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-800">{device.name}</h3>
              <a
                href={device.url}
                className="text-blue-600 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View specs
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Top Devices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Top Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Most Popular</h3>
            {topByInterest.map((device, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">#{device.rank} {device.name}</span>
                <span className="text-sm text-gray-500">{device.hits} views</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparisons Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Popular Comparisons</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {comparisons.map((comparison, index) => (
            <a
              key={index}
              href={comparison.url}
              className="block py-2 hover:bg-gray-100 px-2 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              {comparison.title}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}