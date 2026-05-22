export interface FeedSource {
  url: string;
  title: string;
  category: string;
  siteUrl?: string;
}

export const FEED_SOURCES: FeedSource[] = [
  // Productivity / Life Optimization
  { url: "https://lifehacker.com/rss", title: "Lifehacker", category: "Productivity" },
  { url: "https://www.lifehack.org/feed", title: "Lifehack", category: "Productivity" },
  { url: "https://calnewport.com/blog/feed", title: "Cal Newport", category: "Productivity" },
  { url: "https://jamesclear.com/feed", title: "James Clear", category: "Productivity" },
  { url: "https://aliabdaal.com/feed", title: "Ali Abdaal", category: "Productivity" },
  { url: "https://fs.blog/feed", title: "Farnam Street", category: "Productivity" },
  { url: "https://nesslabs.com/feed", title: "Ness Labs", category: "Productivity" },

  // Hacker News / Elite Tech
  { url: "https://news.ycombinator.com/rss", title: "Hacker News", category: "Tech" },
  { url: "https://hnrss.org/best", title: "HN Best", category: "Tech" },
  { url: "https://lobste.rs/rss", title: "Lobsters", category: "Tech" },
  { url: "https://dev.to/feed", title: "DEV.to", category: "Tech" },
  { url: "https://feeds.arstechnica.com/arstechnica/index", title: "Ars Technica", category: "Tech" },
  { url: "https://www.theverge.com/rss/index.xml", title: "The Verge", category: "Tech" },
  { url: "https://techcrunch.com/feed", title: "TechCrunch", category: "Tech" },

  // AI / Automation
  { url: "https://openai.com/news/rss.xml", title: "OpenAI Blog", category: "AI" },
  { url: "https://www.anthropic.com/news/rss.xml", title: "Anthropic Blog", category: "AI" },
  { url: "https://huggingface.co/blog/feed.xml", title: "HuggingFace Blog", category: "AI" },
  { url: "https://blog.langchain.dev/rss/", title: "LangChain Blog", category: "AI" },
  { url: "https://blog.google/technology/ai/rss/", title: "Google AI Blog", category: "AI" },

  // Software Engineering
  { url: "https://blog.pragmaticengineer.com/rss/", title: "Pragmatic Engineer", category: "Engineering" },
  { url: "https://blog.cloudflare.com/rss/", title: "Cloudflare Blog", category: "Engineering" },
  { url: "https://github.blog/feed/", title: "GitHub Blog", category: "Engineering" },
  { url: "https://vercel.com/blog/rss.xml", title: "Vercel Blog", category: "Engineering" },
  { url: "https://supabase.com/blog/rss.xml", title: "Supabase Blog", category: "Engineering" },

  // Finance
  { url: "https://finshots.in/archive/feed.xml", title: "Finshots", category: "Finance" },
  { url: "https://www.morningbrew.com/feed.xml", title: "Morning Brew", category: "Finance" },
  { url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms", title: "Economic Times", category: "Finance" },

  // Cybersecurity
  { url: "https://krebsonsecurity.com/feed/", title: "Krebs on Security", category: "Security" },
  { url: "https://www.schneier.com/feed/atom/", title: "Schneier", category: "Security" },
  { url: "https://thehackernews.com/feeds/posts/default", title: "The Hacker News", category: "Security" },

  // Long-form / Essays
  { url: "https://stratechery.com/feed/", title: "Stratechery", category: "Essays" },
  { url: "https://simonwillison.net/atom/everything/", title: "Simon Willison", category: "Essays" },

  // Android & Mobile
  { url: "https://www.androidauthority.com/feed/", title: "Android Authority", category: "Android" },
  { url: "https://www.xda-developers.com/feed/", title: "XDA Developers", category: "Android" },

  // Privacy
  { url: "https://www.privacyguides.org/en/feed_rss_created.xml", title: "Privacy Guides", category: "Privacy" },
  { url: "https://www.eff.org/rss/updates.xml", title: "EFF", category: "Privacy" },

  // Reddit
  { url: "https://www.reddit.com/r/programming/.rss", title: "r/programming", category: "Reddit" },
  { url: "https://www.reddit.com/r/MachineLearning/.rss", title: "r/MachineLearning", category: "Reddit" },
  { url: "https://www.reddit.com/r/selfhosted/.rss", title: "r/selfhosted", category: "Reddit" },
  { url: "https://www.reddit.com/r/singularity/.rss", title: "r/singularity", category: "Reddit" },

  // How-To
  { url: "https://www.howtogeek.com/feed/", title: "How-To Geek", category: "How-To" },
  { url: "https://www.makeuseof.com/feed/", title: "MakeUseOf", category: "How-To" },

  // YouTube
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA", title: "Fireship", category: "YouTube" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA", title: "Theo", category: "YouTube" },
  { url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCoOae5nYA7VqaXzerajD0lg", title: "Ali Abdaal YT", category: "YouTube" },
];

export const FEED_CATEGORIES = [
  ...new Set(FEED_SOURCES.map((f) => f.category)),
].sort();
