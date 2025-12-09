
// Vercel Serverless Function to serve alerts as plain text
// Replicates logic from disasterService.js (GDACS + Ditwa Injection)

export default async function handler(req, res) {
  try {
    const GDACS_FEED_URL = 'https://www.gdacs.org/xml/rss.xml';
    // Using a reliable CORS proxy or direct fetch if node environment allows
    // In Vercel server environment, we can fetch GDACS directly usually, but standard fetch might need polyfill in older node
    // Node 18+ has native fetch. Let's assume Node 18 (default for Vercel now).

    // 1. Fetch GDACS XML
    const response = await fetch(GDACS_FEED_URL);
    const xmlText = await response.text();

    // 2. Simple XML Parse (Regex/String manip to avoid bloated xml parsers)
    // We just need Titles and Descriptions
    const items = xmlText.split('<item>');
    const alerts = [];

    // Parse items
    for (let i = 1; i < items.length; i++) {
        const item = items[i];
        const titleMatch = item.match(/<title>(.*?)<\/title>/);
        const descMatch = item.match(/<description>(.*?)<\/description>/);
        const pointMatch = item.match(/<georss:point>(.*?)<\/georss:point>/);

        if (titleMatch && pointMatch) {
            const title = titleMatch[1];
            const desc = descMatch ? descMatch[1] : '';
            const [lat, lng] = pointMatch[1].split(' ').map(parseFloat);

            // Filter for India Region (roughly)
            if (lat >= 0 && lat <= 45 && lng >= 60 && lng <= 105) {
                alerts.push({
                    title: title.replace('<![CDATA[', '').replace(']]>', ''),
                    description: desc.replace('<![CDATA[', '').replace(']]>', ''),
                    severity: title.toLowerCase().includes('red') ? 'CRITICAL' : 'NORMAL'
                });
            }
        }
    }

    // 3. INJECT CYCLONE DITWA (The "Demo" Data)
    const cycloneDitwa = {
        title: 'SUPER CYCLONE DITWA',
        description: 'Severe Cyclonic Storm DITWA centered over Bay of Bengal. Landfall expected near Chennai. Red Alert.',
        severity: 'CRITICAL',
        status: 'ACTIVE'
    };
    
    // Always put Ditwa first
    alerts.unshift(cycloneDitwa);

    // 4. Format as Plain Text
    let textOutput = "=== SIH DISASTER ALERT SYSTEM ===\n";
    textOutput += `Generated: ${new Date().toLocaleString()}\n\n`;

    alerts.forEach((alert, index) => {
        textOutput += `[${alert.severity}] ${alert.title}\n`;
        textOutput += `Details: ${alert.description}\n`;
        textOutput += "--------------------------------\n";
    });

    // 5. Return Response
    res.status(200).send(textOutput);

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).send(`Error fetching alerts: ${error.message}`);
  }
}
