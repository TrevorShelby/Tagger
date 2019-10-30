const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')


const untagFiles_ = (tags, filepaths) => tagDir => {
	tags.forEach( tag => {
		if(!(tag in tagDir.tags)) {
			console.log(`${tag} is not a tag.`)
			return
		}
		filepaths.forEach(filepath => {
			const filepathIndex = tagDir.tags[tag].indexOf(filepath)
			if(filepathIndex != -1)
				tagDir.tags[tag].splice(filepathIndex, 1)
			else
				console.log(`${filepath} did not have the tag ${tag}`)
		})
	})

	//removes a filepath if it has no tags associated with it.
	filepaths.forEach( filepath => {
		const filepathIsReferenced = Object.keys(tagDir.tags)
			.filter(tag => !tags.includes(tag))
			.reduce( (filepathIsReferenced, tag) => {
				return filepathIsReferenced || tagDir.tags[tag].includes(filepath)
			}, false)
		if(!filepathIsReferenced) {
			console.log(`Removing ${filepath} from the directory as it has no tags.`)
			tagDir.files.splice(tagDir.files.indexOf(filepath), 1)
		}
	})
}


module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	//TODO: Allow for the untagging of directories
	const filepaths = filenames.map(filename => {
		const filepath = path.resolve(process.cwd(),filename)
		if(fs.existsSync(filepath)) return filepath
		else console.log(`${filepath} does not exist and will not be tagged.`)
	}).filter(filepath => filepath != null)

	changeTagDir(
		tagDirFilename, untagFiles_(tags, filepaths), () => console.log('Finished untagging files.')
	)
}