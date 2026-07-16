import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editor Rich Text leve baseado em contentEditable + document.execCommand.
 * Não abre modais externos: comandos são aplicados diretamente sobre a seleção.
 * O valor é armazenado como HTML (string). Para exibição posterior, renderize
 * o HTML com dangerouslySetInnerHTML dentro de um container estilizado.
 */

type Cmd = {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  run: (editor: HTMLDivElement) => void;
  active?: () => boolean;
};

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  editorClassName,
  minHeight = 160,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);

  // Only sync when external value differs (avoids caret reset while typing).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    onChange(el.innerHTML);
    force((n) => n + 1);
  }, [onChange]);

  const focusEditor = () => ref.current?.focus();

  const runCmd = (command: string, val?: string) => {
    focusEditor();
    exec(command, val);
    emit();
  };

  const insertHTML = (html: string) => {
    focusEditor();
    exec("insertHTML", html);
    emit();
  };

  const handleLink = () => {
    const url = window.prompt("URL do link:", "https://");
    if (!url) return;
    runCmd("createLink", url);
  };

  const handleImage = () => {
    const url = window.prompt("URL da imagem:", "https://");
    if (!url) return;
    insertHTML(
      `<img src="${url}" alt="" style="max-width:100%;height:auto;border-radius:6px;" />`,
    );
  };

  const handleTable = () => {
    const rows = 3;
    const cols = 3;
    let html = '<table class="rte-table"><tbody>';
    for (let r = 0; r < rows; r += 1) {
      html += "<tr>";
      for (let c = 0; c < cols; c += 1) {
        html += "<td>&nbsp;</td>";
      }
      html += "</tr>";
    }
    html += "</tbody></table><p><br/></p>";
    insertHTML(html);
  };

  const isEmpty = !value || value === "<br>" || value.replace(/<[^>]*>/g, "").trim() === "";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5 dark:bg-white/[0.03]">
        <ToolbarBtn title="Desfazer" onClick={() => runCmd("undo")}>
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Refazer" onClick={() => runCmd("redo")}>
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <Sep />

        <select
          title="Estilo do bloco"
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            runCmd("formatBlock", v);
            e.currentTarget.value = "";
          }}
          className="h-7 cursor-pointer rounded border border-input bg-card px-1.5 text-[11.5px] text-foreground outline-none hover:bg-accent"
          defaultValue=""
        >
          <option value="" disabled>
            Estilo
          </option>
          <option value="p">Texto normal</option>
          <option value="h1">Título 1</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
        </select>

        <select
          title="Tamanho da fonte"
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            runCmd("fontSize", v);
            e.currentTarget.value = "";
          }}
          className="ml-1 h-7 cursor-pointer rounded border border-input bg-card px-1.5 text-[11.5px] text-foreground outline-none hover:bg-accent"
          defaultValue=""
        >
          <option value="" disabled>
            Tamanho
          </option>
          <option value="1">Muito pequeno</option>
          <option value="2">Pequeno</option>
          <option value="3">Normal</option>
          <option value="4">Médio</option>
          <option value="5">Grande</option>
          <option value="6">Muito grande</option>
          <option value="7">Enorme</option>
        </select>

        <Sep />
        <ToolbarBtn title="Negrito" onClick={() => runCmd("bold")}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Itálico" onClick={() => runCmd("italic")}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Tachado" onClick={() => runCmd("strikeThrough")}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <Sep />
        <ToolbarBtn title="Alinhar à esquerda" onClick={() => runCmd("justifyLeft")}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Centralizar" onClick={() => runCmd("justifyCenter")}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Alinhar à direita" onClick={() => runCmd("justifyRight")}>
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Justificar" onClick={() => runCmd("justifyFull")}>
          <AlignJustify className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <Sep />
        <ToolbarBtn title="Lista numerada" onClick={() => runCmd("insertOrderedList")}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Lista com marcadores" onClick={() => runCmd("insertUnorderedList")}>
          <List className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Citação" onClick={() => runCmd("formatBlock", "blockquote")}>
          <Quote className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <Sep />
        <ToolbarBtn title="Inserir link" onClick={handleLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Inserir imagem" onClick={handleImage}>
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Inserir tabela" onClick={handleTable}>
          <TableIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </div>

      <div className="relative">
        {isEmpty && placeholder && (
          <div className="pointer-events-none absolute left-3 top-3 text-[13px] text-muted-foreground">
            {placeholder}
          </div>
        )}
        <div
          ref={ref}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          className={cn(
            "rte-content w-full resize-y overflow-auto bg-card p-3 text-[13px] leading-relaxed text-foreground outline-none",
            editorClassName,
          )}
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}

function ToolbarBtn({
  onClick,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="grid h-7 w-7 cursor-pointer place-items-center rounded text-foreground/80 transition hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span aria-hidden className="mx-1 h-4 w-px bg-border" />;
}

/** Container para exibição segura do HTML gerado (histórico/timeline). */
export function RichTextView({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn("rte-content text-[13px] leading-relaxed text-foreground", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function isHtmlString(s: string) {
  return /<[a-z][\s\S]*>/i.test(s);
}
