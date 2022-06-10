import fs from 'fs'
import https from 'https'
import path from 'path'

export class UploadService {

    private src = "src/files"
    private attributesDir = "attributes"
    private pagesDir = "pages"
    private stylesDir = "styles"
    private domainName: string

    private options: https.RequestOptions = {
        hostname: this.url,
        port: 443,
        path: '/',
        method: 'GET',
        headers: {
            'user-agent': 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36'
        },
        rejectUnauthorized: false,
    }

    constructor(
        private url: string,
        private onData: (content: string, path: string) => void
    ) {
        this.domainName = path.join(this.src, this.url.replace(/^(http|https):\/\//, ''))
    }

    public execute() {

        let dirs: string[] = [
            this.domainName,
            path.join(this.domainName, this.attributesDir),
            path.join(this.domainName, this.pagesDir),
            path.join(this.domainName, this.stylesDir),
        ]

        this.createStructDirs(dirs)
        this.fetch()
    }

    private createStructDirs(dirs: string[]): void {
        for (const dir of dirs) {
            const dirExist = fs.existsSync(dir)

            if (!dirExist) {
                fs.mkdirSync(dir)
            }
        }
    }

    private fetch() {
        const req = https.request(this.options, (res) => {

            if (!res.statusCode?.toString().startsWith('20')) {
                this.remove()
                return console.log(`--------------------> Status code: %d <--------------------`, res.statusCode)
            }

            let data = ''

            res.on('data', (line) => {
                data += line
            });

            res.on('end', () => this.onData(data, path.join(this.domainName, this.pagesDir, 'index.html.mustache')))
        })

        req.on('error', (e) => {
            console.log(`an error was occured\n : ${e}`);
            this.remove()

            req.on('UnhandledPromiseRejectionWarning', () => {
                this.remove()
            })
        })

        req.end()
    }

    private remove() {
        fs.rmSync(this.domainName, { recursive: true, force: true });
    }
}   