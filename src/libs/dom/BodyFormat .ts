/* eslint-disable no-unused-vars */
import * as cheerio from 'cheerio';
import { Attribute, AttributeService } from '../services/AttributesService';
import { ArrayUtils } from '../utils/ArrayUtils';

export class BodyFormat {

    private attributes = new Map<String, Attribute>()

    constructor(
        private document: cheerio.CheerioAPI,
    ) { }

    public execute(): this {
        this.textualTag()
        // this.images()
        return this
    }

    private textualTag(): void {
        const tags = new Map<string, string>()
            .set('h1', 'title')
            .set('h2', 'subTitle')
            .set('h3', 'subTitle3')
            .set('h4', 'subTitle4')
            .set('h5', 'subTitle5')
            .set('h6', 'subTitle6')
            .set('p', 'paragraph')
            .set('span', 'span')
            .set('li', 'span')
            ;

        ArrayUtils.copyAttributes(
            this.document,
            tags,
            (params) => {
                const variable = `${params.itemKey}_${params.itemIndex}`

                this.attributes.set(variable, {
                    href: params.oldItem.attribs['href'] ?? null,
                    title: params.oldItem.attribs['title'] ?? null,
                })

                this.document(params.oldItem).replaceWith(`<${params.itemKey}>{{ ${variable} }}</${params.itemKey}>`)
            }
        )
    }

    private images(): void {
        const images = new Map<string, string>()
            .set('img', 'title')
        ;

        ArrayUtils.copyAttributes(
            this.document,
            images,
            (params) => {
                params.newItem.css('color', 'red')
                params.newItem.attr('src', 'https://via.placeholder.com/900')
                this.document(params.oldItem).replaceWith(params.newItem)
            }
        )
    }

    public get allAttributes() {
        return this.attributes
    }
}