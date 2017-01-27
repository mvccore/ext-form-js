require('./bin/string.js');
var fs = require('fs'),
	path = require('path'),
	execSync = require('child_process').execSync;
	
/* configuration **************************************************************************/


// base MvcCoreForm javascript object name, it's filename and filed definitions directory
var className = 'MvcCoreForm';
var baseSourceFile = '../src/mvccore-form.js';
var fieldsSourceDir = '../src/fields/';

var baseTargetFile = '../../../mvccore-form.js';
var fieldsTargetDir = '../../../fields/';

// for development:
var advancedOptimizations = true;
var prettyPrint = false;

// java path for google closure compiller:
// if you have java in %path% variable - let javaPath as empty string: var javaPath = '';
// if not - complete javaPath variable inclluding java.exe with standard slashes - not backslashes

// get java path stored by install script
var javaPath = fs.readFileSync(
	__dirname + path.sep + 'bin' + path.sep + 'java-home.json', 
	{encoding: 'utf-8', flag: 'r'}
).toString().trim('"');

var tmpSrcFile = 'tmp.src.js';
var tmpMinFile = 'tmp.min.js';


/******************************************************************************************/


// load base MvcCoreForm object definition:
var fileContent = fs.readFileSync(baseSourceFile, 'utf8');
var content = fileContent.trim("\n\r\t;");
var isWin = process.platform.toLowerCase().indexOf('win') > -1;

// load all MvcCoreForm fields definitions:
var fieldDefsFileNames = fs.readdirSync(fieldsSourceDir);
var fieldDefFileName = '';
var fileContentLines = [];
var matchFieldDefRegExp = new RegExp("^" + className + "(\\[')+([^']*)+('\\])+([\\s=]*)+(.*)", 'g');
var fileContentLine = '';
var matches = [];
var fields = [];
var fieldDefClassName = '';
for (var i = 0, l = fieldDefsFileNames.length; i < l; i += 1) {
	fieldDefFileName = fieldDefsFileNames[i];
	if (path.extname(fieldDefFileName).toLowerCase() != '.js') continue;
	fileContent = fs.readFileSync(fieldsSourceDir + fieldDefFileName, 'utf8');
	fileContent = fileContent.trim("\n\r\t;");
	fileContentLines = fileContent.replace(/\r/g, '').split("\n");
	for (var j = 0, k = fileContentLines.length; j < k; j += 1) {
		fileContentLine = fileContentLines[j];
		matches = fileContentLine.match(matchFieldDefRegExp);
		if (matches && matches.length) {
			fieldDefClassName = fileContentLine.replace(matchFieldDefRegExp, '$2');
			fields.push({
				filePath: fieldsTargetDir + fieldDefFileName, 
				className: fieldDefClassName,
				index: 0
			});
			break;
		}
	}
	if (!matches || (matches && !matches.length)) {
		console.error("ERROR: No substring detected in file: '" + fieldDefFileName + "' matches following criteria in any line:");
		console.error("MvcCoreForm['YourFieldName'] = function () {....}");
		console.error(matchFieldDefRegExp);
	}
	content += ";\n" + fileContent;
}

// store everything in temporary file 'tmp.src.js'
if (fs.existsSync(tmpSrcFile)) fs.unlinkSync(tmpSrcFile);
fs.writeFileSync(tmpSrcFile, content);
console.log("Source files completed into single big source.");

// compile tmp source file into tmp minified file 'tmp.min.js':
var currentDir = __dirname.replace(/\\/g, '/') + '/';
var cmd = "cd \"%javaPath%\"\njava -jar bin/compiler/compiler.jar --compilation_level %optimalizationMode% --env BROWSER --formatting PRETTY_PRINT --js \"%inputFile%\" --hide_warnings_for \"%inputFile%\" --js_output_file \"%outputFile%\" --output_wrapper \"var %output%\"";
cmd = cmd
	.replace(/%optimalizationMode%/g, advancedOptimizations ? 'ADVANCED_OPTIMIZATIONS' : 'SIMPLE_OPTIMIZATIONS')
	.replace(/%inputFile%/g, currentDir + tmpSrcFile)
	.replace(/%outputFile%/g, currentDir + tmpMinFile);
if (!prettyPrint) cmd = cmd.replace(' --formatting PRETTY_PRINT', '');
var opts = {
	//cwd: '', // Current working directory of the child process
	input: '', // The value which will be passed as stdin to the spawned process supplying this value will override stdio[0]
	stdio: [], // Child's stdio configuration. (Default: 'pipe') stderr by default will be output to the parent process' stderr unless stdio is specified
	//env: {}, // Environment key-value pairs
	//shell: '', // Shell to execute the command with (Default: '/bin/sh' on UNIX, 'cmd.exe' on Windows, The shell should understand the -c switch on UNIX or /s /c on Windows. On Windows, command line parsing should be compatible with cmd.exe.)
	//uid: 0, // Sets the user identity of the process. (See setuid(2).)
	//gid: 0, // Sets the group identity of the process. (See setgid(2).)
	//timeout: undefined, // In milliseconds the maximum amount of time the process is allowed to run. (Default: undefined)
	//killSignal: 'SIGTERM', // The signal value to be used when the spawned process will be killed. (Default: 'SIGTERM')
	//maxBuffer: 0 // largest amount of data (in bytes) allowed on stdout or stderr - if exceeded child process is killed encoding
};
cmd = cmd
	.replace('%javaPath%', javaPath)
	.replace('bin/compiler/compiler.jar', '"' + currentDir + 'bin/compiler/compiler.jar"');
	
var compileCmdFileName = '';
var compileCmdFullPath = '';
if (isWin) {
	cmd = cmd.replace('%output%', '%%output%%');
	compileCmdFileName = 'compile.bat';
} else {
	compileCmdFileName = 'compile.sh';
}

compileCmdFullPath = __dirname + path.sep + compileCmdFileName;
fs.writeFileSync(compileCmdFullPath, cmd);
execSync(compileCmdFileName, opts);

console.log("Single big source file minimalized into single result file.");

fs.unlinkSync(compileCmdFileName);	

// read minified source, split into original definitions and save into ../.. dir:

// parse minified file
// - complete fields (parsing info array):
var fileContent = fs.readFileSync(tmpMinFile, 'utf8');
var fieldDefFullClassName = '';
var field = {};
var index = 0;
for (var i = 0, l = fields.length; i < l; i += 1) {
	field = fields[i];
	fieldDefFullClassName = className + '.' + field.className;
	index = fileContent.indexOf(fieldDefFullClassName + '=');
	if (index == -1) index = fileContent.indexOf(
		fieldDefFullClassName + ' ='
	);
	field.index = index;
};
// - create target dir if not exists
var fieldsTargetDirStats = null;
try {
	fieldsTargetDirStats = fs.statSync(fieldsTargetDir);
} catch (e) {}
if (!fieldsTargetDirStats || !fieldsTargetDirStats.isDirectory()) {
	if (fieldsTargetDirStats !== null) fs.unlinkSync(fieldsTargetDir);
	fs.mkdirSync(fieldsTargetDir);
}
// - add base file info
fields.push({
	filePath: baseTargetFile, 
	className: className,
	index: 0
});
// - sort fields (parsing info array)
fields.sort(function(a, b){return a.index - b.index});
// - split and save into separate files (by fields - parsing info array)
var currentFileContent = '';
var nextIndex = 0;
var targetFilePath = '';
for (var i = 0, l = fields.length; i < l; i += 1) {
	field = fields[i];
	nextIndex = (typeof(fields[i + 1]) != 'undefined') ? fields[i + 1].index : fileContent.length;
	currentFileContent = fileContent.substr(field.index, nextIndex - field.index);
	currentFileContent = currentFileContent.trim(";");
	targetFilePath = field.filePath;
	if (fs.existsSync(targetFilePath)) {
		fs.unlinkSync(targetFilePath);
	}
	fs.writeFileSync(targetFilePath, currentFileContent + ';');
	console.log("Result file: '" + path.resolve(targetFilePath) + "' readed back and saved separately.");
};

// remove temporary files:
fs.unlinkSync('./tmp.src.js');
fs.unlinkSync('./tmp.min.js');
console.log("Removed all temporary files.");

console.log("Done.");