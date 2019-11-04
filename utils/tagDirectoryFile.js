const path = require('path')
const fs = require('fs')


module.exports = class TagDirectoryFile {
	constructor(filename) {
		this.filepath = (() => {
			const filepath = path.resolve(process.cwd(), filename)
			if(path.extname(filepath) != '.json') return filepath + '.json'
			else return filepath
		})()
	}

	//TODO: What happens if file isn't JSON?
	read() { return JSON.parse(fs.readFileSync(this.filepath, {encoding: 'utf-8'})) }

	//TODO: What happens if data isn't JSON?
	write(data) { fs.writeFileSync(this.filepath, JSON.stringify(data)) }

	exists() { return fs.existsSync(this.filepath) }
}