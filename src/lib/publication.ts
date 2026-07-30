interface PublicationData {
  draft?: boolean;
  published: Date | string;
}

const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tokyo",
});

export function isPublicPost(data: PublicationData, now = new Date()): boolean {
  const published = data.published instanceof Date ? data.published : new Date(data.published);
  return (
    data.draft !== true &&
    !Number.isNaN(published.valueOf()) &&
    dateFormatter.format(published) <= dateFormatter.format(now)
  );
}
