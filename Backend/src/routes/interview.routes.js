// const express = require("express");
// const authMiddleware = require("../middlewares/auth.middleware");
// const interviewController=require("../controllers/interview.controller")
// const upload = require ("../middlewares/file.middleware")

// const interviewRouter = express.Router();

// /*
//  * @route POST /api/interview/
//  * @description Generate a new interview report based on the user's self description, resume PDF, and job description.
//  * @access Private
//  */
// interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"),interviewController.generateInterViewReportController);
// interviewRouter.get(
//     "/",
//     authMiddleware.authUser,
//     interviewController.getAllInterviewReportsController
// );

// module.exports = interviewRouter;


const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterViewReportController
);

interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportController
);
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    interviewController.generateResumePdfController
);

module.exports = interviewRouter;