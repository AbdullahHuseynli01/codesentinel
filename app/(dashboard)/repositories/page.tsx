"use client";

import { useState, useEffect } from "react";
import { GitBranch, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { RepoCard } from "@/components/repositories/repo-card";
import { ConnectModal } from "@/components/repositories/connect-modal";

interface Repository {
  id: string;
  name: string;
  fullName: string;
  language: string | null;
  description: string | null;
  webhookActive: boolean;
  _count: { reviews: number };
  reviews: { overallScore: number | null; createdAt: string }[];
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchRepos() {
    try {
      const res = await fetch("/api/repositories");
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repositories || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold font-display text-text-primary">
            Your Repositories
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Connect repositories to enable AI-powered code reviews.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} weight="bold" />
          Connect Repository
        </Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 space-y-4">
              <div className="skeleton h-5 w-1/2 rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/3 rounded" />
              <div className="skeleton h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : repos.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              id={repo.id}
              name={repo.name}
              fullName={repo.fullName}
              language={repo.language}
              description={repo.description}
              reviewCount={repo._count.reviews}
              lastScore={repo.reviews[0]?.overallScore}
              lastReviewDate={repo.reviews[0]?.createdAt}
              webhookActive={repo.webhookActive}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
            <GitBranch size={32} weight="duotone" className="text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary font-display">
            No repositories connected
          </h3>
          <p className="text-sm text-text-secondary mt-2 max-w-sm">
            Connect your first GitHub repository to start receiving AI-powered
            code reviews on your pull requests.
          </p>
          <Button onClick={() => setModalOpen(true)} className="mt-6">
            <Plus size={16} weight="bold" />
            Connect Your First Repo
          </Button>
        </div>
      )}

      <ConnectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onConnected={fetchRepos}
      />
    </div>
  );
}
