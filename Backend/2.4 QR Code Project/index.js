/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

// Importing the required packages

import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer.prompt([
    {
        type: "input",
        name: "url",
        message: "Enter the URL you want to convert to a QR code:"
    }
]).then(answers => {
    const qrCode = qr.image(answers.url, { type: 'png' });
    qrCode.pipe(fs.createWriteStream('qrcode.png'));
    fs.writeFileSync('url.txt', answers.url);
    console.log("QR code generated and URL saved to url.txt");
}   ).catch(error => {
    console.error("An error occurred:", error);
});