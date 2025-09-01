import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  useDataAccessRequests, 
  useCreateDataAccessRequest, 
  useExportUserData, 
  useDeleteUserAccount 
} from '@/hooks/usePrivacyCompliance';
import { 
  Download, 
  Trash2, 
  Edit, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

export const DataManagementPanel: React.FC = () => {
  const { data: requests = [], isLoading } = useDataAccessRequests();
  const createRequest = useCreateDataAccessRequest();
  const exportData = useExportUserData();
  const deleteAccount = useDeleteUserAccount();
  
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleExportData = () => {
    exportData.mutate();
  };

  const handleRequestCorrection = () => {
    createRequest.mutate({
      request_type: 'correction',
      status: 'pending',
      requested_data_types: ['profile', 'preferences'],
      description: 'Request to correct personal data'
    });
  };

  const handleRequestPortability = () => {
    createRequest.mutate({
      request_type: 'portability',
      status: 'pending',
      requested_data_types: ['all'],
      description: 'Request for data portability'
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE MY ACCOUNT') {
      deleteAccount.mutate(deleteConfirmation);
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Rights Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
          <CardDescription>
            Exercise your data protection rights under GDPR, CCPA, and Australian Privacy Act
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Your Data
                </h4>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your personal data in JSON format
                </p>
                <Button 
                  onClick={handleExportData}
                  disabled={exportData.isPending}
                  size="sm"
                  className="w-full"
                >
                  {exportData.isPending ? 'Exporting...' : 'Export Data'}
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Correct Your Data
                </h4>
                <p className="text-sm text-muted-foreground">
                  Request correction of inaccurate personal information
                </p>
                <Button 
                  variant="outline"
                  onClick={handleRequestCorrection}
                  disabled={createRequest.isPending}
                  size="sm"
                  className="w-full"
                >
                  Request Correction
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Data Portability
                </h4>
                <p className="text-sm text-muted-foreground">
                  Get your data in a machine-readable format
                </p>
                <Button 
                  variant="outline"
                  onClick={handleRequestPortability}
                  disabled={createRequest.isPending}
                  size="sm"
                  className="w-full"
                >
                  Request Portability
                </Button>
              </div>
            </Card>

            <Card className="p-4 border-destructive/50">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Account Permanently
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. All your data will be permanently deleted within 30 days.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        To confirm deletion, type "DELETE MY ACCOUNT" in the field below.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Label htmlFor="delete-confirmation">Confirmation</Label>
                      <Input
                        id="delete-confirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Type: DELETE MY ACCOUNT"
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowDeleteDialog(false);
                          setDeleteConfirmation('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== 'DELETE MY ACCOUNT' || deleteAccount.isPending}
                      >
                        {deleteAccount.isPending ? 'Deleting...' : 'Delete Forever'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle>Data Request History</CardTitle>
          <CardDescription>
            Track the status of your data access requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading request history...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data requests found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium capitalize">
                        {request.request_type} Request
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.created_at && format(new Date(request.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    {request.completed_at && (
                      <p className="text-xs text-muted-foreground">
                        Completed {format(new Date(request.completed_at), 'MMM d')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h5 className="font-medium">Under GDPR (European Union):</h5>
            <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent at any time</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium">Under CCPA (California, USA):</h5>
            <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium">Under Australian Privacy Act:</h5>
            <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
              <li>Right to access your personal information</li>
              <li>Right to correct your personal information</li>
              <li>Right to complain about privacy breaches</li>
              <li>Right to anonymity and pseudonymity where practicable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};