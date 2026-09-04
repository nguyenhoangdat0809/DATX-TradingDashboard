import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Settings as SettingsIcon, User, Bell, Lock, Palette } from "lucide-react";
import { motion } from "motion/react";

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Full Name</Label>
              <Input
                defaultValue="John Doe"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                defaultValue="john.doe@example.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Username</Label>
              <Input
                defaultValue="@johndoe"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Current Password</Label>
              <Input
                type="password"
                placeholder="Enter current password"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Price Alerts</p>
                <p className="text-sm text-gray-400">Get notified when prices hit targets</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Trade Notifications</p>
                <p className="text-sm text-gray-400">Alerts for executed trades</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">News Updates</p>
                <p className="text-sm text-gray-400">Market-moving news alerts</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Strategy Signals</p>
                <p className="text-sm text-gray-400">Alerts from your strategies</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive updates via email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Dark Mode</p>
                <p className="text-sm text-gray-400">Use dark theme</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Compact View</p>
                <p className="text-sm text-gray-400">Show more data in less space</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Animations</p>
                <p className="text-sm text-gray-400">Enable smooth transitions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Show Grid Lines</p>
                <p className="text-sm text-gray-400">Display grid on charts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Preferences */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
            Trading Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Default Position Size</Label>
              <Input
                type="number"
                defaultValue="1000"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Max Risk Per Trade (%)</Label>
              <Input
                type="number"
                defaultValue="2"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Default Leverage</Label>
              <Input
                type="number"
                defaultValue="1"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-white">Auto-close on Target</p>
              <p className="text-sm text-gray-400">Automatically close when target is hit</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Auto-set Stop Loss</p>
              <p className="text-sm text-gray-400">Auto calculate SL based on risk</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
