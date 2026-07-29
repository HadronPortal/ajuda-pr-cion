-- Reimporta colaboradores a partir do export tab_colaboradores.json (sem senhas/CPF/PIS)
alter table public.tab_colaboradores
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists full_name text,
  add column if not exists job_title text,
  add column if not exists operator_acronym text,
  add column if not exists operator_code text,
  add column if not exists terminated_at date;

create unique index if not exists tab_colaboradores_legacy_id_key on public.tab_colaboradores (legacy_id);

insert into public.tab_colaboradores
  (legacy_id, first_name, last_name, full_name, email, clb_departamento, job_title, operator_acronym, operator_code, active, terminated_at)
values
('1','Francisco','Santos','Francisco Santos','kiko@procion.com','admin','funcao','PRCKIKO','913',false,NULL),
('2','Peterson','Mariotto','Peterson Mariotto','peterson@procion.com','admin','funcao','PRCPET','903',true,NULL),
('3','Cristhians','Pazian','Cristhians Pazian','cristhians@procion.com','admin','funcao','PRCCRIS','906',true,NULL),
('6','Rafael','Ceschi','Rafael Ceschi','rafael@procion.com','commercial','funcao','PRCRAF','908',false,'2014-01-01'::date),
('9','Carlos Eduardo','Signini','Carlos Eduardo Signini','eduardo@procion.com','admin','funcao','PRCEDU','901',true,NULL),
('14','Victor','(Victor)','Victor (Victor)','supma10@hotmail.com','commercial',NULL,'PRCVIT','907',true,NULL),
('16','Helder','De Assis','Helder De Assis','helder@procion.com','development','Programador SENIOR','PRCHEL','910',false,NULL),
('20','Matheus','J de Ornellas','Matheus J de Ornellas','matheus@procion.com','admin','Gerente de Suporte','PRCMAT','914',false,NULL),
('25','Juliano','Calcia','Juliano Calcia','juliano@procion.com','development','funcao','PRCJUL','917',true,NULL),
('26','Pedro','Souza','Pedro Souza','pedro@procion.com','development','QA','PRCPED','916',true,NULL),
('28','Rogerio','De Mattos','Rogerio De Mattos','rogerio@procion.com','commercial','Suporte','PRCROG','929',true,NULL),
('33','Johne','Puerta','Johne Puerta','johne@procion.com','admin','funcao','PRCJOH','920',false,'2019-04-30'::date),
('34','tes-adm','adm','tes-adm adm','procion@procion.com','admin','funcao','TESADM','998',true,NULL),
('35','tes-sup','sup','tes-sup sup','procion@procion.com','support','funcao','TES-SUP','999',false,NULL),
('36','Teste do Desenvolvimento','Desenvolvedor','Teste do Desenvolvimento Desenvolvedor','webmaster@procion.com','development','funcao','TES-DES','0',false,NULL),
('37','Guilherme','Sansoni','Guilherme Sansoni','guilherme@procion.com','development',NULL,'PRCGUI','911',false,NULL),
('39','Silvia','Tiera','Silvia Tiera','silvia@procion.com','admin','funcao','PRCSIL','0',false,'2014-10-01'::date),
('40','Marcelo','de Oliveira','Marcelo de Oliveira','marcelo@procion.com','support','Tec apoio ao usuario','PRCMAR_OLD','0',false,'2013-11-29'::date),
('43','Etore','Signini','Etore Signini','etore@procion.com','support','CONTINUO','PRCETO','0',false,'1111-11-11'::date),
('45','Rafael P','Prenholato','Rafael P Prenholato','rafaelp@procion.com','support','Admin de Sistemas Operacionais','PRCPRE','923',false,'2011-12-19'::date),
('48','Sergio','Carlos Fonseca Junior','Sergio Carlos Fonseca Junior','sergio@procion.com','admin','Suporte','PRCSER','926',false,NULL),
('49','Ginaldo','Pereira Teixeira','Ginaldo Pereira Teixeira','ginaldo@procion.com','support','Tec de apoio ao usuario','PRCGIN','925',true,NULL),
('55','Felipe','Miessva Acerbi','Felipe Miessva Acerbi','felipe@procion.com','admin',NULL,'PRCFEL','0',false,NULL),
('57','tes-com',NULL,'tes-com','peterson@procion.com','commercial',NULL,'TES-COM','0',false,NULL),
('66','Matheus B','Vinicius Munhoz Bruno','Matheus B Vinicius Munhoz Bruno','matheusbruno@procion.com','development',NULL,'PRCMTZ','922',false,'2013-12-31'::date),
('67','Bruno','Signini','Bruno Signini','bruno@procion.com','support',NULL,'PRCBRU','0',false,NULL),
('68','Nayara','Amaral de Almeida','Nayara Amaral de Almeida','nayara@procion.com','support','Suporte','PRCNAY','0',false,'2014-11-10'::date),
('69','Rafael S','SÃ¡bado','Rafael S SÃ¡bado','rafaels@procion.com','support','Suporte','PRCSAB','0',false,'1111-11-11'::date),
('72','Tiago','Silva Correa','Tiago Silva Correa','tiago@procion.com','support','Suporte','PRCTIA',NULL,false,'2012-02-28'::date),
('81','Bruno Henrique','Staine','Bruno Henrique Staine','brunohenrique@procion.com','support','Técnico de Suporte','PRCBRN',NULL,false,NULL),
('82','FÃ¡bio','Mattiolli Raimundo','FÃ¡bio Mattiolli Raimundo','fabio@procion.com','commercial','Suporte','PRCFAB',NULL,false,'2013-05-03'::date),
('83','Comercial Simples',NULL,'Comercial Simples','tescob@procion.com','cob',NULL,'TES-COB',NULL,false,NULL),
('84','Leandro','Silva Azevedo','Leandro Silva Azevedo','leandro@procion.com','commercial','Aux Adm','PRCLEO',NULL,false,NULL),
('85','Gustavo Henrique','Bafume','Gustavo Henrique Bafume','gustavo@procion.com','commercial','Aux Administrativo','PRCGUS',NULL,false,'2014-11-26'::date),
('86','Diego','Gustavo da Silva Palombo','Diego Gustavo da Silva Palombo','diego@procion.com','support',NULL,'PRCDIE',NULL,false,'2014-09-09'::date),
('87','Suzana','Sarvo','Suzana Sarvo','suzana@procion.com','admin','Administrativo','PRCSUZ',NULL,true,NULL),
('88','Rodrigo','Pellegrini','Rodrigo Pellegrini','rodrigo@procion.com','development',NULL,'PRCROD',NULL,false,'2015-04-30'::date),
('89','Treinamento',NULL,'Treinamento','procion@procion.com','support','Suporte','PRCCPS',NULL,false,NULL),
('90','Laudemir','Jayme','Laudemir Jayme','jayme@procion.com','commercial','Vendedor','PRCJAY',NULL,false,'2016-08-01'::date),
('91','fabio','franzini','fabio franzini','fabio.franzini@procion.com','commercial','Gestor de Vendas','PRCFFA',NULL,false,'2018-09-10'::date),
('92','Melk','Lima','Melk Lima','melk@procion.com','tester','Suporte','PRCMEK',NULL,true,NULL),
('93','Rafael','A Callegari','Rafael A Callegari','rafael.callegari@procion.com','support','Suporte','PRCRAC',NULL,false,'2017-01-01'::date),
('94','Marcos Roberto','Musetti','Marcos Roberto Musetti','marcos@procion.com','admin','Testes','PRCMRM',NULL,false,'2016-01-02'::date),
('95','Mariana','Gouvea Alves de Campos','Mariana Gouvea Alves de Campos','mariana@procion.com','support','Suporte','PRCMAA',NULL,false,'2018-09-10'::date),
('96','Edson','Fernando Pederro','Edson Fernando Pederro','edson@procion.com','support','Suporte','PRCEDS',NULL,false,'2017-06-13'::date),
('97','Leonardo','Tavoni','Leonardo Tavoni','leonardo@procion.com','development','Suporte','PRCTAV',NULL,false,'2018-11-30'::date),
('105','William','Akihiro Alves Aisawa','William Akihiro Alves Aisawa','william@procion.com','development','Desenvolvedor','PRCWIL',NULL,false,'2017-12-31'::date),
('106','Fábio Rodrigues','Santos','Fábio Rodrigues Santos','fabio.rodrigues@procion.com','commercial','VENDEDOR','PRCFRS',NULL,false,NULL),
('107','Vendas Campinas',NULL,'Vendas Campinas','vendascps@procion.com','commercial','Aux Adm','PRCVEN',NULL,false,NULL),
('108','Wagner','Barnabé','Wagner Barnabé','wagner@procion.com','development','Programador','PRCWAG',NULL,true,NULL),
('109','Paulo','Wellichan','Paulo Wellichan','atendimentocps@procion.com','support','Suporte','PRCPRW','958',false,NULL),
('110','Anderson','Silva','Anderson Silva','anderson@procion.com','admin','Projetos','PRCAND',NULL,true,NULL),
('111','Treinamento',NULL,'Treinamento','procion@procion.com','support',NULL,'PRCTR1',NULL,true,NULL),
('112','Wilians','Marques Gomes','Wilians Marques Gomes','wilians@procion.com','development','PROGRAMADOR','PRCWLS',NULL,true,NULL),
('113','Rafael','Marcondes','Rafael Marcondes','rafael.marcondes@procion.com','support','Suporte','PRCRMA',NULL,false,NULL),
('114','Guilherme','Gonçalves','Guilherme Gonçalves','g.goncalves@procion.com','admin',NULL,'PRCGGC',NULL,true,NULL),
('115','Renan','Morasco','Renan Morasco','renan@procion.com','commercial',NULL,'PRCREN','912',true,NULL),
('116','Gabriel','Barnabé','Gabriel Barnabé','gabrielb@procion.com','development','Desenvolvedor','PRCGAB',NULL,true,NULL),
('117','Jackson Henrique','Perin','Jackson Henrique Perin','jackson@procion.com','support','Help Desk','PRCJAC','50',true,NULL),
('118','Guilherme Antônio','Coito','Guilherme Antônio Coito','guilherme.coito@procion.com.br','support',NULL,'PRCGLH','956',false,NULL),
('119','Marcelo','Lemos JR','Marcelo Lemos JR','marcelo@procion.com','support','SUPORTE','PRCMAR','951',true,NULL),
('120','Rafael A. Albieri','Bueno','Rafael A. Albieri Bueno','albieri@procion.com','support','TEC DE APOIO','PRCABI','32',false,NULL),
('121','Vitor Aielo Rodrigues','Azenha','Vitor Aielo Rodrigues Azenha','azenha@procion.com','support','TEC DE APOIO','PRCAZE','50',false,NULL),
('122','LUCAS','ZANTUT','LUCAS ZANTUT','LUCAS.ZANTUT@PROCION.COM','support','SUPORTE N1','PRCLCZ','961',true,NULL),
('123','VITOR TREVISAN','TREVISAN','VITOR TREVISAN TREVISAN','VITOR.TREVISAN@PROCION.COM','support','SUPORTE TEC N1','PRCTRE','962',true,NULL),
('124','Isaac','Gomes','Isaac Gomes','isaac@procion.com','support',NULL,'PRCISC','963',true,NULL),
('127','Aron','Soad','Aron Soad','aron@procion.com','development','Desenvolvedor Web','PRCARO','964',true,NULL)
on conflict (legacy_id) do update set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  full_name = excluded.full_name,
  email = coalesce(excluded.email, public.tab_colaboradores.email),
  clb_departamento = coalesce(excluded.clb_departamento, public.tab_colaboradores.clb_departamento),
  job_title = excluded.job_title,
  operator_acronym = excluded.operator_acronym,
  operator_code = excluded.operator_code,
  active = excluded.active,
  terminated_at = excluded.terminated_at,
  updated_at = now();

create or replace function public.list_colaboradores()
returns table (
  id uuid,
  legacy_id text,
  full_name text,
  first_name text,
  last_name text,
  email text,
  department text,
  job_title text,
  operator_acronym text,
  operator_code text,
  active boolean,
  terminated_at date
)
language sql
stable
security definer
set search_path = public
as $$
  select c.id, c.legacy_id, c.full_name, c.first_name, c.last_name, c.email,
         c.clb_departamento, c.job_title, c.operator_acronym, c.operator_code,
         c.active, c.terminated_at
  from public.tab_colaboradores c
  order by coalesce(c.full_name, c.email) asc
$$;

grant execute on function public.list_colaboradores() to anon, authenticated, service_role;
