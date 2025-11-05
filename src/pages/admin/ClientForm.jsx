import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabaseAdmin } from '@/lib/supabase-client';
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
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    logo_url: '',
    primary_color: '#FFD700',
    secondary_color: '#FFA500',
    status: 'draft',
  });

  // Fetch existing client data if editing
  useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabaseAdmin
        .from('ai_presenter_clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
      return data;
    },
    enabled: !!id,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (clientData) => {
      if (isEditing) {
        const { data, error } = await supabaseAdmin
          .from('ai_presenter_clients')
          .update(clientData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabaseAdmin
          .from('ai_presenter_clients')
          .insert([clientData])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clients']);
      queryClient.invalidateQueries(['client', id]);
      toast({
        title: isEditing ? 'Client updated' : 'Client created',
        description: `${data.name} has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      navigate('/admin/clients');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} client`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.slug) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in the name and slug.',
        variant: 'destructive',
      });
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      toast({
        title: 'Invalid slug',
        description: 'Slug must contain only lowercase letters, numbers, and hyphens.',
        variant: 'destructive',
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Auto-generate slug from name if creating new client
    if (field === 'name' && !isEditing && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/clients')}
          className="text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Edit Client' : 'Create New Client'}
          </h1>
          <p className="text-white/60 mt-1">
            {isEditing ? 'Update client information' : 'Add a new client to your portfolio'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="bg-[#1E1E1E] border-white/10 p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white/80">
                    Client Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Acme Corporation"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-white/80">
                    Slug * <span className="text-xs text-white/50">(lowercase, hyphens only)</span>
                  </Label>
                  <Input
                    id="slug"
                    placeholder="acme-corporation"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    pattern="[a-z0-9\-]+"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white/80">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the client..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-white/80">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1E1E] border-white/10">
                    <SelectItem value="draft" className="text-white">Draft</SelectItem>
                    <SelectItem value="active" className="text-white">Active</SelectItem>
                    <SelectItem value="archived" className="text-white">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website" className="text-white/80">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white/80">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                Branding
              </h2>

              <div>
                <Label htmlFor="logo_url" className="text-white/80">
                  Logo URL
                </Label>
                <Input
                  id="logo_url"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo_url}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_color" className="text-white/80">
                    Primary Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => handleChange('primary_color', e.target.value)}
                      className="w-16 h-10 p-1 bg-white/5 border-white/10"
                    />
                    <Input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => handleChange('primary_color', e.target.value)}
                      className="flex-1 bg-white/5 border-white/10 text-white"
                      placeholder="#FF6A00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_color" className="text-white/80">
                    Secondary Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => handleChange('secondary_color', e.target.value)}
                      className="w-16 h-10 p-1 bg-white/5 border-white/10"
                    />
                    <Input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => handleChange('secondary_color', e.target.value)}
                      className="flex-1 bg-white/5 border-white/10 text-white"
                      placeholder="#9B30FF"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/clients')}
                className="border-white/20 text-white hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gradient-accent hover-glow"
                disabled={saveMutation.isLoading}
              >
                {saveMutation.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Client' : 'Create Client'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
