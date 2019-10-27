const fs = require('fs')
const path = require('path')
const getJsonFilepath = require('../utils/getJsonFilepath')


module.exports = ({tagDirFpSeg='./tag-dir.json', tags, taggingFpSegs}) => {
	const tagDirFp = getJsonFilepath(tagDirFpSeg)

	const taggingFps = taggingFpSegs.map(taggingFpSeg => path.resolve(process.cwd(),taggingFpSeg))
	if(fs.existsSync(tagDirFp)) {
		//TODO: Add code for if the file at tagDirFp isn't properly formatted.
		const tagDir = JSON.parse(fs.readFileSync(tagDirFp))
		tags.forEach( tag => {
			if(!(tag in tagDir)) tagDir[tag] = []
			tagDir[tag].push(...taggingFps)
		})
		fs.writeFileSync(tagDirFp, JSON.stringify(tagDir))
		console.log('Finished tagging files.')
	}
	else
		console.log(`${tagDirFp} does not exist.`)
}