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

export const getReview = async (id: string) => {
    try {
        const page: any = await notion.pages.retrieve({ page_id: id });
        const imageProp = page.properties.Image?.files?.[0];
        const imageUrl = imageProp?.file?.url || imageProp?.external?.url || null;

        // Notionのページブロック（本文）を取得
        const blocksResponse = await notion.blocks.children.list({ block_id: id });

        // 取得したブロックからテキストを抽出（今回はparagraphとheadingのみを簡易的につなぐ形）
        const reviewText = blocksResponse.results.map((block: any) => {
            if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
                return block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
            }
            if (block.type === 'heading_1' && block.heading_1.rich_text.length > 0) {
                return block.heading_1.rich_text.map((t: any) => t.plain_text).join('');
            }
            if (block.type === 'heading_2' && block.heading_2.rich_text.length > 0) {
                return block.heading_2.rich_text.map((t: any) => t.plain_text).join('');
            }
            if (block.type === 'heading_3' && block.heading_3.rich_text.length > 0) {
                return block.heading_3.rich_text.map((t: any) => t.plain_text).join('');
            }
            return '';
        }).filter(Boolean).join('\n\n');

        return {
            id: page.id,
            title: page.properties.Name?.title?.[0]?.plain_text || 'No Title',
            type: page.properties.Type?.select?.name || 'Other',
            status: page.properties.Status?.select?.name || 'Unknown',
            rating: page.properties.Rating?.select?.name || '-',
            review: reviewText || page.properties.Review?.rich_text?.map((text: any) => text.plain_text).join('') || '', // 本文が空ならプロパティから
            imageUrl: imageUrl,
        };
    } catch (error) {
        console.error('Error fetching from Notion:', error);
        return null;
    }
};
