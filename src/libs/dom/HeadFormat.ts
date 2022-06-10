/* eslint-disable no-unused-vars */
import * as cheerio from 'cheerio'
import { Attribute } from '../services/AttributesService';
import { LinkService } from '../services/LinkService';

export class HeadFormat {
    private attributes = new Map<String, Attribute>()

    constructor(
        private document: cheerio.CheerioAPI,
        private linkService: LinkService
    ) { }

    private removeScripts() {
        this.document('script').remove()
    }

    public execute() : this {
        this.removeScripts()
        this.metas()
        this.links()
        this.title()
        return this
    }

    private links() {
        this.linkService.reformat(
            'a',
            (i) => this.document(`<a>{{ link_${i} }}</a>`) as cheerio.Cheerio<cheerio.Element>,
            (newLink, i, oldLink) => {

                const variableName = `link_${i}`
                const title = `title_${i}`
                
                this.attributes.set(variableName,  {
                    name: variableName,
                    title: title,
                    href:  `href_${i}`
                })
                
                newLink.attr('href', `{{ ${variableName} }}`)
                newLink.attr('title', `{{ ${title} }}`)
            }
        )

        const keys: string[] = [
            'link[rel=alternate]',
            'link[rel=shortlink]',
            'link[rel=canonical]',
            'link[rel=EditURI]',
            'link[rel=preconnect]',
            'link[rel=search]',
            'link[rel=wlwmanifest]',
            'link[type=image/x-icon]',
            'link[type=image/png]',
        ]

        keys.forEach(k => this.document(k).remove())
        this.updateFavicon()
    }

    public updateFavicon(): void {
        const sizes = ['32x32', '192x192']
        this.linkService.reformat(
            'link[rel=icon]',
            () => this.document('<link>') as cheerio.Cheerio<cheerio.Element>,
            (newLink, i) => {
                newLink.attr('href', `{{ link_${i} }}`)

                if (sizes[i] != undefined) {
                    newLink.attr('sizes', sizes[i])
                }
            }
        )
    }

    private metas() {
        this.updateLang()
        this.removeMeta()

        const description = this.document('meta[name=description]')
        description.attr('content', '{{ head.meta.description }}')
    }

    private updateLang() {
        const html = this.document('html')
        html.attr('lang', '{{ head.meta.lang }}')
    }

    private removeMeta() {
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
                const value = metaToWithPropertyToNotRemove.get(property)
                this.document(item).attr('content', value)
                return
            }

            if (!metaToNotRemove.includes(name ?? '')) {
                this.document(item).remove()
            }
        })

        return this
    }

    private title() {
        const title = this.document('head > title')
        title.replaceWith('<title>{{ head.title }}</title>')
    }

    public get allAttributes() {
        return  this.attributes
    }
}