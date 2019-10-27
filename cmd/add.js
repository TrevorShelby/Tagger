const fs = require('fs')
const path = require('path')


const getInitFilepath = (initFilepathSegment) => {
	let initFilepath = path.resolve(process.cwd(), initFilepathSegment)
	if(path.extname(initFilepath) != '.json') initFilepath += '.json'
	return initFilepath
}


module.exports = ({initFpSeg='init.json', tags, taggingFpSegs}) => {
	const initFp = getInitFilepath(initFpSeg)

	const taggingFps = taggingFpSegs.map(taggingFpSeg => path.resolve(process.cwd(),taggingFpSeg))
	if(fs.existsSync(initFp)) {
		//TODO: Add code for if the file at initFp isn't properly formatted.
		const tagDir = JSON.parse(fs.readFileSync(initFp))
		tags.forEach( tag => {
			if(!(tag in tagDir)) tagDir[tag] = []
			tagDir[tag].push(...taggingFps)
		})
		fs.write(initFp, JSON.stringify(tagDir))
		console.log('Finished tagging files.')
	}
	else
		console.log(`${initFp} does not exist.`)
}