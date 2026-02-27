import { Client } from '@notionhq/client';

export const notion = new Client({
    auth: process.env.NOTION_TOKEN || 'dummy', // Prevent crash on client initialization
});

export const getReviews = async () => {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
        return []; // Return empty if not configured yet
    }

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            sorts: [
                {
                    timestamp: 'created_time',
                    direction: 'descending',
                },
            ],
        });

        return response.results.map((page: any) => {
            const imageProp = page.properties.Image?.files?.[0];
            const imageUrl = imageProp?.file?.url || imageProp?.external?.url || null;

            return {
                id: page.id,
                title: page.properties.Name?.title?.[0]?.plain_text || 'No Title',
                type: page.properties.Type?.select?.name || 'Other',
                status: page.properties.Status?.select?.name || 'Unknown',
                rating: page.properties.Rating?.select?.name || '-',
                review: page.properties.Review?.rich_text?.[0]?.plain_text || '',
                imageUrl: imageUrl,
            };
        });
    } catch (error) {
        console.error('Error fetching from Notion:', error);
        return [];
    }
};
