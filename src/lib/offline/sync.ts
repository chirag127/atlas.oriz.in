import dbLocal, { type SyncQueueItem } from './dexie';

export async function queueOfflineAction(
	action: 'insert' | 'update' | 'delete',
	tableName: 'notes' | 'highlights' | 'user_articles' | 'collections' | 'srs_cards',
	itemId: string,
	payload: any
) {
	const queueItem: SyncQueueItem = {
		action,
		table_name: tableName,
		item_id: itemId,
		payload: JSON.stringify(payload),
		created_at: new Date().toISOString()
	};
	await dbLocal.sync_queue.add(queueItem);
	console.log(`Queued offline action: ${action} on ${tableName} (ID: ${itemId})`);
}

export async function syncWithCloud(userId: string): Promise<{ success: boolean; syncedCount: number; errors?: string[] }> {
	if (typeof window === 'undefined' || !navigator.onLine) {
		return { success: false, syncedCount: 0, errors: ['Device is offline'] };
	}

	try {
		// 1. Get all pending sync queue items
		const pendingItems = await dbLocal.sync_queue.toArray();
		
		const lastSyncedAt = localStorage.getItem(`atlas_last_synced_at_${userId}`) || '1970-01-01T00:00:00.000Z';
		const currentSyncTime = new Date().toISOString();

		// 2. Send local actions to server + pull server updates
		const res = await fetch('/api/sync', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId,
				queue: pendingItems,
				lastSyncedAt
			})
		});

		if (!res.ok) {
			const errText = await res.text();
			throw new Error(`Sync server returned ${res.status}: ${errText}`);
		}

		const data = (await res.json()) as any;
		
		if (!data.success) {
			throw new Error(data.error || 'Server reported sync failure');
		}

		// 3. Clear successfully synced items from local queue
		const successfulIds = pendingItems.map(item => item.id).filter((id): id is number => id !== undefined);
		if (successfulIds.length > 0) {
			await dbLocal.sync_queue.bulkDelete(successfulIds);
		}

		// 4. Apply pulled server updates to local IndexedDB
		const { pulls } = data;
		if (pulls) {
			// Apply pulled notes
			if (pulls.notes && pulls.notes.length > 0) {
				for (const note of pulls.notes) {
					if (note.deleted) {
						await dbLocal.notes.delete(note.id);
					} else {
						// Check local version's last modification to ensure we don't overwrite newer local unsynced edits
						const local = await dbLocal.notes.get(note.id);
						if (!local || new Date(note.updated_at) > new Date(local.updated_at)) {
							await dbLocal.notes.put({
								id: note.id,
								user_id: note.user_id,
								title: note.title,
								content_md: note.content_md,
								parent_id: note.parent_id || undefined,
								article_id: note.article_id || undefined,
								is_pinned: note.is_pinned ?? 0,
								word_count: note.word_count ?? 0,
								created_at: note.created_at,
								updated_at: note.updated_at
							});
						}
					}
				}
			}

			// Apply pulled highlights
			if (pulls.highlights && pulls.highlights.length > 0) {
				for (const hl of pulls.highlights) {
					if (hl.deleted) {
						await dbLocal.highlights.delete(hl.id);
					} else {
						await dbLocal.highlights.put({
							id: hl.id,
							user_id: hl.user_id,
							article_id: hl.article_id,
							highlighted_text: hl.highlighted_text,
							note: hl.note || undefined,
							color: hl.color,
							start_offset: hl.start_offset,
							end_offset: hl.end_offset,
							element_selector: hl.element_selector,
							created_at: hl.created_at
						});
					}
				}
			}
		}

		// 5. Update last synced timestamp
		localStorage.setItem(`atlas_last_synced_at_${userId}`, currentSyncTime);
		console.log(`Synchronization complete. Synced ${pendingItems.length} items. Pulled:`, pulls);

		return {
			success: true,
			syncedCount: pendingItems.length
		};

	} catch (error: any) {
		console.error('Bidirectional sync failed:', error);
		return {
			success: false,
			syncedCount: 0,
			errors: [error.message || String(error)]
		};
	}
}
