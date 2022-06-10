import fs from 'fs'
import express from 'express'
import path from 'path'
import Mustache from 'mustache'
import { FileService } from './libs/services/FileService'
import { Attribute } from './libs/services/AttributesService'
import { ServiceFactory } from './libs/factory/ServiceFactory'

const app = express()
const port = 3000

const domainName = 'wordpress.com'

app.listen(port, () => {

})

app.get('/generate', (req, res) => {

    const content = fs.readFileSync('src/files/wordpress.org/pages/index.html.mustache', { encoding: 'utf-8'})

    ServiceFactory.getFormatPageService(domainName).execute(
        content, 
        'src/files/wordpress.org/pages/index.html.mustache',
        1
    )

    ServiceFactory.getUploadService(
        domainName,
        (content, path) => ServiceFactory.getFormatPageService(domainName).execute(content, path, 1)
    ).execute()

    res.send("{'status': 'ok'}");

})

app.get('/index', (req, res) => {
    
    const base = path.join('src', 'files', domainName)
    const project = path.join(base, 'pages', 'index.html.mustache')
    const atttributeFilePath = path.join(base, 'attributes', 'attributes-1.json')
    const content = FileService.read(project)

    const json = JSON.parse(FileService.read(atttributeFilePath))
    const entries = Object.entries<Attribute>(json);

    const lorem = FileService.read(path.join('src', 'assets', 'lorem-ipsum.txt' ))
    let data = new Map<String, string>()

    for (const [k] of entries) {
        const value =  Math.floor(Math.random() * 100);
        data.set(k, lorem.slice(4, value))
    }

    console.log(Object.fromEntries(data));
    
    let output = Mustache.render(content, Object.fromEntries(data));

    res.send(output);
});