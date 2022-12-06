const fs = require("fs");
const { readFile, writeFile } = require('fs').promises;
const path = require("path");
const { json2csvAsync } = require('json-2-csv');


function readFiles(dir, processFile) {
  // read directory
  fs.readdir(dir, (error, fileNames) => {
    if (error) throw error;

    fileNames.forEach((filename) => {
      // get current file name
      const name = path.parse(filename).name;
      // get current file extension
      const ext = path.parse(filename).ext;
      // get current file path
      const filepath = path.resolve(dir, filename);

      // get information about the file
      fs.stat(filepath, function (error, stat) {
        if (error) throw error;

        // check if the current path is a file or a folder
        const isFile = stat.isFile();

        // exclude folders
        if (isFile) {
          processFile(filepath, name, ext, stat);
          fs.readFile(filepath, "utf-8", function (err, content) {
            if (err) {
              onError(err);
              return;
            }
            onFileContent(filepath, content);
          });
          // callback, do something with the file
        } else {
          readFiles(filepath, (filepath, name, ext, stat) => {});
        }
      });
    });
  });
}

readFiles("../../../pulse/data/", (filepath, name, ext, stat) => {});

onFileContent = async (filename, content) => {
  if (validateJSON(content) && filename.includes(".json")) {
    const data = await parseJSONFile(filename);
    console.log(data)

    const csv = await json2csvAsync(data);
    await writeCSV(filename, csv);
  console.log(`Successfully converted ${filename}!`);
  }
};

convertFromJsonToExcel = (fileName, data) => {
  if (fileName) {
    csvjson_object.toCSV(fileContent);
  }
};

function arrayToCSV(data) {
  csv = data?.map((row) => Object.values(row));
  csv.unshift(Object.keys(data[0]));
  return csv.join("\n");
}

async function writeCSV(fileName, data) {
  try {
    await writeFile(fileName.replace('.json', '') + '.csv', data, "utf8");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function parseJSONFile (fileName) {
    try {
      const file = await readFile(fileName);
      
      return JSON.parse(file);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  const validateJSON = data => {
    try { JSON.parse(data); }
    catch { return false; }
    return true;
  }
