import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Calendar, User, MapPin, FilterX, Filter } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatFleetDateTime, type VehicleUsage, USAGE_STATUS_LABEL } from "@/lib/fleet-store";
import { getClientById } from "@/lib/clients-store";
import { getCoordinates } from "@/lib/geocoding.functions";
import { useServerFn } from "@tanstack/react-start";
import { cn } from "@/lib/utils";
import { ClientOnly } from "@/components/ui/client-only";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Lazy load map components to avoid SSR issues
const MapContainer = lazy(() => import("react-leaflet").then(mod => ({ default: mod.MapContainer })));
const TileLayer = lazy(() => import("react-leaflet").then(mod => ({ default: mod.TileLayer })));
const Marker = lazy(() => import("react-leaflet").then(mod => ({ default: mod.Marker })));
const Popup = lazy(() => import("react-leaflet").then(mod => ({ default: mod.Popup })));
const MarkerClusterGroup = lazy(() => import("react-leaflet-cluster"));

interface UsageWithCoords extends VehicleUsage {
  lat?: number;
  lng?: number;
  clientData?: any;
  geocodingError?: boolean;
}

interface MapFilters {
  period: string;
  client: string;
  operator: string;
  status: string;
}

interface VehicleUsageMapProps {
  usages: VehicleUsage[];
  filters: MapFilters;
  onFilterChange: (filters: Partial<MapFilters>) => void;
  allOperators: string[];
  allClients: string[];
}

function ChangeView({ bounds }: { bounds: any }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export function VehicleUsageMap(props: VehicleUsageMapProps) {
  return (
    <ClientOnly fallback={
      <div className="flex h-full w-full items-center justify-center bg-muted/10 rounded-lg border">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    }>
      <VehicleUsageMapContent {...props} />
    </ClientOnly>
  );
}

function VehicleUsageMapContent({ 
  usages, 
  filters, 
  onFilterChange,
  allOperators,
  allClients
}: VehicleUsageMapProps) {
  const [enrichedUsages, setEnrichedUsages] = useState<UsageWithCoords[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchCoords = useServerFn(getCoordinates);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    import("leaflet").then((leaflet) => {
      const leafletLib = (leaflet as any).default || leaflet;
      setL(leafletLib);
      const iconDefault = leafletLib.Icon.Default;
      if (iconDefault) {
        delete (iconDefault.prototype as any)._getIconUrl;
        iconDefault.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
      }
    });
  }, []);

  useEffect(() => {
    let active = true;
    async function enrich() {
      setLoading(true);
      const results: UsageWithCoords[] = [];
      
      for (const usage of usages) {
        // Find client by ID or acronym as fallback
        const client = getClientById(usage.client) as any;
        
        if (!client) {
           results.push({ ...usage, geocodingError: true });
           continue;
        }

        // Normalizar endereço seguindo regras de negócio
        const parts = [
          client.logradouro,
          client.numero,
          client.bairro,
          client.cidade,
          client.uf?.toUpperCase(),
          client.cep?.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2"),
          "Brasil"
        ].filter(v => v && v !== "undefined" && v !== "null" && v.trim() !== "");
        
        const fullAddress = Array.from(new Set(parts)).join(", ");

        try {
          const res = await fetchCoords({ data: fullAddress });
          if (active) {
            if (res.success) {
              results.push({
                ...usage,
                lat: res.lat,
                lng: res.lng,
                clientData: client
              });
            } else {
              results.push({ ...usage, clientData: client, geocodingError: true });
            }
          }
        } catch (e) {
          if (active) results.push({ ...usage, clientData: client, geocodingError: true });
        }
      }
      if (active) {
        setEnrichedUsages(results);
        setLoading(false);
      }
    }
    enrich();
    return () => { active = false; };
  }, [usages, fetchCoords]);

  const groupedUsages = useMemo(() => {
    const groups: Record<string, UsageWithCoords[]> = {};
    enrichedUsages.forEach(u => {
      if (u.lat && u.lng) {
        const key = `${u.lat},${u.lng}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(u);
      }
    });
    return groups;
  }, [enrichedUsages]);

  const bounds = useMemo(() => {
    if (!L || enrichedUsages.length === 0) return null;
    const validPoints = enrichedUsages.filter(u => u.lat && u.lng).map(u => [u.lat!, u.lng!] as any);
    if (validPoints.length === 0) return null;
    return L.latLngBounds(validPoints);
  }, [enrichedUsages, L]);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "devolvido" || s === "concluido") return "bg-emerald-500 text-white";
    if (s === "em_deslocamento" || s === "em_uso") return "bg-blue-500 text-white";
    if (s === "cancelado") return "bg-red-500 text-white";
    return "bg-amber-500 text-white"; // agendado / aguardando_retirada
  };

  const isClient = typeof window !== 'undefined';
  if (!L || !isClient) return null;

  const hasNoLocations = enrichedUsages.length > 0 && enrichedUsages.every(u => !u.lat || !u.lng);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border bg-background flex flex-col">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-muted/20 z-[1001]">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mr-1 shrink-0">
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filtros:</span>
        </div>
        
        <Select value={filters.period} onValueChange={(v) => onFilterChange({ period: v })}>
          <SelectTrigger className="h-8 w-[110px] text-[11px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo histórico</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.client} onValueChange={(v) => onFilterChange({ client: v })}>
          <SelectTrigger className="h-8 w-[140px] text-[11px]">
            <SelectValue placeholder="Todos clientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos clientes</SelectItem>
            {allClients.map(c => (
              <SelectItem key={c} value={c} className="text-[11px] truncate max-w-[200px]">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.operator} onValueChange={(v) => onFilterChange({ operator: v })}>
          <SelectTrigger className="h-8 w-[130px] text-[11px]">
            <SelectValue placeholder="Todos operadores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos operadores</SelectItem>
            {allOperators.map(op => (
              <SelectItem key={op} value={op} className="text-[11px] truncate max-w-[200px]">{op}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => onFilterChange({ status: v })}>
          <SelectTrigger className="h-8 w-[120px] text-[11px]">
            <SelectValue placeholder="Todos status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="em_deslocamento">Em uso</SelectItem>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 relative">
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Carregando componentes...</div>}>
          {loading ? (
            <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-medium">Geocodificando endereços...</p>
              </div>
            </div>
          ) : enrichedUsages.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <FilterX className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhum resultado para os filtros selecionados.
              </p>
            </div>
          ) : hasNoLocations ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <MapPin className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhuma localização disponível no histórico deste veículo.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Os endereços dos clientes não puderam ser localizados no mapa.
              </p>
            </div>
          ) : (
            <MapContainer 
              center={[-22.0175, -47.8908]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="dark:invert dark:grayscale dark:contrast-125 dark:brightness-75"
              />
              
              <MarkerClusterGroup chunkedLoading>
                {Object.entries(groupedUsages).map(([coords, group]) => {
                  const [lat, lng] = coords.split(',').map(Number);
                  const mainUsage = group[0];
                  return (
                    <Marker key={coords} position={[lat, lng]}>
                      <Popup className="usage-popup">
                        <div className="w-64 flex flex-col gap-2 p-1 text-foreground">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 mr-2">
                              <h4 className="font-bold text-sm leading-tight truncate">
                                {mainUsage.clientData?.acronym} - {mainUsage.clientData?.fantasia || mainUsage.clientData?.name}
                              </h4>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {mainUsage.clientData?.address || mainUsage.clientData?.logradouro}, {mainUsage.clientData?.city || mainUsage.clientData?.cidade}
                                </span>
                              </div>
                            </div>
                            {group.length > 1 && (
                              <Badge variant="secondary" className="h-5 text-[10px] shrink-0">
                                {group.length} visitas
                              </Badge>
                            )}
                          </div>

                          <div className="max-h-[200px] overflow-y-auto pr-1 space-y-3 py-2 border-t my-1 custom-scrollbar">
                            {group.map((u, i) => (
                              <div key={u.id} className={cn("space-y-1.5", i > 0 && "pt-3 border-t")}>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className={cn("h-4 text-[8px] uppercase font-bold border-none", getStatusColor(u.status))}>
                                    {USAGE_STATUS_LABEL[u.status] || u.status}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {formatFleetDateTime(u.departureAt || u.scheduledStartAt).split(',')[0]}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span>{formatFleetDateTime(u.departureAt || u.scheduledStartAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <User className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span>{u.operatorId}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {mainUsage.clientData?.id && (
                            <Button asChild size="sm" variant="outline" className="h-8 text-[11px] w-full gap-2 mt-1">
                              <Link to="/clientes/$clienteId" params={{ clienteId: mainUsage.clientData.id }}>
                                Detalhes do Cliente
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MarkerClusterGroup>
              
              <ChangeView bounds={bounds} />
            </MapContainer>
          )}
        </Suspense>
        
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none sm:pointer-events-auto">
          <div className="bg-background/90 backdrop-blur border rounded-md p-2 shadow-sm text-[10px] space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" /> <span>Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" /> <span>Em uso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" /> <span>Agendado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" /> <span>Cancelado</span>
            </div>
          </div>
        </div>

        {enrichedUsages.some(u => u.geocodingError) && (
          <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="destructive" className="flex gap-1 items-center cursor-help">
                    <AlertTriangle className="h-3 w-3" />
                    Endereços não localizados
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[11px]">Alguns registros possuem endereços inválidos ou não encontrados.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}

const AlertTriangle = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);
