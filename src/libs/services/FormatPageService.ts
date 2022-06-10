import * as cheerio from "cheerio";
import { ServiceFactory } from "../factory/ServiceFactory";
import fs from 'fs'
import { FileService } from "./FileService";
import path from "path";

export class FormatPageService {

    // eslint-disable-next-line no-unused-vars
    constructor(private domainName: string) {}

    execute(content: string, filePath: string, page: number) {
        const base = 'src/files'
        const attributesPath = path.join(base, this.domainName, 'attributes', `attributes-${page}.json`)

        const document = cheerio.load(content);

        FileService.create(attributesPath, '{}')
        
        const body = ServiceFactory.getBodyFormat(document).execute()
        const head = ServiceFactory.getHeadFormat(document).execute()

        const attributesService = ServiceFactory.getAttributeService(this.domainName, page, new Map([...body.allAttributes, ...head.allAttributes]))
        attributesService.setPage(page).onSave()

        fs.writeFileSync(filePath, document.html().toString(), {
            encoding: 'utf-8'
        })
        console.log(`--------------------> Success <--------------------`)
    }
}