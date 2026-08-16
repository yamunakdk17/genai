const { PDFParse } = require("pdf-parse");
const {generateInterviewReport, generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        const parser = new PDFParse({
            data: req.file.buffer
        });

        const resumeContent = await parser.getText();

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });
        console.log("AI Report:", interViewReportByAi);
        console.log("Job Title:", jobDescription.split("\n")[0]);


        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            title: jobDescription.split("\n")[0],

        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            interviewReports
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


async function getInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        return res.status(200).json({
            interviewReport
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const pdfBuffer = await generateResumePdf({
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription,
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="resume.pdf"',
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message,
        });
    }
}
module.exports = {
    generateInterViewReportController,
    getAllInterviewReportsController,
    getInterviewReportController,
    generateResumePdfController
};