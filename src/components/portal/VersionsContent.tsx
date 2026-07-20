import { GitBranch, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { versions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function VersionsContent() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden sm:block" />
      <div className="space-y-5">
        {versions.map((v) => (
          <div key={v.version} className="sm:pl-12 relative">
            <div className="hidden sm:grid absolute left-0 top-4 h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
              <GitBranch className="h-4 w-4" />
            </div>
            <Card className="p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-semibold">{v.version}</h4>
                    <Badge
                      className={cn(
                        "text-[10px]",
                        v.type === "Estável"
                          ? "bg-success/15 text-success hover:bg-success/15"
                          : "bg-warning/25 text-warning-foreground hover:bg-warning/25",
                      )}
                    >
                      {v.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{v.date}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {v.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
