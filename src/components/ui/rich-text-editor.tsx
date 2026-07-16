import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
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
 * Dropdowns "Estilo" e "Tamanho" são renderizados em Portal (document.body)
 * para evitar recorte por overflow do modal e ficar acima do overlay.
 */

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

const STYLE_OPTIONS: { value: string; label: string }[] = [
  { value: "p", label: "Texto normal" },
  { value: "h1", label: "Título 1" },
  { value: "h2", label: "Título 2" },
  { value: "h3", label: "Título 3" },
  { value: "blockquote", label: "Citação" },
  { value: "pre", label: "Código" },
];

const SIZE_OPTIONS: number[] = [10, 12, 14, 16, 18, 20, 24, 28, 32];

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
  const savedRangeRef = useRef<Range | null>(null);
  const [, force] = useState(0);
  const [currentStyle, setCurrentStyle] = useState<string>("p");
  const [currentSize, setCurrentSize] = useState<number>(14);

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

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const editor = ref.current;
      if (editor && editor.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    if (!range) {
      ref.current?.focus();
      return;
    }
    ref.current?.focus();
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const runCmd = (command: string, val?: string) => {
    ref.current?.focus();
    exec(command, val);
    emit();
  };

  const insertHTML = (html: string) => {
    ref.current?.focus();
    exec("insertHTML", html);
    emit();
  };

  const applyBlockStyle = (tag: string) => {
    restoreSelection();
    exec("formatBlock", tag);
    setCurrentStyle(tag);
    emit();
  };

  const applyFontSize = (px: number) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) {
      // Insert a span placeholder for future typing
      const span = document.createElement("span");
      span.style.fontSize = `${px}px`;
      span.appendChild(document.createTextNode("\u200B"));
      range.insertNode(span);
      // Place caret inside span, after zero-width char
      const newRange = document.createRange();
      newRange.setStart(span.firstChild!, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      const contents = range.extractContents();
      const span = document.createElement("span");
      span.style.fontSize = `${px}px`;
      span.appendChild(contents);
      range.insertNode(span);
      // Select the inserted span contents
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
    setCurrentSize(px);
    emit();
  };

  // Track current block style / font size from caret
  const updateFromSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    if (!node) return;
    const editor = ref.current;
    if (!editor || !editor.contains(node)) return;
    let el: HTMLElement | null =
      node.nodeType === 1 ? (node as HTMLElement) : node.parentElement;
    // Block style
    let cursor = el;
    while (cursor && cursor !== editor) {
      const tag = cursor.tagName?.toLowerCase();
      if (tag && ["p", "h1", "h2", "h3", "blockquote", "pre"].includes(tag)) {
        setCurrentStyle(tag);
        break;
      }
      cursor = cursor.parentElement;
    }
    // Font size (rounded to nearest option)
    if (el) {
      const size = parseFloat(window.getComputedStyle(el).fontSize);
      if (!Number.isNaN(size)) {
        const rounded = SIZE_OPTIONS.reduce((prev, curr) =>
          Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev,
        );
        setCurrentSize(rounded);
      }
    }
  }, []);

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

  const isEmpty =
    !value || value === "<br>" || value.replace(/<[^>]*>/g, "").trim() === "";

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

        <PortalSelect
          label="Estilo"
          currentLabel={
            STYLE_OPTIONS.find((o) => o.value === currentStyle)?.label ?? "Estilo"
          }
          options={STYLE_OPTIONS.map((o) => ({ key: o.value, label: o.label }))}
          selectedKey={currentStyle}
          width={140}
          onBeforeOpen={saveSelection}
          onSelect={(key) => applyBlockStyle(key)}
        />

        <PortalSelect
          label="Tamanho"
          currentLabel={`${currentSize} px`}
          options={SIZE_OPTIONS.map((n) => ({ key: String(n), label: `${n} px` }))}
          selectedKey={String(currentSize)}
          width={96}
          onBeforeOpen={saveSelection}
          onSelect={(key) => applyFontSize(Number(key))}
        />

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
        <ToolbarBtn
          title="Lista com marcadores"
          onClick={() => runCmd("insertUnorderedList")}
        >
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
          onInput={() => {
            emit();
            updateFromSelection();
          }}
          onKeyUp={updateFromSelection}
          onMouseUp={updateFromSelection}
          onBlur={() => {
            saveSelection();
            emit();
          }}
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

/** Dropdown renderizado em portal com z-index alto, para não ser cortado pelo modal. */
function PortalSelect({
  label,
  currentLabel,
  options,
  selectedKey,
  width,
  onSelect,
  onBeforeOpen,
}: {
  label: string;
  currentLabel: string;
  options: { key: string; label: string }[];
  selectedKey: string;
  width: number;
  onSelect: (key: string) => void;
  onBeforeOpen?: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width,
  });

  useLayoutEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(width, rect.width),
    });
  }, [open, width]);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        btnRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        title={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-rich-text-menu="true"
        onMouseDown={(e) => {
          // Preserve editor selection
          e.preventDefault();
          e.stopPropagation();
          onBeforeOpen?.();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="ml-1 inline-flex h-7 cursor-pointer items-center gap-1 rounded border border-input bg-card px-2 text-[11.5px] text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        style={{ minWidth: width, pointerEvents: "auto" }}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            data-rich-text-menu="true"
            onMouseDown={(e) => {
              // Keep editor selection intact when clicking inside menu
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[2147483000] max-h-72 overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg"
            style={{
              top: pos.top,
              left: pos.left,
              minWidth: pos.width,
              pointerEvents: "auto",
            }}
          >
            {options.map((opt) => {
              const selected = opt.key === selectedKey;
              const handleSelect = (
                e: React.PointerEvent | React.MouseEvent,
              ) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(opt.key);
                setOpen(false);
              };
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  data-rich-text-menu="true"
                  onPointerDown={handleSelect}
                  onMouseDown={(e) => {
                    // Fallback for browsers dispatching mousedown without pointerdown
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 text-left text-[12.5px] transition hover:bg-accent hover:text-accent-foreground",
                    selected && "bg-accent/60 font-medium",
                  )}
                  style={{ pointerEvents: "auto" }}
                >
                  <span className="truncate">{opt.label}</span>
                  {selected && <Check className="h-3.5 w-3.5 opacity-70" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
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
