import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Agent } from "@/services/api";

interface AgentEditDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (agent: Agent) => void;
}

export function AgentEditDialog({ agent, open, onOpenChange, onSave }: AgentEditDialogProps) {
  const [formData, setFormData] = useState<Agent | null>(null);

  useEffect(() => {
    if (agent) {
      setFormData({ ...agent });
    }
  }, [agent]);

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFormData(agent ? { ...agent } : null);
    onOpenChange(false);
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">编辑智能体配置</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              智能体名称 *
            </Label>
            <Input
              id="name"
              placeholder="请输入智能体名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="module" className="text-sm font-medium">
              模块类型 *
            </Label>
            <Select 
              value={formData.module} 
              onValueChange={(value) => setFormData({ ...formData, module: value as Agent["module"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择模块类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intent">Intent - 意图识别</SelectItem>
                <SelectItem value="ner">NER - 命名实体识别</SelectItem>
                <SelectItem value="t2sql">T2SQL - 文本转SQL</SelectItem>
                <SelectItem value="e2e">E2E - 端到端对话</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="version" className="text-sm font-medium">
                版本号 *
              </Label>
              <Input
                id="version"
                placeholder="如: v1.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model_name" className="text-sm font-medium">
                模型名称
              </Label>
              <Input
                id="model_name"
                placeholder="如: gpt-4o"
                value={formData.model_name || ""}
                onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prompt_hash" className="text-sm font-medium">
              Prompt Hash
            </Label>
            <Input
              id="prompt_hash"
              placeholder="Prompt的哈希值，用于版本控制"
              value={formData.prompt_hash || ""}
              onChange={(e) => setFormData({ ...formData, prompt_hash: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code_commit" className="text-sm font-medium">
              代码提交ID
            </Label>
            <Input
              id="code_commit"
              placeholder="Git commit hash"
              value={formData.code_commit || ""}
              onChange={(e) => setFormData({ ...formData, code_commit: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="config" className="text-sm font-medium">
              配置信息 (JSON格式)
            </Label>
            <Textarea
              id="config"
              placeholder='{"temperature": 0.7, "max_tokens": 1000}'
              className="min-h-[100px] font-mono text-sm"
              value={formData.config ? JSON.stringify(formData.config, null, 2) : ""}
              onChange={(e) => {
                try {
                  const config = e.target.value ? JSON.parse(e.target.value) : undefined;
                  setFormData({ ...formData, config });
                } catch {
                  // 保持原始文本，等用户修正JSON格式
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name || !formData.module || !formData.version}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            保存配置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}