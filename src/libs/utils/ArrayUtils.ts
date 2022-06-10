import * as cheerio from 'cheerio'

type CopyAttributesParams = {
    oldItem: cheerio.Element,
    value: string,
    itemKey: string,
    map: Map<String, String>,
    itemIndex: number,
    newItem: cheerio.Cheerio<cheerio.AnyNode>
}

export class ArrayUtils {

    public static copyAttributes(
        document: cheerio.CheerioAPI,
        tags: Map<string, string>,
        // eslint-disable-next-line no-unused-vars
        onNewTag: (params: CopyAttributesParams) => void,
    ): void {
        tags.forEach((value, itemKey, map) => {
            const items = document(itemKey) as cheerio.Cheerio<cheerio.Element>

            items.each((itemIndex, oldItem) => {
                const newItem = document(itemKey)

                oldItem.attributes.forEach((attr) => {
                    newItem.attr(attr.name, attr.value)
                })

                let params: CopyAttributesParams = {
                    itemIndex,
                    itemKey,
                    map,
                    oldItem,
                    value,
                    newItem
                }

                onNewTag(params)
            })
        })
    }
}