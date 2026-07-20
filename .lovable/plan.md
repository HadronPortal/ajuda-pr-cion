## Objetivo

Reorganizar a lógica de veículos/visitas: separar o agendamento da retirada do veículo. A retirada e devolução passam a acontecer no dia, através de uma nova página `/frota`, mantendo integração com o Calendário.

## Etapas

### 1. Modelo de dados (`src/lib/fleet-store.ts`)
Expandir o store existente para o novo schema alinhado a uma futura API:

- `vehicles`: id, model, plate, category, color, yearModel, currentMileage, fuelLevel, nextRevisionDate, nextRevisionMileage, status (`disponivel` | `em_uso` | `manutencao`), imageUrl.
- `vehicle_usages`: id, vehicleId, appointmentId, operatorId, client, destination, departureAt, expectedReturnAt, returnedAt, departureMileage, returnMileage, distanceTraveled, fuelAtDeparture, fuelAtReturn, status (`aguardando_retirada` | `em_deslocamento` | `devolvido` | `cancelado`), departureNotes, returnNotes, departurePhotos[], returnPhotos[], createdAt, updatedAt.

Funções: `listVehicles`, `useVehicles`, `useUsages`, `getUsageByAppointment`, `registerDeparture`, `registerReturn`, `cancelUsage`, hooks `useSyncExternalStore`. Ao registrar saída atualiza `vehicle.status = em_uso` e ajusta `currentMileage`; ao devolver volta para `disponivel`, grava KM final e horário.

### 2. Agendamento (`src/routes/calendario.tsx`)
- Remover completamente `VehiclePickerDialog` e o campo "Selecionar veículo" do `CreateEventDialog`.
- Manter os 4 tipos; renomear "Reunião PRC" → "Reunião na Prócion".
- Para `Visita presencial`: campos Cliente, Endereço/destino, Operador, Data, Horário inicial, Previsão de término, toggle `Deslocamento necessário` (Sim/Não).
- Ao salvar visita com deslocamento: cria também um `vehicle_usage` vinculado ao `appointmentId` com status `aguardando_retirada` (sem `vehicleId`); status do evento = `Aguardando retirada`. Sem deslocamento = `Agendado`.
- Agenda do dia (drawer): para visitas presenciais com deslocamento, mostrar botão contextual conforme status: `Retirar veículo` → placa/veículo → `Devolver veículo` → `Devolvido`. Botões abrem os mesmos modais da página Frota.

### 3. Nova rota `/frota` (`src/routes/frota.tsx`)
Layout `AppShell` com abas persistidas em URL (`?tab=`):

- **Saídas de hoje** — tabela com colunas: Horário, Operador, Cliente, Destino, Veículo, KM saída, Horário saída, Previsão retorno, Horário retorno, Status, Ações (`Retirar veículo` / `Devolver veículo` / `Devolvido`).
- **Veículos** — grid de cards (foto, modelo, placa, categoria, KM, combustível, revisão, status, operador atual, previsão de retorno). Filtros: Todos / Disponíveis / Em uso / Manutenção.
- **Em uso** — tabela: Veículo, Placa, Operador, Cliente/destino, Saída, KM saída, Previsão retorno, Tempo em utilização, ação `Devolver veículo`. Destacar atrasados.
- **Histórico** — tabela: Data, Veículo, Placa, Operador, Cliente/destino, Saída, Devolução, KM inicial/final/percorridos, Status, `Ver detalhes`. Painel lateral de filtros (Sheet) padrão Chamados/Clientes: Período, Veículo, Operador, Status, Cliente.

### 4. Menu lateral (`src/components/portal/AppSidebar.tsx`)
Adicionar item `Frota` com ícone sólido de carro (usar `Car` do lucide via mesma técnica de máscara já existente ou ícone direto para manter consistência). Rota `/frota`.

### 5. Modais compartilhados (`src/components/fleet/`)
Componentes reutilizados por `/frota` e Agenda do dia:

- `VehiclePickerModal.tsx` — carrossel visual da frota (foto, modelo, placa, categoria, cor, ano/modelo, KM, combustível, próxima revisão, disponibilidade). Desabilita indisponíveis. Ao selecionar, avança para `RegisterDepartureModal`.
- `RegisterDepartureModal.tsx` — Veículo, data/hora saída (agora), KM saída, combustível, operador, cliente/destino, previsão devolução, observações/avarias, anexar fotos. Botão `Confirmar retirada` → `registerDeparture`. Atualiza usage → `em_deslocamento`, veículo → `em_uso`.
- `ReturnVehicleModal.tsx` — data/hora devolução, KM final (validar ≥ saída), KM percorridos calculados, combustível restante, checklist (limpo/chaves/sem avarias/KM registrada), fotos, observações. Confirmar → veículo `disponivel`, usage `devolvido`, `returnedAt` = agora.

Todos os modais usam `DetailModalHeader`, fecham só por X/Cancelar, `preventOutsideClose`, `cursor-pointer`, suporte light/dark.

### 6. Regras gerais
- Nada de `alert`/`confirm`/`prompt`; usar `sonner`.
- Toast de confirmação em cada ação.
- Reutilizar `getFleetUsageSnapshot`/hooks para sincronizar Frota + Calendário em tempo real via `useSyncExternalStore`.
- Preservar padrão visual/tipográfico atual.

## Detalhes técnicos

- **Store**: manter API interna; migrar `FleetUsage` para o novo schema (renomear campos, adicionar `client`, `departureNotes`, `returnNotes`, `departurePhotos`, `returnPhotos`). Adicionar coleção `vehicles` extraída de `FLEET_VEHICLES` que hoje vive em `calendario.tsx`; mover para o store para reuso.
- **Fotos**: armazenadas como `blob:` URLs via `URL.createObjectURL` (mock, sem upload real).
- **Cálculo tempo em uso**: `Date.now() - departureAt`; destacar se > `expectedReturnAt`.
- **Filtros histórico**: mesmo padrão de `Sheet` + chips já usados em `chamados`/`clientes`/`calendario`.
- **Rota**: `src/routes/frota.tsx` → `createFileRoute("/frota")` com `validateSearch` para `tab`.
- **Ícone menu**: usar `Car` do lucide diretamente como `NavIcon` (o tipo já aceita `ComponentType`), evitando dependência de novo asset PNG.

## Arquivos afetados

- `src/lib/fleet-store.ts` (refatorar/expandir)
- `src/routes/frota.tsx` (novo)
- `src/routes/calendario.tsx` (remover picker, novos campos visita, ações contextuais na agenda)
- `src/components/fleet/VehiclePickerModal.tsx` (novo)
- `src/components/fleet/RegisterDepartureModal.tsx` (novo)
- `src/components/fleet/ReturnVehicleModal.tsx` (novo)
- `src/components/fleet/HistoryFiltersSheet.tsx` (novo)
- `src/components/portal/AppSidebar.tsx` (item Frota)
