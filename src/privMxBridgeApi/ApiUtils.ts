export class ApiUtils {
    static async loadAllPages<TItem>(pageSize: number, pageLoader: (pageId: number) => Promise<{ totalCount: number; pageItems: TItem[] }>): Promise<TItem[]> {
        const res: TItem[] = [];
        const { pageItems: firstPageItems, totalCount } = await pageLoader(0);
        res.push(...firstPageItems);
        const numberOfPages = Math.ceil(totalCount / pageSize);
        for (let pageId = 1; pageId < numberOfPages; pageId++) {
            const { pageItems } = await pageLoader(pageId);
            res.push(...pageItems);
        }
        return res;
    }
}
