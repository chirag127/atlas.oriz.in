export function renderDigestEmail(params: {
  name: string;
  articles: { title: string; summary: string; url: string }[];
  date: string;
}): string {
  const articlesHtml = params.articles
    .map(
      (a) => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #e2e8f0;">
        <a href="${a.url}" style="font-size:16px;font-weight:600;color:#1a202c;text-decoration:none;">${a.title}</a>
        <p style="margin:4px 0 0;font-size:14px;color:#718096;">${a.summary}</p>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7fafc;font-family:Georgia,serif;">
  <table width="100%" style="max-width:600px;margin:0 auto;padding:24px;">
    <tr><td style="padding:24px 0;text-align:center;">
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;color:#1a202c;margin:0;">Atlas</h1>
      <p style="color:#718096;font-size:14px;">${params.date}</p>
    </td></tr>
    <tr><td style="background:#fff;border-radius:8px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="font-size:18px;color:#1a202c;margin:0 0 16px;">Your Daily Digest</h2>
      <p style="color:#4a5568;font-size:14px;">Good morning ${params.name}. Here are today's top articles.</p>
      <table width="100%">${articlesHtml}</table>
    </td></tr>
  </table>
</body></html>`;
}

export function renderRecapEmail(params: {
  name: string;
  articlesRead: number;
  streak: number;
  curiosityScore: number;
  topTopics: string[];
}): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7fafc;font-family:Georgia,serif;">
  <table width="100%" style="max-width:600px;margin:0 auto;padding:24px;">
    <tr><td style="padding:24px 0;text-align:center;">
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;color:#1a202c;margin:0;">Atlas</h1>
      <p style="color:#718096;font-size:14px;">Weekly Recap</p>
    </td></tr>
    <tr><td style="background:#fff;border-radius:8px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="font-size:18px;color:#1a202c;margin:0 0 16px;">Your Week in Reading</h2>
      <table width="100%">
        <tr><td style="padding:8px 0;font-size:14px;color:#4a5568;">Articles Read</td>
            <td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;">${params.articlesRead}</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#4a5568;">Reading Streak</td>
            <td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;">${params.streak} days</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#4a5568;">Curiosity Score</td>
            <td style="padding:8px 0;font-size:14px;font-weight:600;text-align:right;">${params.curiosityScore}</td></tr>
      </table>
      <p style="color:#4a5568;font-size:14px;margin-top:16px;">Top topics: ${params.topTopics.join(", ")}</p>
    </td></tr>
  </table>
</body></html>`;
}

export function renderAlertEmail(params: {
  keyword: string;
  articles: { title: string; url: string }[];
}): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Georgia,serif;">
  <h2 style="font-family:'Playfair Display',Georgia,serif;">Keyword Alert: ${params.keyword}</h2>
  <ul>${params.articles.map((a) => `<li><a href="${a.url}">${a.title}</a></li>`).join("")}</ul>
</body></html>`;
}
