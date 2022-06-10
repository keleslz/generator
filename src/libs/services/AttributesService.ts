/* eslint-disable no-unused-vars */
import * as cheerio  from "cheerio";
import path from "path";
import { FileService } from "./FileService";

export type Attribute = {
    name?: string
    label?: string
    href?: string
    id?: string
    value?: string
    title?: string
}


export class AttributeService {
    constructor(
        private domainName : string,
        private page : number,
        private attibutes: Map<String, Attribute>
        ) {}
    
    public add(name: string, value: Attribute) : this  {
        this.attibutes.set(name, value)
        return this
    }

    public setPage(page: number) : this {
        this.page = page
        return this
    }

    public onSave() {
        console.log(Object.fromEntries(this.attibutes));
        
        FileService.create(
            path.join('src/files', this.domainName, 'attributes', `attributes-${this.page}.json`),
            JSON.stringify(Object.fromEntries(this.attibutes))
        )
    }
}