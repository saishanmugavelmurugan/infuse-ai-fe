import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useHealthUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.health.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (userData) => {
    try {
      const newUser = await api.health.createUser(userData);
      setUsers([...users, newUser]);
      return { success: true, data: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const updatedUser = await api.health.updateUser(userId, userData);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      return { success: true, data: updatedUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.health.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
};

export const useHealthRecords = (userId = null) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await api.health.getRecords(userId);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  const addRecord = async (recordData) => {
    try {
      const newRecord = await api.health.createRecord(recordData);
      setRecords([...records, newRecord]);
      return { success: true, data: newRecord };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    records,
    loading,
    error,
    refreshRecords: fetchRecords,
    addRecord,
  };
};

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async (practiceType = null) => {
    try {
      setLoading(true);
      const data = await api.health.getDoctors(practiceType);
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    loading,
    error,
    refreshDoctors: fetchDoctors,
  };
};
