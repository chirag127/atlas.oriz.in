import { json, type RequestHandler } from '@sveltejs/kit';
import { defaultFeeds } from '$lib/rss/feeds';
import { parseFeedContent, convertToDBArticle } from '$lib/rss/parser';
import { dbHelper } from '$lib/db';
import type { DBFeed } from '$lib/db';

export const GET: RequestHandler = async ({ platform, url }) => {
	const db = platform?.env.DB;
	if (!db) {
		return json({ error: 'Database binding missing' }, { status: 500 });
	}

	const userId = url.searchParams.get('userId') || undefined;
	const category = url.searchParams.get('category') || undefined;
	const force = url.searchParams.get('force') === 'true';

	try {
		// 1. Get all feeds from DB
		let dbFeeds = await dbHelper.getFeeds(db, userId);

		// If no feeds in database, seed them from defaultFeeds
		if (dbFeeds.length === 0) {
			console.log('No feeds found in database. Seeding default feeds...');
			const seedFeeds: DBFeed[] = defaultFeeds.map(feed => ({
				id: feed.id,
				user_id: undefined, // default feeds
				url: feed.url,
				title: feed.title,
				description: feed.description,
				feed_type: feed.feedType,
				category: feed.category,
				is_active: 1,
				refresh_interval_min: 60
			}));

			const insertFeedsStatements = seedFeeds.map(feed => {
				return db.prepare(
					'INSERT OR IGNORE INTO feeds (id, user_id, url, title, description, feed_type, category, is_active, refresh_interval_min) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
				).bind(
					feed.id,
					null,
					feed.url,
					feed.title,
					feed.description,
					feed.feed_type,
					feed.category,
					feed.is_active,
					feed.refresh_interval_min
				);
			});
			await db.batch(insertFeedsStatements);
			dbFeeds = await dbHelper.getFeeds(db, userId);
		}

		// Filter by category if requested
		let feedsToFetch = dbFeeds;
		if (category && category !== 'all') {
			feedsToFetch = dbFeeds.filter(f => f.category === category);
		}

		let totalAdded = 0;
		const results: any[] = [];

		// 2. Fetch each feed sequentially or in small batches to prevent timeout on serverless
		// Using a concurrency-limited approach
		for (const feed of feedsToFetch) {
			// Skip inactive feeds unless forced
			if (!feed.is_active && !force) continue;

			// Skip if fetched recently (e.g. less than refresh interval)
			if (feed.last_fetched_at && !force) {
				const lastFetched = new Date(feed.last_fetched_at).getTime();
				const intervalMs = (feed.refresh_interval_min || 60) * 60 * 1000;
				if (Date.now() - lastFetched < intervalMs) {
					results.push({ id: feed.id, status: 'skipped', reason: 'recently_fetched' });
					continue;
				}
			}

			try {
				console.log(`Fetching feed: ${feed.title || feed.url}`);
				const response = await fetch(feed.url, {
					headers: {
						'User-Agent': 'AtlasKnowledgeOS/1.0 (Mozilla/5.0; SvelteKit Feed Aggregator)',
						'Accept': 'application/xml, text/xml, application/rss+xml, application/atom+xml, */*'
					},
					signal: AbortSignal.timeout(10000) // 10 second timeout per feed
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const xml = await response.text();
				const parsed = parseFeedContent(xml);

				// Convert parsed items to database articles
				const dbArticles = parsed.items.map(item => convertToDBArticle(item, feed.id));
				
				// Batch add articles to D1 database
				await dbHelper.addArticles(db, dbArticles);

				// Update last_fetched_at and reset error count
				await db.prepare(
					"UPDATE feeds SET last_fetched_at = datetime('now'), error_count = 0 WHERE id = ?"
				).bind(feed.id).run();

				totalAdded += dbArticles.length;
				results.push({ id: feed.id, title: parsed.title, status: 'success', articlesCount: dbArticles.length });
			} catch (err: any) {
				console.error(`Error processing feed ${feed.id} (${feed.url}):`, err);
				
				// Increment error count in database
				await db.prepare(
					'UPDATE feeds SET error_count = error_count + 1 WHERE id = ?'
				).bind(feed.id).run();

				results.push({ id: feed.id, status: 'error', error: err.message || String(err) });
			}
		}

		return json({
			success: true,
			totalFeedsProcessed: feedsToFetch.length,
			totalArticlesAdded: totalAdded,
			results
		});

	} catch (error: any) {
		console.error('Feed aggregation endpoint error:', error);
		return json({ success: false, error: error.message || String(error) }, { status: 500 });
	}
};
