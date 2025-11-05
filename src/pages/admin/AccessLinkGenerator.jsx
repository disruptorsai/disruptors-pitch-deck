import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseAdmin } from '@/lib/supabase-client';
import { adminSDK } from '@/lib/ai-presenter-sdk';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  Link as LinkIcon,
  Copy,
  Check,
  Calendar,
  Eye,
  Lock,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function AccessLinkGenerator() {
  const [formData, setFormData] = useState({
    client_id: '',
    name: '',
    expires_at: '',
    max_views: '',
    password: '',
    custom_message: '',
  });
  const [copiedToken, setCopiedToken] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch active clients for dropdown using SDK
  const { data: clientsResponse } = useQuery({
    queryKey: ['clients', 'active'],
    queryFn: async () => {
      return await adminSDK.listClients({ limit: 100, status: 'active' });
    },
  });

  const clients = clientsResponse?.data || [];

  // Fetch existing access links
  const { data: accessLinks, isLoading } = useQuery({
    queryKey: ['access-links'],
    queryFn: async () => {
      const { data } = await supabaseAdmin
        .from('ai_presenter_access_links')
        .select(`
          *,
          client:ai_presenter_clients(name, slug)
        `)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  // Generate token (simple implementation)
  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (linkData) => {
      const token = generateToken();

      const { data, error } = await supabaseAdmin
        .from('ai_presenter_access_links')
        .insert([{
          ...linkData,
          token,
          status: 'active',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['access-links']);
      toast({
        title: 'Access link created',
        description: 'Your secure access link has been generated.',
      });
      // Reset form
      setFormData({
        client_id: '',
        name: '',
        expires_at: '',
        max_views: '',
        password: '',
        custom_message: '',
      });
      // Auto-copy the token
      copyToken(data.token);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create access link',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (linkId) => {
      const { error } = await supabaseAdmin
        .from('ai_presenter_access_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['access-links']);
      toast({
        title: 'Link deleted',
        description: 'The access link has been removed.',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.client_id || !formData.name) {
      toast({
        title: 'Missing fields',
        description: 'Please select a client and enter a link name.',
        variant: 'destructive',
      });
      return;
    }

    const linkData = {
      client_id: formData.client_id,
      name: formData.name,
      ...(formData.expires_at && { expires_at: new Date(formData.expires_at).toISOString() }),
      ...(formData.max_views && { max_views: parseInt(formData.max_views) }),
      ...(formData.password && { password_hash: formData.password }), // In production, use proper hashing
      ...(formData.custom_message && { custom_message: formData.custom_message }),
    };

    createMutation.mutate(linkData);
  };

  const copyToken = (token) => {
    const url = `${window.location.origin}/p/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Access Links</h1>
        <p className="text-white/60 mt-1">Generate secure, trackable presentation links</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Form */}
        <Card className="bg-[#1E1E1E] border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Generate New Link</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="client" className="text-white/80">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-white/10">
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="text-white">
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name" className="text-white/80">Link Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Investor Pitch - Q1 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="expires_at" className="text-white/80">Expiration Date (Optional)</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="max_views" className="text-white/80">Max Views (Optional)</Label>
              <Input
                id="max_views"
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.max_views}
                onChange={(e) => setFormData({ ...formData, max_views: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white/80">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Leave empty for no password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-white/80">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Welcome message for visitors"
                value={formData.custom_message}
                onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-accent hover-glow"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? 'Generating...' : 'Generate Link'}
            </Button>
          </form>
        </Card>

        {/* Existing Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Existing Links</h2>

          {isLoading ? (
            <Card className="bg-[#1E1E1E] border-white/10 p-12 text-center">
              <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading links...</p>
            </Card>
          ) : accessLinks?.length === 0 ? (
            <Card className="bg-[#1E1E1E] border-white/10 p-12 text-center">
              <LinkIcon className="w-16 h-16 mx-auto text-white/20 mb-4" />
              <p className="text-white/60">No access links yet</p>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {accessLinks?.map((link) => (
                <Card key={link.id} className="bg-[#1E1E1E] border-white/10 p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{link.name}</h3>
                        <p className="text-sm text-white/60 mt-1">
                          {link.client?.name} ({link.client?.slug})
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          link.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {link.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-white/50">
                      {link.expires_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires: {new Date(link.expires_at).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {link.view_count || 0} views
                        {link.max_views && ` / ${link.max_views}`}
                      </span>
                      {link.password_hash && (
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Protected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        value={`${window.location.origin}/p/${link.token}`}
                        readOnly
                        className="bg-white/5 border-white/10 text-white text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 shrink-0"
                        onClick={() => copyToken(link.token)}
                      >
                        {copiedToken === link.token ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 shrink-0"
                        onClick={() => window.open(`/p/${link.token}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 shrink-0"
                        onClick={() => deleteMutation.mutate(link.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
