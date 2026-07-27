import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        return {
          email: user.email || "",
          firstName: user.firstName || "",
          middleName: user.middleName || "",
          lastName: user.lastName || "",
          favoriteGenre: user.favoriteGenre || "",
          bio: user.bio || "",
        };
      } catch (error) {
        console.error("Could not load profile:", error);
      }
    }

    return {
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      favoriteGenre: "",
      bio: "",
    };
  });

  const [originalEmail, setOriginalEmail] = useState(
    profile.email
  );

  const [isEditing, setIsEditing] = useState(false);
  const [readingProgress, setReadingProgress] = useState([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    const fetchReadingProgress = async () => {
      try {
        setIsLoadingProgress(true);
        setProgressError("");

        const response = await fetch("/api/progress");

        if (!response.ok) {
          throw new Error("Could not load readin progress.");

        }
        const data = await response.json()
        
        const progressList = Array.isArray(data)
        ? data: data.progress || [];

      setReadingProgress(progressList);
      } catch (error) {
        console.error("Progress error:", error);
        setProgressError("Unable to load your saved stories.");
    } finally {
      setIsLoadingProgress(false);
    }
  };
  fetchReadingProgress();
  
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() ===
        originalEmail.toLowerCase()
    );

    if (!existingUser) {
      alert("The user account could not be found.");
      return;
    }

    const updatedProfile = {
      ...existingUser,
      email: profile.email.trim(),
      firstName: profile.firstName.trim(),
      middleName: profile.middleName.trim(),
      lastName: profile.lastName.trim(),
      favoriteGenre: profile.favoriteGenre,
      bio: profile.bio.trim(),
      password: existingUser.password,
    };

    const emailTaken = users.some(
      (user) =>
        user.email.toLowerCase() ===
          updatedProfile.email.toLowerCase() &&
        user.email.toLowerCase() !==
          originalEmail.toLowerCase()
    );

    if (emailTaken) {
      alert("That email is already being used.");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.email.toLowerCase() ===
      originalEmail.toLowerCase()
        ? updatedProfile
        : user
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedProfile)
    );

    setProfile({
      email: updatedProfile.email,
      firstName: updatedProfile.firstName,
      middleName: updatedProfile.middleName,
      lastName: updatedProfile.lastName,
      favoriteGenre: updatedProfile.favoriteGenre,
      bio: updatedProfile.bio,
    });

    setOriginalEmail(updatedProfile.email);
    setIsEditing(false);
  };

  const fullName =
  `${profile.firstName} ${profile.lastName}`.trim() ||
  "Reader";

  return (
    <main className="profile-page">
      <nav className="profile-nav">
        <Link
          to="/"
          className="nav-btn home-btn"
          aria-label="Back to home"
        >
          ← Back to Home
        </Link>

        <Link to="/library" className="library-btn">
          Library
        </Link>

        <Link
          to="/profile"
          className="nav-btn"
          aria-label="Open profile"
        >
          👤
        </Link>
      </nav>

      <section className="profile-card">
        <div className="profile-avatar">
          {profile.firstName.charAt(0).toUpperCase()}
          {profile.lastName.charAt(0).toUpperCase()}
        </div>

        <h1>My Profile</h1>

        {!isEditing ? (
          <div className="profile-information">
            <div className="profile-field">
              <span>Name</span>
              <p>{fullName}</p>
              </div>
              
              <div className="profile-field">
              <span>Email</span>
              <p>{profile.email || "Not provided"}</p>
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
              <p>
                {profile.favoriteGenre || "Not selected"}
              </p>
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
          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >
            <label>
              Email
              <input
                type="text"
                name="email"
                value={profile.email}
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
                <option value="Adventure">Adventure</option>
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

              <button
                type="submit"
                className="save-button"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </section>
      
      <section className="continue-section">
        <h2>Continue Reading</h2>

        {isLoadingProgress &&  (
          <p className="progress-message">
            Loading your saved stories...
          </p>
        )}

        {!isLoadingProgress && progressError && (
          <p className="progress-error">
            {progressError}

          </p>
        )}

        {!isLoadingProgress &&
        !progressError &&
        readingProgress.length === 0 && (
          <div className="empty-progress-card">
            <h3>No saved stories yet</h3>

            <p>
              Start reading a story and your progress will
              appear here.
            </p>
            <Link
              to="/library"
              className="browse-stories-button"
              >
                Browse Stories
              </Link>
          </div>
        )}

      {!isLoadingProgress && 
      !progressError &&
      readingProgress.length > 0 && (
        <div className="progress-grid">
          {readingProgress.map((item) => {
            const storyId =
            item.storyId || item.story_id;

            const storyTitle =
            item.storyTitle ||
            item.story_title ||
            item.title ||
            "Untitled Story";

          const currentPassage =
                  item.currentPassage ||
                  item.current_passage ||
                  item.passageId ||
                  item.passage_id;
          return (
            <article
            className="progress-card"
            key={
              item.id ||
              `${storyId}-${currentPassage}`
            }
            >
              <h3>{storyTitle}</h3>

              {item.genre && (
                <p className="story-genre">
                  {item.genre}
                </p>
              )}
              <Link
              to={`/stories/${storyId}`}
              state={{ passageId: currentPassage}}
              className="continue-button"
              >
                Continue Reading
              </Link>
            </article>
          )
          })}
        </div>
      )}
      </section>

    </main>
  );
}

export default Profile;