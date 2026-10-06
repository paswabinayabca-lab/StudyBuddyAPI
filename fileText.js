const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const extractTextFromFile = async (filePath) => {
    const extension = path.extname(filePath).toLowerCase();

    // TXT
    if (extension === ".txt") {
        return fs.readFileSync(filePath, "utf8");
    }

    // PDF
    if (extension === ".pdf") {
        const buffer = fs.readFileSync(filePath);

        const parser = new PDFParse({
            data: buffer
        });

        const result = await parser.getText();

        await parser.destroy();

        return result.text;
    }

    // DOCX
    if (extension === ".docx") {
        const result = await mammoth.extractRawText({
            path: filePath
        });

        return result.value;
    }

    throw new Error(
        "Only PDF, DOCX and TXT files are currently supported for AI processing."
    );
};

module.exports = extractTextFromFile;