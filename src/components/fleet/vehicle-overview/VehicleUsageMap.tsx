import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
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

// Separate component for the map view logic that uses useMap
function ChangeView({ bounds }: { bounds: any }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
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
    // Import Leaflet only on client side
    import("leaflet").then((leaflet) => {
      const leafletLib = leaflet.default || leaflet;
      console.log('Leaflet loaded:', !!leafletLib);
      setL(leafletLib);
      
      // Fix icons
      delete (leafletLib.Icon.Default.prototype as any)._getIconUrl;
      leafletLib.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    });
  }, []);

  useEffect(() => {
    async function enrich() {
      setLoading(true);
      const results: UsageWithCoords[] = [];
      
      for (const usage of usages) {
        const client = getClientById(usage.client) as any;
        if (!client || (!client.address && !client.city)) continue;

        const address = `${client.address || ""}, ${client.city || ""} - ${client.state || ""}`;
        const res = await fetchCoords({ data: address });
        
        if (res.success) {
          results.push({
            ...usage,
            lat: res.lat,
            lng: res.lng,
            clientData: client
          });
        }
      }
      setEnrichedUsages(results);
      setLoading(false);
    }
    enrich();
  }, [usages, fetchCoords]);

  const groupedUsages = useMemo(() => {
    const groups: Record<string, UsageWithCoords[]> = {};
    enrichedUsages.forEach(u => {
      const key = `${u.lat},${u.lng}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(u);
    });
    return groups;
  }, [enrichedUsages]);

  const bounds = useMemo(() => {
    if (!L || enrichedUsages.length === 0) return null;
    const points = enrichedUsages.map(u => [u.lat!, u.lng!] as any);
    return L.latLngBounds(points);
  }, [enrichedUsages, L]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "devolvido": return "bg-emerald-500 text-white";
      case "em_deslocamento": return "bg-blue-500 text-white";
      case "cancelado": return "bg-red-500 text-white";
      default: return "bg-amber-500 text-white";
    }
  };

  if (!L) return null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border bg-background flex flex-col">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-muted/20">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mr-2">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtros:</span>
        </div>
        
        <Select value={filters.period} onValueChange={(v) => onFilterChange({ period: v })}>
          <SelectTrigger className="h-8 w-[110px] text-xs">
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
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos clientes</SelectItem>
            {allClients.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.operator} onValueChange={(v) => onFilterChange({ operator: v })}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Operador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos operadores</SelectItem>
            {allOperators.map(op => (
              <SelectItem key={op} value={op}>{op}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => onFilterChange({ status: v })}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {Object.entries(USAGE_STATUS_LABEL).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 relative">
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Carregando mapa...</div>}>
          {loading ? (
            <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-medium">Processando mapa...</p>
              </div>
            </div>
          ) : enrichedUsages.length === 0 ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <FilterX className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhuma localização disponível com os filtros atuais.
              </p>
            </div>
          ) : (
            <MapContainer 
              center={[-22.0175, -47.8908]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
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
                                <span className="truncate">{mainUsage.clientData?.address}</span>
                              </div>
                            </div>
                            {group.length > 1 && (
                              <Badge variant="secondary" className="h-5 text-[10px] shrink-0">
                                {group.length} visitas
                              </Badge>
                            )}
                          </div>

                          <div className="max-h-[200px] overflow-y-auto pr-1 space-y-3 py-2 border-t my-1">
                            {group.map((u, i) => (
                              <div key={u.id} className={cn("space-y-1.5", i > 0 && "pt-3 border-t")}>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className={cn("h-4 text-[8px] uppercase font-bold border-none", getStatusColor(u.status))}>
                                    {u.status}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {formatFleetDateTime(u.departureAt).split(',')[0]}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span>{formatFleetDateTime(u.departureAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <User className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span>{u.operatorId}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button asChild size="sm" variant="outline" className="h-8 text-[11px] w-full gap-2 mt-1">
                            <Link to="/clientes/$clienteId" params={{ clienteId: mainUsage.clientData?.id }}>
                              Detalhes do Cliente
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
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
        
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <div className="bg-background/90 backdrop-blur border rounded-md p-2 shadow-sm text-[10px] space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" /> <span>Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" /> <span>Em deslocamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" /> <span>Agendado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" /> <span>Cancelado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
