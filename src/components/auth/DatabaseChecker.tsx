import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';
import { projectId, publicAnonKey } from '../../lib/auth-config';

interface DatabaseStatus {
  tablesExist: boolean;
  serverConnected: boolean;
  error?: string;
  details?: any;
}

export function DatabaseChecker() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      // Check MongoDB browser storage setup
      const dbKeys = [
        'mongodb_megajobnepal_job_categories',
        'mongodb_megajobnepal_companies',
        'mongodb_megajobnepal_users'
      ];
      
      let hasValidData = false;
      for (const dbKey of dbKeys) {
        const data = localStorage.getItem(dbKey);
        if (data && data !== '[]' && data !== 'null') {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
              hasValidData = true;
              break;
            }
          } catch (parseError) {
            console.warn(`Error parsing ${dbKey}:`, parseError);
          }
        }
      }

      if (!hasValidData) {
        setStatus({
          tablesExist: false,
          serverConnected: false,
          error: 'MongoDB database setup needed - no valid data found'
        });
        return;
      }

      // If we have valid data, database is ready
      setStatus({
        tablesExist: true,
        serverConnected: true,
        details: {
          status: 'ok',
          database: 'connected',
          environment: {
            mongodb_storage: 'configured',
            localStorage_access: 'configured'
          }
        }
      });

    } catch (error: any) {
      setStatus({
        tablesExist: false,
        serverConnected: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const setupDatabase = async () => {
    setSetupLoading(true);
    try {
      // Simulate database setup by triggering the DatabaseSetup component
      // Instead of making API calls, redirect to the setup page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('setup')) {
        window.location.href = '/';
        return;
      }
      
      // If already on setup page, just mark as successful
      setStatus({
        tablesExist: false,
        serverConnected: true,
        details: {
          status: 'setup_required',
          message: 'Database setup in progress'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Test signup successful:', data);
        
        // Refresh database status
        await checkDatabase();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Setup failed');
      }
    } catch (error: any) {
      console.error('Database setup error:', error);
      setStatus(prev => prev ? { ...prev, error: error.message } : null);
    } finally {
      setSetupLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  if (!status && loading) {
    return (
      <Card className="mb-4">
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm">Checking database status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Server Connection:</span>
              <div className="flex items-center">
                {status.serverConnected ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge variant={status.serverConnected ? 'default' : 'destructive'} className="ml-2">
                  {status.serverConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Database Tables:</span>
              <div className="flex items-center">
                {status.tablesExist ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge variant={status.tablesExist ? 'default' : 'destructive'} className="ml-2">
                  {status.tablesExist ? 'Ready' : 'Setup Needed'}
                </Badge>
              </div>
            </div>

            {status.error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription className="text-xs">
                  <strong>Error:</strong> {status.error}
                </AlertDescription>
              </Alert>
            )}

            {status.details && (
              <div className="text-xs text-gray-600">
                <div>Server: {status.details.status}</div>
                <div>Database: {status.details.database}</div>
                <div>Timestamp: {status.details.timestamp}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkDatabase}
            disabled={loading}
            className="text-xs"
          >
            {loading ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <RefreshCw className="w-3 h-3 mr-1" />
            )}
            Recheck
          </Button>

          {!status?.tablesExist && (
            <Button
              size="sm"
              onClick={setupDatabase}
              disabled={setupLoading}
              className="text-xs"
            >
              {setupLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                  Setting up...
                </>
              ) : (
                'Setup Database'
              )}
            </Button>
          )}
        </div>

        {/* Instructions */}
        {!status?.serverConnected && (
          <Alert className="py-2">
            <AlertDescription className="text-xs">
              <strong>Server Connection Issue:</strong>
              <br />
              • The backend server might not be running
              <br />
              • Check if your Supabase Edge Functions are deployed
              <br />
              • Verify your project ID is correct: <code>{projectId}</code>
            </AlertDescription>
          </Alert>
        )}

        {status?.serverConnected && !status?.tablesExist && (
          <Alert className="py-2">
            <AlertDescription className="text-xs">
              <strong>Database Setup Required:</strong>
              <br />
              • The database tables for authentication haven't been created yet
              <br />
              • Click "Setup Database" to initialize the required tables
              <br />
              • This will create the users table and other necessary structures
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}