export const isLiveAnnouncement = (a, now = new Date()) => {
  if (!a || a.active === false) return false;
  const start = a.startsAt ? new Date(a.startsAt) : null;
  const end = a.endsAt ? new Date(a.endsAt) : null;
  return (!start || now >= start) && (!end || now <= end);
};

/** bir liste döndür */
export const getLiveAnnouncements = (items, now = new Date()) =>
  (items || []).filter((a) => isLiveAnnouncement(a, now));
