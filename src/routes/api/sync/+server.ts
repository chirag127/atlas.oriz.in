import { json, type RequestHandler } from '@sveltejs/kit';
import { dbHelper } from '$lib/db';

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env.DB;
	if (!db) {
		return json({ error: 'Database binding missing' }, { status: 500 });
	}

	try {
		const { userId, queue, lastSyncedAt } = (await request.json()) as any;

		if (!userId) {
			return json({ error: 'Missing userId' }, { status: 400 });
		}

		// 1. Process client's sync queue
		if (queue && queue.length > 0) {
			for (const item of queue) {
				const payload = JSON.parse(item.payload);
				
				if (item.table_name === 'notes') {
					if (item.action === 'insert' || item.action === 'update') {
						// Last-Write-Wins check
						const existing = await db.prepare('SELECT updated_at FROM notes WHERE id = ?')
							.bind(item.item_id)
							.first<{ updated_at: string }>();

						if (!existing || new Date(payload.updated_at) > new Date(existing.updated_at)) {
							await dbHelper.saveNote(db, payload);
						}
					} else if (item.action === 'delete') {
						await dbHelper.deleteNote(db, userId, item.item_id);
					}
				} 
				
				else if (item.table_name === 'highlights') {
					if (item.action === 'insert' || item.action === 'update') {
						await dbHelper.saveHighlight(db, payload);
					} else if (item.action === 'delete') {
						await dbHelper.deleteHighlight(db, userId, item.item_id);
					}
				}
				
				else if (item.table_name === 'user_articles') {
					await dbHelper.updateUserArticleInteraction(db, userId, item.item_id, payload);
				}
				
				else if (item.table_name === 'srs_cards') {
					await dbHelper.saveSRSCard(db, payload);
				}
			}
		}

		// 2. Pull server changes since lastSyncedAt
		const syncedTime = lastSyncedAt || '1970-01-01T00:00:00.000Z';
		
		// Query notes modified after syncedTime
		const notesRes = await db.prepare(
			'SELECT * FROM notes WHERE user_id = ? AND updated_at > ?'
		).bind(userId, syncedTime).all();
		
		// Query highlights modified/created after syncedTime
		// Note: highlights only has created_at, which is fine since they are immutable or deleted
		const highlightsRes = await db.prepare(
			'SELECT * FROM highlights WHERE user_id = ? AND created_at > ?'
		).bind(userId, syncedTime).all();

		return json({
			success: true,
			pulls: {
				notes: notesRes.results,
				highlights: highlightsRes.results
			}
		});

	} catch (error: any) {
		console.error('Server sync error:', error);
		return json({ success: false, error: error.message || String(error) }, { status: 500 });
	}
};
