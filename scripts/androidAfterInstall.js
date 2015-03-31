#!/usr/bin/env node

// this plugin replaces arbitrary text in arbitrary files
//
// Look for the string CONFIGURE HERE for areas that need configuration
//

var fs = require('fs');
var path = require('path');

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(to_replace, "g"), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

var target = "stage";
if (process.env.TARGET) {
    target = process.env.TARGET;
}


var projectconfig = fs.readFileSync("./config.xml", 'utf8'),
    idfound = projectconfig.match(/id=[\"']([^\"']+)[\"']/);

if (idfound.length < 2) {
    console.log("Did not find App ID in config.xml");
    return;
}
var filestoreplace = [
    "platforms/android/src/com/plugin/gcm/PushSettingsActivity.java",
];
filestoreplace.forEach(function (val, index, array) {
    if (fs.existsSync(val)) {
        // CONFIGURE HERE
        // with the names of the token values. For example,
        // below we are looking for the token
        // /*REP*/ 'api.example.com' /*REP*/ and will replace
        // that token
        replace_string_in_file(val,
            "CORDOVA_PACKAGE_ID",
            idfound[1]);
        // ... any other configuration options
        console.log("Replaced");
    } else {
        console.log("missing: " + val);
    }
});
