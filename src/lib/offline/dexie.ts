import Dexie, { type Table } from 'dexie';

// Type definitions for local IndexedDB cache tables (mirroring cloud schema)
export interface LocalArticle {
	id: string;
	feed_id: string;
	external_url: string;
	title: string;
	author?: string;
	content_html?: string;
	content_text?: string;
	summary?: string;
	tldr?: string;
	key_insights?: string; // stringified JSON
	ai_tags?: string;      // stringified JSON
	quality_score?: number;
	clickbait_score?: number;
	reading_time_min?: number;
	word_count?: number;
	image_url?: string;
	published_at?: string;
	fetched_at?: string;
	is_saved_offline: number;
	embedding?: number[];
}

export interface LocalNote {
	id: string;
	user_id: string;
	title: string;
	content_md: string;
	parent_id?: string;
	article_id?: string;
	is_pinned: number;
	word_count: number;
	created_at: string;
	updated_at: string;
	has_conflict?: number; // flag for local sync merge conflicts
}

export interface LocalHighlight {
	id: string;
	user_id: string;
	article_id: string;
	highlighted_text: string;
	note?: string;
	color: string;
	start_offset: number;
	end_offset: number;
	element_selector: string;
	created_at: string;
}

export interface SyncQueueItem {
	id?: number; // Auto-incrementing local primary key
	action: 'insert' | 'update' | 'delete';
	table_name: 'notes' | 'highlights' | 'user_articles' | 'collections' | 'srs_cards';
	item_id: string;
	payload: string; // JSON stringified data
	created_at: string;
}

// Dexie Database Subclass Definition
class AtlasOfflineDatabase extends Dexie {
	articles!: Table<LocalArticle, string>;
	notes!: Table<LocalNote, string>;
	highlights!: Table<LocalHighlight, string>;
	sync_queue!: Table<SyncQueueItem, number>;

	constructor() {
		super('AtlasOfflineDatabase');
		this.version(1).stores({
			articles: 'id, feed_id, published_at, is_saved_offline',
			notes: 'id, user_id, parent_id, article_id, updated_at',
			highlights: 'id, user_id, article_id, created_at',
			sync_queue: '++id, table_name, item_id, created_at'
		});
	}
}

export const dbLocal = new AtlasOfflineDatabase();
export default dbLocal;
