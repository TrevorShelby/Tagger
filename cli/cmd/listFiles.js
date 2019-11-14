const readTagDirectory = require('../tagDirIo').readTagDirectory


module.exports = ({tagDirFilename='tag-dir.json'}) => {
	const tagDir = readTagDirectory(tagDirFilename)
	const files = Object.keys(tagDir.files)
	if(files.lengths == 0)
		console.log('Found no files in this directory.')
	else {
		console.log(`Found ${files.length != 1 ? 'these files:' : 'this file:'}`)
		files.forEach( file => console.log(`  - ${file}`))
	}
}