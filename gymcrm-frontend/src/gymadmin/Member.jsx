import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', phone: '', plan: '' });

  const fetchMembers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users?role=member');
      const data = await res.json();
      setMembers(data.reverse());
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    if (newMember.phone.length !== 10) {
      alert('Phone number must be 10 digits');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/members/add-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      const data = await res.json();

      if (res.ok) {
        setMembers([data.member, ...members]);
        setNewMember({ name: '', phone: '', plan: '' });
        setShowForm(false);
      } else {
        alert(data.error || 'Failed to add member');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto font-sans">

      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Member Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <AiOutlinePlus />
          {showForm ? 'Close' : 'Add Member'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Add New Member</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 px-3 py-2 rounded w-full"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="border border-gray-300 px-3 py-2 rounded w-full"
              value={newMember.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setNewMember({ ...newMember, phone: value });
                }
              }}
            />
            <select
              className="border border-gray-300 px-3 py-2 rounded w-full"
              value={newMember.plan}
              onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
            >
              <option value="">Select Plan</option>
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
              <option value="6 months">6 Months</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setNewMember({ name: '', phone: '', plan: '' });
                setShowForm(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Search Field */}
      <input
        type="text"
        className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
        placeholder="Search by name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members
          .filter((m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.phone.includes(searchTerm)
          )
          .map((member) => (
            <div
              key={member._id}
              className="bg-white border border-gray-200 p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <div className="font-semibold text-lg text-blue-700">{member.name}</div>
              <div className="text-gray-700 text-sm"> {member.phone}</div>
              <div className="text-gray-500 text-sm mt-1"> Plan: {member.plan}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Members;
