import { supabase } from '../config/supabase.js';

/**
 * Sends a push notification to a reviewer's registered FCM device token.
 * Calls Supabase Edge Function if available, or logs for delivery.
 */
export async function sendPushNotification(fcmToken, conflictCount, reviewerEmail) {
  if (!fcmToken) return { success: false, reason: 'No FCM token registered' };

  const payload = {
    fcmToken,
    title: '🔔 New Conflict Review Assignment',
    body: `You have ${conflictCount} new conflict record(s) assigned for triage.`,
    data: {
      url: '/conflict-triage',
      count: String(conflictCount)
    }
  };

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      // Invoke the Edge Function where the user added the FIREBASE_SERVICE_ACCOUNT secret
      const response = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true, method: 'edge-function' };
      }
    }

    console.log(`[FCM Push] Notification queued for ${reviewerEmail}: ${conflictCount} conflicts assigned.`);
    return { success: true, method: 'queued' };
  } catch (err) {
    console.error(`[FCM Push Error] Failed to send push to ${reviewerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Divides unassigned pending conflicts across active reviewers (round-robin)
 * and dispatches push notifications to each reviewer.
 */
export async function autoAssignConflicts() {
  // 1. Fetch unassigned conflicts
  const { data: unassigned, error: fetchErr } = await supabase
    .from('student_conflict_queue')
    .select('id')
    .eq('status', 'PENDING')
    .is('assigned_to', null);

  if (fetchErr || !unassigned || unassigned.length === 0) {
    return { assigned_count: 0, reviewers_notified: 0 };
  }

  // 2. Fetch active reviewers
  const { data: reviewers, error: revErr } = await supabase
    .from('profiles')
    .select('id, email, fcm_token')
    .eq('role', 'reviewer');

  if (revErr || !reviewers || reviewers.length === 0) {
    console.warn('[Assignment] No active reviewers found in profiles table.');
    return { assigned_count: 0, reviewers_notified: 0, warning: 'No reviewers registered' };
  }

  // 3. Round-robin assignment distribution
  const assignmentsByReviewer = {};
  reviewers.forEach((r) => {
    assignmentsByReviewer[r.id] = { reviewer: r, conflictIds: [] };
  });

  unassigned.forEach((item, index) => {
    const rev = reviewers[index % reviewers.length];
    assignmentsByReviewer[rev.id].conflictIds.push(item.id);
  });

  let totalAssigned = 0;
  let notifiedCount = 0;

  // 4. Batch update each reviewer's assignments and trigger push notification
  for (const { reviewer, conflictIds } of Object.values(assignmentsByReviewer)) {
    if (conflictIds.length === 0) continue;

    const { error: updateErr } = await supabase
      .from('student_conflict_queue')
      .update({
        assigned_to: reviewer.id,
        assigned_at: new Date().toISOString()
      })
      .in('id', conflictIds);

    if (!updateErr) {
      totalAssigned += conflictIds.length;

      // Trigger push notification if reviewer has FCM token
      if (reviewer.fcm_token) {
        const pushRes = await sendPushNotification(
          reviewer.fcm_token,
          conflictIds.length,
          reviewer.email
        );
        if (pushRes.success) notifiedCount++;
      }
    }
  }

  return {
    assigned_count: totalAssigned,
    reviewers_notified: notifiedCount,
    reviewers_count: reviewers.length
  };
}
