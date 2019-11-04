const eol = require('os').EOL
const config = {
	'000': (tagDirFilepath) => `${tagDirFilepath} already exists.`,
	'001': (tagDirFilepath) => `${tagDirFilepath} does not exist.`,
	'002': (tagDirFilepath) => `${tagDirFilepath} is not formatted as a JSON file.`,
	'003': (tagDirFilepath, missingPropertyPath) => `${tagDirFilepath} is missing the property ${missingPropertyPath.join('.')} .`,
	'004': (tagDirFilepath, mistypedPropertyPath) => `${mistypedPropertyPath} in ${tagDirFilepath} is the wrong type.`,
	'010': (nonexistentLink) => `${nonexistentLink} does not exist in this directory.`,
	'011': (nonexistentTag) => `${nonexistentTag} is not a tag.`,
	'012': (link, missingTag) => `${link} did not have the tag ${missingTag}.`,
	'013': (missingLink, tag) => `${missingLink} had the tag ${tag}, but ${tag} did not list as having ${missingLink} , indiciating a corrupted tag directory.`,
	'014': (link, tag) => `${link} already had the tag ${tag}.`,
	'015': (removedLink) => `${removedLink} was removed from the directory since it didn't have any more tags.`,
	'016': (nonexistentLink) => `${nonexistentLink} does not exist and will not be tagged.`,
	'017': (invalidTag) => `${invalidTag} is not a valid tag. Tags may only contain letters, numbers, and underscores.`,
	'020': (query, unmatchedParenIndex) => {
		let out = 'Unmatched parenthesis:'
		out += eol + query
		out += eol + ' '.repeat(unmatchedParenIndex) + '^'
		return out
	},
	'021': (query, unexpectedTokenIndex) => {
		let out = `Unexpected token '${str[unexpectedTokenIndex]}':`
		out += eol + query
		out += eol + ' '.repeat(unexpectedTokenIndex) + '^'
		return out
	},
	'022': (nonexistentTag) => `${nonexistentTag} is not a tag.`,

	'100': (tagDirFilepath) => `Initialized ${tagDirFilepath} .`,
	'101': () => 'Added link.'
	'102': () => 'Removed links.',
	'103': () => 'Removed tags.',
	'104': () => 'Tagged links.',
	'105': () => 'Untagged links.',
	'106': (queryMatches) => {
		let out = `Found ${queryMatches.length} result${queryMatches.length != 1 ? 's' : ''}.`
		queryMatches.forEach( match => out += eol + match )
		return out
	}
}



module.exports = (type, code, ...data) => {
	code = (code + '').padStart(3, '0')
	const out = config[code](...data)
	if(type == 'error' || type == 'warning') {
		let header
		if(code[1] == '0') header = 'Directory '
		else if(code[1] == '1') header = 'Directory Operation '
		else if(code[1] == '2') header = 'Query '

		if(type == 'error') {
			header += 'Error:'
			console.error(header + eol + out)
			process.exit(1)
		}
		else {
			header += 'Warning:'
			console.error(header + eol + out + eol)
		}
	}
	else if(type == 'success') console.log(out)
}