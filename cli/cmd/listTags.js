const readTagDirectory = require('../tagDirIo').readTagDirectory


module.exports = ({tagDirFilename='tag-dir.json'}) => {
	const tagDir = readTagDirectory(tagDirFilename)
	const tags = Object.keys(tagDir.tags)
	if(tags.length == 0)
		console.log('Found no tags in this directory.')
	else {
		console.log(`Found ${tags.length != 1 ? 'these tags:' : 'this tag:'}`)
		tags.forEach( tag => console.log(`  - ${tag}`))
	}
}