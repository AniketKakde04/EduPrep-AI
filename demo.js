// Generating my CV with docx
const docx = require("docx");
const express = require("express");
const app = express(exports);

const PHONE_NUMBER = "07534563401";
const PROFILE_URL = "https://www.linkedin.com/in/dolan1";
const EMAIL = "docx@com";

const { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun } = docx;

const experiences = [
    {
        isCurrent: true,
        summary: "Full-stack developer working with Angular and Java. Working for the iShares platform",
        title: "Associate Software Developer",
        startDate: {
            month: 11,
            year: 2017,
        },
        company: {
            name: "BlackRock",
        },
    },
    {
        isCurrent: false,
        summary:
            "Full-stack developer working with Angular, Node and TypeScript. Working for the iShares platform. Emphasis on Dev-ops and developing the continous integration pipeline.",
        title: "Software Developer",
        endDate: {
            month: 11,
            year: 2017,
        },
        startDate: {
            month: 10,
            year: 2016,
        },
        company: {
            name: "Torch Markets",
        },
    },
    {
        isCurrent: false,
        summary:
            "Used ASP.NET MVC 5 to produce a diversity data collection tool for the future of British television.\n\nUsed AngularJS and C# best practices. Technologies used include JavaScript, ASP.NET MVC 5, SQL, Oracle, SASS, Bootstrap, Grunt.",
        title: "Software Developer",
        endDate: {
            month: 10,
            year: 2016,
        },
        startDate: {
            month: 3,
            year: 2015,
        },
        company: {
            name: "Soundmouse",
        },
    },
    {
        isCurrent: false,
        summary:
            "Develop web commerce platforms for constious high profile clients.\n\nCreated a log analysis web application with the Play Framework in Java, incorporating Test Driven Development. It asynchronously uploads and processes large (2 GB) log files, and outputs meaningful results in context with the problem. \n\nAnalysis  and  development  of  the payment system infrastructure and user accounts section to be used by several clients of the company such as Waitrose, Tally Weijl, DJ Sports, Debenhams, Ann Summers, John Lewis and others.\n\nTechnologies used include WebSphere Commerce, Java, JavaScript and JSP.",
        title: "Java Developer",
        endDate: {
            month: 10,
            year: 2014,
        },
        startDate: {
            month: 3,
            year: 2013,
        },
        company: {
            name: "Soundmouse",
        },
    },
];

const education = [
    {
        degree: "Master of Science (MSc)",
        fieldOfStudy: "Computer Science",
        notes:
            "Exam Results: 1st Class with Distinction, Dissertation: 1st Class with Distinction\n\nRelevant Courses: Java and C# Programming, Software Engineering, Artificial Intelligence, \nComputational Photography, Algorithmics, Architecture and Hardware.\n\nCreated a Windows 8 game in JavaScript for the dissertation. \n\nCreated an award-winning 3D stereoscopic game in C# using XNA.",
        schoolName: "University College London",
        startDate: {
            year: 2012,
        },
        endDate: {
            year: 2013,
        },
    },
    {
        degree: "Bachelor of Engineering (BEng)",
        fieldOfStudy: "Material Science and Engineering",
        notes:
            "Exam Results: 2:1, Dissertation: 1st Class with Distinction\n\nRelevant courses: C Programming, Mathematics and Business for Engineers.",
        schoolName: "Imperial College London",
        startDate: {
            year: 2009,
        },
        endDate: {
            year: 2012,
        },
    },
];

const skills = [
    {
        name: "Angular",
    },
    {
        name: "TypeScript",
    },
    {
        name: "JavaScript",
    },
    {
        name: "NodeJS",
    },
];

const achievements = [
    {
        issuer: "Oracle",
        name: "Oracle Certified Expert",
    },
];

class DocumentCreator {
    create([experiences, educations, skills, achivements]) {
        const document = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        text: "Dolan Miu",
                        heading: HeadingLevel.TITLE,
                    }),
                    this.createContactInfo(PHONE_NUMBER, PROFILE_URL, EMAIL),
                    this.createHeading("Education"),
                    ...educations
                        .map((education) => {
                            const arr = [];
                            arr.push(
                                this.createInstitutionHeader(education.schoolName, `${education.startDate.year} - ${education.endDate.year}`),
                            );
                            arr.push(this.createRoleText(`${education.fieldOfStudy} - ${education.degree}`));

                            const bulletPoints = this.splitParagraphIntoBullets(education.notes);
                            bulletPoints.forEach((bulletPoint) => {
                                arr.push(this.createBullet(bulletPoint));
                            });

                            return arr;
                        })
                        .reduce((prev, curr) => prev.concat(curr), []),
                    this.createHeading("Experience"),
                    ...experiences
                        .map((position) => {
                            const arr = [];

                            arr.push(
                                this.createInstitutionHeader(
                                    position.company.name,
                                    this.createPositionDateText(position.startDate, position.endDate, position.isCurrent),
                                ),
                            );
                            arr.push(this.createRoleText(position.title));

                            const bulletPoints = this.splitParagraphIntoBullets(position.summary);

                            bulletPoints.forEach((bulletPoint) => {
                                arr.push(this.createBullet(bulletPoint));
                            });

                            return arr;
                        })
                        .reduce((prev, curr) => prev.concat(curr), []),
                    this.createHeading("Skills, Achievements and Interests"),
                    this.createSubHeading("Skills"),
                    this.createSkillList(skills),
                    this.createSubHeading("Achievements"),
                    ...this.createAchivementsList(achivements),
                    this.createSubHeading("Interests"),
                    this.createInterests("Programming, Technology, Music Production, Web Design, 3D Modelling, Dancing."),
                    this.createHeading("References"),
                    new Paragraph(
                        "Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk",
                    ),
                    new Paragraph("More references upon request"),
                    new Paragraph({
                        text: "This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.",
                        alignment: AlignmentType.CENTER,
                    }),
                ],
            }],
        });

        return document;
    }

    createContactInfo(phoneNumber, profileUrl, email) {
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun(`Mobile: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`),
                new TextRun({
                    text: "Address: 58 Elm Avenue, Kent ME4 6ER, UK",
                    break: 1,
                }),
            ],
        });
    }

    createHeading(text) {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
        });
    }

    createSubHeading(text) {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_2,
        });
    }

    createInstitutionHeader(institutionName, dateText) {
        return new Paragraph({
            tabStops: [
                {
                    type: TabStopType.RIGHT,
                    position: TabStopPosition.MAX,
                },
            ],
            children: [
                new TextRun({
                    text: institutionName,
                    bold: true,
                }),
                new TextRun({
                    text: `\t${dateText}`,
                    bold: true,
                }),
            ],
        });
    }

    createRoleText(roleText) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: roleText,
                    italics: true,
                }),
            ],
        });
    }

    createBullet(text) {
        return new Paragraph({
            text: text,
            bullet: {
                level: 0,
            },
        });
    }

    // tslint:disable-next-line:no-any
    createSkillList(skills) {
        return new Paragraph({
            children: [new TextRun(skills.map((skill) => skill.name).join(", ") + ".")],
        });
    }

    // tslint:disable-next-line:no-any
    createAchivementsList(achivements) {
        return achivements.map(
            (achievement) =>
                new Paragraph({
                    text: achievement.name,
                    bullet: {
                        level: 0,
                    },
                }),
        );
    }

    createInterests(interests) {
        return new Paragraph({
            children: [new TextRun(interests)],
        });
    }

    splitParagraphIntoBullets(text) {
        return text.split("\n\n");
    }

    // tslint:disable-next-line:no-any
    createPositionDateText(startDate, endDate, isCurrent) {
        const startDateText = this.getMonthFromInt(startDate.month) + ". " + startDate.year;
        const endDateText = isCurrent ? "Present" : `${this.getMonthFromInt(endDate.month)}. ${endDate.year}`;

        return `${startDateText} - ${endDateText}`;
    }

    getMonthFromInt(value) {
        switch (value) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sept";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";
            default:
                return "N/A";
        }
    }
}

app.get("/", async (req, res) => {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([experiences, education, skills, achievements]);

    const b64string = await Packer.toBase64String(doc);
    
    res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
    res.send(Buffer.from(b64string, 'base64'));
});