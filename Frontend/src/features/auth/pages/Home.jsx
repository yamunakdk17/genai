// import React from 'react'
// import "../../interview/style/home.scss"; 
// const Home = () => {
//     return (
//         <main className='home'>
//             <div className="interview-input-group">
//                 <div className="left">
//                     <textarea
//                         name="jobDescription"
//                         id="jobDescription"
//                         placeholder="Enter job description here..."
//                     ></textarea>
//                 </div>

//                 <div className="right">
//                     <div className="input-group">
//                         <p>Resume<small className='highlight'></small> (Use Resume and self description together for best result.)</p>
//                         <label className='file-label'htmlFor="resume">Upload Resume</label>
//                         <input hidden type="file" name="resume" id="resume" accept=".pdf" />
//                     </div>

//                     <div className="input-group">
//                         <label htmlFor="selfDescription">Self Description</label>
//                         <textarea
//                             name="selfDescription"
//                             id="selfDescription"
//                             placeholder="Describe yourself in a few sentences..."
//                         ></textarea>
//                     </div>

//                     <button className='generate-btn'>Generate Interview Report</button>
//                 </div>
//             </div>
//         </main>
//     )
// }

// export default Home
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../../interview/hooks/useInterview";
import "../../interview/style/home.scss";
const Home = () => {

    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");

    const { generateReport,reports } = useInterview();
    const navigate = useNavigate();

    const handleGenerate = async () => {
        console.log("Generate button clicked");

        if (!jobDescription) {
            alert("Please enter Job Description");
            return;
        }

        if (!resume && !selfDescription) {
            alert("Upload Resume or write Self Description");
            return;
        }

        try {
            const report = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile: resume
            });

            console.log("REPORT =", report);

            if (report?._id) {
                navigate(`/interview/${report._id}`);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <main className="home">

            <div className="home-container">

                <div className="hero">

                    <h1>
                        Create Your Custom <br />
                        <span>Interview Plan</span>
                    </h1>

                    <p>
                        Let our AI analyze the job requirements and your unique profile to
                        build a winning interview strategy.
                    </p>

                </div>

                <div className="interview-card">

                    {/* LEFT */}

                    <div className="left">

                        <label className="section-title">
                            Target Job Description
                            <span className="required"> REQUIRED</span>
                        </label>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                        ></textarea>

                    </div>

                    {/* RIGHT */}

                    <div className="right">

                        <div className="input-group">

                            <label className="section-title">
                                Your Profile
                                
                            </label>

                            <div className="upload-header">
                                <span className="upload-title">Upload Resume</span>
                                <span className="best">BEST RESULTS</span>
                            </div>

                            <label htmlFor="resume" className="upload-box">

                                <div className="upload-icon">
                                    📄
                                </div>

                                <h3>Click to upload</h3>

                                <p>or drag & drop</p>

                                <small>PDF or DOCX (MAX. 5MB)</small>

                                {resume && (
                                    <div className="filename">
                                        {resume.name}
                                    </div>
                                )}

                            </label>

                            <input
                                hidden
                                id="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    setResume(e.target.files[0]);
                                }}
                            />

                        </div>

                        <div className="divider">

                            <span>OR</span>

                        </div>

                        <div className="input-group">

                            <label className="section-title">
                                Quick Self Description
                            </label>

                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                placeholder="Briefly describe your experience, skills, projects and career goals..."
                            ></textarea>

                        </div>

                        <div className="info-box">

                            💡 Either a <b>Resume</b> or a <b>Self Description</b> is
                            required to generate your personalized interview report.

                        </div>

                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                        >
                            🚀 Generate My Interview Strategy

                        </button>

                    </div>

                </div>

                {/* {Recent Reports List} */}
                {reports.length > 0 && (
                    <section className='recent-reports'>
                        <h2>My Recent Interview Plans</h2>
                        <ul className='reports-list'>
                            {reports.map(report => (
                                <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}


                <div className="footer">

                    <a href="/">Privacy Policy</a>

                    <a href="/">Terms of Service</a>

                    <a href="/">Help Center</a>

                </div>

            </div>

        </main>
    );
};

export default Home;