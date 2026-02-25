const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend', 'src');

function replaceInFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content
                .replace(/bg-red-/g, 'bg-brand-')
                .replace(/text-red-/g, 'text-brand-')
                .replace(/border-red-/g, 'border-brand-')
                .replace(/ring-red-/g, 'ring-brand-')
                .replace(/from-red-/g, 'from-brand-')
                .replace(/to-red-/g, 'to-brand-')
                .replace(/shadow-red-/g, 'shadow-brand-')
                .replace(/hover:bg-red-/g, 'hover:bg-brand-')
                .replace(/hover:text-red-/g, 'hover:text-brand-')
                .replace(/hover:border-red-/g, 'hover:border-brand-')
                .replace(/ZomatoClone/g, 'FlavorDash')
                .replace(/bg-green-/g, 'bg-accent-') // To match the accent theme slightly
                .replace(/text-green-/g, 'text-accent-');

            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

replaceInFiles(directoryPath);
// Also update index.html title
const htmlPath = path.join(__dirname, 'frontend', 'index.html');
if (fs.existsSync(htmlPath)) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    let updatedHtml = htmlContent.replace(/Zomato\s*Clone/ig, 'FlavorDash');
    fs.writeFileSync(htmlPath, updatedHtml, 'utf8');
    console.log('Updated index.html');
}
console.log('Done.');
