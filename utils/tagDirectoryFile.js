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

	read() { return fs.readFileSync(this.filepath, {encoding: 'utf-8'}) }

	write(data) { fs.writeFileSync(this.filepath, JSON.stringify(data)) }

	exists() { return fs.existsSync(this.filepath) }
}