"use client";

import { useState } from "react";
import { Check, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LANGUAGE_COLORS } from "@/lib/constants";
import toast from "react-hot-toast";

interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  owner: { login: string };
  default_branch: string;
}

interface ConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected?: () => void;
}

export function ConnectModal({ open, onOpenChange, onConnected }: ConnectModalProps) {
  const [search, setSearch] = useState("");
  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<number | null>(null);
  const [connectedIds, setConnectedIds] = useState<Set<number>>(new Set());

  async function searchRepos() {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/repositories/search?q=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repositories || []);
      }
    } catch {
      toast.error("Failed to search repositories");
    } finally {
      setLoading(false);
    }
  }

  async function connectRepo(repo: GitHubRepoItem) {
    setConnecting(repo.id);
    try {
      const res = await fetch("/api/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          owner: repo.owner.login,
          description: repo.description,
          language: repo.language,
          isPrivate: repo.private,
          defaultBranch: repo.default_branch,
        }),
      });

      if (res.ok) {
        setConnectedIds((prev) => new Set(prev).add(repo.id));
        toast.success(`Connected ${repo.name}`);
        onConnected?.();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to connect repository");
      }
    } catch {
      toast.error("Failed to connect repository");
    } finally {
      setConnecting(null);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Connect Repository"
      description="Search for a GitHub repository to connect with CodeSentinel."
      className="max-w-xl"
    >
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchRepos()}
          icon={<MagnifyingGlass size={16} weight="regular" />}
        />
        <Button onClick={searchRepos} loading={loading} size="md">
          Search
        </Button>
      </div>

      <div className="max-h-[360px] overflow-y-auto space-y-2">
        {repos.length === 0 && !loading && (
          <p className="text-sm text-text-muted text-center py-8">
            Search for a repository to get started
          </p>
        )}

        {repos.map((repo) => {
          const isConnected = connectedIds.has(repo.id);
          return (
            <div
              key={repo.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {repo.full_name}
                </p>
                {repo.description && (
                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {repo.language && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: LANGUAGE_COLORS[repo.language] || "#6B7280",
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.private && (
                    <Badge variant="default" className="text-[10px]">
                      Private
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant={isConnected ? "ghost" : "secondary"}
                size="sm"
                onClick={() => !isConnected && connectRepo(repo)}
                loading={connecting === repo.id}
                disabled={isConnected}
              >
                {isConnected ? (
                  <>
                    <Check size={13} weight="bold" />
                    Connected
                  </>
                ) : (
                  <>
                    <Plus size={13} weight="bold" />
                    Connect
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
