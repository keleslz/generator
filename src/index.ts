import https from 'https'
import fs from 'fs'
import express from 'express'
import { DomFormat } from './libs/dom/DomFormat'
import * as cheerio from 'cheerio'
import { LinkService } from './libs/LinkService'

const app = express()
const port = 3000
const src = "src/files"
const options: https.RequestOptions = {
    hostname: 'wordpress.com',
    port: 443,
    path: '/',
    method: 'GET',
    headers: {
        'user-agent': 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36'
    }
}

type LinksAttributes = {
    index: Number,
    id: Number,
}

// Listen all save 
app.listen(port, () => {
    const content = fs.readFileSync(`${src}/test/test.html.twig`, 'utf-8');
    const document = cheerio.load(content);
    const attributes = new Map<number, LinksAttributes>();
    
    const manager = new DomFormat(document);
    manager.removeScripts()
    manager.head()
    manager.links()

    fs.writeFileSync(`${src}/test/generated.html.twig`, document.html().toString(), {
        encoding: 'utf-8'
    })

    // const dir = fs.mkdirSync(`${src}/${options.hostname}`)

    // const req = https.request(options, (res) => {
    //     console.log(`statusCode: ${res.statusCode}`)

    //     let data =''
    //     res.on('data', (line) => {      
    //         data += line
    //     });

    //     res.on('end', () => {
    //         // const content = new DomManager(data).remove()
    //         fs.writeFile(`${src}/${options.hostname}/test.html.twig`, data, console.error)
    //     });
    // })

    // req.on('error', (e) => {
    //     console.log(e);
    // })

    // req.end()
})