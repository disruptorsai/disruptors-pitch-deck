import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabaseAdmin } from '@/lib/supabase-client';
import { adminSDK } from '@/lib/ai-presenter-sdk';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Users,
  Link as LinkIcon,
  Eye,
  FileText,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  // Fetch summary statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [clients, accessLinks, analytics] = await Promise.all([
        supabaseAdmin.from('ai_presenter_clients').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('ai_presenter_access_links').select('id, view_count', { count: 'exact' }),
        supabaseAdmin.from('ai_presenter_analytics_events').select('id', { count: 'exact', head: true })
      ]);

      const totalViews = accessLinks.data?.reduce((sum, link) => sum + (link.view_count || 0), 0) || 0;

      return {
        totalClients: clients.count || 0,
        totalAccessLinks: accessLinks.count || 0,
        totalViews,
        totalEvents: analytics.count || 0,
      };
    },
  });

  // Fetch recent clients using SDK
  const { data: recentClientsResponse } = useQuery({
    queryKey: ['recent-clients'],
    queryFn: async () => {
      return await adminSDK.listClients({ limit: 5, offset: 0 });
    },
  });

  const recentClients = recentClientsResponse?.data || [];

  const statCards = [
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'from-[#FFD700] to-[#FFA500]',
      link: '/admin/clients',
    },
    {
      title: 'Access Links',
      value: stats?.totalAccessLinks || 0,
      icon: LinkIcon,
      color: 'from-[#FFED4E] to-[#FFD700]',
      link: '/admin/access-links',
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'from-[#FFC107] to-[#FF9800]',
      link: '/admin/analytics',
    },
    {
      title: 'Analytics Events',
      value: stats?.totalEvents || 0,
      icon: TrendingUp,
      color: 'from-[#FFB300] to-[#FF8F00]',
      link: '/admin/analytics',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/60 mt-1">Welcome to AI Presenter Admin</p>
        </div>
        <Link to="/admin/clients/new">
          <Button className="gradient-accent hover-glow">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="bg-[#1E1E1E] border-white/10 hover:border-white/30 transition-all p-6 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-all" />
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">
                    {isLoading ? '...' : stat.value.toLocaleString()}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Clients */}
      <Card className="bg-[#1E1E1E] border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Clients</h2>
          <Link to="/admin/clients">
            <Button variant="ghost" className="text-white/70 hover:text-white">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentClients?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-white/20 mb-3" />
              <p className="text-white/60 mb-4">No clients yet</p>
              <Link to="/admin/clients/new">
                <Button className="gradient-accent">Create Your First Client</Button>
              </Link>
            </div>
          ) : (
            recentClients?.map((client) => (
              <Link
                key={client.id}
                to={`/admin/clients/${client.id}`}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  {client.logo_url ? (
                    <img
                      src={client.logo_url}
                      alt={client.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    <p className="text-sm text-white/60">{client.slug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : client.status === 'draft'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {client.status}
                  </span>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1E1E1E] border-white/10 p-6 hover:border-white/30 transition-all">
          <Users className="w-12 h-12 text-[#FFD700] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Create Client</h3>
          <p className="text-white/60 text-sm mb-4">
            Add a new client and create their presentation
          </p>
          <Link to="/admin/clients/new">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
              Get Started
            </Button>
          </Link>
        </Card>

        <Card className="bg-[#1E1E1E] border-white/10 p-6 hover:border-white/30 transition-all">
          <LinkIcon className="w-12 h-12 text-[#FFC107] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Generate Link</h3>
          <p className="text-white/60 text-sm mb-4">
            Create secure access links for presentations
          </p>
          <Link to="/admin/access-links/new">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
              Generate Link
            </Button>
          </Link>
        </Card>

        <Card className="bg-[#1E1E1E] border-white/10 p-6 hover:border-white/30 transition-all">
          <FileText className="w-12 h-12 text-[#FFB300] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Manage Content</h3>
          <p className="text-white/60 text-sm mb-4">
            Edit slides, case studies, and services
          </p>
          <Link to="/admin/content">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
              Edit Content
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
