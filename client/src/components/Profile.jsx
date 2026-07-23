import { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    favoriteGenre: "",
    bio: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Profile:", profile);
    setIsEditing(false);
  };

  return (
    <main className="profile-page">
      <nav className="profile-nav">
        <Link to="/" className="nav-btn" aria-label="Back to home">
          ← Back to Home
        </Link>

        <Link to="/library" className="library-btn">
          Library
        </Link>

        <Link to="/profile" className="nav-btn" aria-label="Open profile">
          👤
        </Link>
      </nav>

      <section className="profile-card">
        <div className="profile-avatar">
          {profile.firstName.charAt(0)}
          {profile.lastName.charAt(0)}
        </div>

        <h1>My Profile</h1>

        {!isEditing ? (
          <div className="profile-information">
            <div className="profile-field">
              <span>Username</span>
              <p>{profile.username || "Not provided"}</p>
            </div>

            <div className="profile-name-grid">
              <div className="profile-field">
                <span>First name</span>
                <p>{profile.firstName || "Not provided"}</p>
              </div>

              <div className="profile-field">
                <span>Last name</span>
                <p>{profile.lastName || "Not provided"}</p>
              </div>
            </div>

            <div className="profile-field">
              <span>Favorite genre</span>
              <p>{profile.favoriteGenre || "Not selected"}</p>
            </div>

            <div className="profile-field">
              <span>Bio</span>
              <p>{profile.bio || "No bio added yet."}</p>
            </div>

            <button
              type="button"
              className="edit-profile-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                required
              />
            </label>

            <div className="profile-name-grid">
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Last name
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Favorite genre
              <select
                name="favoriteGenre"
                value={profile.favoriteGenre}
                onChange={handleChange}
                required
              >
                <option value="">Select a genre</option>
                <option value="Comedy">Comedy</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Western">Western</option>
              </select>
            </label>

            <label>
              Bio
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell readers about yourself"
              />
            </label>

            <div className="profile-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default Profile;