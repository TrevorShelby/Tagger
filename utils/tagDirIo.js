const fs = require('fs')
const TagDirectory = require('./tagDirectory').TagDirectory



const readTagDirectory = tagDirFilepath => {
	if(fs.existsSync(tagDirFilepath)) {
		const tagDirJson = JSON.parse(fs.readFileSync(tagDirFilepath))
		return new TagDirectory(tagDirJson)
	}
	else
		return null
}


const writeTagDirectory = (tagDir, tagDirFilepath) => {
	const data = JSON.stringify({files: tagDir.files, tags: tagDir.tags})
	fs.writeFileSync(tagDirFilepath, data)
}



module.exports = { readTagDirectory, writeTagDirectory }