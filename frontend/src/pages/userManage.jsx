import React, { useEffect, useState } from "react";
import axios from "axios";
import {Card,CardHeader,CardTitle,CardContent,} from "@/components/ui/card";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  //  Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //  Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Edit a user
  const handleEdit = (user) => {
    setEditUser(user._id);
    setFormData({ name: user.name, email: user.email });
  };

  //  Cancel edit
  const handleCancel = () => {
    setEditUser(null);
    setFormData({ name: "", email: "" });
  };

  //  Update user
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/users/${id}`, formData);
      alert(" User updated successfully!");
      fetchUsers();
      handleCancel();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  //  Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      alert("🗑️ User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 to-green-300">
      <Card className="shadow-xl rounded-2xl border-green-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-800">
            👨‍🌾 Farmer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-600 py-4">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-500">
                    <TableHead className="text-black">Name</TableHead>
                    <TableHead className="text-black">Email</TableHead>
                    <TableHead className="text-center text-black">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-gray-500 py-4"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow
                        key={user._id}
                        className="hover:bg-green-50 transition"
                      >
                        <TableCell>
                          {editUser === user._id ? (
                            <Input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                            />
                          ) : (
                            user.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editUser === user._id ? (
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          ) : (
                            user.email
                          )}
                        </TableCell>
                        <TableCell className="text-center space-x-3">
                          {editUser === user._id ? (
                            <>
                              <Button
                                onClick={() => handleUpdate(user._id)}
                                className="bg-green-600 hover:bg-green-500"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={handleCancel}
                                variant="secondary"
                                className="bg-gray-300 hover:bg-gray-400"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleEdit(user)}
                                className="bg-green-600 hover:bg-green-400"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-500 hover:bg-green-300"
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManage;
