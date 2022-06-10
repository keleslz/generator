import * as cheerio from "cheerio";
import { BodyFormat } from "../dom/BodyFormat ";
import { HeadFormat } from "../dom/HeadFormat";
import { Attribute, AttributeService } from "../services/AttributesService";
import { FormatPageService } from "../services/FormatPageService";
import { LinkService } from "../services/LinkService";
import { UploadService } from "../services/UploadService";

export class ServiceFactory {

    static getHeadFormat(document: cheerio.CheerioAPI): HeadFormat {
        const linkService = ServiceFactory.getLinkService(document)
        return new HeadFormat(document, linkService)
    }

    static getBodyFormat(document: cheerio.CheerioAPI): BodyFormat {
        return new BodyFormat(document)
    }

    // eslint-disable-next-line no-unused-vars
    static getUploadService(domain: string, onData: (content: string, path: string) => void): UploadService {
        return new UploadService(domain, onData)
    }

    static getFormatPageService(domainName: string) {
        return new FormatPageService(domainName)
    }

    static getLinkService(document: cheerio.CheerioAPI): LinkService {
        return new LinkService(document)
    }

    static getAttributeService(domainName: string, page: number = 1, attributes: Map<String, Attribute>): AttributeService {
        return new AttributeService(domainName, page, attributes)
    }
}