import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Mail, Shield, Heart, Copy, Check, 
  Trash2, Edit, Loader2, AlertCircle, X, ChevronDown
} from 'lucide-react';
import { API_URL } from '../config/api';

const TeamManagement = ({ platform = 'all' }) => {
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedLink, setCopiedLink] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const [membersRes, invitesRes] = await Promise.all([
        fetch(`${API_URL}/api/team/members${platform !== 'all' ? `?platform=${platform}` : ''}`, {
          headers: getAuthHeaders()
        }),
        fetch(`${API_URL}/api/team/invites`, {
          headers: getAuthHeaders()
        })
      ]);

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members || []);
      }
      
      if (invitesRes.ok) {
        const invitesData = await invitesRes.json();
        setInvites(invitesData.invites || []);
      }
    } catch (err) {
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCancelInvite = async (inviteId) => {
    try {
      const response = await fetch(`${API_URL}/api/team/invites/${inviteId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        setInvites(invites.filter(i => i.id !== inviteId));
        setSuccess('Invitation cancelled');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to cancel invitation');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/team/members/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        setMembers(members.filter(m => m.user_id !== userId));
        setSuccess('Team member removed');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to remove team member');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      case 'member': return 'bg-green-100 text-green-700';
      case 'viewer': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            Team Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage team members and invitations for your organization
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:opacity-90"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Pending Invitations */}
      {invites.length > 0 && (
        <div className="p-6 border-b">
          <h3 className="font-medium text-gray-900 mb-4">Pending Invitations ({invites.length})</h3>
          <div className="space-y-3">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invite.name}</p>
                    <p className="text-sm text-gray-600">{invite.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getRoleBadgeColor(invite.role)}`}>
                        {invite.role}
                      </span>
                      {invite.platforms?.map((p) => (
                        <span key={p} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {p === 'healthtrack' ? 'HealthTrack' : 'SecureSphere'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(`${window.location.origin}/accept-invite?token=${invite.token}`, invite.id)}
                    className="p-2 text-gray-500 hover:text-orange-500"
                    title="Copy invite link"
                  >
                    {copiedLink === invite.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    className="p-2 text-gray-500 hover:text-red-500"
                    title="Cancel invitation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="p-6">
        <h3 className="font-medium text-gray-900 mb-4">Team Members ({members.length})</h3>
        
        {members.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No team members yet</p>
            <p className="text-sm mt-1">Invite your first team member to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Member</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Platform Access</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.user_id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                          {member.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.user?.name}</p>
                          <p className="text-sm text-gray-500">{member.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-1">
                        {member.platforms?.includes('healthtrack') && (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                            <Heart className="w-3 h-3" /> HealthTrack
                          </span>
                        )}
                        {member.platforms?.includes('securesphere') && (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                            <Shield className="w-3 h-3" /> SecureSphere
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveMember(member.user_id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)} 
          onSuccess={(invite) => {
            setInvites([...invites, invite]);
            setShowInviteModal(false);
            setSuccess('Invitation sent successfully!');
            setTimeout(() => setSuccess(''), 3000);
          }}
          platform={platform}
        />
      )}
    </div>
  );
};

// Invite Modal Component
const InviteModal = ({ onClose, onSuccess, platform }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [platforms, setPlatforms] = useState(
    platform === 'all' ? ['healthtrack', 'securesphere'] : [platform]
  );
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/team/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          name,
          role,
          platforms,
          department: department || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setInviteLink(data.invite_link);
        onSuccess(data);
      } else {
        setError(data.detail || 'Failed to send invitation');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (p) => {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter(x => x !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {inviteLink ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Invitation Sent!</h4>
              <p className="text-gray-600 mt-1">Share this link with {name}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 mb-2">Invitation Link</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inviteLink} 
                  readOnly 
                  className="flex-1 bg-white border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                  }}
                  className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="admin">Admin - Full access</option>
                <option value="manager">Manager - Manage team & data</option>
                <option value="member">Member - Standard access</option>
                <option value="viewer">Viewer - Read-only access</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Access</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => togglePlatform('healthtrack')}
                  className={`flex-1 p-3 rounded-lg border-2 transition ${
                    platforms.includes('healthtrack') 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 mx-auto mb-1 ${platforms.includes('healthtrack') ? 'text-orange-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${platforms.includes('healthtrack') ? 'text-orange-700' : 'text-gray-600'}`}>
                    HealthTrack
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => togglePlatform('securesphere')}
                  className={`flex-1 p-3 rounded-lg border-2 transition ${
                    platforms.includes('securesphere') 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Shield className={`w-5 h-5 mx-auto mb-1 ${platforms.includes('securesphere') ? 'text-amber-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${platforms.includes('securesphere') ? 'text-amber-700' : 'text-gray-600'}`}>
                    SecureSphere
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department (optional)</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Engineering, Sales"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || platforms.length === 0}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Invitation
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
