
/**
 * @description ساخت یک مسیر بصورت پویا
 * @param {!String} targetDirectory
 * @param {boolean} isRelative
 * @return {string}
 */
function mkDynamicDirectory(targetDirectory, { isRelative= false } = {}) {
  const sep = path.sep;
  const initDirectory = path.isAbsolute(targetDirectory) ? sep : '';
  const baseDirectory = isRelative ? __dirname : '.';
  return targetDirectory.split(sep).reduce((parentDirectory, childDirectory) => {
    const directory = path.resolve(baseDirectory, parentDirectory, childDirectory);
    try {
      fs.mkdirSync(directory);
    } catch (err) {
      if (err.code === 'EEXIST') {
        return directory;
      }
      if (err.code === 'ENOENT') {
        throw new Error(`EACCES: permission denied, mkdir '${parentDirectory}'`);
      }
      const error = ['EISDIR', 'EACCES', 'EPERM'].indexOf(err.code) > -1;
      if (!error || error && directory === path.resolve(targetDirectory)) {
        throw err;
      }
    }
    return directory;
  }, initDirectory);
}
