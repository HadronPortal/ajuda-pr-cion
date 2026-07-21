import { useEffect, useMemo, useState } from "react";
import { Building2, Search, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  addWorkspaceMember,
  createKanbanWorkspace,
  listAvailableMembers,
  listWorkspaceMembers,
  removeWorkspaceMember,
  updateKanbanWorkspace,
  updateWorkspaceMemberRole,
  type BoardMember,
  type WorkspaceSummary,
} from "@/lib/kanban-api";

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  member: "Membro",
  guest: "Convidado",
};

export function WorkspaceModal({
  open,
  onOpenChange,
  workspace,
  initialTab = "settings",
  onChanged,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: WorkspaceSummary | null;
  initialTab?: "settings" | "members";
  onChanged: () => void;
}) {
  const [tab, setTab] = useState(initialTab);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [available, setAvailable] = useState<BoardMember[]>([]);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTab(initialTab);
    setName(workspace?.name ?? "");
    setDescription(workspace?.description ?? "");
    setVisibility(workspace?.visibility ?? "private");
    if (!workspace) return;
    Promise.all([
      listWorkspaceMembers({ data: { workspaceId: workspace.id } }),
      listAvailableMembers(),
    ]).then(([memberResult, availableResult]) => {
      setMembers(memberResult.members ?? []);
      setAvailable(availableResult.members ?? []);
    }).catch(() => toast.error("Não foi possível carregar os membros."));
  }, [initialTab, open, workspace]);

  const candidates = useMemo(() => {
    const ids = new Set(members.map((member) => member.id));
    const normalized = query.trim().toLowerCase();
    return available.filter((member) => {
      if (ids.has(member.id)) return false;
      return !normalized || `${member.name} ${member.operator ?? ""} ${member.email ?? ""}`.toLowerCase().includes(normalized);
    }).slice(0, 6);
  }, [available, members, query]);

  const save = async () => {
    if (!name.trim()) return toast.error("Informe o nome da área de trabalho.");
    setSaving(true);
    try {
      if (workspace) {
        await updateKanbanWorkspace({ data: { id: workspace.id, name: name.trim(), description: description.trim(), visibility } });
        toast.success("Área de trabalho atualizada.");
      } else {
        await createKanbanWorkspace({ data: { name: name.trim(), description: description.trim(), visibility } });
        toast.success("Área de trabalho criada.");
      }
      onChanged();
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível salvar a área de trabalho.");
    } finally {
      setSaving(false);
    }
  };

  const addMember = async (member: BoardMember) => {
    if (!workspace) return;
    try {
      await addWorkspaceMember({ data: { workspaceId: workspace.id, profileId: member.id, role: "member" } });
      setMembers((current) => [...current, { ...member, role: "member" }]);
      toast.success("Membro adicionado.");
      onChanged();
    } catch {
      toast.error("Não foi possível adicionar o membro.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl" onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            <Building2 className="h-5 w-5 text-primary" />
            {workspace ? workspace.name : "Criar área de trabalho"}
          </DialogTitle>
          <DialogDescription>Organize quadros, pessoas e permissões em um único espaço.</DialogDescription>
        </DialogHeader>

        <Tabs value={workspace ? tab : "settings"} onValueChange={(value) => setTab(value as typeof tab)}>
          {workspace && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="settings" className="cursor-pointer">Configurações</TabsTrigger>
              <TabsTrigger value="members" className="cursor-pointer">Membros</TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="space-y-2"><Label htmlFor="workspace-name">Nome</Label><Input id="workspace-name" value={name} onChange={(event) => setName(event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="workspace-description">Descrição</Label><Textarea id="workspace-description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></div>
            <div className="space-y-2">
              <Label>Visibilidade</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="cursor-pointer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="private" className="cursor-pointer">Privada</SelectItem>
                  <SelectItem value="company" className="cursor-pointer">Toda a empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          {workspace && (
            <TabsContent value="members" className="mt-4 space-y-4">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar pessoa para adicionar" className="pl-9" /></div>
              {query && candidates.length > 0 && <div className="rounded-md border p-2">{candidates.map((member) => <button key={member.id} type="button" onClick={() => void addMember(member)} className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/5"><span><span className="block text-sm">{member.name}</span><span className="text-xs text-slate-500">{member.operator ?? member.email}</span></span><UserPlus className="h-4 w-4 text-primary" /></button>)}</div>}
              <div className="space-y-2">
                {members.length === 0 && <p className="rounded-md border border-dashed p-5 text-center text-sm text-slate-500">Nenhum membro adicionado.</p>}
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 rounded-md border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm">{member.name}</p><p className="truncate text-xs text-slate-500">{member.operator ?? member.email}</p></div>
                    <Select value={member.role ?? "member"} onValueChange={async (role) => { await updateWorkspaceMemberRole({ data: { workspaceId: workspace.id, profileId: member.id, role: role as "admin" | "member" | "guest" } }); setMembers((current) => current.map((item) => item.id === member.id ? { ...item, role } : item)); onChanged(); }}>
                      <SelectTrigger className="w-36 cursor-pointer"><ShieldCheck className="mr-1 h-4 w-4" /><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(roleLabel).map(([value, label]) => <SelectItem key={value} value={value} className="cursor-pointer">{label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="cursor-pointer" onClick={async () => { await removeWorkspaceMember({ data: { workspaceId: workspace.id, profileId: member.id } }); setMembers((current) => current.filter((item) => item.id !== member.id)); onChanged(); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>Cancelar</Button>
          {(!workspace || tab === "settings") && <Button className="cursor-pointer" disabled={saving} onClick={() => void save()}>{saving ? "Salvando..." : workspace ? "Salvar" : "Criar área"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
