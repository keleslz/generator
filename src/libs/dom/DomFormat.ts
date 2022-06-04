import * as cheerio from 'cheerio'
import { LinkService } from '../LinkService';

export class DomFormat {
    constructor(
        private document: cheerio.CheerioAPI
    ) { }

    public removeScripts() {
        this.document('script').remove()
    }

    public links() {
        const linkService = new LinkService(this.document);
        linkService.reformat()

        const keys = [
            'link[rel=alternate]',
            'link[rel=shortlink]',
            'link[rel=canonical]',
            'link[rel=EditURI]'
        ]

        keys.forEach(k => this.document(k).remove())
    }

    public head() {
        this.metas()
        this.links()
        this.title()
    }

    public metas() {
        this.updateLang()
        this.removeMeta()

        const description = this.document('meta[name=description]')
        description.attr('content', '{{ head.meta.description }}')
    }

    public updateLang() {
        const html = this.document('html')
        html.attr('lang', '{{ head.meta.lang }}')
    }

    public removeMeta() {
        const metaToNotRemove = ['description', 'viewport', 'application-name']

        const metaToWithPropertyToNotRemove = new Map()
            .set('og:type', '{{ meta.head.og.type }}')
            .set('og:title', '{{ meta.head.og.title }}')
            .set('og:description', '{{ meta.head.og.description }}')
            .set('og:url', '{{ meta.head.og.url }}')
            .set('og:site_name', '{{ meta.head.og.siteName }}')
            .set('og:image', '{{ meta.head.og.image }}')
            ;

        this.document('meta').each((_, item) => {

            const name = this.document(item).attr('name')
            const property = this.document(item).attr('property')
            
            if (property != undefined && metaToWithPropertyToNotRemove.has(property)) {
            console.log(property);
                const value = metaToWithPropertyToNotRemove.get(property)
                this.document(item).attr('content', value)
                return
            }

            if (!metaToNotRemove.includes(name ?? '')) {
                this.document(item).remove()
            }
        })
    }

    public title() {
        const title = this.document('head > title')
        title.replaceWith('<title>{{ head.title }}</title>')
    }
}