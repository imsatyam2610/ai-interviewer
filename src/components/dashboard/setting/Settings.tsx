"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser, useClerk } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [aiLearning, setAiLearning] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={user?.emailAddresses[0].emailAddress} disabled />
              </div>
              <div>
                <Label>Full Name</Label>
                <Input value={user?.fullName || ""} disabled />
              </div>
              <div>
                <Label>Subscription</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Free Plan</Badge>
                  <p className="text-xs text-gray-500">2 interviews left</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow AI to Learn from My Interviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Helps improve question quality
                  </p>
                </div>
                <Switch checked={aiLearning} onCheckedChange={setAiLearning} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-500 mb-4">
                Deleting your account is irreversible. Your interview history
                will be lost.
              </p>
              <Button variant="destructive" disabled>
                Delete My Account (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
