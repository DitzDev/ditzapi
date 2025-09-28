import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Copy, Play, RotateCcw } from "lucide-react";

interface ApiPlaygroundProps {
  apiId: string;
}

// TODO: Remove mock data when connecting to real APIs
const mockApiDetails: Record<string, any> = {
  "youtube-dl": {
    name: "YouTube Downloader",
    description: "Download videos, audio, and metadata from YouTube",
    baseUrl: "https://api.downloader.com/v1/youtube",
    methods: ["GET"],
    parameters: [
      { name: "url", type: "string", required: true, description: "YouTube video URL" },
      { name: "format", type: "string", required: false, description: "Output format (mp4, mp3, etc.)" },
      { name: "quality", type: "string", required: false, description: "Video quality (720p, 1080p, etc.)" }
    ]
  }
};

export function ApiPlayground({ apiId }: ApiPlaygroundProps) {
  const [method, setMethod] = useState("GET");
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [customHeaders, setCustomHeaders] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiDetails = mockApiDetails[apiId] || mockApiDetails["youtube-dl"];

  const handleParameterChange = (paramName: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleTestApi = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response for demonstration
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "API request successful",
          result: {
            title: "Sample Video Title",
            duration: "3:45",
            format: parameters.format || "mp4",
            quality: parameters.quality || "720p",
            download_url: "https://example.com/download/video.mp4"
          }
        },
        headers: {
          "content-type": "application/json",
          "x-api-version": "1.0"
        }
      };

      setResponse(mockResponse);
    } catch (err) {
      setError("Uhh, Ohh! It looks like this API endpoint has an error. Report the Error now for betterment.");
    }
    
    setIsLoading(false);
  };

  const handleReportError = () => {
    console.log("Error reported for API:", apiId);
    // TODO: Implement error reporting
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setParameters({});
    setCustomHeaders("");
    setCustomBody("");
    setResponse(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">{apiDetails.name}</h1>
        <p className="text-muted-foreground mb-4">{apiDetails.description}</p>
        <div className="flex items-center gap-4">
          <Badge variant="outline">{apiDetails.baseUrl}</Badge>
          <div className="flex gap-2">
            {apiDetails.methods.map((m: string) => (
              <Badge key={m} variant={m === method ? "default" : "secondary"}>
                {m}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request Configuration</h3>
              <Button variant="outline" size="sm" onClick={resetForm} data-testid="button-reset">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="method">HTTP Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger data-testid="select-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {apiDetails.methods.map((m: string) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {apiDetails.parameters.map((param: any) => (
                <div key={param.name}>
                  <Label htmlFor={param.name}>
                    {param.name}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id={param.name}
                    placeholder={param.description}
                    value={parameters[param.name] || ""}
                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    data-testid={`input-param-${param.name}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {param.description} ({param.type})
                  </p>
                </div>
              ))}

              <Tabs defaultValue="headers" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>
                <TabsContent value="headers" className="space-y-4">
                  <div>
                    <Label htmlFor="headers">Custom Headers (JSON)</Label>
                    <Textarea
                      id="headers"
                      placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                      value={customHeaders}
                      onChange={(e) => setCustomHeaders(e.target.value)}
                      rows={3}
                      data-testid="input-headers"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="body" className="space-y-4">
                  <div>
                    <Label htmlFor="body">Request Body (JSON)</Label>
                    <Textarea
                      id="body"
                      placeholder='{"key": "value"}'
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      rows={4}
                      data-testid="input-body"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={handleTestApi} 
                disabled={isLoading}
                className="w-full"
                data-testid="button-test-api"
              >
                {isLoading ? (
                  "Testing..."
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Test API
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Response</h3>
              {response && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                  data-testid="button-copy-response"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-destructive font-medium mb-2">API Error</p>
                    <p className="text-sm text-destructive/80 mb-3">{error}</p>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={handleReportError}
                      data-testid="button-report-error"
                    >
                      Report the Error now for betterment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={response.status === 200 ? "default" : "destructive"}>
                    {response.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {response.status === 200 ? "Success" : "Error"}
                  </span>
                </div>
                
                <div>
                  <Label>Response Body</Label>
                  <Textarea
                    value={JSON.stringify(response.data, null, 2)}
                    readOnly
                    rows={12}
                    className="font-mono text-sm"
                    data-testid="response-body"
                  />
                </div>
              </div>
            )}

            {!response && !error && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Configure your request and click "Test API" to see the response here.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}