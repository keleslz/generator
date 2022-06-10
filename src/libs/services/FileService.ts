import fs from 'fs'

export class FileService {

    public static read(path: string) {
        let content = ''
        try {
            content = fs.readFileSync(path, { encoding: 'utf-8'})
        } catch (error) {
            throw new Error(`Unable to read on : ${path} file`)
        }

        return content
    }
    public static create(path: string, data: string, options?: fs.WriteFileOptions): boolean {
        try {
            fs.writeFileSync(path, data, options)
        } catch (error) {
            throw new Error(`Unable to write on : ${path}`)
        }

        return true
    }
}