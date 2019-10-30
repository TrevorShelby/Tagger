const changeTagDir = require('../utils/changeTagDir')


module.exports = ({tagDirFilename='tag-dir.json', tags}) => {
	changeTagDir(
		tagDirFilename,
		tagDir => {
			tags.forEach( tag => {
				if(tag in tagDir.tags)
					delete tagDir.tags[tag]
				else
					console.log(`${tag} is not a tag.`)
			})
		},
		() => console.log('Finished removing tags.')
	)
}