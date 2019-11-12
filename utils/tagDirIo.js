const fs = require('fs')
const TagDirectory = require('./tagDirectory').TagDirectory



const readTagDirectory = tagDirFilepath => {
	const tagDirJson = JSON.parse(fs.readFileSync(tagDirFilepath, {encoding: 'utf-8'}))
	return new TagDirectory(tagDirJson)
}


const writeTagDirectory = (tagDir, tagDirFilepath) => {
	const data = JSON.stringify({files: tagDir.files, tags: tagDir.tags})
	fs.writeFileSync(tagDirFilepath, data)
}



module.exports = { readTagDirectory, writeTagDirectory }