import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSDK } from '@/lib/ai-presenter-sdk';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Users,
  ArrowRight,
  Trash2,
  Edit,
  Eye,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

export default function ClientsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch clients using SDK
  const { data: clientsResponse, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      return await adminSDK.listClients({ limit: 100 });
    },
  });

  const clients = clientsResponse?.data;

  // Delete mutation using SDK
  const deleteMutation = useMutation({
    mutationFn: async (clientId) => {
      await adminSDK.deleteClient(clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      toast({
        title: 'Client deleted',
        description: 'The client has been successfully deleted.',
      });
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete client',
        variant: 'destructive',
      });
    },
  });

  // Filter clients by search query
  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteMutation.mutate(clientToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <p className="text-white/60 mt-1">Manage your client presentations</p>
        </div>
        <Link to="/admin/clients/new">
          <Button className="gradient-accent hover-glow">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="bg-[#1E1E1E] border-white/10 p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              placeholder="Search clients by name, slug, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
        </div>
      </Card>

      {/* Clients List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="bg-[#1E1E1E] border-white/10 p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading clients...</p>
          </Card>
        ) : filteredClients?.length === 0 ? (
          <Card className="bg-[#1E1E1E] border-white/10 p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-white/60 mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first client to get started'}
            </p>
            {!searchQuery && (
              <Link to="/admin/clients/new">
                <Button className="gradient-accent">Create Your First Client</Button>
              </Link>
            )}
          </Card>
        ) : (
          filteredClients?.map((client) => (
            <Card
              key={client.id}
              className="bg-[#1E1E1E] border-white/10 hover:border-white/30 transition-all p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {client.logo_url ? (
                    <img
                      src={client.logo_url}
                      alt={client.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {client.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-2">/{client.slug}</p>
                    {client.description && (
                      <p className="text-white/50 text-sm line-clamp-1">
                        {client.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      {client.email && (
                        <span className="text-xs text-white/50">{client.email}</span>
                      )}
                      {client.website && (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#FFD700] hover:underline"
                        >
                          {client.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-white/10">
                      <Link to={`/p/${client.slug}`}>
                        <DropdownMenuItem className="text-white/70 hover:text-white cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          View Presentation
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/admin/clients/${client.id}`}>
                        <DropdownMenuItem className="text-white/70 hover:text-white cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Client
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => handleDelete(client)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1E1E1E] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete {clientToDelete?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone. This will permanently delete the client
              and all associated data including presentations, access links, and analytics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
