import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import 'dotenv/config'
// import GoogleStrategy from "passport-google-oauth2";



const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index", { ans: null });
});

app.post("/", async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { question, standard, board, subject,marks } = req.body;

    const prompt = `Generate a question paper of ${subject} for class ${standard} ${board} ${marks} marks`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const document = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        text: `Question Paper for ${subject} - Class ${standard} (${board})`,
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `${marks}`,
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                    }),
                    ...text.split('\n').map(line => new Paragraph({
                        text: line,
                        spacing: {
                            after: 200,
                        },
                    }))
                ],
            },
        ],
    });

    const b64string = await Packer.toBase64String(document);
    res.setHeader('Content-Disposition', 'attachment; filename=Question_Paper.docx');
    res.send(Buffer.from(b64string, 'base64'));
});

app.listen(PORT, () => {
    console.log("Server started at port 3000");
});
