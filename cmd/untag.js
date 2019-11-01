const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const printResults = require('../utils/printResults')


const resultHandlers = {
	missingTags: missingTag => `${missingTag} is not a tag.`,
	missingFiles: missingFile => `${missingFile} does not exist in this directory.`,
	filesWithoutTag: ({file, tag}) => `${file} did not have the tag ${tag}.`,
	tagsWithoutFile: ({file, tag}) => `${file} had the tag ${tag}, but ${tag} did not list as having ${file}.`,
	removedFiles: removedFile => `Removing ${removedFile} from the directory since it has no more tags.`
}

const untagFiles_ = (tags, filepaths) => tagDir => {
	const results = new TagDirectory(tagDir).untagFiles(filepaths, tags)
	printResults(results, resultHandlers)
}


module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	//TODO: Allow for the untagging of directories
	const filepaths = filenames.map( filename => path.resolve(process.cwd(),filename) )

	changeTagDir(
		tagDirFilename, untagFiles_(tags, filepaths), () => console.log('Finished untagging files.')
	)
}