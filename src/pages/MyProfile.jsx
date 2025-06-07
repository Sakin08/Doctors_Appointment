import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [image, setImage] = useState(null);

  const updateUserData = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return userData && (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl rounded-2xl mt-12 space-y-8">
      <div className="flex justify-center">
        {isEdit ? (
          <label htmlFor="image" className="cursor-pointer relative">
            <img
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {!image && (
              <img
                src={assets.upload_icon}
                alt="Upload Icon"
                className="absolute bottom-0 right-0 w-8 h-8"
              />
            )}
            <input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
          </label>
        ) : (
          <img
            className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
            src={userData.image}
            alt="User"
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex-1 text-center md:text-left">
          {isEdit ? (
            <input
              type="text"
              name="name"
              className="w-full text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-200"
              value={userData.name}
              onChange={handleChange}
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
          )}
          <p className="text-lg text-gray-600 mt-1">{userData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8 border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              {isEdit ? (
                <input
                  type="text"
                  name="phone"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={userData.phone}
                  onChange={handleChange}
                />
              ) : (
                <p className="font-medium text-gray-800">{userData.phone}</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Address</p>
              {isEdit ? (
                <div className="space-y-2 mt-1">
                  <input
                    type="text"
                    name="address.line1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={userData.address.line1}
                    onChange={handleChange}
                    placeholder="Address Line 1"
                  />
                  <input
                    type="text"
                    name="address.line2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={userData.address.line2}
                    onChange={handleChange}
                    placeholder="Address Line 2"
                  />
                </div>
              ) : (
                <p className="font-medium text-gray-800">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              {isEdit ? (
                <select
                  name="gender"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  value={userData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="font-medium text-gray-800">{userData.gender}</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Birthday</p>
              {isEdit ? (
                <input
                  type="date"
                  name="dob"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={userData.dob}
                  onChange={handleChange}
                />
              ) : (
                <p className="font-medium text-gray-800">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-6">
        {isEdit ? (
          <button
            onClick={updateUserData}
            disabled={loading}
            className={`px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Information'}
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
