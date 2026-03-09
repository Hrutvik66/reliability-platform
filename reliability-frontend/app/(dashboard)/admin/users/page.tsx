"use client"

import { Users, Shield, User } from "lucide-react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetcher } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import type { User as UserType } from "@/lib/types"

export default function AdminUsersPage() {
  const { data: users, error, isLoading } = useSWR<UserType[]>(
    "/admin/users",
    fetcher
  )

  return (
    <div className="flex flex-col">
      <Header
        title="User Management"
        description="View and manage all registered users"
      />

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">
              Failed to load users. You may not have admin permissions.
            </p>
          </div>
        ) : users?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No users found</h3>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <div className="grid grid-cols-4 gap-4 border-b border-border bg-secondary/50 p-4 text-sm font-medium text-muted-foreground">
              <div>User</div>
              <div>Role</div>
              <div>Created</div>
              <div>Status</div>
            </div>
            {users?.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-4 gap-4 border-b border-border p-4 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {user.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {user.role === "admin" && <Shield className="h-3 w-3" />}
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
                </div>
                <div className="flex items-center">
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
