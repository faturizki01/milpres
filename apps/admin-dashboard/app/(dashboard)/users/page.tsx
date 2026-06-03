'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../components/AuthProvider'
import Link from 'next/link'

type User = {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'STAFF' | 'SUPER_ADMIN'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin?: string
}

const ROLES = ['ADMIN', 'STAFF', 'SUPER_ADMIN']
const STATUSES = ['active', 'inactive', 'suspended']

export default function UsersPage() {
  useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Mock users data
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@milpers.id',
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            status: 'active',
            createdAt: new Date(Date.now() - 7776000000).toISOString(),
            lastLogin: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '2',
            email: 'editor@milpers.id',
            name: 'Editor Utama',
            role: 'ADMIN',
            status: 'active',
            createdAt: new Date(Date.now() - 5184000000).toISOString(),
            lastLogin: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: '3',
            email: 'kontributor@milpers.id',
            name: 'Kontributor',
            role: 'STAFF',
            status: 'active',
            createdAt: new Date(Date.now() - 2592000000).toISOString(),
            lastLogin: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '4',
            email: 'old.user@milpers.id',
            name: 'Old User',
            role: 'STAFF',
            status: 'inactive',
            createdAt: new Date(Date.now() - 15552000000).toISOString(),
          },
        ]
        setUsers(mockUsers)
      } catch (e) {
        console.error('Failed to load users', e)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  let filtered = users

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }

  if (roleFilter) {
    filtered = filtered.filter(u => u.role === roleFilter)
  }

  if (statusFilter) {
    filtered = filtered.filter(u => u.status === statusFilter)
  }

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(u => u.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': 'bg-red-100 text-red-800',
      'ADMIN': 'bg-blue-100 text-blue-800',
      'STAFF': 'bg-gray-100 text-gray-800',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Kelola pengguna dan role mereka</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua Role</option>
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua Status</option>
            {STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div>
            <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50" disabled={selectedIds.size === 0}>
              Hapus ({selectedIds.size})
            </button>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah User Baru</h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault()
              setShowCreateModal(false)
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" placeholder="Nama lengkap" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="email@milpers.id" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Memuat users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">Tidak ada users ditemukan</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Last Login</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-3 text-gray-600">{user.email}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('id-ID') : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t px-6 py-4 text-sm text-gray-600 bg-gray-50">
            Menampilkan {filtered.length} dari {users.length} users
          </div>
        </div>
      )}
    </div>
  )
}
