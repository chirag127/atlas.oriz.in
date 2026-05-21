import { parseFeed } from 'feedsmith';
import type { DBArticle } from '../db';

export interface ParsedItem {
	title: string;
	url: string;
	author?: string;
	contentHtml?: string;
	contentText?: string;
	publishedAt?: string;
	imageUrl?: string;
}

export interface ParsedFeed {
	title: string;
	description?: string;
	link?: string;
	items: ParsedItem[];
}

export function parseFeedContent(xml: string): ParsedFeed {
	try {
		const { feed } = parseFeed(xml) as any;
		
		const rawItems: any[] = feed.items || [];
		const items: ParsedItem[] = rawItems.map((item: any): ParsedItem => {
			// Extract image if available in description/content or specific fields
			let imageUrl = '';
			const mediaContent = item.media?.content || item['media:content'];
			if (mediaContent && mediaContent.url) {
				imageUrl = mediaContent.url;
			} else {
				// Try parsing from content/summary html
				const html = item.content || item.summary || '';
				const match = html.match(/<img[^>]+src="([^">]+)"/);
				if (match && match[1]) {
					imageUrl = match[1];
				}
			}

			// Clean content text by removing HTML tags
			const rawContent = item.content || item.summary || '';
			const cleanText = rawContent
				.replace(/<[^>]*>/g, ' ')
				.replace(/\s+/g, ' ')
				.trim();

			return {
				title: item.title || 'Untitled',
				url: item.link || item.id || '',
				author: item.author || item.creator || undefined,
				contentHtml: item.content || item.summary || undefined,
				contentText: cleanText || undefined,
				publishedAt: item.published || item.updated || item.pubDate || undefined,
				imageUrl: imageUrl || undefined
			};
		}).filter((item: ParsedItem) => item.url);

		return {
			title: feed.title || 'Untitled Feed',
			description: feed.description || undefined,
			link: feed.link || undefined,
			items
		};
	} catch (error) {
		console.error('Error parsing feed content:', error);
		throw new Error(`Failed to parse feed: ${error instanceof Error ? error.message : String(error)}`);
	}
}

// Convert parsed item to DBArticle format
export function convertToDBArticle(item: ParsedItem, feedId: string): DBArticle {
	const id = 'art_' + Math.random().toString(36).substring(2, 15);
	
	// Estimate reading time (average 200 words per minute)
	const wordCount = item.contentText ? item.contentText.split(/\s+/).length : 0;
	const readingTimeMin = Math.max(1, Math.round(wordCount / 200));

	return {
		id,
		feed_id: feedId,
		external_url: item.url,
		title: item.title,
		author: item.author,
		content_html: item.contentHtml,
		content_text: item.contentText,
		image_url: item.imageUrl,
		published_at: item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date().toISOString(),
		fetched_at: new Date().toISOString(),
		reading_time_min: readingTimeMin,
		word_count: wordCount
	};
}
