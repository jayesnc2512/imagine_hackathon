import React, { useState } from "react";
import "../Styles/Profile.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    photo:
    "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg",
    bloodGroup: "A+",
    diabetes: "No",
    gender: "Male",
    allergies: ["Pollen", "Dust"],
    additionalInfo: "No additional health concerns.",
  });
  const [allergy, setAllergy] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAllergy = () => {
    if (allergy.trim()) {
      setProfileData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergy.trim()],
      }));
      setAllergy("");
    }
  };

  const handleRemoveAllergy = (index) => {
    setProfileData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div>
      {/* Profile Header */}
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={profileData.photo}
            alt="Profile"
            className="profile-photo"
          />
          <h2>{profileData.name}</h2>
          <button
            className="edit-button"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Profile Details */}
        {!isEditing ? (
          <div className="profile-details">
            <p>
              <strong>Blood Group:</strong> {profileData.bloodGroup}
            </p>
            <p>
              <strong>Diabetes:</strong> {profileData.diabetes}
            </p>
            <p>
              <strong>Gender:</strong> {profileData.gender}
            </p>
            <p>
              <strong>Allergies:</strong> {profileData.allergies.join(", ")}
            </p>
            <p>
              <strong>Additional Info:</strong> {profileData.additionalInfo}
            </p>
          </div>
        ) : (
          // Profile Edit Form
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group:</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="diabetes">Do you have diabetes?</label>
              <select
                id="diabetes"
                name="diabetes"
                value={profileData.diabetes}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={profileData.gender === "Male"}
                    onChange={handleInputChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={profileData.gender === "Female"}
                    onChange={handleInputChange}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={profileData.gender === "Other"}
                    onChange={handleInputChange}
                  />
                  Other
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="allergies">Allergies:</label>
              <div className="allergy-input">
                <input
                  type="text"
                  id="allergy"
                  value={allergy}
                  placeholder="Enter an allergy"
                  onChange={(e) => setAllergy(e.target.value)}
                />
                <button type="button" onClick={handleAddAllergy}>
                  Add Allergy
                </button>
              </div>
              <ul className="allergy-list">
                {profileData.allergies.map((item, index) => (
                  <li key={index}>
                    {item}{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Information:</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows="4"
                value={profileData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Enter any additional health information"
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              Save Profile
            </button>
          </form>
        )}
      </div>
      
    </div>
  );
}

export default Profile;
