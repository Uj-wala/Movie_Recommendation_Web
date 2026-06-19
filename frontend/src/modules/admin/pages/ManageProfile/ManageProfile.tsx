import React, { useState } from 'react';
import './ManageProfile.css';
import { ChevronDown, Phone, EyeOff, Eye, Upload } from 'lucide-react';

interface ManageProfileProps {
  setActiveTab?: (tab: string) => void;
  userEmail?: string;
  profileImage?: string | null;
  setProfileImage?: (image: string | null) => void;
}

const ManageProfile: React.FC<ManageProfileProps> = ({ profileImage, setProfileImage }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{name?: string, phone?: string}>({});

  const handleSave = () => {
    const newErrors: {name?: string, phone?: string} = {};
    if (fullName && !/^[a-zA-Z\s]*$/.test(fullName)) {
      newErrors.name = 'Full name can only contain letters and spaces.';
    }
    if (phone && !/^[+\-\d\s()]*$/.test(phone)) {
      newErrors.phone = 'Phone number can only contain numbers and basic symbols (+ -).';
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Profile details saved successfully!");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setProfileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="manage-profile-page">
      <div className="profile-header">
        <h2 className="profile-title">Manage Profile Details</h2>
        <span className="profile-subtitle">Manage your Account Details</span>
      </div>

      <div className="profile-upload-section">
        <label className="upload-box" style={{ position: 'relative', overflow: 'hidden' }}>
          {profileImage ? (
            <img src={profileImage} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <Upload size={24} color="#8B8B8B" />
              <span>Upload your<br/>photo</span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>
        <div className="upload-text-info">
          <h3>Profile Photo</h3>
          <p>Upload a new photo or change hour existing one</p>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Admin Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Enter your full name"
              className={`profile-input placeholder:font-['Poppins'] placeholder:text-[14px] placeholder:font-normal placeholder:text-[#8C94A3] placeholder:opacity-100 placeholder:tracking-normal ${errors.name ? 'input-error' : ''}`} 
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-with-icon">
              <Phone size={16} color="#8B8B8B" className="input-icon-left" />
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter your phone number"
                className={`profile-input icon-padded-left placeholder:font-['Poppins'] placeholder:text-[14px] placeholder:font-normal placeholder:text-[#8C94A3] placeholder:opacity-100 placeholder:tracking-normal ${errors.phone ? 'input-error' : ''}`} 
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
            <div className="input-links">
              <span className="link-text">Add New Phone Number</span>
              <span className="link-text">Update Phone Number</span>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password"
                className="profile-input icon-padded-right placeholder:font-['Poppins'] placeholder:text-[14px] placeholder:font-normal placeholder:text-[#8C94A3] placeholder:opacity-100 placeholder:tracking-normal" 
              />
              <div className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={16} color="#8B8B8B" /> : <EyeOff size={16} color="#8B8B8B" />}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm your password"
                className="profile-input icon-padded-right placeholder:font-['Poppins'] placeholder:text-[14px] placeholder:font-normal placeholder:text-[#8C94A3] placeholder:opacity-100 placeholder:tracking-normal" 
              />
              <div className="input-icon-right" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <Eye size={16} color="#8B8B8B" /> : <EyeOff size={16} color="#8B8B8B" />}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
              className="profile-input placeholder:font-['Poppins'] placeholder:text-[14px] placeholder:font-normal placeholder:text-[#8C94A3] placeholder:opacity-100 placeholder:tracking-normal" 
            />
            <div className="input-links">
              <span className="link-text">Add New Email Address</span>
              <span className="link-text">Update Email Address</span>
            </div>
          </div>
          <div className="form-group">
            <label>Relationship</label>
            <div className="select-wrapper">
              <select className="custom-select">
                <option>Choose Relation Type</option>
              </select>
              <ChevronDown size={16} color="#0F172A" className="select-icon" />
            </div>
          </div>
        </div>
      </div>



      <div className="profile-actions">
        <button className="cancel-btn">Cancel</button>
        <button className="save-btn" onClick={handleSave}>Save Permissions</button>
      </div>
    </div>
  );
};

export default ManageProfile;
