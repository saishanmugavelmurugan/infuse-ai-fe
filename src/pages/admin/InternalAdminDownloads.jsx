import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Download, FileText, Presentation, RefreshCw, 
  Lock, Users, Building, Shield, ChevronRight,
  CheckCircle, AlertCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const INTERNAL_KEY = 'infuse_internal_2025_secret';

const InternalAdminDownloads = () => {
  const [downloads, setDownloads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/internal-admin/downloads`, {
        headers: { 'x-internal-key': INTERNAL_KEY }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDownloads(data);
        setError(null);
      } else {
        setError('Failed to fetch downloads');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/internal-admin/downloads/${filename}`, {
        headers: { 'x-internal-key': INTERNAL_KEY }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const response = await fetch(`${BACKEND_URL}/api/internal-admin/downloads/regenerate-sales-deck`, {
        method: 'POST',
        headers: { 'x-internal-key': INTERNAL_KEY }
      });
      
      if (response.ok) {
        await fetchDownloads();
      }
    } catch (err) {
      console.error('Regeneration failed:', err);
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading downloads...</p>
        </div>
      </div>
    );
  }

  const salesDeck = downloads?.available_materials?.executive_sales_deck;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-orange-600" />
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Infuse Internal Only
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Materials & Downloads</h1>
          <p className="text-gray-600 mt-2">
            Executive presentations and sales collateral for customer meetings
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Main Sales Deck Card */}
        <Card className="mb-8 border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Presentation className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Executive Sales Deck</CardTitle>
                  <CardDescription className="text-blue-100">
                    {salesDeck?.description || 'Professional presentation for C-level meetings'}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-white/20 text-white text-lg px-4 py-1">
                15 Slides
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Target Audience */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Target Audience</h3>
              <div className="flex flex-wrap gap-2">
                {(salesDeck?.audience || ['CEO', 'CFO', 'CIO', 'CSO']).map((role) => (
                  <Badge key={role} variant="secondary" className="text-sm px-3 py-1">
                    <Users className="w-3 h-3 mr-1" />
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Slide Contents */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Presentation Contents</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {(salesDeck?.contents || [
                  'Executive Summary',
                  'Product Overview',
                  'AI Agents Overview',
                  'Security Architecture',
                  'ROI & Financial Impact',
                  'Pricing Models'
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* File Info */}
            {downloads?.files?.[0] && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{downloads.files[0].filename}</p>
                      <p className="text-sm text-gray-500">
                        Size: {downloads.files[0].size_mb} MB • 
                        Last updated: {new Date(downloads.files[0].modified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
                onClick={() => handleDownload('Infuse_Executive_Sales_Deck.pptx')}
              >
                <Download className="w-5 h-5 mr-2" />
                Download PowerPoint
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                {regenerating ? 'Regenerating...' : 'Regenerate'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                For CFO Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">Focus on slides:</p>
              <ul className="text-sm space-y-1">
                <li>• Financial Impact (Slide 8)</li>
                <li>• Pricing Models (Slide 11)</li>
                <li>• ROI Metrics (Slide 6)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                For CSO/CISO Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">Focus on slides:</p>
              <ul className="text-sm space-y-1">
                <li>• Security Architecture (Slide 7)</li>
                <li>• Security Posture (Slide 10)</li>
                <li>• AI Agents (Slide 5)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                For CIO/CTO Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">Focus on slides:</p>
              <ul className="text-sm space-y-1">
                <li>• Technology Architecture (Slide 9)</li>
                <li>• Integration Capabilities</li>
                <li>• AI/ML Infrastructure</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Access Info */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Confidential Materials</h4>
              <p className="text-sm text-yellow-700">
                These materials are for Infuse internal use and authorized sales representatives only.
                Do not share download links externally. For customer sharing, use the official sales portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalAdminDownloads;
