
import { useState, useEffect } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    preferences: '',
    cv: ''
  });

  const userId = '660000000000000000000000'; // replace with real user ID

  useEffect(() => {
    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => setProfile(data || {}));
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/api/profile/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    }).then(() => alert('Profile updated.'));
  };

  const handleUpload = e => {
    const formData = new FormData();
    formData.append('cv', e.target.files[0]);

    fetch(`http://localhost:5000/api/profile/${userId}/upload`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => setProfile(prev => ({ ...prev, cv: data.cv })));
  };

  return (
    <div className="profile-page">
      <h2>Profile Settings</h2>
      <input type="text" name="name" placeholder="Full Name" value={profile.name} onChange={handleChange} />
      <textarea name="bio" placeholder="Bio" value={profile.bio} onChange={handleChange}></textarea>
      <input type="text" name="preferences" placeholder="Job Preferences" value={profile.preferences} onChange={handleChange} />
      <div className="upload-section">
        <label>Upload CV:</label>
        <input type="file" onChange={handleUpload} />
        {profile.cv && <a href={`http://localhost:5000/uploads/${profile.cv}`} target="_blank" rel="noreferrer">View Uploaded CV</a>}
      </div>
      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
}

export default ProfilePage;
