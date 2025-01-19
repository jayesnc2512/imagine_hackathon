import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/LegalDocs.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function LegalDocs() {
  const [reportData, setReportData] = useState(null);

  const handlePdfUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        parsePdfContent(text);
      };
      reader.readAsText(file);
    }
  };

  const parsePdfContent = (text) => {
    // Simulated parsing logic (replace with actual PDF parsing)
    const data = {
      patientName: "John Doe",
      dateOfBirth: "MM/DD/YYYY",
      dateOfExamination: "MM/DD/YYYY",
      physician: "Dr. Jane Smith, MD",
      specialty: "General Medicine",
      symptoms: "Persistent cough, wheezing, shortness of breath, fatigue",
      diagnosis: "Acute bronchitis superimposed on chronic asthma",
      treatmentPlan: [
        "Antibiotics",
        "Corticosteroid inhaler",
        "Bronchodilators",
        "Rest",
      ],
      workLeave: "Recommended for [Number of Weeks] weeks",
    };
    setReportData(data);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
            <Navbar />

    <div className="legal-section-title">
      <h1 className="legal-siteTitle">
        <Link to="/">
          Health <span className="legal-siteSign">+</span>
        </Link>
      </h1>

      <div className="legal-text-content">
        <p className="legal-title">General Info</p>
        <p className="legal-description">
          Welcome to Health Plus, your trusted online healthcare platform. Our
          mission is to provide accessible and personalized healthcare services
          to individuals seeking expert medical advice and treatment.
        </p>

        <div className="upload-section">
          <label htmlFor="pdf-upload" className="upload-button">
            Upload Report PDF
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            style={{ display: "none" }}
          />
        </div>

        {reportData && (
          <div className="report-table">
            <h2>Report Details</h2>
            <table>
              <tbody>
                <tr>
                  <th>Patient Name</th>
                  <td>{reportData.patientName}</td>
                </tr>
                <tr>
                  <th>Date of Birth</th>
                  <td>{reportData.dateOfBirth}</td>
                </tr>
                <tr>
                  <th>Date of Examination</th>
                  <td>{reportData.dateOfExamination}</td>
                </tr>
                <tr>
                  <th>Physician</th>
                  <td>{reportData.physician}</td>
                </tr>
                <tr>
                  <th>Specialty</th>
                  <td>{reportData.specialty}</td>
                </tr>
                <tr>
                  <th>Symptoms</th>
                  <td>{reportData.symptoms}</td>
                </tr>
                <tr>
                  <th>Diagnosis</th>
                  <td>{reportData.diagnosis}</td>
                </tr>
                <tr>
                  <th>Treatment Plan</th>
                  <td>
                    <ul>
                      {reportData.treatmentPlan.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>Work Leave</th>
                  <td>{reportData.workLeave}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
    <Footer />

    </div>
            
  );
}

export default LegalDocs;
