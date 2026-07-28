update public.mob_dispositivos
set
  active = status = '1',
  updated_at = now()
where active is distinct from (status = '1');
