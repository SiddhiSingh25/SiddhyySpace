"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { User, ShieldCheck, ShieldAlert, Search } from "lucide-react";

type UserItem = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
    saved: number;
  };
};

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());

        const { data } = await axios.get(`/api/admin/users?${params.toString()}`);
        if (!ignore && data.data) {
          setUsers(data.data);
        }
      } catch {
        if (!ignore) toast({ tone: "error", title: "Could not load users." });
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [search, toast]);

  async function toggleRole(id: string, currentRole: "USER" | "ADMIN") {
    const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${nextRole}?`,
      )
    ) {
      return;
    }

    setUpdatingId(id);
    try {
      await axios.patch(`/api/admin/users/${id}`, {
        role: nextRole,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u)),
      );

      toast({
        tone: "success",
        title: `User role changed to ${nextRole}.`,
      });
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Could not update role.";
      toast({ tone: "error", title: msg });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Users"
        description="View registered readers, community interactions, and manage admin privileges."
      />

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm outline-none transition focus:border-link"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted">
          Loading users…
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <User className="mx-auto h-8 w-8 text-muted" />
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No users found
          </h3>
          <p className="mt-1 text-xs text-muted">
            {search
              ? "Try adjusting your search query."
              : "Registered users will appear here once they sign in."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5">Activity</th>
                  <th className="px-5 py-3.5 text-right">Admin Role Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt={u.name ?? "User"}
                            className="h-10 w-10 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted border border-border">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {u.name ?? "Anonymous Reader"}
                          </p>
                          <p className="text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {u.role === "ADMIN" ? (
                        <Badge variant="info">
                          <ShieldCheck className="h-3 w-3" />
                          ADMIN
                        </Badge>
                      ) : (
                        <Badge variant="outline">USER</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted">
                      <div className="flex gap-2">
                        <span>{u._count.comments} comments</span>
                        <span>•</span>
                        <span>{u._count.likes} likes</span>
                        <span>•</span>
                        <span>{u._count.saved} saved</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        size="sm"
                        variant={u.role === "ADMIN" ? "secondary" : "outline"}
                        onClick={() => toggleRole(u.id, u.role)}
                        loading={updatingId === u.id}
                      >
                        {u.role === "ADMIN" ? (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5 mr-1 text-muted" />
                            Revoke Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-link" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
