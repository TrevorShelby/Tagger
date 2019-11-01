const handleIssue = require('./handleIssue')


module.exports = class TagDirectory {
	constructor({files={}, tags={}}={}) {
		this.files = files
		this.tags = tags
	}

	tagFiles(files, tags) {
		if(tags.length == 0)
			return
		files.forEach( file => {
			if(!(file in this.files))
				this.files[file] = []
			tags.forEach( tag => {
				if(!(tag in this.tags))
					this.tags[tag] = []
				if(this.tags[tag].includes(file)) {
					handleIssue('warning', '014', file, tag)
					return
				}
				else {
					this.files[file].push(tag)
					this.tags[tag].push(file)
				}
			})
		})
	}

	untagFiles(files, tags) {
		files.forEach( file => {
			if(!(file in this.files)) {
				handleIssue('warning', '010', file)
				return
			}
			tags.forEach( tag => {
				if(!(tag in this.tags)) {
					handleIssue('warning', '011', tag)
					return
				}
				const tagIndex = this.files[file].indexOf(tag)
				if(tagIndex == -1) {
					handleIssue('warning', '012', file, tag)
					return
				}
				const fileIndex = this.tags[tag].indexOf(file)
				if(fileIndex == -1) {
					handleIssue('warning', '013', file, tag)
					return
				}
				this.files[file].splice(tagIndex, 1)
				this.tags[tag].splice(fileIndex, 1)
			})
			if(this.files[file].length == 0) {
				delete this.files[file]
				handleIssue('warning', '015', file)
			}
		})
	}

	removeTags(tags) {
		tags.forEach( tag => {
			if(!(tag in this.tags)) {
				handleIssue('warning', '011', tag)
				return
			}
			this.tags[tag].forEach( taggedFile => {
				const tagIndex = this.files[taggedFile].indexOf(tag)
				this.files[taggedFile].splice(tagIndex, 1)
				if(this.files[taggedFile].length == 0) {
					delete this.files[taggedFile]
					handleIssue('warning', '015', file)
				}
			})
			delete this.tags[tag]
		})
	}

	removeFiles(files) {
		files.forEach( file => {
			if(!(file in this.files)) {
				handleIssue('warning', '010', file)
				return
			}
			this.files[file].forEach( tagWithFile => {
				const fileIndex = this.tags[tagWithFile].indexOf(file)
				this.tags[tagWithFile].splice(fileIndex, 1)
			})
			delete this.files[file]
		})
	}
}