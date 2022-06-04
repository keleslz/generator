import * as cheerio from 'cheerio'

export class LinkService {

    constructor(
        private document: cheerio.CheerioAPI,
    ) {}

    public reformat(): void {
        const links = this. document('a')

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const newLink = this.document(`<a>{{ link${i} }}</a>`)

            link.attributes.forEach((item) => {
                newLink.attr(item.name, item.value)
            })

            newLink.attr('href', `#test${i}`)
            newLink.attr('title', `title-test-${i}`)

            this.document(link).replaceWith(newLink)
        }
    }
}