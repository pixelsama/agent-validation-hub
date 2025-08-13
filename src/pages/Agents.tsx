import { useState } from "react";
import { SEO } from "@/components/common/SEO";
import { AgentEditDialog } from "@/components/common/AgentEditDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api, Agent } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Bot, Edit, Calendar, GitCommit } from "lucide-react";

export default function AgentsPage() {
  const { toast } = useToast();
  const { data: agents = [], refetch } = useQuery({ queryKey: ["agents"], queryFn: api.listAgents });
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const save = useMutation({
    mutationFn: api.saveAgent,
    onSuccess: () => {
      toast({ title: "已保存智能体配置", description: "配置更新成功！" });
      setEditingAgent(null);
      setDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast({ title: "保存失败", description: "请检查配置信息是否正确", variant: "destructive" });
    },
  });

  const handleEditClick = (agent: Agent) => {
    setEditingAgent(agent);
    setDialogOpen(true);
  };

  const handleSave = (agent: Agent) => {
    save.mutate(agent);
  };

  const getModuleDisplayName = (module: string) => {
    const moduleMap = {
      intent: "意图识别",
      ner: "命名实体识别",
      t2sql: "文本转SQL",
      e2e: "端到端对话"
    };
    return moduleMap[module as keyof typeof moduleMap] || module;
  };

  const getModuleColor = (module: string) => {
    const colorMap = {
      intent: "bg-blue-100 text-blue-800",
      ner: "bg-green-100 text-green-800",
      t2sql: "bg-purple-100 text-purple-800",
      e2e: "bg-orange-100 text-orange-800"
    };
    return colorMap[module as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <SEO title="智能体配置" description="配置和管理AI智能体的API接入和参数设置" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">智能体配置</h1>
        <p className="text-muted-foreground">配置 GPT、BERT 等智能体模型的 API 接入和参数设置</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <Badge className={`text-xs mt-1 ${getModuleColor(agent.module)}`}>
                      {getModuleDisplayName(agent.module)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>版本：{agent.version}</span>
                </div>
                
                {agent.model_name && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bot className="w-4 h-4" />
                    <span>模型：{agent.model_name}</span>
                  </div>
                )}
                
                {agent.code_commit && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GitCommit className="w-4 h-4" />
                    <span>提交：{agent.code_commit.slice(0, 8)}</span>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={() => handleEditClick(agent)}
              >
                <Edit className="w-4 h-4 mr-2" />
                编辑配置
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AgentEditDialog
        agent={editingAgent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
