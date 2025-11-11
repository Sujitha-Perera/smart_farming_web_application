// components/admin/AdminContact.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [responseData, setResponseData] = useState({
    message: '',
    adminName: ''
  });
  const [filter, setFilter] = useState('all');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      setError(null);
      const response = await axios.get('http://localhost:3001/api/admin/contacts', {
        params: { status: filter }
      });
      
      // Safely handle the response data
      if (response.data && response.data.success) {
        setContacts(response.data.data || []);
      } else {
        setContacts([]);
        setError('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contact messages');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/contacts/stats');
      if (response.data && response.data.success) {
        setStats(response.data.data || {});
      } else {
        setStats({});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({});
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:3001/api/admin/contacts/${id}/status`, { status });
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const sendResponse = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    
    try {
      await axios.post(`http://localhost:3001/api/admin/contacts/${selectedContact._id}/respond`, responseData);
      setSelectedContact(null);
      setResponseData({ message: '', adminName: '' });
      fetchContacts();
      fetchStats();
      alert('Response sent successfully via email!');
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSendingEmail(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        await axios.delete(`http://localhost:3001/api/admin/contacts/${id}`);
        fetchContacts();
        fetchStats();
        alert('Contact message deleted successfully!');
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact message');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-red-100 text-red-800 border-red-200',
      'read': 'bg-blue-100 text-blue-800 border-blue-200',
      'replied': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'new': '🆕',
      'read': '👀',
      'replied': '✅'
    };
    return icons[status] || '📝';
  };

  // Safe array access
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const contactsCount = contactsArray.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Messages</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchContacts}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-green-600 text-xl">📨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <span className="text-red-600 text-xl">🆕</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">New Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.new || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-blue-600 text-xl">👀</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Read Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.read || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.replied || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          
          <button
            onClick={fetchContacts}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <span className="mr-2">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Contact Messages</h2>
          <p className="text-green-100 text-sm mt-1">
            {contactsCount} message{contactsCount !== 1 ? 's' : ''} found
          </p>
        </div>

        {contactsCount === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-500">No contact messages match your current filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {contactsArray.map((contact) => (
              <div key={contact._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{contact.fullName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                        {getStatusIcon(contact.status)} {contact.status}
                      </span>
                    </div>
                    <p className="text-green-600 font-medium">{contact.email}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-green-500"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>

                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                      disabled={contact.status === 'replied'}
                    >
                      <span className="mr-1">✉️</span>
                      Reply
                    </button>

                    <button
                      onClick={() => deleteContact(contact._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Received:</span> {new Date(contact.createdAt).toLocaleString()}
                  </div>
                  <div>
                    {contact.ipAddress && (
                      <span className="mr-4">IP: {contact.ipAddress}</span>
                    )}
                    <span>ID: {contact._id?.slice(-8) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Send Email Response</h3>
              <p className="text-green-100 text-sm mt-1">
                To: {selectedContact.fullName} ({selectedContact.email})
              </p>
            </div>

            <form onSubmit={sendResponse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Message from {selectedContact.fullName}
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={responseData.adminName}
                  onChange={(e) => setResponseData(prev => ({ ...prev, adminName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message *
                </label>
                <textarea
                  required
                  rows="6"
                  value={responseData.message}
                  onChange={(e) => setResponseData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Write your response here. This will be sent via email to the user."
                />
                <p className="text-sm text-gray-500 mt-1">
                  This message will be sent as an email to {selectedContact.email}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✉️</span>
                      Send Response Email
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedContact(null);
                    setResponseData({ message: '', adminName: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;