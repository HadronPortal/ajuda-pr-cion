import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  GitBranch,
  KanbanSquare,
  Users,
  UserCircle,
  BarChart3,
  Plus,
  FileText,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { kbArticlesFull } from "@/lib/kb-data";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to: to as string });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar páginas, artigos, ações..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => go("/")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Início
          </CommandItem>
          <CommandItem onSelect={() => go("/base-de-conhecimento")}>
            <BookOpen className="mr-2 h-4 w-4" /> Base de Conhecimento
          </CommandItem>
          <CommandItem onSelect={() => go("/atualizacoes")}>
            <Sparkles className="mr-2 h-4 w-4" /> Atualizações
          </CommandItem>
          <CommandItem onSelect={() => go("/versoes")}>
            <GitBranch className="mr-2 h-4 w-4" /> Versões
          </CommandItem>
          <CommandItem onSelect={() => go("/kanban")}>
            <KanbanSquare className="mr-2 h-4 w-4" /> Kanban Prócion
          </CommandItem>
          <CommandItem onSelect={() => go("/kanban-dashboard")}>
            <BarChart3 className="mr-2 h-4 w-4" /> Dashboard do Kanban
          </CommandItem>
          <CommandItem onSelect={() => go("/clientes")}>
            <Users className="mr-2 h-4 w-4" /> Clientes
          </CommandItem>
          <CommandItem onSelect={() => go("/minha-conta")}>
            <UserCircle className="mr-2 h-4 w-4" /> Minha Conta
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ações rápidas">
          <CommandItem onSelect={() => go("/kanban")}>
            <Plus className="mr-2 h-4 w-4" /> Criar novo card
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/base-de-conhecimento")}>
            <FileText className="mr-2 h-4 w-4" /> Pesquisar artigos
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Artigos recentes">
          {kbArticlesFull.slice(0, 6).map((a) => (
            <CommandItem
              key={a.id}
              onSelect={() => go(`/base-de-conhecimento/${a.slug}`)}
            >
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="truncate">{a.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
