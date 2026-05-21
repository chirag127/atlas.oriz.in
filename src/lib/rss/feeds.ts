export interface FeedSource {
	id: string;
	title: string;
	url: string;
	feedType: 'rss' | 'reddit' | 'youtube' | 'hn' | 'github' | 'producthunt';
	category: 'productivity' | 'tech' | 'ai' | 'finance' | 'security' | 'howto' | 'smart';
	description: string;
}

export const defaultFeeds: FeedSource[] = [
	// 1. Productivity & Life Optimization
	{
		id: 'lifehacker',
		title: 'Lifehacker',
		url: 'https://lifehacker.com/rss',
		feedType: 'rss',
		category: 'productivity',
		description: 'Life hacks, tips, and tricks for productivity'
	},
	{
		id: 'zenhabits',
		title: 'Zen Habits',
		url: 'https://zenhabits.net/feed',
		feedType: 'rss',
		category: 'productivity',
		description: 'Minimalist living and mindfulness'
	},
	{
		id: 'scott-young',
		title: 'Scott H. Young',
		url: 'https://scotthyoung.com/blog/feed',
		feedType: 'rss',
		category: 'productivity',
		description: 'Ultra-learning systems and career growth'
	},
	{
		id: 'cal-newport',
		title: 'Cal Newport Study Hacks',
		url: 'https://calnewport.com/blog/feed',
		feedType: 'rss',
		category: 'productivity',
		description: 'Deep work, focus, and digital minimalism'
	},
	{
		id: 'james-clear',
		title: 'James Clear Blog',
		url: 'https://jamesclear.com/feed',
		feedType: 'rss',
		category: 'productivity',
		description: 'Atomic Habits, decision making, and optimization'
	},
	{
		id: 'ali-abdaal',
		title: 'Ali Abdaal Blog',
		url: 'https://aliabdaal.com/feed',
		feedType: 'rss',
		category: 'productivity',
		description: 'Productivity systems, study tips, and tech reviews'
	},
	{
		id: 'farnam-street',
		title: 'Farnam Street (FS)',
		url: 'https://fs.blog/feed',
		feedType: 'rss',
		category: 'productivity',
		description: 'Mental models, rational thinking, and decision making'
	},
	{
		id: 'lesswrong',
		title: 'LessWrong',
		url: 'https://www.lesswrong.com/feed.xml',
		feedType: 'rss',
		category: 'productivity',
		description: 'Rationality, reasoning, cognitive biases, and future science'
	},

	// 2. Hacker News & Elite Tech
	{
		id: 'hn',
		title: 'Hacker News (Top Stories)',
		url: 'https://news.ycombinator.com/rss',
		feedType: 'hn',
		category: 'tech',
		description: 'Elite technical, startup, and science news aggregator'
	},
	{
		id: 'lobsters',
		title: 'Lobsters (Tech)',
		url: 'https://lobste.rs/rss',
		feedType: 'rss',
		category: 'tech',
		description: 'Tech-centric developer community'
	},
	{
		id: 'dev-to',
		title: 'DEV Community',
		url: 'https://dev.to/feed',
		feedType: 'rss',
		category: 'tech',
		description: 'Programmer articles, tutorials, and community discussions'
	},
	{
		id: 'stack-overflow-blog',
		title: 'Stack Overflow Blog',
		url: 'https://stackoverflow.blog/feed',
		feedType: 'rss',
		category: 'tech',
		description: 'Insights into engineering culture and tech evolution'
	},
	{
		id: 'ars-technica',
		title: 'Ars Technica',
		url: 'https://feeds.arstechnica.com/arstechnica/index',
		feedType: 'rss',
		category: 'tech',
		description: 'In-depth science, tech, and policy reviews'
	},
	{
		id: 'simon-willison',
		title: 'Simon Willison Blog',
		url: 'https://simonwillison.net/atom/everything/',
		feedType: 'rss',
		category: 'tech',
		description: 'AI tooling, software engineering, and open-source updates'
	},
	{
		id: 'paul-graham-essays',
		title: 'Paul Graham Essays',
		url: 'http://www.aaronsw.com/2002/feeds/pgessays.rss',
		feedType: 'rss',
		category: 'tech',
		description: 'Thoughts on startups, code, human psychology, and technology'
	},

	// 3. AI / Machine Learning / Future Tech
	{
		id: 'openai',
		title: 'OpenAI News',
		url: 'https://openai.com/news/rss.xml',
		feedType: 'rss',
		category: 'ai',
		description: 'Official announcements from OpenAI'
	},
	{
		id: 'anthropic',
		title: 'Anthropic News',
		url: 'https://www.anthropic.com/news/rss.xml',
		feedType: 'rss',
		category: 'ai',
		description: 'Official announcements on Claude AI and alignment research'
	},
	{
		id: 'huggingface',
		title: 'Hugging Face Blog',
		url: 'https://huggingface.co/blog/feed.xml',
		feedType: 'rss',
		category: 'ai',
		description: 'Latest machine learning and open AI updates'
	},
	{
		id: 'langchain',
		title: 'LangChain Blog',
		url: 'https://blog.langchain.dev/rss/',
		feedType: 'rss',
		category: 'ai',
		description: 'AI engineering, LLM app development, and orchestrations'
	},
	{
		id: 'towards-datascience',
		title: 'Towards Data Science',
		url: 'https://towardsdatascience.com/feed',
		feedType: 'rss',
		category: 'ai',
		description: 'Practical guides and deep-dives on Machine Learning and Data Science'
	},
	{
		id: 'sebastian-raschka',
		title: 'Sebastian Raschka Blog',
		url: 'https://sebastianraschka.com/rss.xml',
		feedType: 'rss',
		category: 'ai',
		description: 'Excellent deep educational LLM and ML posts'
	},

	// 4. Finance & Markets (Productive Focus)
	{
		id: 'financial-times',
		title: 'Financial Times (Global Tech)',
		url: 'https://www.ft.com/technology?format=rss',
		feedType: 'rss',
		category: 'finance',
		description: 'Global business and financial markets tech news'
	},
	{
		id: 'economic-times',
		title: 'Economic Times (Tech & Startups)',
		url: 'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms',
		feedType: 'rss',
		category: 'finance',
		description: 'Indian tech industry news, funding rounds, and startup scene'
	},
	{
		id: 'finshots',
		title: 'Finshots Daily',
		url: 'https://finshots.in/archive/feed.xml',
		feedType: 'rss',
		category: 'finance',
		description: 'Simplified daily analysis of Indian financial and economic events'
	},
	{
		id: 'stable-investor',
		title: 'Stable Investor',
		url: 'https://stableinvestor.com/feed',
		feedType: 'rss',
		category: 'finance',
		description: 'Indian personal finance, asset allocation, and investing'
	},
	{
		id: 'wealth-common-sense',
		title: 'A Wealth of Common Sense',
		url: 'https://awealthofcommonsense.com/feed/',
		feedType: 'rss',
		category: 'finance',
		description: 'Market dynamics, investor behavior, and long-term planning'
	},
	{
		id: 'collab-fund',
		title: 'Collaborative Fund Blog',
		url: 'https://collabfund.com/blog/feed/',
		feedType: 'rss',
		category: 'finance',
		description: 'Insights into investment psychology, business history, and trends'
	},

	// 5. Cybersecurity & Privacy
	{
		id: 'krebs-security',
		title: 'Krebs on Security',
		url: 'https://krebsonsecurity.com/feed/',
		feedType: 'rss',
		category: 'security',
		description: 'Investigative cybersecurity news and digital crime tracking'
	},
	{
		id: 'schneier-security',
		title: 'Schneier on Security',
		url: 'https://www.schneier.com/feed/atom/',
		feedType: 'rss',
		category: 'security',
		description: 'Bruce Schneier on security technologies, threats, and policy'
	},
	{
		id: 'bleeping-computer',
		title: 'BleepingComputer',
		url: 'https://www.bleepingcomputer.com/feed/',
		feedType: 'rss',
		category: 'security',
		description: 'Breaking technology and cybersecurity threat news'
	},
	{
		id: 'the-hacker-news',
		title: 'The Hacker News',
		url: 'https://feeds.feedburner.com/TheHackersNews',
		feedType: 'rss',
		category: 'security',
		description: 'Worldwide updates on security vulnerabilities and cyber threats'
	},

	// 6. How-To & Tutorials
	{
		id: 'how-to-geek',
		title: 'How-To Geek',
		url: 'https://www.howtogeek.com/feed/',
		feedType: 'rss',
		category: 'howto',
		description: 'PC, mobile, and software operating system guides'
	},
	{
		id: 'makeuseof',
		title: 'MakeUseOf',
		url: 'https://www.makeuseof.com/feed/',
		feedType: 'rss',
		category: 'howto',
		description: 'Tech tutorials, FOSS app reviews, and hardware setups'
	},
	{
		id: 'wikihow',
		title: 'wikiHow',
		url: 'https://www.wikihow.com/feed.rss',
		feedType: 'rss',
		category: 'howto',
		description: 'Structured tutorials on doing almost anything'
	},

	// 7. Reddit RSS
	{
		id: 'reddit-productivity',
		title: 'r/productivity',
		url: 'https://www.reddit.com/r/productivity/.rss',
		feedType: 'reddit',
		category: 'productivity',
		description: 'Community sharing tips on efficiency and focus'
	},
	{
		id: 'reddit-selfhosted',
		title: 'r/selfhosted',
		url: 'https://www.reddit.com/r/selfhosted/.rss',
		feedType: 'reddit',
		category: 'tech',
		description: 'FOSS self-hosted software, cloud infrastructure, and homelabs'
	},
	{
		id: 'reddit-privacy',
		title: 'r/privacy',
		url: 'https://www.reddit.com/r/privacy/.rss',
		feedType: 'reddit',
		category: 'security',
		description: 'Discussions on digital surveillance and private alternatives'
	},
	{
		id: 'reddit-singularity',
		title: 'r/singularity',
		url: 'https://www.reddit.com/r/singularity/.rss',
		feedType: 'reddit',
		category: 'ai',
		description: 'Future of intelligence, tech acceleration, and singularity'
	},

	// 8. YouTube RSS
	{
		id: 'yt-fireship',
		title: 'Fireship (YouTube)',
		url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrdUwzDMc21qVJSTeg',
		feedType: 'youtube',
		category: 'tech',
		description: 'Superfast code tutorials and tech industry summaries'
	},
	{
		id: 'yt-theo',
		title: 'Theo - t3.gg (YouTube)',
		url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC-8QAzbLcRjf21FMapGXUwQ',
		feedType: 'youtube',
		category: 'tech',
		description: 'Developer news, web architecture debates, and ecosystems'
	},
	{
		id: 'yt-networkchuck',
		title: 'NetworkChuck (YouTube)',
		url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9x0AN7BpHgOPVUm1FfhyFw',
		feedType: 'youtube',
		category: 'security',
		description: 'Cybersecurity training, homelab setups, and networking guides'
	}
];
