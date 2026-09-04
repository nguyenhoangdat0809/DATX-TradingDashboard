import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ChartUpload() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Upload Chart for AI Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-center">
              <p className="text-white mb-1">Drag & drop your chart screenshot</p>
              <p className="text-sm text-gray-400">or click to browse</p>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG (Max 10MB)</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
