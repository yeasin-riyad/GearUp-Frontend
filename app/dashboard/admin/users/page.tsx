"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  User,
  Shield,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  getAllUsersAction,
  updateUserStatusAction,
  UserItem,
  MetaData,
} from "@/actions/admin-users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [meta, setMeta] = useState<MetaData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(true);

  // Filter & Search Controls
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Action state management
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsers = useCallback(
    async (pageNum = meta.page) => {
      setLoading(true);
      try {
        const res = await getAllUsersAction({
          searchTerm: searchTerm.trim() || undefined,
          role: roleFilter,
          status: statusFilter,
          page: pageNum,
          limit: meta.limit,
        });

        if (res.success && res.data) {
          setUsers(res.data);
          if (res.meta) setMeta(res.meta);
        } else {
          toast.error(res.error || "Failed to load users");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, roleFilter, statusFilter, meta.limit, meta.page]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, statusFilter]);

  const handleStatusToggle = async () => {
    if (!selectedUser) return;

    const targetStatus = selectedUser.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setIsUpdating(true);

    try {
      const res = await updateUserStatusAction(selectedUser.id, targetStatus);
      if (res.success) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((item) =>
            item.id === selectedUser.id ? { ...item, status: targetStatus } : item
          )
        );
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsUpdating(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            View, search, filter, and manage platform user permissions and access statuses.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadUsers(meta.page)}
          disabled={loading}
          className="w-fit gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-card p-4 rounded-xl border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden md:inline" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="PROVIDER">Provider</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[280px]">User Profile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Activity Metrics</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No users found matching the given criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  {/* User Profile */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <p className="font-medium text-sm line-clamp-1">{user.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>

                  {/* Activity Metrics */}
                  <TableCell>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1" title="Rental Orders">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{user._count?.rentalOrders ?? 0}</span>
                      </span>
                      <span className="flex items-center gap-1" title="Reviews">
                        <Star className="h-3.5 w-3.5" />
                        <span>{user._count?.reviews ?? 0}</span>
                      </span>
                    </div>
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="text-right">
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-muted-foreground italic px-2">
                        System Protected
                      </span>
                    ) : user.status === "ACTIVE" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-3 text-xs gap-1.5"
                        onClick={() => setSelectedUser(user)}
                      >
                        <UserX className="h-3.5 w-3.5" />
                        <span>Suspend</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs gap-1.5 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        onClick={() => setSelectedUser(user)}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Activate</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
          <div className="text-xs text-muted-foreground">
            Showing page <span className="font-semibold">{meta.page}</span> of{" "}
            <span className="font-semibold">{meta.totalPage || 1}</span> ({meta.total}{" "}
            total users)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1 || loading}
              onClick={() => loadUsers(meta.page - 1)}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPage || loading}
              onClick={() => loadUsers(meta.page + 1)}
              className="h-8 px-3"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AlertDialog
        open={Boolean(selectedUser)}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "ACTIVE"
                ? "Suspend User Account"
                : "Reactivate User Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "ACTIVE" ? (
                <>
                  Are you sure you want to suspend{" "}
                  <strong className="text-foreground">{selectedUser?.name}</strong> (
                  {selectedUser?.email})? They will lose access to rent items or accept orders.
                </>
              ) : (
                <>
                  Are you sure you want to reactivate{" "}
                  <strong className="text-foreground">{selectedUser?.name}</strong> (
                  {selectedUser?.email})? Account access will be restored immediately.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusToggle}
              disabled={isUpdating}
              className={
                selectedUser?.status === "ACTIVE"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : selectedUser?.status === "ACTIVE" ? (
                "Confirm Suspension"
              ) : (
                "Confirm Activation"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300";
    case "PROVIDER":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300";
  }
}

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <TableRow key={n}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-20 ml-auto rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}