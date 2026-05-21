import type { D1Database } from '@cloudflare/workers-types';

export interface DBUser {
	id: string;
	email: string;
	display_name?: string;
	avatar_url?: string;
	created_at?: string;
	updated_at?: string;
	onboarded?: number;
}

export interface DBSettings {
	user_id: string;
	theme: string;
	ai_provider: string;
	feed_view: string;
	locations: string; // JSON string
	interests: string; // JSON string
	notification_enabled: number;
	reading_goal_minutes: number;
	digest_time: string;
	offline_save_limit: number;
	updated_at?: string;
}

export interface DBArticle {
	id: string;
	feed_id: string;
	external_url: string;
	title: string;
	author?: string;
	content_html?: string;
	content_text?: string;
	summary?: string;
	tldr?: string;
	key_insights?: string; // JSON string
	ai_tags?: string;      // JSON string
	quality_score?: number;
	clickbait_score?: number;
	reading_time_min?: number;
	word_count?: number;
	image_url?: string;
	published_at?: string;
	fetched_at?: string;
	embedding_vector?: ArrayBuffer;
	duplicate_of?: string;
}

export interface DBUserArticle {
	id: string;
	user_id: string;
	article_id: string;
	is_read?: number;
	is_bookmarked?: number;
	is_liked?: number;
	is_disliked?: number;
	is_saved_offline?: number;
	reading_progress?: number;
	time_spent_sec?: number;
	opened_count?: number;
	first_opened_at?: string;
	last_opened_at?: string;
	bookmarked_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface DBFeed {
	id: string;
	user_id?: string;
	url: string;
	title?: string;
	description?: string;
	favicon_url?: string;
	feed_type: string;
	category?: string;
	is_active?: number;
	refresh_interval_min?: number;
	last_fetched_at?: string;
	error_count?: number;
	created_at?: string;
}

export interface DBNote {
	id: string;
	user_id: string;
	title: string;
	content_md: string;
	parent_id?: string;
	article_id?: string;
	is_pinned?: number;
	word_count?: number;
	created_at?: string;
	updated_at?: string;
}

export interface DBHighlight {
	id: string;
	user_id: string;
	article_id: string;
	highlighted_text: string;
	note?: string;
	color: string;
	start_offset?: number;
	end_offset?: number;
	element_selector?: string;
	created_at?: string;
}

export interface DBCollection {
	id: string;
	user_id: string;
	name: string;
	description?: string;
	icon: string;
	is_smart?: number;
	smart_filter?: string; // JSON
	created_at?: string;
	updated_at?: string;
}

export interface DBSRSCard {
	id: string;
	user_id: string;
	item_type: string;
	item_id: string;
	front_text: string;
	back_text?: string;
	stability: number;
	difficulty: number;
	elapsed_days: number;
	scheduled_days: number;
	reps: number;
	lapses: number;
	state: number;
	due_at?: string;
	last_review_at?: string;
	created_at?: string;
}

export interface DBUserStats {
	user_id: string;
	current_streak: number;
	longest_streak: number;
	streak_freezes: number;
	total_articles_read: number;
	total_time_spent_min: number;
	total_notes_created: number;
	total_highlights: number;
	curiosity_score: number;
	learning_score: number;
	level: number;
	xp: number;
	last_active_date?: string;
	weekly_digest_data?: string; // JSON
	updated_at?: string;
}

// DB Helper Functions
export const dbHelper = {
	// Users
	async getUser(db: D1Database, id: string): Promise<DBUser | null> {
		return db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<DBUser>();
	},
	
	async createUser(db: D1Database, user: DBUser): Promise<void> {
		await db.prepare(
			'INSERT INTO users (id, email, display_name, avatar_url, onboarded) VALUES (?, ?, ?, ?, ?)'
		)
		.bind(user.id, user.email, user.display_name || null, user.avatar_url || null, user.onboarded || 0)
		.run();

		// Initialize user stats and settings
		await db.prepare(
			'INSERT OR IGNORE INTO user_settings (user_id) VALUES (?)'
		).bind(user.id).run();

		await db.prepare(
			'INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)'
		).bind(user.id).run();
	},

	async updateUser(db: D1Database, id: string, data: Partial<DBUser>): Promise<void> {
		const keys = Object.keys(data).filter(k => k !== 'id');
		if (keys.length === 0) return;
		const query = `UPDATE users SET ${keys.map(k => `${k} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`;
		const values = keys.map(k => (data as any)[k]);
		await db.prepare(query).bind(...values, id).run();
	},

	// Settings
	async getSettings(db: D1Database, userId: string): Promise<DBSettings | null> {
		return db.prepare('SELECT * FROM user_settings WHERE user_id = ?').bind(userId).first<DBSettings>();
	},

	async updateSettings(db: D1Database, userId: string, data: Partial<DBSettings>): Promise<void> {
		const keys = Object.keys(data).filter(k => k !== 'user_id');
		if (keys.length === 0) return;
		const query = `UPDATE user_settings SET ${keys.map(k => `${k} = ?`).join(', ')}, updated_at = datetime('now') WHERE user_id = ?`;
		const values = keys.map(k => (data as any)[k]);
		await db.prepare(query).bind(...values, userId).run();
	},

	// Feeds
	async getFeeds(db: D1Database, userId?: string): Promise<DBFeed[]> {
		if (userId) {
			const res = await db.prepare('SELECT * FROM feeds WHERE user_id IS NULL OR user_id = ?').bind(userId).all<DBFeed>();
			return res.results;
		}
		const res = await db.prepare('SELECT * FROM feeds WHERE user_id IS NULL').all<DBFeed>();
		return res.results;
	},

	async addFeed(db: D1Database, feed: DBFeed): Promise<void> {
		await db.prepare(
			'INSERT OR REPLACE INTO feeds (id, user_id, url, title, description, favicon_url, feed_type, category, is_active, refresh_interval_min) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
		)
		.bind(
			feed.id,
			feed.user_id || null,
			feed.url,
			feed.title || null,
			feed.description || null,
			feed.favicon_url || null,
			feed.feed_type,
			feed.category || null,
			feed.is_active ?? 1,
			feed.refresh_interval_min ?? 60
		)
		.run();
	},

	// Articles
	async getArticles(
		db: D1Database, 
		userId: string, 
		options?: { 
			category?: string; 
			isBookmarked?: boolean;
			isRead?: boolean;
			limit?: number; 
			offset?: number;
			query?: string;
		}
	): Promise<(DBArticle & { is_read: number; is_bookmarked: number })[]> {
		let sql = `
			SELECT a.*, COALESCE(ua.is_read, 0) as is_read, COALESCE(ua.is_bookmarked, 0) as is_bookmarked
			FROM articles a
			LEFT JOIN user_articles ua ON a.id = ua.article_id AND ua.user_id = ?
			WHERE a.duplicate_of IS NULL
		`;
		const params: any[] = [userId];

		if (options?.category && options.category !== 'all') {
			sql += ` AND a.feed_id IN (SELECT id FROM feeds WHERE category = ?)`;
			params.push(options.category);
		}

		if (options?.isBookmarked) {
			sql += ` AND ua.is_bookmarked = 1`;
		}

		if (options?.isRead !== undefined) {
			sql += ` AND COALESCE(ua.is_read, 0) = ?`;
			params.push(options.isRead ? 1 : 0);
		}

		if (options?.query) {
			sql += ` AND (a.title LIKE ? OR a.content_text LIKE ? OR a.summary LIKE ? OR a.tldr LIKE ?)`;
			const pattern = `%${options.query}%`;
			params.push(pattern, pattern, pattern, pattern);
		}

		sql += ` ORDER BY a.published_at DESC LIMIT ? OFFSET ?`;
		params.push(options?.limit ?? 50, options?.offset ?? 0);

		const res = await db.prepare(sql).bind(...params).all<any>();
		return res.results;
	},

	async addArticles(db: D1Database, articles: DBArticle[]): Promise<void> {
		if (articles.length === 0) return;
		
		const statements = articles.map(art => {
			return db.prepare(
				`INSERT OR IGNORE INTO articles (
					id, feed_id, external_url, title, author, content_html, content_text, 
					summary, tldr, key_insights, ai_tags, quality_score, clickbait_score, 
					reading_time_min, word_count, image_url, published_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			).bind(
				art.id,
				art.feed_id,
				art.external_url,
				art.title,
				art.author || null,
				art.content_html || null,
				art.content_text || null,
				art.summary || null,
				art.tldr || null,
				art.key_insights || null,
				art.ai_tags || null,
				art.quality_score ?? 0,
				art.clickbait_score ?? 0,
				art.reading_time_min ?? 1,
				art.word_count ?? 0,
				art.image_url || null,
				art.published_at || null
			);
		});

		await db.batch(statements);
	},

	async getArticle(db: D1Database, userId: string, id: string): Promise<(DBArticle & { is_read: number; is_bookmarked: number }) | null> {
		return db.prepare(`
			SELECT a.*, COALESCE(ua.is_read, 0) as is_read, COALESCE(ua.is_bookmarked, 0) as is_bookmarked
			FROM articles a
			LEFT JOIN user_articles ua ON a.id = ua.article_id AND ua.user_id = ?
			WHERE a.id = ?
		`).bind(userId, id).first<any>();
	},

	async updateUserArticleInteraction(
		db: D1Database, 
		userId: string, 
		articleId: string, 
		interaction: Partial<DBUserArticle>
	): Promise<void> {
		const interactionId = `${userId}_${articleId}`;
		
		// Get existing interaction or create default
		const existing = await db.prepare(
			'SELECT * FROM user_articles WHERE user_id = ? AND article_id = ?'
		).bind(userId, articleId).first<DBUserArticle>();

		if (!existing) {
			await db.prepare(
				`INSERT INTO user_articles (
					id, user_id, article_id, is_read, is_bookmarked, is_liked, is_disliked, is_saved_offline,
					reading_progress, time_spent_sec, opened_count, first_opened_at, last_opened_at, bookmarked_at
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			).bind(
				interactionId,
				userId,
				articleId,
				interaction.is_read ?? 0,
				interaction.is_bookmarked ?? 0,
				interaction.is_liked ?? 0,
				interaction.is_disliked ?? 0,
				interaction.is_saved_offline ?? 0,
				interaction.reading_progress ?? 0.0,
				interaction.time_spent_sec ?? 0,
				interaction.opened_count ?? 1,
				interaction.first_opened_at || datetimeNow(),
				interaction.last_opened_at || datetimeNow(),
				interaction.is_bookmarked === 1 ? datetimeNow() : null
			).run();
		} else {
			const keys = Object.keys(interaction).filter(k => k !== 'user_id' && k !== 'article_id' && k !== 'id');
			if (keys.length === 0) return;
			
			const updates = keys.map(k => `${k} = ?`).join(', ');
			const query = `UPDATE user_articles SET ${updates}, updated_at = datetime('now') WHERE user_id = ? AND article_id = ?`;
			const values = keys.map(k => (interaction as any)[k]);
			await db.prepare(query).bind(...values, userId, articleId).run();
		}

		// Update stats if mark as read
		if (interaction.is_read === 1 && (!existing || existing.is_read !== 1)) {
			await db.prepare(
				`UPDATE user_stats SET 
					total_articles_read = total_articles_read + 1,
					xp = xp + 10,
					last_active_date = date('now'),
					updated_at = datetime('now')
				WHERE user_id = ?`
			).bind(userId).run();
		}
	},

	// Notes
	async getNotes(db: D1Database, userId: string): Promise<DBNote[]> {
		const res = await db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC').bind(userId).all<DBNote>();
		return res.results;
	},

	async getNote(db: D1Database, userId: string, id: string): Promise<DBNote | null> {
		return db.prepare('SELECT * FROM notes WHERE user_id = ? AND id = ?').bind(userId, id).first<DBNote>();
	},

	async saveNote(db: D1Database, note: DBNote): Promise<void> {
		await db.prepare(
			`INSERT OR REPLACE INTO notes (id, user_id, title, content_md, parent_id, article_id, is_pinned, word_count, created_at, updated_at) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM notes WHERE id = ?), datetime('now')), datetime('now'))`
		).bind(
			note.id,
			note.user_id,
			note.title,
			note.content_md,
			note.parent_id || null,
			note.article_id || null,
			note.is_pinned ?? 0,
			note.word_count ?? 0,
			note.id
		).run();
	},

	async deleteNote(db: D1Database, userId: string, id: string): Promise<void> {
		await db.prepare('DELETE FROM notes WHERE user_id = ? AND id = ?').bind(userId, id).run();
	},

	// Highlights
	async getHighlights(db: D1Database, userId: string, articleId?: string): Promise<DBHighlight[]> {
		if (articleId) {
			const res = await db.prepare('SELECT * FROM highlights WHERE user_id = ? AND article_id = ?').bind(userId, articleId).all<DBHighlight>();
			return res.results;
		}
		const res = await db.prepare('SELECT * FROM highlights WHERE user_id = ?').bind(userId).all<DBHighlight>();
		return res.results;
	},

	async saveHighlight(db: D1Database, hl: DBHighlight): Promise<void> {
		await db.prepare(
			`INSERT OR REPLACE INTO highlights (id, user_id, article_id, highlighted_text, note, color, start_offset, end_offset, element_selector) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
		).bind(
			hl.id,
			hl.user_id,
			hl.article_id,
			hl.highlighted_text,
			hl.note || null,
			hl.color,
			hl.start_offset || null,
			hl.end_offset || null,
			hl.element_selector || null
		).run();
	},

	async deleteHighlight(db: D1Database, userId: string, id: string): Promise<void> {
		await db.prepare('DELETE FROM highlights WHERE user_id = ? AND id = ?').bind(userId, id).run();
	},

	// SRS Cards
	async getSRSCardsDue(db: D1Database, userId: string): Promise<DBSRSCard[]> {
		const res = await db.prepare(
			"SELECT * FROM srs_cards WHERE user_id = ? AND (due_at IS NULL OR due_at <= datetime('now'))"
		).bind(userId).all<DBSRSCard>();
		return res.results;
	},

	async saveSRSCard(db: D1Database, card: DBSRSCard): Promise<void> {
		await db.prepare(
			`INSERT OR REPLACE INTO srs_cards (
				id, user_id, item_type, item_id, front_text, back_text, stability, difficulty, 
				elapsed_days, scheduled_days, reps, lapses, state, due_at, last_review_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		).bind(
			card.id,
			card.user_id,
			card.item_type,
			card.item_id,
			card.front_text,
			card.back_text || null,
			card.stability,
			card.difficulty,
			card.elapsed_days,
			card.scheduled_days,
			card.reps,
			card.lapses,
			card.state,
			card.due_at || null,
			card.last_review_at || null
		).run();
	},

	// Stats
	async getStats(db: D1Database, userId: string): Promise<DBUserStats | null> {
		return db.prepare('SELECT * FROM user_stats WHERE user_id = ?').bind(userId).first<DBUserStats>();
	},

	async updateStats(db: D1Database, userId: string, data: Partial<DBUserStats>): Promise<void> {
		const keys = Object.keys(data).filter(k => k !== 'user_id');
		if (keys.length === 0) return;
		const query = `UPDATE user_stats SET ${keys.map(k => `${k} = ?`).join(', ')}, updated_at = datetime('now') WHERE user_id = ?`;
		const values = keys.map(k => (data as any)[k]);
		await db.prepare(query).bind(...values, userId).run();
	}
};

function datetimeNow() {
	return new Date().toISOString();
}
