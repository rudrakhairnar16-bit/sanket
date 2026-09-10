export type AuditAction =
  | 'login'
  | 'logout'
  | 'session_start'
  | 'session_end'
  | 'sign_recognized'
  | 'interpreter_escalation'
  | 'feedback_submitted'
  | 'module_completed'
  | 'admin_settings_change'
  | 'sign_approved'
  | 'sign_rejected'
  | 'service_pack_update'
  | 'content_update'
  | 'role_change';

export interface AuditEntry {
  userId: string;
  username: string;
  role: string;
  action: AuditAction;
  details: string;
  metadata?: Record<string, string | number | boolean>;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {});
    } catch {}
    return;
  }
  try {
    const { default: AuditLog } = await import('@/models/AuditLog');
    await AuditLog.create({
      userId: entry.userId,
      userName: entry.username,
      action: entry.action,
      target: entry.details,
      result: 'success',
      details: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
      timestamp: new Date(),
    });
  } catch {
    console.error('[Audit] Failed to log:', entry.action);
  }
}

export async function getAuditLogs(filters: {
  action?: string;
  userId?: string;
  limit?: number;
}): Promise<any[]> {
  try {
    const { default: AuditLog } = await import('@/models/AuditLog');
    const query: any = {};
    if (filters.action) query.action = filters.action;
    if (filters.userId) query.userId = filters.userId;
    return await AuditLog.find(query).sort({ timestamp: -1 }).limit(filters.limit || 50).lean();
  } catch {
    return [];
  }
}
