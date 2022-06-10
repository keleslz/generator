import * as cheerio from 'cheerio'

export type LinkType = 'a'|'link'|'link[rel=icon]';

export class LinkService {

    constructor(
        private document: cheerio.CheerioAPI,
    ) {}

    public reformat(
        cssSelector: LinkType,
        newTag: (index: number) => cheerio.Cheerio<cheerio.Element>, 
        updateAttributes: (link: cheerio.Cheerio<cheerio.Element>, i: number, oldLink: cheerio.Element) => void 
    )
    {
        const links = this.document(cssSelector)

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const newLink = newTag(i)

            link.attributes.forEach((item) => {
                newLink.attr(item.name, item.value)
            })

            updateAttributes(newLink, i, link)

            this.document(link).replaceWith(newLink)
        }
    }
}