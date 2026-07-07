import type { KbArticle } from "./kb-data";

export const importedKbArticles = [
  {
    "id": "AP-162",
    "slug": "nota_fiscal_de_devolucao_de_venda_entrada_origem_e_commerce_hadron_web",
    "title": "Nota Fiscal de Devolução de Venda (Entrada) - Origem e-commerce - Hádron Web",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "vendas"
    ],
    "updatedAt": "2023-01-23",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa dar orientações sobre procedimentos a serem realizados no processo de emissão de nota fiscal de devolução (entrada) , para vendas feitas via e-commerce alinhado a plataforma Hádron Web.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/162/nota_fiscal_de_devolucao_de_venda_entrada_origem_e_commerce_hadron_web",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa dar orientações sobre procedimentos a serem realizados no processo de emissão de nota fiscal de devolução (entrada) , para vendas feitas via e-commerce alinhado a plataforma Hádron Web."
      },
      {
        "type": "h3",
        "text": "Plataforma Hádron Web - Visualização da numeração do pedido de venda e chave Nfe"
      },
      {
        "type": "p",
        "text": "Acessar a plataforma Hádron Web do cliente 'Menu Principal - Vendas' , serão exibidos na página todos pedidos criados com seus diferentes status:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/FOTO-1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Através do campo de filtro em tela selecionar pedidos pelo status 'Pedido Cancelado' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/FOTO-2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Listados os pedidos com status 'Pedido Cancelado' , ir em seu detalhamento e selecionar a opção 'Visualizar' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/FOTO-3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Acima no canto superior esquerdo da tela poderá ser visto a numeração do pedido que deu origem a venda cancelada, esse número deverá ser utilizado como base para efetuar a emissão da nota fiscal de devolução do produto (entrada) via opção '2131 - Cadastro de Pedidos' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/FOTO-4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Clicar em 'Nota Fiscal: Visualizar XML' para visualizar e copiar a numeração da chave NFe, essa chave deverá ser referenciada na nota fiscal de devolução de entrada de mercadorias."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/FOTO-5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/FOTO%206.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Cadastro de pedido e emissão de nota fiscal de devolução de venda (entrada) via 'Hádron ERP - 2131 - Cadastro de Pedidos'"
      },
      {
        "type": "p",
        "text": "Identificado a numeração do pedido e chave NFe na plataforma 'Hádron Web' , acessar o programa '2131 - Cadastro de Pedidos' modo 'Inclusão' , inserir o número do pedido e pressionar a tecla 'F4' , será feito uma cópia do pedido com todas suas informações (Terceiros/Produtos/Valores/Impostos, etc..) ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/2131_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito a cópia do pedido, trocar o código da transação de 'Venda' para um código de 'Devolução de Venda (Entrada)' previamente cadastrado na opção '2113 - Transações' , a transação deve possuir o código CFOP correspondente para a operação (consultar contador responsável), a característica '61 - Devolução (Entrada)' e o 'Tipo Venda - VD - Devolução de Venda' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/2131_2_Transac.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de cadastro de transação de 'Devolução de Venda (Entrada)' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/2113_Model_Transac.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em '2131 - Cadastro de Pedidos - Aba 'Notas Referenciadas' deverá ser incluso a numeração da chave NFe referente a nota fiscal de venda emitida para a(s) mercadoria(s) que está sendo devolvida pelo cliente, sem essa informação a nota fiscal será rejeitada na validação das informações pela Sefaz. Deve - se também utilizar uma condição de pagamento que não gere nenhuma informação ou pendência financeira para o terceiro envolvido."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Venda%20(Entrada)%20-%20Origem%20e-commerce/2131_3_Referenc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " "
      }
    ]
  },
  {
    "id": "AP-161",
    "slug": "cadastro_de_centro_de_custos_de_producao_vinculo_composicao_x_centro_de_custos_valorizacao_da_producao_",
    "title": "Cadastro de Centro de Custos de Produção - Vínculo Composição x Centro de Custos (Valorização da Produção)",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque",
      "producao"
    ],
    "updatedAt": "2022-11-21",
    "readTime": "7 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo abaixo visa dar orientações referente ao cadastro de Centro de Custo de Produção, seu funcionamento e aplicação na valorização da produção no Sistema Hádron.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/161/cadastro_de_centro_de_custos_de_producao_vinculo_composicao_x_centro_de_custos_valorizacao_da_producao_",
    "content": [
      {
        "type": "p",
        "text": "O artigo abaixo visa dar orientações referente ao cadastro de Centro de Custo de Produção, seu funcionamento e aplicação na valorização da produção no Sistema Hádron."
      },
      {
        "type": "h3",
        "text": "Definição de Centro de Custos:"
      },
      {
        "type": "p",
        "text": "Centro de custos é uma separação interna a uma empresa ou organização para rateio de despesas e receitas, essas unidades são usadas para associar custos e pagamentos arrecadados a projetos, departamentos ou filiais de uma empresa, seu agrupamento permite conhecer o impacto de cada segmento dentro da empresa, para tomada de decisões com base em dados financeiros."
      },
      {
        "type": "p",
        "text": "5211 - Cadastro de Centro de Custo de Produção - Através desse programa será possível realizar o cadastro das contas pertencentes ao Centro de Custos, não há um modelo específico visto que cada empresa ou organização possui suas próprias características, porém, em termos gerais é necessário identificar, especificar e categorizar as depesas que integram e compõem o custo de todo o processo."
      },
      {
        "type": "p",
        "text": "Cadastro de Contas Sintéticas -  Um centro de custos 'Sintético' pode ser o centro mãe de vários centros de custos analíticos, e de vários centros sintéticos, criando-se uma hierarquia de centros de custos, denominada 'Plano de Centros de Custos' , sua função é agrupar custos nos relatórios de valorização da produção."
      },
      {
        "type": "h3",
        "text": "Exemplo abaixo de um conta tipo 'Sintética' num 'Plano de Centros de Custos' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5211_CC_P_Sint%C3%A9tica.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Cadastro de Contas Analíticas -  Um centro custos  'Analítico' são contas de ultimo nível e são utilizadas para alocar os custos de forma separada, abaixo um exemplo de conta tipo 'Analítica' num 'Plano de Centros de Custos' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5211_CC_P_Analitica.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de 'Plano de Centros de Custos' contendo contas 'Sintéticas' e 'Analíticas' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/Exemplo_CC_Produc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5211 - Cadastro de Centro de Custo de Produção - Funcionalidade dos campos:"
      },
      {
        "type": "p",
        "text": "Código - Centro de Custo Prod -  Número da conta (Sintética/Analítica) no 'Plano de Centro de Custos' , essa numeração será dada pelo próprio operador obedecendo sua hierarquia e função;"
      },
      {
        "type": "h3",
        "text": "Descrição -  Breve descritivo da conta, essa descrição será utilizada para buscas e exibição em relatórios;"
      },
      {
        "type": "p",
        "text": "Tipo -  Ao inserir a codificação da conta é possível definir seu tipo (Sintética/Analítica) , porém, conforme o 'Plano de Centro de Custos' é construído, o sistema automaticamente identifica seu nível e hierarquia e não permite sua alteração;"
      },
      {
        "type": "p",
        "text": "Grupo Exclusivo para Lançamentos de Custo a Ratear? - Para habilitar o checkbox obrigatoriamente a conta não deve possuir níveis abaixo dela em sua inclusão, pois, essa condição será herdada pelas contas que serão posteriormente cadastradas em seu grupo. Ao utilizar o grupo exclusivo os valores lançados serão rateados em todos os níveis do centro de custo pertecente ao esse grupo de contas;"
      },
      {
        "type": "p",
        "text": "Permite Lançamentos para serem rateados na Produção? -  Ao marcar o checkbox a conta é habilitada a realizar/receber lançamentos de valores no 'Plano Centro de Custos da Produção' pela opção '5242 - Custos Complementares de Produção',  dessa forma o valor do lançamento será incluso na conta 'C.C. Produção' e rateado por todas as ordens de produção que estiverem vinculadas a mesma na valorização da produção;"
      },
      {
        "type": "p",
        "text": "Permite Vincular o rateio nos Itens produzidos nas O.P.s.? - Ao marcar o checkbox a conta é habilitada a ser utilizada na opção '5217 - Produto Acabado x Centro de Custo Produção' , ao se criar o vínculo de 'Conta C.C. Produção x Produto Acabado'  será feito o rateio do cálculo do custo do item produzido nas contas vinculadas no processo de encerramento da ordem de produção em conjunto com a opção '5410 - Valorização Contábil Estoque' ;"
      },
      {
        "type": "h3",
        "text": "Centro -  Campo criado para implementações futuras, faz referência ao 'Plano de Centro de Custos' criado no 'Módulo Financeiro' ;"
      },
      {
        "type": "p",
        "text": "Peso/Rateio -  Nele será definido o valor referente ao 'Peso/Rateio'  quando algum lançamento de custo for aplicado a conta, o campo funcionará com o fator em 'ponto percentual' , ou seja para '50%' inserir valor igual a '0,50' , para '100 %' valor igual a '1' , para '150 %' valor igual '1,50' e assim sucessivamente;"
      },
      {
        "type": "p",
        "text": "Seções de Produção - Faz referência ao cadastro de 'Seções' utilizado pela o antigo módulo de produção, campo não está mais em uso."
      },
      {
        "type": "p",
        "text": "5217 - Produto Acabado x Centro de Custo Produção - Uma vez que a conta 'C.C. Produção' foi cadastrada com a característica 'Permite Vincular o rateio nos Itens produzidos nas O.P.s.?' , ela estará habilitada a ser vinculada a um código de 'Produto Acabado' . Nessa condição o sistema entenderá que toda a valorização da produção referente a este item (Entrada e saída de materiais) está associado a(s) conta(s), acumulando valores que poderão posteriormente serem analisados em relatórios."
      },
      {
        "type": "p",
        "text": "O 'Produto Acabado' poderá estar associado a mais de um 'C.C. Produção' e o campo 'Fator Rateio' funcionará com o fator em 'ponto percentual' , ou seja para '50%' inserir valor igual a '0,50' , para '100 %' valor igual a '1' , para '150 %' valor igual '1,50' e assim sucessivamente."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5217_Vinc_Prod_Acab_CC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5242 - Custos Complementares de Produção - Nesse programa serão lançados todos os 'Custos Complementares' da produção, o valor poderá ser incluso na 'C.C. Produção' ou diretamente no código da 'Ordem de Produção' . Em ambos os casos, após a inclusão do registro, deve - se processar a opção '5410 - Valorização Contábil Estoque' para que este valor seja contabilizado na produção."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5242_CC_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Abaixo segue a lista de relatórios que serão utilizados para o acompanhamento dos custos na valorização da produção. Anterior a emissão dos relatórios processar sempre a opção '5410 - Valorização Contábil Estoque' ."
      },
      {
        "type": "p",
        "text": "5445 - Centro de Custo Produção:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5445_CC_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5445_CC_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5446 - Valorização da Produção:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5446_CC_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5420 - Kardex:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Centro%20de%20Custos%20de%20Produ%C3%A7%C3%A3o/5420_CC_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Pontos Importantes para uma correta valorização da produção:"
      },
      {
        "type": "p",
        "text": "- Estoque do mês anterior ao 'Mês/Ano' base vigente corretamente fechado no Sistema Hádron;"
      },
      {
        "type": "p",
        "text": "- TODOS os produtos tipo 'MP - Matéria Prima' que compõem o item tipo 'PA - Produto Acabado', deverão possuir movimento de estoque valorizado referente a 'Entrada' desse material via '5121 - Cadastro de Entradas' ou '3212 - Cadastro de Documentos  de Entrada'. Dessa forma o item possuirá valor existente em '1232 - Cadastro de Produtos' tabela 'Custo Inventário 2 (D)', que será utilizada para compor o valor do produto 'PA - Produto Acabado' exibida na tabela 'Custo Inventário 1 (C)';"
      },
      {
        "type": "p",
        "text": "- TODOS os produtos tipo 'MP - Matéria Prima' deverão possuir saldo positivo e suficiente para atender a demanda de produção exigida, do contrário a valorização da produção não será feita, serão exibidos erros ao processar a opção '5410';"
      },
      {
        "type": "p",
        "text": "- Para implementar o novo 'Módulo Produção' não é necessariamente obrigatório a utilização de 'Centro de Custos Produção', é uma ferramenta existente que se bem aplicada conseguirá fornecer de forma organizada informações adicionais a todo o processo produtivo. O sistema de forma padrão automaticamente já calcula todo o custo do processo produtivo vinculado a ordem de produção e consequentemente ao item 'PA - Produto Acabado'."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      }
    ]
  },
  {
    "id": "AP-160",
    "slug": "emissao_de_recibo_de_carreteiro_desvinculado_a_folha_de_pagamento",
    "title": "Emissão de Recibo de Carreteiro Desvinculado a Folha de Pagamento",
    "category": "guia",
    "module": "Logística",
    "tags": [],
    "updatedAt": "2022-10-14",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Segue abaixo algumas considerações e parâmetros a serem feitos para realizar a emissão de 'Recibo a Carreteiro' desvinculado a 'Folha de Pagamento' e 'Módulo E-Social'  pelo sistema Hádron.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/160/emissao_de_recibo_de_carreteiro_desvinculado_a_folha_de_pagamento",
    "content": [
      {
        "type": "p",
        "text": "Segue abaixo algumas considerações e parâmetros a serem feitos para realizar a emissão de 'Recibo a Carreteiro' desvinculado a 'Folha de Pagamento' e 'Módulo E-Social'  pelo sistema Hádron."
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros Globais Sistema  - Aba - Contábil/Fiscal/Folha - Desmarcar o checkbox 'Vincula Trabalhador ao Terceiro ?' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/1111_Recib_Carreteir_N_Folha.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - SPED - Indicador da Natureza - Utilizar o valor '01 - Sociedade cooperativa'."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/1112_Recib_Carreteir_N_Folha.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1221 - Cadastro de Terceiros - Aba - Fiscal/Contábil - Utilizar o valor 'Sub - Tipo - C - Cooperado'  e apontar a quantidade de 'Número de Dependentes' para a finalidade de cálculo de IR."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/1221_Recib_Carreteir_N_Folha.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "E311 - Tabelas - Incluir tabelas de cálculo para o 'Mês/Ano' base referente a 'IRPF/INSS' , ao incluir o registro será feito o download automático da tabela diretamente da nuvem."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/E311_Recib_Carreteir_N_Folha.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7315 - Verbas do Recibo de Carreteiro - Criar verbas do tipo 'P - Provento' e 'Desconto' e vinculá - las as suas respectivas 'Rubricas' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/7315_New_Emiss_Carreteiro_N_Folha.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4371 - Cadastro de Contas Corrente - Vincular o terceiro cooperado (1221) a conta corrente, ao emitir o recibo de carreteiro será criado um processo de pagamento associado a esse registro (Terceiro x Conta Corrente) ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/4371_Terc_Rec_Carreteiro.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "E342 - Pagamento a Carreteiro - Nessa tela será emitido o recibo de carreteiro e criado o processo de pagamento vinculado ao cooperado."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/E342_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Recibo%20de%20Carreteiro%20Desvinculado%20a%20Folha%20de%20Pagamento/E342_2.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-159",
    "slug": "erro_rejeicao_na_emissao_nfe_crit_schema_ori_obj_erro_na_analise_do_xml__viola_a_restricao_pattern_de_0_9_44_",
    "title": "Erro - Rejeição na Emissão NFe - CRIT-SCHEMA-ORI-OBJ-Erro na Análise do XML: '' viola a restrição pattern de '[0-9]{44}'",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2022-09-13",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "A rejeição  'CRIT-SCHEMA-ORI-OBJ-Erro na Análise do XML: '' viola a restrição pattern de '[0-9]{44}' ao emitir a nota fisca eletrônica , deve - se ausência da chave NFe referenciada do produto em '2131 - Cadastro de Pedi",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/159/erro_rejeicao_na_emissao_nfe_crit_schema_ori_obj_erro_na_analise_do_xml__viola_a_restricao_pattern_de_0_9_44_",
    "content": [
      {
        "type": "p",
        "text": "A rejeição  'CRIT-SCHEMA-ORI-OBJ-Erro na Análise do XML: '' viola a restrição pattern de '[0-9]{44}' ao emitir a nota fisca eletrônica , deve - se ausência da chave NFe referenciada do produto em '2131 - Cadastro de Pedidos - Aba - Itens - Detalhamento Itens - Exportação Indireta' . Ao inserir a informação solicitada, a mesma será registrada na aba 'Notas Referenciadas' ."
      }
    ]
  },
  {
    "id": "AP-156",
    "slug": "calculo_custo_medio_sistema_hadron",
    "title": "Cálculo Custo Médio - Sistema Hádron",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2022-04-19",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo abaixo irá tratar sobre o cálculo do custo médio de produtos baseado na entrada de itens via 'Módulo Compras' , transferência entre estoques e manufatura de produtos acabados via 'Módulo Produção' , anterior a e",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/156/calculo_custo_medio_sistema_hadron",
    "content": [
      {
        "type": "p",
        "text": "O artigo abaixo irá tratar sobre o cálculo do custo médio de produtos baseado na entrada de itens via 'Módulo Compras' , transferência entre estoques e manufatura de produtos acabados via 'Módulo Produção' , anterior a este é recomendável ler os textos nos links abaixo."
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/153/novo_cadastro_de_composicao_de_produtos_5215_"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/155/novo_modulo_producao_processo_de_abertura_inicio_e_encerramento_de_ordem_de_producao_"
      },
      {
        "type": "p",
        "text": "O Sistema Hádron trabalhará com duas opções para o cálculo do custo médio de produtos via parâmetro, em '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção - Cálculo Custo Médio' escolher entre 'F - Média ponderada Fixa' (Valor Default) e 'M - Média ponderada Móvel' . "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/1111_Calc_Custo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "A  fórmula do custo médio ponderado  é:"
      },
      {
        "type": "h3",
        "text": "CMP = Valor total do estoque / Número de itens comprados e armazenados."
      },
      {
        "type": "h3",
        "text": "O custo médio pode ser dividido em duas vertentes:  custo médio ponderado móvel  e o  custo médio ponderado fixo ."
      },
      {
        "type": "p",
        "text": "Com o  método ponderado móvel , o estoque é avaliado, a cada entrada por custo diferente do custo médio anterior que altera esse custo médio, e cada saída, embora não altere o custo médio, altera o fator de ponderação. Com o controle de estoques pelo método da média ponderada fixa os materiais consumidos são baixados ao custo médio do final do mês ou período, onde o lançamento de baixa é feito unicamente no final do mês ou período avaliado."
      },
      {
        "type": "p",
        "text": "As entrada pelo Sistema Hádron serão realizadas via 'Módulo Compras' em '3212 - Cadastro de Documentos de Entrada' ou via 'Módulo Estoque' em '5121 - Cadastro de Entradas' . O cálculo do custo levará em consideração impostos (ICMS, ICMS - ST, IPI, FCP - ST)  e valores adicionais incidentes (Frete, Outras Despesas)  sobre o documento fiscal de entrada."
      },
      {
        "type": "h3",
        "text": "Lançamento de entrada de produto via '3212 - Cadastro de Documentos de Entrada' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/3212_Entrad_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/3212_Entrad_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Lançamento de entrada de produto via '5121 - Cadastro de Entradas' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5121_Entrad.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos - Aba - Preços -  Feito as entradas dos itens o último custo/valor de compra será exibido na aba 'Preços' nas tabelas 'Valor Última Compra (A)' , 'Custo Última Compra (B) e 'Custo Inventário 2 (D)' . Mediante o parâmetro em '1112 - Cadastro de Empresas - Aba - Fiscal - Direito ao Crédito do ICMS?' o valor apresentado na tabela 'Valor Última Compra (A)' poderá ser menor que o apresentado nas demais tabelas, pois, o valor do ICMS será subtraído de seu total."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/1232_Prec_Custos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Transferência entre 'Estoques' (Estoque Depósito): Utilizado o parâmetro '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção - Estoque Depósito'  e realizado uma transferência do estoque 'Principal' para o 'Depósito' , o custo médio referente a essa movimentação será alocado na tabela 'Custo Inventário 1 (C)'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/3212_Transferenc_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/3212_Transferenc_Est_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito o procedimento de transferência entre estoques (Principal/Depósito) , o valor do custo médio dessa movimentação ficará alocado na tabela  'Custo Inventário 1 (C)'. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/1232_Prec_Custos_Transferenc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5410 - Valorização Contábil Estoque / 5420 - Kardex  "
      },
      {
        "type": "h3",
        "text": "O que é kardex de estoque?"
      },
      {
        "type": "p",
        "text": "O  Kardex  é um registro de todas as movimentações de um determinado item, que permite realizar um controle de  estoque  mais detalhado, evidenciando o valor do  estoque  e o custo de cada item e indicando possíveis perdas e desvios de unidades. Porém, anterior a emissão desse importante relatório é necessário processar a opção '5410 - Valorização Contábil Estoque' , esse programa realiza todos os cálculos referente ao custo médio de produtos e produção de produto acabado item a item, valorizando o estoque dentro do período apurado/desejado. Para que o período de apuração seja alterado para o mês seguinte é necessário realizar seu 'Encerramento' em '5511 - Atualização de Arquivos de Estoque' ."
      },
      {
        "type": "h3",
        "text": "Opção '5410 - Valorização Contábil Estoque' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5410_Prime.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Opção  '5511 - Atualização de Arquivos de Estoque':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5511_Prime.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Opção '5420 - Kardex' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5420_kardex.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de relatório emitido:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5420_Rel_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5420_Rel_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Cálculo do Custo Médio de ' Produto Acabado' -   Esse custo médio é calculado com origem nos processos desenvolvidos no 'Módulo Produção' , após o cadastro da composição do produto acabado em '5215 - Cadastro de Composição de Produtos' e realizado as entradas dos itens pertencentes a mesma, deve - se executar os procedimentos de abertura, início e encerramento da ordem de produção para que o custo médio seja calculado e o valor agregado ao produto final."
      },
      {
        "type": "p",
        "text": "No Kardex abaixo mostra a movimentação de uma ordem de produção, repare que o valor final do 'Produto Acabado' foi a soma de todos os valores referente a saída dos produtos que o compõem."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5420_Kardex_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O valor do custo referente a produção do 'Produto Acabado' ficará na tabela 'Custo Inventário 1 (C)' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/1232_Prec_Prod_Acabad.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5211 - Cadastro de Centro de Custo de Produção - Nessa tela será possível formatar um cadastro de centros de custo exclusivo para lançamentos referente ao 'Módulo Produção' , conforme a configuração da conta cadastrada, os valores alocados poderão ou não compor (ratear) o custo do produto/ordem de produção."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5211_New.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5242 - Custos Complementares de Produção - Custos adicionais poderão ser vinculados a conta centro de custo de produção ou diretamente ao número da ordem de produção."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5242_New.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5446 - Centro de Custo de Produção - Valorização da Produção - Este programa emitirá um relatório de forma detalhada de todo o processo de custo, entrada e saída de valores até o valor final da ordem de produção/produto acabado. Anterior a emissão do relatório é necessário que o processo em '5410 - Valorização Contábil Estoque' seja executado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5446_Rel_New.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Exemplo de relatório após abertura e encerramento da ordem de produção mais lançamentos de custos adicionais no centro de custo produção."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20M%C3%A9dio_Sistema%20H%C3%A1dron/5446_Rel_Impress.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-155",
    "slug": "novo_modulo_producao_processo_de_abertura_inicio_e_encerramento_de_ordem_de_producao_",
    "title": "Novo Módulo Produção - Processo de Abertura, Início e Encerramento de Ordem de Produção",
    "category": "guia",
    "module": "ERP - Produção",
    "tags": [
      "producao"
    ],
    "updatedAt": "2022-04-13",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "https://ajuda.procion.com/artigo/guia/153/novo_cadastro_de_composicao_de_produtos_5215_",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/155/novo_modulo_producao_processo_de_abertura_inicio_e_encerramento_de_ordem_de_producao_",
    "content": [
      {
        "type": "h3",
        "text": "Anterior a leitura deste texto é recomendável ler o artigo no link abaixo que explica o cadastro de Composição de Produtos."
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/153/novo_cadastro_de_composicao_de_produtos_5215_"
      },
      {
        "type": "h3",
        "text": "Anterior a leitura deste texto é recomendável ler o artigo no link abaixo que explica o cadastro de Centro de Custo da Produção."
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/161/cadastro_de_centro_de_custos_de_producao_vinculo_composicao_x_centro_de_custos_valorizacao_da_producao_"
      },
      {
        "type": "p",
        "text": "O artigo abaixo dará orientações sobre a abertura, início e encerramento da ordem de produção no 'Novo Módulo Produção' . Habilitar o módulo em '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção - Ordens de Produção - 2 - Cálculo Produção por O.P' . Também deve - se criar em '5111 - Tipos de Estoque' estoques referente a 'Terceiros em nosso poder' , 'Separado Produção' e 'Produtos com Defeito'  e parametrizá - lo como mostra a figura abaixo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/1111_Param_Princip_Calc_Op_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5216 - Cadastro Cadastro de Defeitos - Caso exista a necessidade de realizar o controle, nesse programa é possível inclur uma lista de 'Defeitos' que poderão ser vinculados a produtos 'Não Conformes' nos apontamentos realizados em '5235 - Apontamento de Produto Acabado na Produção' e '5236 - Apontamento de Matéria - Prima na Produção' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5216_Cad_Defeito.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5222 - Planejamento da Produção - Nessa tela será cadastrado a ordem de produção, será possível inserir uma estimativa de término em dias baseado na quantidade principal a ser produzida, também é possível realizar uma rápida consulta do saldo referente aos itens matéria - prima após a escolha do 'Produto Acabado',  a variação do item deve ser apontada nesse momento caso exista."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5222_Manual_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Consulta de saldo de estoque dos itens pertecentes a composição do produto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/522E.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5223 - Listagem Planejamento da Produção X Estoque"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5223.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5223_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5231 - Entrada na Produção - Nessa tela será dado início de fato a produção, essa 'Entrada' poderá ser dada em partes que terão o nome de 'Sequência' , uma ordem de produção poderá ter várias entradas/sequências até que satisfaça o valor apontado em '5222 - Planejamento da Produção' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5231.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao pressionar o botão 'Confirma' será gerado um relatório referente a 'Entrada/Sequência' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5231_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O que acontece no estoque depois que são realizadas as 'Entradas/Sequências' ?"
      },
      {
        "type": "p",
        "text": "Cria - se movimentos referente aos itens matéria - prima no estoque parametrizado 'Separado Produção' , ou seja, esse material é reservado pelo sistema para que atenda a ordem de produção do 'Produto Acabado' já previsto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5131_Rel_2_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5236 - Apontamento de Matéria - Prima na Produção - Nessa tela será apontado o consumo/utilização da matéria - prima prevista para a entrada/sequência cadastrada, é possível fazer o apontamento de três formas: 'N - Normal' , 'D - Desmembrado em Lote, Nro. de Série ou Tipo de Estoque'  ou 'S - Substituir por outro Produto'."
      },
      {
        "type": "h3",
        "text": "Tipo 'N - Normal' , caso exista alguma 'Não Conformidade' é possível apontar o 'Código do Defeito' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5236_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Tipo  'D - Desmembrado em Lote, Nro. de Série ou Tipo de Estoque'  habilitará a grid para que sejam inseridas informações referente a 'Código do Lote' e 'Validade'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5236_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Tipo  'S - Substituir por outro Produto'  habilitará o campo 'Prod. Substituído' para que seja inserido o produto substituto caso exista necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5236_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5235 - Apontamento de Produto Acabado na Produção - Nessa tela serão apontadas as quantidades dos produtos acabados conforme previsão e entradas/sequências existentes."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5235.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs: A ordem dos processos '5235/5236' não precisa necessariamente seguir a do manual, o importante é que ambos sejam realizados anterior ao encerramento da ordem de produção."
      },
      {
        "type": "p",
        "text": "5232 - Acompanhamento de Ordens de Produção -  Este relatório apresenta todo o desenvolvimento da ordem de produção em detalhes, dividido por sequências exibe todos os apontamentos realizados (Matéria - Prima/Produto Acabado) , estoque atual e previsto restante, além de um acumulado ao final do relatório."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5232_Tela.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5232_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5232_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5232_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5238 - Encerramento da Ordem de Produção - Nessa tela conforme os apontamentos realizados nas opções '5235' e '5236' será feito o 'Encerramento' da Ordem de Produção, serão criados os movimentos de baixa da matéria - prima e entrada do 'Produto Acabado' em estoque. São três tipos de encerramentos possíveis, '6 - Encerrar Produção' , '3 - Suspender Produção' e '9 - Cancelar Produção' , nos dois últimos (3 e 9) , não serão gerados movimentos de estoque e o saldo reservado em 'Separado Produção' deverá ser ajustado posteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5238_Inic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5238_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5238_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Exemplo de relatório gerado após o 'Encerramento' realizado apontando a baixa de matéria - prima e entrada do produto acabado em estoque."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5238_Rel_Exemplo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Numa Ordem de Produção que tenha tido seu processo realizado de forma completa, o estoque 'Separado Produção' deverá sempre estar com seu saldo igual a zero no 'Encerramento' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5131_Encerr_Op.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5237 - Apontamentos Automáticos da O.P (Produto Acabado e Matéria - Prima) - Nessa tela serão feitos apontamentos automáticos da Ordem de Produção conforme o cadastro realizado nas opções  '5222' e '5231' , porém, existem duas condições para que o registro (Ordem de Produção) fique apto para o processo. A primeira é que o cadastro da composição (5215) contenha somente itens matéria - prima do tipo 'Forma Aferição - F - Fixa' , a outra é que nao tenha sido feito nenhum apontamento nas opções '5235' e '5236' , ou seja, serão criados os movimentos de baixa e entrada conforme cadastro da composição x planejamento da produção de forma simples e direta."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20M%C3%B3dulo%20Produ%C3%A7%C3%A3o/5237.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Cadastro de Centro de Custos de Produção - Vínculo Composição x Centro de Custos (Valorização da Produção)"
        ]
      }
    ]
  },
  {
    "id": "AP-153",
    "slug": "novo_cadastro_de_composicao_de_produtos_5215_",
    "title": "Novo Cadastro de Composição de Produtos (5215)",
    "category": "guia",
    "module": "ERP - Produção",
    "tags": [
      "producao"
    ],
    "updatedAt": "2022-03-29",
    "readTime": "7 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo fará uma apresentação ao novo cadastro de composição de produtos que será utilizado no 'Novo Módulo Produção'  e telas de vendas (7512 - Cadastro de Orçamentos/ 2131 - Cadastro de Pedidos) quando utilizado o par",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/153/novo_cadastro_de_composicao_de_produtos_5215_",
    "content": [
      {
        "type": "p",
        "text": "O artigo fará uma apresentação ao novo cadastro de composição de produtos que será utilizado no 'Novo Módulo Produção'  e telas de vendas (7512 - Cadastro de Orçamentos/ 2131 - Cadastro de Pedidos) quando utilizado o parâmetro  '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção - Ordens de Produção - 2 - Cálculo Produção por O.P' ."
      },
      {
        "type": "p",
        "text": "Para habilitar o 'Novo Módulo Produção' ir em '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção - Ordens de Produção - 2 - Cálculo Produção por O.P' , também deve - se criar em '5111 - Tipos de Estoque' o estoque referente a 'Terceiros em nosso poder' e parametrizá-lo como mostra a figura abaixo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/1111_Param_Princip_Calc_Op_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5215 - Cadastro de Composição de Produtos - Botão - Converter Composição Antiga para a Nova (Produção) -  Anterior ao processo de criação de novos cadastros de composição de produtos, é necessário a conversão do arquivo referente aos antigos registros inclusos em '5311 - Cadastro de Composição de Produtos' para o novo formato lido pela opção '5215' . Mesmo em clientes que não utilizam o 'Módulo Produção' , mas possuem o cadastro de composição para explosão de itens em telas de vendas feitas em '7512 - Cadastro de Orçamentos' e '2131 - Cadastro de Pedidos' , faz - se necessário a conversão uma vez que é habilitado o parâmetro  '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção - Ordens de Produção - 2 - Cálculo Produção por O.P' . Para habilitar o botão inserir senha 'Gerente' e definir a 'Forma de Aferição' que as composições existentes terão no novo formato."
      },
      {
        "type": "p",
        "text": "Forma de Aferição: Nesse campo será definido a forma de apontamento da matéria prima em '5236 - Apontamento de Matéria - Prima na Produção' , forma 'F - Fixa' os valores cadastrados referente ao 'Previsto'  não podem ser alterados, a forma  'P - Perdas' permite que somente o valor 'Conforme' produzido seja menor e 'A - Ajustes' permite que as quantidades possam ser manipuladas no apontamento para mais ou para menos comparado ao 'Previsto' , a forma 'C - C.C. Produção'  será utilizada para implementações futuras no módulo."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/5215_Cad_Compos_Ant_Nov.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O cadastro será dividido em duas grids, na parte superior serão inclusos os 'Produtos Acabados' que poderão ser mais de um nessa nova versão do programa, ou seja, ao final de todo o processo produtivo mais de um item poderá entrar no estoque conforme a configuração realizada em tela. Na grid da parte inferior da tela serão inclusos os produtos que fazem parte da composição do produto acabado (Matéria Prima) , abaixo iremos tratar a função de cada campo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/5215_New.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Grid Composição - Produto Acabado:"
      },
      {
        "type": "p",
        "text": "Código: Nesse campo serão inclusos os 'Produtos Acabados' que ao final do processo do produtivo será dado a entrada no estoque, conforme dito anteriormente acima, poderá ser mais de um item."
      },
      {
        "type": "p",
        "text": "Quantidade Produto Acabado: Valor que será dado a entrada no estoque referente ao item 'Produto Acabado' ao final do processo produtivo."
      },
      {
        "type": "p",
        "text": "Peso: Fator/Peso em porcentagem que o item produzido terá no custo total da produção ao final do processo/período, valores deverão ser números inteiros (100, 90, 50, etc) ;"
      },
      {
        "type": "p",
        "text": "Tipo Composição:  Nesse campo será definido o 'tipo' da composição conforme sua utilização dentro do sistema, para o 'Novo Módulo Produção' utilizar sempre o tipo '0 - Normal' , os tipos '1, 2, 5 e 6' serão tratados na opção '5241 - Montagem / Desmontagem' , lembrando que:"
      },
      {
        "type": "p",
        "text": "***Desmontagem/Montagem 'E' –  Realiza o processo pela 'Entrada/Saída'  de 'Produtos/Itens'  presentes na totalidade de sua composição, ou seja, pressupõe-se realmente que na 'Desmontagem/Montagem'  todos os itens relacionados tem participação no processo;"
      },
      {
        "type": "p",
        "text": "***Desmonstagem/Montagem 'OU' –  Relaciona-se os 'Produtos/Itens'  que  podem  ser utilizados e/ou produzidos no processo de 'Desmontagem/Montagem'  de materiais, sendo assim os itens da grid podem ser exclusos ou trocados nos lançamentos realizados pela opção  '5241 - Montagem / Desmontagem' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/5215_new_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Produção Obrigatória? (P.O):  Nesse campo será apontado se o 'Produto Acabado' da composição será de produção obrigatória ou não, essa informação terá impacto na opção '5222 - Planejamento da Produção' ."
      },
      {
        "type": "p",
        "text": "Há Variações de Itens? (Var): Nesse campo será apontado se o 'Produto Acabado' possui variações de itens no que diz respeito a matéria prima utilizada, essa informação será utilizada em conjunto com o campo 'Var' presente na grid 'Matéria - Prima' ."
      },
      {
        "type": "p",
        "text": "Processo: Dado um número ao processo e pressionado o botão 'Editar' abrirá uma caixa de texto para que seja descrito informações diversas relacionadas a produção do item, ao clicar no botão 'OK' essa informação ficará salva junto ao cadastro da composição."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/5215_new_3_Process.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Centro de Custo da Produção: Campo destinado a implementações futuras no 'Novo Módulo Produção' ."
      },
      {
        "type": "h3",
        "text": "Grid Composição - Matéria - Prima:"
      },
      {
        "type": "p",
        "text": "Código: Nesse campo serão inclusos os produtos  'Matéria - Prima' que ao final do processo produtivo será dado saída/baixa no estoque."
      },
      {
        "type": "p",
        "text": "Quantidade Produto Matéria - Prima: Valor que será dado saída/baixa no estoque referente ao item 'Produto Matéria - Prima' ao final do processo produtivo."
      },
      {
        "type": "h3",
        "text": "Operação (Op): Recebe valor conforme definição feita em 'Tipo' ."
      },
      {
        "type": "p",
        "text": "Variação (Var): Nesse campo caso a composição utilize 'Variação' serão inseridos seus códigos, essa informação será utilizada em '5222 - Planejamento Produção' para que seja dado a devida baixa na matéria prima utilizada pela Ordem de Produção. O conceito de 'Variação' funciona de forma a permitir o cadastro na grid 'Matéria -Prima'  diversas variações do mesmo produto. Por exemplo, uma caneta, supondo que o material 'Variação 1'  corresponda a cor azul e a 'Variação 2'  a cor vermelha, se na opção '5222 - Planejamento Produção' for apontado a 'Variação 1' , o sistema ao realizar o encerramento da produção fará a baixa da matéria prima somente com esse código e ignorará os demais. Este recurso faz com que seja possível no mesmo cadastro de composição obter diversas variantes do mesmo produto acabado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/5215_new_4_Variaca.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Forma de Aferição: Nesse campo será definido a forma de apontamento da matéria prima em '5236 - Apontamento de Matéria - Prima na Produção' , forma 'F - Fixa' os valores cadastrados referente ao 'Previsto'  não podem ser alterados, a forma  'P - Perdas' permite que somente o valor 'Conforme' produzido seja menor e 'A - Ajustes' permite que as quantidades possam ser manipuladas no apontamento para mais ou para menos comparado ao 'Previsto' , a forma 'C - C.C. Produção'  será utilizada para implementações futuras no módulo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/5215_new_5_Aferic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Est. Ori. Padrão: Nesse campo será informado o estoque origem no qual será dado baixa no produto matéria - prima, as opções disponíveis são 'P - Principal' e 'T - Terceiros' , ambos definidos em parâmetro em '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção - Estoque - Controle' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20Composicao%20Produtos_5215/5215_new_6_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Centro de Custo da Produção: Campo destinado a implementações futuras no 'Novo Módulo Produção' ."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      }
    ]
  },
  {
    "id": "AP-152",
    "slug": "novo_elaborado_itens_pedidos_2222_",
    "title": "Novo Elaborado Itens Pedidos (2222)",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2022-02-09",
    "readTime": "7 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa fornecer orientações sobre a nova opção '2222 - Elaborados Itens Pedidos' , características de campos , novos valores e complementos.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/152/novo_elaborado_itens_pedidos_2222_",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa fornecer orientações sobre a nova opção '2222 - Elaborados Itens Pedidos' , características de campos , novos valores e complementos."
      },
      {
        "type": "p",
        "text": "A opção '2222 - Elaborados Itens Pedidos' faz a leitura das tabelas 'PED/Pedidos' e 'PIT/Itens de Pedidos' , dessa forma é possível a inclusão de campos que focam em informações gerais da venda (Pedido) e detalhes dos itens (Itens Pedidos) , desmembrando valores relacionados a venda, complementos, operações, percentuais, valores calculados e valores de impostos. Seria uma junção entre os elaborados hoje existentes '2450 - Elaborados de Vendas' e '2221 - Elaborados de Faturamento/Cliente' ."
      },
      {
        "type": "p",
        "text": "As funções de 'Inclusão' , 'Alteração' , 'Consulta' e 'Exclusão' continuam iguais aos demais elaborados do sistema, através do botão 'Seleciona' será escolhido o elaborado para impressão do relatório após inclusão, o botão 'Listar' gerará uma relação de todos os elaborados já cadastrados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/2222_1_Barra_Bot_List.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O botão 'Definição de Campos Elaborados' traz todo o cadastro dos campos disponíveis para cada tipo de elaborado, sendo assim é possível a criação de novos campos para o relatório desde que exista um combo/complemento apto a receber essa nova informação a ser criada. Os campos \"originais\" não devem ser alterados, pois, sua origem é no  'PROBASE' , consequentemente, a informação alterada será sobreposta a cada atualização."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/2222_2_Barra_Bot_List_Def_Campo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo abaixo, refere-se a um campo disponível no elaborado '2222' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/2222_DELB_Cad_Campo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Através do botão 'Listar' será possível relacionar todos os campos disponíveis para cada elaborado existente no sistema, para a opção '2222 - Elaborados Itens Pedidos' verificar relação de campos em  'Relatório: 23 - Faturamento Itens' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Listagem_DELB.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2222 - Elaborados Itens Pedidos - Campos e Grupos"
      },
      {
        "type": "p",
        "text": "Os campos disponíveis no elaborado foram divididos em grupos com a inteção de facilitar a localização e inclusão do mesmo em relatório, outra facilidade trazida dos elaborados já existentes é a busca pelo nome do campo por meio da digitação da letra inicial no teclado. Os grupos existentes são: 'Cliente Cadastro' , 'Cliente Contatos' , 'Cliente Endereço' , 'Empresa' , 'Estoque' , 'Item Complementares' , 'Item Operação' , 'Item Percentuais' , 'Item Produto' , 'Item Quantidades' , 'Item Valores' , 'Pedido' , 'Representantes' , 'Valores Base' , 'Valores Calculados' e 'Valores Impostos' ."
      },
      {
        "type": "h3",
        "text": "E xemplos abaixo de 'Campos x Grupo' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/2222_Cad_Group_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/2222_Cad_Group_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2222 - Elaborados Itens Pedidos - Característica do Campo"
      },
      {
        "type": "p",
        "text": "Uma das novidades na reformulação dos elaborados é o campo 'Característica' , nele será possível definir seu posicionamento no relatório, também poderão ser definidos outras características como  'fonte maior' , 'fonte menor' , 'fonte negrito' ,  'fonte courrier' ,  'alinhamento à esquerda' , 'alinhamento à direita' ,  'centralizado' ,  'brancos' ,  'traços' , etc."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Caracter_Campo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2222 - Elaborados Itens Pedidos - Repete"
      },
      {
        "type": "p",
        "text": "Outra possibilidade disponível na reformulação dos elaborados é a opção 'Repete' , através dela é possível escolher se a informação do campo repete-se ao longo do relatório (00 - Imprime Normal) ou exibe somente uma vez, preenchendo as demais vezes com brancos (01 - Brancos se Repete) ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Caracter_Repete_Branco.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo abaixo (00 - Imprime Normal) :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Exempl_Repete_Info.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo abaixo (01 - Brancos se Repete) :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Exempl_Repete_Branco.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2222 - Elaborados Itens Pedidos - Novos Complementos"
      },
      {
        "type": "p",
        "text": "Uma alteração fundamental na reformulação dos elaborados foi a implementação de novos 'Complementos' , conforme a função e característica do campo serão habilitados complementos que visam otimizar a utilização do campo, dessa forma um mesmo campo pode referenciar informações distintas de mesma característica no mesmo relatório."
      },
      {
        "type": "h3",
        "text": "Complemento 'Tipo Endereço': Campos relacionados a endereços de terceiro podem referenciar diferentes tipos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Complemento 'Nível Território': Diferentes tipos de  'Níveis Território' para o mesmo campo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Complemento 'Estoque': É possível referenciar diferentes saldos de diferentes estoques no mesmo relatório."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Unidade': Esse complemento permite a inclusão de diferentes unidades utilizadas na movimentação de estoque e cadastro de produtos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Complemento 'Tabela': Permite a utilização de diferentes tabelas de preço no mesmo relatório."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Controle': Permite referenciar origens distintas da informação no cadastro do produto (1232) para o campo (Produto Controlado)  em relatório."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_6.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'P/Unidade':  Esse complemento permite a inclusão de diferentes unidades utilizadas na movimentação de estoque e cadastro de produtos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_7.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Início STR (01 a 97)/Tamanho (01 a 96)': Esse complemento é responsável pela impressão dos vencimentos existentes no pedido de venda, os campos em destaque definem a posição inicial e final da string, para uma melhor visualização é recomendável inserir os valores '01' em 'Início STR' e '96' em 'Tamanho' (exemplo figura) , dessa forma é utilizado todo o espaço disponível para a informação, não ocorrendo o risco de algum dado ficar oculto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_8.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Sobre' : Campos que apresentarem esse tipo de complemento, apontar se o valor exibido em relatório será calculado sobre as opções disponíveis na combo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_9.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Tipo Valor' : Campos que apresentarem esse tipo de complemento, apontar se o valor exibido em relatório será calculado sobre as opções disponíveis na combo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_10.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Tabela' : Em campos tipo 'Dif (+)/(-)' ou 'Margem' , o complemento 'Tabela' funcionará como referência para cálculo de valores comparando ao valor faturado (venda) ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_11.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Valor/Por' : Esse complemento exibe a diferença de valores entre o  'Faturado (venda) x Custo do item' , valor esse informado no cadastro de produtos  (1232)  mediante entrada de nota fiscal de compra ou inserido manualmente nas tabelas 'Valor Última Compra (A)' e 'Custo Última Compra (B)' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_12.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complemento 'Origem' : Esse complemento poderá relacionar diversos tipos de valores mediante ao que foi praticado na venda, nele podem ser referenciados valores de descontos, acréscimos, vendas, impostos e variações que incluem a soma e subtração entre eles."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_13.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Complementos \"Mistos\" : Existirão campos que podem apresentar mais de um tipo de 'Complemento' , nesses casos atentar - se ao esperado na exibição do relatório, pois serão concatenadas duas informações distintas, no exemplo da figura abaixo, em 'Origem'  pede - se um valor 'Total' que seja '(Base - Dsc + Acr + IPI)' , porém, exibido de forma 'Percentual Sobre Total' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Celb_Complemen_exempl_14.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Por meio do novo  'Complemento' é possível criar informações das mais variadas formas, sem que seja necessário a criação de um campo específico para cada finalidade."
      },
      {
        "type": "p",
        "text": "OBS1: Nem todos os campos possuem 'Complemento', vários dos campos disponíveis somente recebem os valores praticados no 'Pedido/Item'."
      },
      {
        "type": "p",
        "text": "OBS2: Os exemplos das figuras acima visam ilustrar os diferentes tipos de 'Complemento' criados para o novo elaborado, existem uma variedade de campos maior que os citados acima disponíveis. Esse padrão (Complemento) também será transportado aos demais elaborados existentes no sistema."
      },
      {
        "type": "p",
        "text": "2222 - Elaborados Itens Pedidos - Tela de Filtros"
      },
      {
        "type": "p",
        "text": "Os filtros disponíveis em tela mais as quebras, ordenações, totalizações e sínteses é uma junção entre a opção   '2450 - Elaborados de Vendas' e '2221 - Elaborados de Faturamento/Cliente'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20Elaborado%20Itens%20Pedidos%20(2222)/Tela_Filtros_2222_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Relatórios Módulo Faturamento - Listagem de Pedidos/Elaborados Faturamento-Vendas",
          "Relatórios Módulo Faturamento - Relatórios Analíticos/Sintéticos",
          "Erro - Comissionamento - Emissão de Vendas via '7512/75OV'",
          "Relatórios Módulo Faturamento - Listagem de Pedidos/Elaborados Faturamento-Vendas",
          "Relatórios Módulo Faturamento - Relatórios Analíticos/Sintéticos",
          "Relatórios Módulo Faturamento - Análise de Produtos/Representantes",
          "Relatórios Módulo Faturamento - Rankings"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "2450 - Novas variáveis para a exibição de valores",
          "2220 - Relatório Notas fiscais referenciadas",
          "2220 - Novo tipo de ordenação em relatório"
        ]
      }
    ]
  },
  {
    "id": "AP-151",
    "slug": "nova_importacao_de_lancamentos_de_estoque",
    "title": "Nova importação de Lançamentos de Estoque",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2021-10-11",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa dar orientações referente ao novo programa '5191 - Importação de Lançamentos de Estoque' , programa criado para a importação e geração de movimentos de estoque para o Módulo Produção e demais tipos de movim",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/151/nova_importacao_de_lancamentos_de_estoque",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa dar orientações referente ao novo programa '5191 - Importação de Lançamentos de Estoque' , programa criado para a importação e geração de movimentos de estoque para o Módulo Produção e demais tipos de movimentações. Definições de arquivos de configuração, processo de importação e funcionalidades em tela serão abordados no texto."
      },
      {
        "type": "h3",
        "text": "Dados do Arquivo - Definição e Origem:"
      },
      {
        "type": "p",
        "text": "O botão 'Definição de Campos para Importação' será habilitado mediante 'Senha Gerente' , nele serão definidos o nome do 'Arquivo Definição' que armazenará toda a configuração/parametrização referente aos campos presentes na importação e o vínculo com o 'Arquivo Origem' que contém os dados a serem importados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Botao_Definicao_Param.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao digitar o nome desejado para o arquivo no campo 'Arquivo Definição' automaticamente ele será criado no diretório '\\REDACOES' na base de dados com a extensão 'CFH' , para alteração de parâmetros em arquivos já existentes acessar o mesmo modo 'Definição' através de 'Senha Gerente' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Nome_Arquiv_Definic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em seguida deve - se definir a 'Origem dos Dados' (1- Arquivo de Texto/ 2 - Banco de Dados) e o 'Arquivo Origem' que contém os dados a serem importados para a criação dos movimentos de estoque."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Definic_Origem_Dados.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Nome_Arquiv_Origem.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Definições para Importação - Formato Arquivo Origem:"
      },
      {
        "type": "p",
        "text": "Realizado as definições iniciais, deve - se parametrizar o conteúdo do arquivo a ser importado, os campos 'Forma Tabulação' (1 - Separado por 'TAB'/ 2 - Separado por 'I' / 3 - Separado por ',') , 'Forma Data' , 'Separador de Casas Dec' e o checkbox 'Arquivo contém cabeçalho?' precisam ser configurados em conformidade com o  'Arquivo Origem' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Definic_Import.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito todas as parametrizações acima, automaticamente se em conformidade com o 'Arquivo Origem' , será trazido na tela à esquerda em 'Campos do Arquivo - Origem' as informações (campos) disponíveis para importação. Na parte à direita da tela em 'Junção dos Campos do Arquivo com os Campos do Sistema Hádron' as informações (campos) disponíveis referente a movimentação de estoque no sistema Hádron serão exibidas. Para criar o vínculo entre um e outro arrastar a informação do conteúdo à esquerda ao seu respectivo posicionado à direita. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/2_Definic_Import_ArqOrigem_Campos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Pode - se também na definição atribuir um valor fixo ao conteúdo do campo, ao pressionar double click sobre o campo desejado abrirá um tela para que o valor seja inserido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Definic_Especial.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Nos campos referente a data (Data da Ordem de Produção/ Data Emissão / Data Validade) , se atribuido o valor '@HOJE' automaticamente será associado ao campo a informação respectiva a data do dia da importação do arquivo no movimento de estoque criado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Definic_Especial_Data_.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Observação 1: Conteúdo dos campos 'Código Produto' , 'Data da Ordem de Produção' , 'Código da Ordem de Produção' , 'Tipo Lançamento (E/S)' , 'Quantidade' e 'Código do Estoque' são obrigatórios."
      },
      {
        "type": "p",
        "text": "Observação 2: Se existente conteúdo no campo 'Data da Ordem de Produção' , essa informação sobressaírá sobre o conteúdo presente em 'Data Emissão' na criação do movimento de estoque."
      },
      {
        "type": "p",
        "text": "Observação 3 : Uma vez não definido conteúdo para 'Tipo do Movimento (N/D/P/R)' automaticamente na importação do arquivo seus movimentos de estoque criados terão o tipo 'N - Normal' ."
      },
      {
        "type": "h3",
        "text": "I mporta Dados Conforme Definição do Arquivo:"
      },
      {
        "type": "p",
        "text": "Através do botão 'Importa Dados Conforme Definição do Arquivo' será realizado a importação do arquivo para a geração dos movimentos de estoque."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/Bot%C3%A3o_Import_Arquiv.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao selecionar 'Arquivo Definição' e ' Arquivo Origem' serão trazidos em tela todas as parametrizações definidas anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/5191_Import.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao clicar no botão 'Confirma',  caso ocorra algum erro no processo será exibido a mensagem 'Erro 5191 - Há erro na Importação! Verifique!' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/5191_Erro_Import.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Será apresentado um relatório com os erros:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/5191_Erro_Rel_Import.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Se o arquivo 'Origem' selecionado estiver em conformidade com o arquivo 'Definição' escolhido será exibido a mensagem 'Msg. 5191 - 10208 - Confira a Listagem! Deseja importar o arquivo agora ? Sim/Não' . Escolhido a opção 'SIM' será emitido um relatório com os itens encontrados no arquivo. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/5191_Rel_Sucess_Import.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Será exibido a mensagem 'Msg. 5191 - 51810 - Procedimento Realizado com Sucesso!' seguido do relatório contendo a relação dos produtos e seus respectivos movimentos de estoque criados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/5191_Proced_Sucess.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Relação dos produtos e respectivos movimentos de estoques criados após a importação:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova%20importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20de%20Estoque/5191_Rel_Mov_Criados.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Implementação/Geração - Bloco K",
          "Operações em Transferência de Estoque - 7512/7513",
          "Importação de Arquivo XML para NFe de Entrada de Mercadorias",
          "Controle de Movimentação de Estoques de Terceiros",
          "Processos de Acertos de Estoque"
        ]
      }
    ]
  },
  {
    "id": "AP-148",
    "slug": "cobranca_antecipada_rateio_de_impostos_ipi_st_em_pedidos_de_venda",
    "title": "Cobrança antecipada/rateio de impostos (IPI/ST) em Pedidos de Venda",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2021-07-13",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo abaixo visa dar orientações sobre as configurações necessárias para a cobrança antecipada e/ou rateio de impostos (IPI/ICMS ST) em pedidos de venda.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/148/cobranca_antecipada_rateio_de_impostos_ipi_st_em_pedidos_de_venda",
    "content": [
      {
        "type": "p",
        "text": "O artigo abaixo visa dar orientações sobre as configurações necessárias para a cobrança antecipada e/ou rateio de impostos (IPI/ICMS ST) em pedidos de venda."
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - Faturamento - Imposto 1ª Parcela - Nesse parâmetro será definido a cobrança antecipada e/ou rateio dos impostos (IPI/ICMS ST) no pedido de venda, é possível o total rateio do valor pelas parcelas e a antecipação referente ao IPI e/ou ICMS   ST na primeira parcela, outra possibilidade é do valor do imposto ser acrescido ao primeiro vencimento juntamente ao valor dos produtos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cobran%C3%A7a%20antecipadarateio%20de%20impostos%20(IPIST)%20em%20Pedidos%20de%20Venda/1112_Param_Fatur_Antecip_Impost.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2111 - Cadastro de Condições de Pagamento - Deve - se cadastrar duas condições de pagamentos semelhantes, a primeira fará referência ao uso do imposto antecipado definido no campo 'Dias Antecipado' , mediante o parâmetro utilizado o valor do (s)  imposto (s) poderá ser lançado na primeira parcela a partir da data base de emissão do pedido de venda, o vencimento será 'Data base Emissão + Valor Dias Antecipado' . Também é necessário vincular a condição de pagamento semelhante que não realiza essa antecipação de valores. Ao digitar os pedidos via '2131 - Cadastro de Pedidos' e ' 7512 - Cadastro de Orçamentos' e inserido a condição de pagamento o sistema terá a inteligência de identificar o cálculo ou não dos impostos e alocará os valores das parcelas da forma adequada."
      },
      {
        "type": "h3",
        "text": "Condição de pagamento configurado com 'Dias Antecipado':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cobran%C3%A7a%20antecipadarateio%20de%20impostos%20(IPIST)%20em%20Pedidos%20de%20Venda/2111_Cond_Antecip.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "OBS: O cadastro dessa condição de pagamento obriga o uso de duas ou mais parcelas, o primeiro vencimento será utilizado para alocar o valor do imposto."
      },
      {
        "type": "h3",
        "text": "Condição de pagamento vinculado semelhante 'Sem Antecipação' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cobran%C3%A7a%20antecipadarateio%20de%20impostos%20(IPIST)%20em%20Pedidos%20de%20Venda/2111_Cond_N%C3%A3o_Antecip.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos - Ao digitar os pedidos de venda e inserido a condição de pagamento o sistema terá a inteligência de identificar o cálculo ou não dos impostos e alocará os valores das parcelas da forma adequada, no exemplo abaixo foi utilizado o parâmetro 'T - Cobra Impostos Antecipado' , o valor lançado no primeiro vencimento é a soma do IPI + ICMS ST (37,50 + 234,01 = 271,51) ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cobran%C3%A7a%20antecipadarateio%20de%20impostos%20(IPIST)%20em%20Pedidos%20de%20Venda/2131_Exemplo_Imposto_Antecip.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Novo Parâmetro para Cálculo de Volumes '1112/2131'",
          "Cadastro de Transação - Checkbox para destaque de impostos em 'Dados Adicionais' - ICMS/ICMS-ST",
          "Notas Fiscais de Complemento de Imposto"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "1112 - Novo parâmetro que abate 'VALOR' do ICMS da base de cálculo para PIS/COFINS",
          "1112 - Novo parâmetro aba 'Fiscal' campo 'Dif. Aliquota Compõe Custo?'",
          "1112 - Novo parâmetro - Abate Valor de PIS/COFINS de Custo Contábil Estoque",
          "2131/7513 - Impressão da composição do produto em dados adicionais da NFE",
          "2131 - Cópia de Pedido entre Empresas"
        ]
      }
    ]
  },
  {
    "id": "AP-146",
    "slug": "erro_0102900_uma_conexao_com_o_servidor_nao_pode_ser_estabelecida",
    "title": "Erro - 0102900 - Uma conexão com o servidor não pôde ser estabelecida",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2021-06-15",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao exibir esta mensagem em  'ENFG - Gerenciador Hádron de NF-e / CT-e / CC-e / MDF-e / NFS-e'   na abertura do certificado digital o erro poderá estar relacionado a duas causas:",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/146/erro_0102900_uma_conexao_com_o_servidor_nao_pode_ser_estabelecida",
    "content": [
      {
        "type": "p",
        "text": "Ao exibir esta mensagem em  'ENFG - Gerenciador Hádron de NF-e / CT-e / CC-e / MDF-e / NFS-e'   na abertura do certificado digital o erro poderá estar relacionado a duas causas:"
      },
      {
        "type": "p",
        "text": "- A Sefaz pode estar com o servidor em manutenção ou status 'Offline' , na qual não é possível estabelecer uma conexão com o gerenciador 'ENFG' ao abrir o sistema Hádron."
      },
      {
        "type": "p",
        "text": "- O computador (Terminal Hádron) configurado como gerenciador do certificado digital pode estar utilizando o sistema operacional 'Windows 7' , onde as atualizações (download) do Windows Update não foram feitas por completo, se faz necessário realizar o download até a versão mais recente, pois, essas atualizações de segurança fazem o gerenciador (ENFG)  e o certificado digital se comunicarem com a Sefaz corretamente."
      },
      {
        "type": "p",
        "text": "Para computadores que utilizarem a versão 'Windows 10' , observar se em  'Opções da Internet - Aba - Avançado'  os checkbox  'Usar TLS 1.2' e 'Verificar se há assinaturas em programas baixados' estão habilitados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/SUPORTE/PRCMEK/screenshot-5.jpg",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-143",
    "slug": "erro_2000330_nao_encontrado_na_tabelas_de_erros_da_nfs_e",
    "title": "Erro - 2000330 não encontrado na tabelas de Erros da NFS-e",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2021-06-14",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao exibir esta mensagem somente o código do erro é trazido como resposta do servidor GINFES para o sistema Hádron, porém, não é enviado a descrição da rejeição, segundo o próprio GINFES diz o seguinte: 'E330 - Local da p",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/143/erro_2000330_nao_encontrado_na_tabelas_de_erros_da_nfs_e",
    "content": [
      {
        "type": "p",
        "text": "Ao exibir esta mensagem somente o código do erro é trazido como resposta do servidor GINFES para o sistema Hádron, porém, não é enviado a descrição da rejeição, segundo o próprio GINFES diz o seguinte: 'E330 - Local da prestação diferente do local da obra' ."
      },
      {
        "type": "h3",
        "text": "O erro 'E330' pode ocorrer devido ao seguinte fator:"
      },
      {
        "type": "ul",
        "items": [
          "Quando o prestador de serviços emite uma nota com serviço da construção civil e seleciona (ou informa no arquivo XML) um código de obra cadastrado com endereço num municipio diferente ao local (cidade) informado no NFS-e ou RPS."
        ]
      },
      {
        "type": "h3",
        "text": "Solução segundo Ginfes:"
      },
      {
        "type": "p",
        "text": "Verifique o local da obra cadastrada no Gissonline, informe o mesmo local (município) no campo 'Local da prestação'  no site Ginfes ou informe o 'Código do IBGE' do municipio na tag '<CodigoMunicipio>' que se encontra dentro do elemento (tag) '<Servico>' no XML de envio do respectivo recibo provisorio."
      },
      {
        "type": "p",
        "text": "Revisar em  '2113 - Transações'  o campo 'Local da Prestação' , porém, caso envolva construção civil ou relacionados conferir ou criar o cadastro na opção  '1265 - Estabelecimentos, Obras ou Unidades de Órgãos Públicos',  a ausência ou não correto preenchimento do registro poderá causar   a rejeição 'E322 - Tag de Construção civil é obrigatória e não foi informada no arquivo. Insira a Construção Civil juntamente com o código da Obra e Código ART' ."
      },
      {
        "type": "p",
        "text": "Para cada serviço de construção que será realizado existe um Código Cadastro Nacional de Obras (CNO Deve possuir 15 caracteres) e o Código ART (Anotação de Responsabilidade Técnica) , esses dois deverão ser acrescentados no registro criado na opção '1265'  para a emissão da NFS-e seguindo o exemplo abaixo :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/SUPORTE/PRCMEK/exemplo%201265.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Uma vez criado o registro ele ficará disponível para ser inserido nas opções '7512 - Cadastro de Orçamentos' e '2131 - Cadastro de Pedidos'  na montagem de pedidos para emissão do NFS-e."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/SUPORTE/PRCMEK/screenshot-1.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/SUPORTE/PRCMEK/screenshot-2.jpg",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-144",
    "slug": "erro_2000358_nao_encontrado_na_tabelas_de_erros_da_nfs_e",
    "title": "Erro - 2000358 não encontrado na tabelas de Erros da NFS-e",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2021-06-14",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao exibir esta mensagem somente o código do erro é trazido como resposta do servidor GINFES para o sistema Hádron, porém, não é enviado a descrição da rejeição, segundo o próprio GINFES diz o seguinte: 'E358 - Alíquota d",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/144/erro_2000358_nao_encontrado_na_tabelas_de_erros_da_nfs_e",
    "content": [
      {
        "type": "p",
        "text": "Ao exibir esta mensagem somente o código do erro é trazido como resposta do servidor GINFES para o sistema Hádron, porém, não é enviado a descrição da rejeição, segundo o próprio GINFES diz o seguinte: 'E358 - Alíquota do simples não pode ser inferior a 2% e superior a 5%, CORRECAO: Entre em contato com a prefeitura para realizar o cancelamento através de processo administrativo' ."
      },
      {
        "type": "h3",
        "text": "As causas podem estar relacionadas a duas situações:"
      },
      {
        "type": "p",
        "text": "- O contribuinte está com o cadastro desatualizado na prefeitura do município e precisa entrar em contato com o mesmo para a correção da situação cadastral, ou alíquotas inseridas de forma incorreta nas opções '1112 - Cadastro de Empresas' e '1246 - Complemento de Serviços' ."
      },
      {
        "type": "p",
        "text": "- O sevidor GINFES do município pode estar passando por manutenções ou sobrecarregado exibindo a mesma mensagem de retorno."
      }
    ]
  },
  {
    "id": "AP-142",
    "slug": "erro_enfi_50885_faltam_elementos_no_xml_para_a_emissao_da_danfe_",
    "title": "Erro - ENFI- 50885- Faltam elementos no XML para a emissão da DANFE!",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2021-06-14",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao exibir este erro na geração da Pré - Danfe via '2131 - Cadastro de Pedidos' , revisar o cadastro do terceiro pois algum campo referente ao endereço não está preenchido.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/142/erro_enfi_50885_faltam_elementos_no_xml_para_a_emissao_da_danfe_",
    "content": [
      {
        "type": "p",
        "text": "Ao exibir este erro na geração da Pré - Danfe via '2131 - Cadastro de Pedidos' , revisar o cadastro do terceiro pois algum campo referente ao endereço não está preenchido."
      },
      {
        "type": "h3",
        "text": "Tags : PRÉ-DANFE, PRÉ DANFE"
      }
    ]
  },
  {
    "id": "AP-140",
    "slug": "novo_sac_servico_de_atendimento_ao_consumidor",
    "title": "Novo SAC - Serviço de Atendimento ao Consumidor",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2021-06-02",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Anterior a utilização do SAC deve-se incluir os 'Objetos de Trabalho' que serão utilizados para realizar o cadastro de chamadas, estes também poderão ser utilizados como 'Filtros de Identificação' em relatórios e busca p",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/140/novo_sac_servico_de_atendimento_ao_consumidor",
    "content": [
      {
        "type": "h3",
        "text": "O artigo visa dar orientações referente a funcionalidades do novo Módulo SAC (Serviço de Atendimento ao Consumidor)."
      },
      {
        "type": "p",
        "text": "1188 - Objetos de Trabalho"
      },
      {
        "type": "p",
        "text": "Anterior a utilização do SAC deve-se incluir os 'Objetos de Trabalho' que serão utilizados para realizar o cadastro de chamadas, estes também poderão ser utilizados como 'Filtros de Identificação' em relatórios e busca por registros já existentes. Os objetos podem ser do tipo '1 - Livre', '2 - Produto', '3 - Terceiro', '4 - Sim/Não', '5 - Combo Box (Cadastro Feito na opção '1184'), '6 - Número de Série', '7 - Placa Veículo', '8 - Representante' e  '9 - Data',  seu código deverá conter as letras 'SA' ."
      },
      {
        "type": "p",
        "text": "É necessário ressaltar que seja feita uma boa análise anterior a criação dos objetos conforme o modelo de negócio e necessidade do cliente, pois, a alteração ou exclusão desses registros após o início do uso do SAC podem acarretar em danos nas tabelas de arquivos referente ao módulo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/1188_Cadastro_Objetos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1510 - SAC (Serviço de Atendimento ao Consumidor)"
      },
      {
        "type": "p",
        "text": "Nesse menu principal poderão ser inclusas novas chamadas, dar seguimento ao processo e finalização de chamadas já existentes, além de consultas detalhadas pelos botões  'Detalhes' e 'Imprime' , conforme os parâmetros vão sendo inseridos (Cliente/Vendedor/Departamento/Filtros Identificação) automaticamente é realizado uma busca e as chamadas relacionadas aos fitros são trazidos em tela."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Menu_Tela_Inicial.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para a inclusão de uma nova chamada deve-se pressionar o botão 'Incluir' , abrirá a tela '15CH - Registro de Chamadas',  os parâmetros  (Cliente/Vendedor/Departamento/Filtros Identificação)  deverão ser inseridos, ao selecionar o status 'I - Iniciado' o evento deverá ser detalhado em 'Descrição Chamada' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Inclusao_Chamada_Iniciado_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Através da tela '15CH - Registro de Chamadas' será possível o cadastro de novos contatos, ao clicar sobre o botão 'Pesquisar Contatos' abrirá a opção 'PTLT - Pesquisa de Contatos' no qual será possível a inclusão de um novo registro em  'CTLT - Cadastro de Contatos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Inclusao_Chamada_Contato_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Na tela  'CTLT - Cadastro de Contatos'  será incluso o novo contato."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Inclusao_Chamada_Contato_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Alteração de Status de Chamadas"
      },
      {
        "type": "p",
        "text": "Feito a inclusão das chamadas a alteração de seus status (Em Processo/Solucionado/Cancelado) será feito pela tela '1510 - SAC' botão 'Alterar' , abrirá novamente a '15CH - Registro de Chamadas' e o campo 'Status' deverá ser alterado pelo operador. Ao utilizar  'P - Em Processo' e 'S - Solucionado' a descrições deverão ser feitas nos campos 'Procedimento' e 'Solução' respectivamente."
      },
      {
        "type": "h3",
        "text": "Status - P - Em Processo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Inclusao_Chamada_Processo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Status 'S - Solucionado':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Inclusao_Chamada_Solucionado.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Consultas de Chamadas e Relatório"
      },
      {
        "type": "p",
        "text": "Como dito anteriormente acima, a própria '1510 - SAC' funcionará como uma busca automatica de chamadas conforme os parâmetros são inseridos em tela, pelo botão 'Detalhe' serão exibidos os itens do 'Objeto de Trabalho'  com seu conteúdo para cada registro de chamada encontrado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Menu_Tela_Inicial_Detalhes.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Pelo botão 'Imprime' será impresso um relatório utilizando como filtro todos os parâmetros inseridos nos campos ' Cliente/Vendedor/Departamento/Filtros Identificação'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Menu_Tela_Inicial_Imprime.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Para emitir um relatório com todos os campos de filtros livres acessar a opção '1520 - Relatório de Chamadas' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/1520_Tela.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Modelo do Relatório de Chamadas impresso:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Rel_1520_Modelo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Cancelamento de Chamada"
      },
      {
        "type": "p",
        "text": "O cancelamento da chamada será feito pela opção '15CH - Registro de Chamadas' , inserir senha gerente para que o botão 'Cancelar' seja habilitado, o 'Número Sequência' será a chave para o cancelamento/exclusão do registro."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20SAC%20-%20Servi%C3%A7o%20de%20Atendimento%20ao%20Consumidor/Cancelamento_Chamada.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-133",
    "slug": "integracao_hadron_web_x_marketplace",
    "title": "Integração Hádron-Web x MarketPlace",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2021-05-11",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa fornecer orientações referente a configurações e ferramentas existentes na plataforma Hádron-Web para vendas no módulo MarketPlace, anterior a esse texto é recomendável ler os quatro artigos nos links abaix",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/133/integracao_hadron_web_x_marketplace",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa fornecer orientações referente a configurações e ferramentas existentes na plataforma Hádron-Web para vendas no módulo MarketPlace, anterior a esse texto é recomendável ler os quatro artigos nos links abaixo:"
      },
      {
        "type": "h3",
        "text": "I nstalação ODBC MySql:"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/manual/47/hadron_mobile_manual_de_configuracoes"
      },
      {
        "type": "h3",
        "text": "Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace):"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/91/hadron_web_manutencao_de_cadastro_de_produtos_e_commerce_marketplace_"
      },
      {
        "type": "h3",
        "text": "Recepção e Emissão de Pedidos origem Hadron-Web:"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/92/recepcao_e_emissao_de_pedidos_origem_hadron_web"
      },
      {
        "type": "h3",
        "text": "Integração Hádron-Web x E-Commerce:"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/115/integracao_hadron_web_x_e_commerce"
      },
      {
        "type": "p",
        "text": "O acesso a plataforma Hádron-Web será feito pelo endereço  https://hadronweb.com.br/admin/  ou  http://app.hadronweb.com.br/admin/ , informações para o primeiro acesso (Sigla/Operador/Senha) serão anteriormente fornecidos pelo Departamento de Desenvolvimento Web. Para o módulo MarketPlace o Hádron-Web funcionará como um Back Office/Retaguarda, no qual, será possível realizar a sincronização dos produtos com as plataformas de vendas via Web, visualização de clientes e vendas além da manutenção de seus status."
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Marketplaces:"
      },
      {
        "type": "p",
        "text": "Nesta seção serão relacionados todos os anúncios criados, publicados ou não, será possível visualizar a descrição e imagem do produto com seu respectivo saldo de estoque, também poderá ser feito através desta tela a exclusão do anúncio da plataforma de vendas desejada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/HadronWeb_MenuMarket_Places.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao clicar sobre o código do anúncio abrirá o link do produto dentro da plataforma de vendas web. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/HadronWeb_MenuMarket_Places_anuncio_prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Integrações"
      },
      {
        "type": "p",
        "text": "Nesta seção será feito a sincronização dos produtos com a plataforma web de vendas, ao acessar o menu deve-se escolher a plataforma desejada, lembrando que o cliente deverá ter feito anteriormente o login no marketplace escolhido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/Menu_Integra%C3%A7%C3%B5es.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado a escolha da plataforma pressionar o botão 'Sincronizar' , é importante atentar-se aos dois checkbox 'Sincronizar Preço' e 'Sincronizar Saldo' caso opte-se por alinhar os dados do Hádron-ERP referente a preço e saldo do produto com o MarketPlace, alguns clientes optam por fazer esse manutenção dentro da própria plataforma de vendas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/HadronWeb_MenuMarket_Integra%C3%A7%C3%B5es_Config_Sincronizar.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito a passo acima serão trazidos todos os anúncios da plataforma escolhida, a associação entre o anúncio e produto do Hádron-ERP será feito pelo Código SKU que refere-se a numeração do código do produto no sistema Hádron-ERP , realizar a associação entre o código e o ID do anúncio na plataforma de vendas. Através desta tela também será possível a manutenção da descrição do produto no anúncio, seu preço e saldo de estoque."
      },
      {
        "type": "h3",
        "text": "Obs: Para o marketplace Tray o código SKU deverá ser inserido dentro da própria plataforma."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/HadronWeb_MenuMarket_Integra%C3%A7%C3%B5es_Config_Sincronizar_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Caso o produto possua variações (tamanho, cor, etc) dele mesmo dentro do anúncio no marketplace, deve-se também associá-los aos respectivos códigos SKU  referente ao  Hádron-ERP."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/Cod_SKU_varia%C3%A7%C3%A3o_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Realizados todos os ajustes selecionar os produtos desejados e clicar em 'Sincronizar' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/HadronWeb_MenuMarket_Integra%C3%A7%C3%B5es_Config_Sincronizar_Prod_sinc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Será dado uma aviso referente a sincronização dos produtos, ao marcar os checkbox 'Atualizar com preço atual do produto no marketplace' e 'Atualizar com saldo do produto no marketplace' os itens serão atualizados com as informações presentes no Hádron-ERP , ao não marca - los será feito apenas a sincronização dos produtos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Integra%C3%A7%C3%A3o%20H%C3%A1dron-Web%20x%20MarketPlace/HadronWeb_MenuMarket_Integra%C3%A7%C3%B5es_Config_Sincronizar_Prod_sinc_aviso.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Vale lembrar que a sincronização é a parte final de todo um processo referente ao cadastro de produtos, depois de criado o registro no Hádron-ERP em '1232 - Cadastro de produtos' , feito o ajuste do saldo de estoque, posteriormente o envio das informações pelo 'SGBW - Gerenciador do Banco de Dados Remoto' , dentro do Hádron-Web deverá ser feito associação do código SKU e por últmo a sincronização dos itens com a plataforma de vendas online. Atentar-se aos artigos relacionados citados acima para um bom entendimento da ferramenta para sua melhor utilização."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Integração Hádron-Web x E-Commerce",
          "Hádron-Web - Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace)",
          "Hádron Mobile - Manual de Configurações",
          "Recepção e Emissão de Pedidos origem Hadron-Web",
          "Hádron-Web - Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace)"
        ]
      }
    ]
  },
  {
    "id": "AP-131",
    "slug": "emissao_de_conhecimento_de_transporte_eletronico_atraves_de_importacao_de_arquivo_xml",
    "title": "Emissão de Conhecimento de Transporte Eletrônico através de importação de arquivo XML",
    "category": "guia",
    "module": "Logística",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2021-03-09",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo abaixo visa dar orientações para a emissão de CT-e (Conhecimento de Transporte Eletrônico) através da importação de arquivos no formato XML referente a notas fiscais enviadas por terceiros.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/131/emissao_de_conhecimento_de_transporte_eletronico_atraves_de_importacao_de_arquivo_xml",
    "content": [
      {
        "type": "p",
        "text": "O artigo abaixo visa dar orientações para a emissão de CT-e (Conhecimento de Transporte Eletrônico) através da importação de arquivos no formato XML referente a notas fiscais enviadas por terceiros."
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - Faturamento - Modo Operação - 1 - Importa XML's de NFe's p/ emissão CTe's -  Deve - se configurar o parâmetro para que o módulo fique habilitado a importar arquivos xml referente a notas fiscais de terceiros, no tipo '4 - CrossDocking' também é possível realizar a mesma ação, porém, nesse módulo são efetuadas outras operações como gerenciamento de romaneio de entrega, coleta, e controle de quilometragem de veículo, o artigo que trata o assunto encontra - se no link   https://ajuda.procion.com/artigo/guia/10/gerenciador_de_coletas_e_entregas_crossdocking_  ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/1112_Import_Xml_CTe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "RUS2 - Parâmetros Especiais Faturamento - Aba - Conhecimentos - Operação EDI - 0 - EDI. Importa/Exporta - Deve - se habilitar o parâmetro para que o botão 'Importação de EDI/Notas' seja habilitado em '7331 - Cadastro de Conhecimentos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/RUS2_EDI_Import_Export.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "RUS2 - Parâmetros Especiais Faturamento - Aba - Conhecimentos - Lançamentos NFE's -  Nesse parâmetro é escolhido o tipo de grid em que as notas fiscais serão lançadas na opção '7331 - Cadastro de Conhecimentos' , o tipo '1 - Simplificado' não é o mais recomendado, pois, muitas críticas referente a emissão de um CT-e não são realizadas nesse modo o que pode gerar rejeição na Sefaz no momento da emissão do documento. Recomendável optar pelas opções '0 - Completo' e '2 - Simplificado crítica na emissão' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/RUS2_Lanc_Nfe_Tip_Grid.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Modo Completo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/Format_grid_completo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Modo Simplificado:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/Format_grid_simplific.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7321 - Importação de XMLs Notas Fiscais - Nesse opção será configurado o diretório em que o sistema fará a busca pelos arquivo xml e realizado a sua importação, escolhido as notas fiscais será feito uma crítica referente a inconsistências existentes que poderão ser corrigidas no momento do processamento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/7321_Import_Xml.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Uma vez encontrado inconsistências nos arquivos selecionados o sistema exibirá uma mensagem para que elas sejam corrigidas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/7321_Import_Xml_msg_Correc_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao escolher a opção 'Sim' o sistema abrirá a tela '73A1 - Ações Prévias' para que as correções sejam efetuadas, clique sobre os ícones de aviso e erro para que os itens apontados sejam corrigidos."
      },
      {
        "type": "h3",
        "text": "As correções podem envolver o cadastro de terceiros (Remetente/Destinatário):"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/73A1_Acoes_previas_import_correc_first.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao clicar sobre a ocorrência abrirá uma mensagem solicitando a inclusão ou correção do cadastro do terceiro buscando a informação presente no arquivo xml."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/73A1_Acoes_previas_import_correc_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao escolher a opção 'SIM' abrirá o cadastro de terceiros para que a inclusão ou correção de um cadastro já existente seja concluído."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/73A1_Acoes_previas_import_correc_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "As correções podem envolver o vínculo 'Produto x Terceiro x Sistema':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/73A1_Acoes_previas_import_correc_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " "
      },
      {
        "type": "p",
        "text": "Nesse caso abrirá a opção '1237 - Referências Produto/Terceiro' para que essa correlação possa ser criada, o respectivo produto cadastrado no sistema frente a referência do item no terceiro deve ser vinculado, esse processo é feito somente uma vez."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/1237_Correc_73A1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao final dos ajustes estando todos os itens corretos pressionar o botão 'Processa' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/73A1_correta_processa.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após a importação dos arquivos xml deve-se acessar a opção '7331 - Cadastro de Conhecimentos'  e pressionar o botão 'Importação EDI/Notas'  para que o sistema faça a montagem do conhecimento de transporte."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/7331_Import_EDI_Notas.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Abrirá a tela '73IC - Importação EDI ou NF-e' , pressionar o botão 'Montar Conhecimento a Partir de NF-e' como indicado na figura abaixo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/73IC_import_EDI_NFe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A tela '73IN - Importação de NF-e para Montagem de Conhecimento' é a responsável por gerenciar todas notas as fiscais (xml) importados anteriormente pela opção '7321 - Importação de XMLs Notas Fiscais' , nela existem uma série de filtros que serão utilizados para selecionar as notas fiscais que irão compor o conhecimento de transporte. Realizado a seleção das notas fiscais clicar em 'Confirma' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/73IN_IMport_NFe_Mont_Conhecimento.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito o processo abrirá a opção '7331 - Cadastro de Conhecimentos' com os dados referente a terceiros, origem, destino, peso, valor de mercadorias e notas fiscais já preenchidos conforme seleção realizada anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/7331_1_Import_xml.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Grid referente as notas fiscais selecionadas:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Conhecimento%20de%20Transporte%20Eletr%C3%B4nico%20atrav%C3%A9s%20de%20importa%C3%A7%C3%A3o%20de%20arquivo%20XML/7331_2_Import_xml.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao final do processo preencher as informações referente as abas  'Dados do Frete' e 'Dados Complementares' para que seja feita a emissão do CTe."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Gerenciador de Coletas e Entregas (Crossdocking)",
          "Erro ao emitir Conhecimento de Transporte - Rejeição 687",
          "Manifesto de Documentos Fiscais Eletrônicos- MDF-e",
          "CIOT - Conceitos e Operação"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "7331 - Impressão de 'Dados Recebedor' em CT-e",
          "3217 - Inserção de novo filtro para 'Manifestar' documentos eletrônicos",
          "2152 - Emissão de Manifesto - Montagem de Cargas Avulsas",
          "2153/215R - Incluso nova aba 'Carga/CIOT'",
          "1217 - Novos campos para implementação de automação de 'Vale Pedágio' no CIOT"
        ]
      }
    ]
  },
  {
    "id": "AP-128",
    "slug": "controle_de_movimentacao_de_estoques_de_terceiros",
    "title": "Controle de Movimentação de Estoques de Terceiros",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2020-10-20",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "O Artigo abrange o controle de movimentação de estoques de terceiros no sistema Hádron tanto para o tipo 'Nosso Produto em poder de Terceiros' como 'Produtos de Terceiros em nosso poder' . ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/128/controle_de_movimentacao_de_estoques_de_terceiros",
    "content": [
      {
        "type": "p",
        "text": "O Artigo abrange o controle de movimentação de estoques de terceiros no sistema Hádron tanto para o tipo 'Nosso Produto em poder de Terceiros' como 'Produtos de Terceiros em nosso poder' . "
      },
      {
        "type": "p",
        "text": "Primeiro deve-se cadastrar os estoques  'Nosso Produto em poder de Terceiros' e  'Produtos de Terceiros em nosso poder'  na opção '5111 - Tipos de Estoque' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processo%20Movimentos%20de%20Estoque%20de%20Terceiros/5111_Est_Terceiro.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em seguida na opção '1111 - Parâmetros Globais Sistema - Aba - Estoque/Produção' deve-se apontar os estoques anteriormente cadastrados nos respectivos parâmetros."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processo%20Movimentos%20de%20Estoque%20de%20Terceiros/1111_Est_Prod_Terc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A partir da configuração feita acima, toda e qualquer movimentação de produto no sistema em que for apontado um dos estoques parametrizados via '7513 - Emissão de Orçamentos' , '2131 - Cadastro de Pedidos' , '5121 - Cadastro de Entradas' , '5122 - Cadastro de Sáidas' e '3212 - Cadastro de Documentos de Entrada'  levará esse(s) movimento(s) ao controle de  'Movimentos de Estoque de Terceiros'."
      },
      {
        "type": "p",
        "text": "Esses movimentos de estoques com a finalidade para tal controle também poderão ser inclusos manualmente via opção '5129 - Movimentos de Estoque de Terceiros' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processo%20Movimentos%20de%20Estoque%20de%20Terceiros/5129_Mov_Terc_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para que o movimento seja incluso é necessário que o terceiro em seu cadastro esteja habilitado para a situação, em '1221 - Cadastro de Terceiros - Aba - Fiscal/Contábil - Estoque Terceiro' escolher a informação adequada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processo%20Movimentos%20de%20Estoque%20de%20Terceiros/1221_Mov_Terc_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Todos os movimentos criados referente aos estoques de terceiros via  '7513 - Emissão de Orçamentos' , '2131 - Cadastro de Pedidos' , '5121 - Cadastro de Entradas' , '5122 - Cadastro de Sáidas' e '3212 - Cadastro de Documentos de Entrada'  para que sejam inclusos no controle, devem ser processados pela opção '51TE - Processo Movimentos de Estoques de Terceiros' presente na própria '5129' , esse procedimento também possui a função de incluir esses registros no Sped Fiscal compondo o  'Bloco H' e 'Bloco K' conforme necessidade do cliente, sendo assim, esse processo é imprescindível para todos que realizam movimentações de estoques de terceiros e entregam o Sped Fiscal."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processo%20Movimentos%20de%20Estoque%20de%20Terceiros/51TE_Mov_Est_Terc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado todo o processamento e incluso todas movimentações, elas poderão ser relacionadas através do relatório '512E - Relatórios Estoque Terceiros' presente na opção ' 5129' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processo%20Movimentos%20de%20Estoque%20de%20Terceiros/512E_Mov_Est_Terc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Emissão de Notas Fiscais no processo de Industrialização por conta e ordem de terceiro",
          "Operações em Transferência de Estoque - 7512/7513",
          "Parametros - Processos - Relatórios Estoque ABC - Mínimo/Máximo - Giro - Disponibilidade",
          "Cálculo Custo/Compras - Nova opção 3215",
          "Cotação e emissão de Ordem de Compra",
          "Conferência Quantitativa - Entrada de Materiais",
          "Importação de Arquivo XML para NFe de Entrada de Mercadorias",
          "Manifestação de Nota Fiscal Eletrônica"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "3217 - Inserção de novo filtro para 'Manifestar' documentos eletrônicos",
          "3212 - Novo campo em 'Detalhamento ICMS - Difer'",
          "1111/3212 - Parâmetro - Prioriza Estoque Principal"
        ]
      }
    ]
  },
  {
    "id": "AP-126",
    "slug": "erro_nfe_0000_nota_fiscal_de_cliente_x_com_o_erro_9900803_objeto_vazio",
    "title": "Erro NFe (0000): Nota fiscal de cliente \"X\" com o erro 9900803 - OBJETO VAZIO",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-10-07",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao ocorrer este erro é necessário no computador que está o certificado digital A3 instalado reconectar novamente o hardware do leitor do cartão na porta USB, em seguida reabrir o gerenciador do certificado no sistema Hád",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/126/erro_nfe_0000_nota_fiscal_de_cliente_x_com_o_erro_9900803_objeto_vazio",
    "content": [
      {
        "type": "p",
        "text": "Ao ocorrer este erro é necessário no computador que está o certificado digital A3 instalado reconectar novamente o hardware do leitor do cartão na porta USB, em seguida reabrir o gerenciador do certificado no sistema Hádron, pois, o Windows perdeu a comunicação com o dispositivo e não consegue enviar as informações para a Sefaz."
      }
    ]
  },
  {
    "id": "AP-125",
    "slug": "chave_de_acesso_do_produto_verificacao_de_cadastro_",
    "title": "Chave de Acesso do Produto - Verificação de Cadastro",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-10-02",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao optar por um determinada chave de acesso ao produto no sistema, tanto no momento da implantação como em uma posterior alteração, feito a escolha em '1111 - Parâmetros Globais Sistema - Aba Produtos - Chave de acesso d",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/125/chave_de_acesso_do_produto_verificacao_de_cadastro_",
    "content": [
      {
        "type": "p",
        "text": "Ao optar por um determinada chave de acesso ao produto no sistema, tanto no momento da implantação como em uma posterior alteração, feito a escolha em '1111 - Parâmetros Globais Sistema - Aba Produtos - Chave de acesso do Produto'  é de boa prática executar a verificação, no qual, o sistema lista os produtos que não estão conformes mediante a opção escolhida."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Chave%20de%20Acesso%20do%20Produto%20-%20Verifica%C3%A7%C3%A3o%20de%20Cadastro/1111_Chave_Acesso.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Obs:  Se escolhido o parâmetro:"
      },
      {
        "type": "p",
        "text": "  'A - Automático' obrigatoriamente o 'Código Interno' do produto NÃO poderá  ser um código numérico de até 6 dígitos, ou seja, ou deve possuir ao menos uma letra ou conter um código numérico igual ou superior a 7 dígitos;"
      },
      {
        "type": "p",
        "text": "  '3 - Somente pelo código interno'  sendo possível um valor menor que seis caracteres em sua codificação - neste caso, não serão aceitos códigos internos em duplicidade."
      },
      {
        "type": "p",
        "text": "Para efetuar a verificação é necessário acessar a opção '1332 - Elaborados de Produtos',  escolher a listagem de preferência do usuário e emiti - la sem nenhum filtro de forma que todo o cadastro de produto possa ser lido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Chave%20de%20Acesso%20do%20Produto%20-%20Verifica%C3%A7%C3%A3o%20de%20Cadastro/1332_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Chave%20de%20Acesso%20do%20Produto%20-%20Verifica%C3%A7%C3%A3o%20de%20Cadastro/1332_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para que a verificação seja feita é necessário inserir os dizeres 'TESTA INTERNO' no 'Cabeçalho' do relatório, os produtos que forem relacionados/impressos  não estão em conformidade mediante o parâmetro de acesso ao produto escolhido, esses códigos deverão ter seus cadastros ajustados na opção '1232'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Chave%20de%20Acesso%20do%20Produto%20-%20Verifica%C3%A7%C3%A3o%20de%20Cadastro/PPRN_verific.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "1332 - Correção exibição de 'Qtde. para desconto/QTD.DES 2' e 'Porcentagem Descontos/POR.DS 2'",
          "1239 - Novo campo para acertos gerais de produtos",
          "1239 - Alteração campo 'Aplicação'"
        ]
      }
    ]
  },
  {
    "id": "AP-124",
    "slug": "configuracao_e_operacao_modulo_tintas_",
    "title": "Configuração e Operação Módulo 'Tintas'",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-10-01",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa orientar referente as configurações e parâmetros necessários para a venda utilizando o Módulo Tintas no sistema Hádron e sua operação nas telas '75OV - Cadastro de Orçamentos' e '2131 - Cadastro de Pedidos'",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/124/configuracao_e_operacao_modulo_tintas_",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa orientar referente as configurações e parâmetros necessários para a venda utilizando o Módulo Tintas no sistema Hádron e sua operação nas telas '75OV - Cadastro de Orçamentos' e '2131 - Cadastro de Pedidos' ."
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros Globais Sistema - Aba - Produtos -  É necessário habilitar o parâmetro 'Formulação de Produto - 3 - Produtos COM formulações (tintas/composição)'  para que o produto possua a característica necessária ao funcionamento do módulo e marcar o checkbox 'Exibe Formulação NF-e?' para que a formulação da tinta seja impressa na Danfe caso seja necessário."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/1111_Tintas_param_geral.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na mesma tela também é necessário apontar a tabela de preço padrão que será utilizada para compor o preço total do produto formulação tinta."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em 'RUS2 - Parametros Especiais Faturamento - Aba - Geral - Utiliza Preço Unitário Calculado da Formulação?'  ao utilizar a configuração, todos os valores manipulados em 'RMTG - Montagem de Produtos Compostos' referente ao 'Módulo Tintas'  serão levados a '75OV - Cadastro de Orçamentos' e '2131 - Cadastro de Pedidos', ignorando o valor de tabela trazido referente ao produto 'Genérico' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A base de dados que contém todas as tintas e formulações referente ao catálogo será importado pela equipe de desenvolvimento, cada catálogo possui características próprias com suas cores e fórmulas, ou seja, um banco de dados de 'X' marca não poderá ser utilizado na marca 'Y' . Após a importação do banco de dados o passo seguinte será o cadastro dos  'Produtos Formulação Tintas' , das 'Bases' e dos 'Pigmentos' no sistema Hádron."
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos - Produtos Formulação Tintas (Genérico) - Para cada 'Catálogo X Unidade de Tamanho (LT, GAL, LAT, QUA)' criar um produto genérico com a adequada tributação informando na aba 'Complementos' a informação 'Tipo 1 - Formulação Fixa para Tintas' e seu respectivo 'Catálogo' . No campo 'Volume' informar o valor convertido em ML (Mililitros) , por exemplo, um Galão de 3,6 LT , deve ser colocado '3600' , essa informação deverá ser inserida somente para  catálogos automotivos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/1232_Prod_Formul_Tintas.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs1: Esse produto NÃO fará baixa de estoque, ele será o produto genérico responsável por habilitar o Módulo Tintas no momento da venda, a informação inserida no campo 'Volume Cálculo' será utilizada para efetuar a correta baixa proporcional nas bases e pigmentos conforme o catálogo importado."
      },
      {
        "type": "p",
        "text": "Obs2: Caso o cliente possua diferença de preço entre as tabelas (acréscimo/desconto), o fator deverá estar aplicado nas tabelas utilizadas no cadastro do produto genérico, pois, independentemente do preço realizado no produto formulado o sistema utilizará esse fator para atualizar o preço do produto formulado tintas caso ocorra troca de tabelas no momento da venda."
      },
      {
        "type": "p",
        "text": "Note que o resultado do produto formulado tintas na grande maioria das vezes terá um valor totalmente diferente ao inserido no produto genérico, porém, o que é importante e o que será utilizado como fator é o diferencial proporcional em porcentagem entre as tabelas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos - Produto Base de Tinta -  Após a importação do catálogo todos os produtos tipo 'Base'  deverão ser cadastrados, na aba  'Complementos'  informar 'Tipo Produto - B - Base/Embalagem'  com seu respectivo volume."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/1232_Prod_Base_Tintas.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs: Todos os produtos 'Embalagem' usados na formulação de tintas automotivas devem estar com o 'Tipo Produto - B - Base/Embalagem'  e seu respectivo volume."
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos - Produto Pigmento -  Após a importação do catálogo todos os produtos tipo 'Pigmento' deverão ser cadastrados, utilizar unidade 'ML' para o estoque podendo ser até a secundária caso o faturamento utilize um outro tipo de unidade para emissão de notas fiscais, é importante ressaltar o controle do estoque em 'ML' para fins de Sped Fiscal (Bloco K) e controle das mini OP's que serão geradas ao produzir a tinta, a medida padrão dos arquivos importados enviados pela indústria é  'ML' , na aba 'Complementos' informar 'Tipo Produto - P - Pigmento'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/1232_Prod_Pigmento_Tintas.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs: Todos os produtos 'Thinner' usados na formulação de tintas automotivas também devem estar como unidade 'ML' e campo 'Tipo Produto - P - Pigmento'."
      },
      {
        "type": "p",
        "text": "5115 - Cadastro de Cores - Nessa tela é aonde será realizado a consulta do catálogo importado e suas cores, esses registros são criados no momento da importação. Outra função extremamente importante para o funcionamento de módulo é criar os vínculos entre o banco de dados importado e os produtos cadastrados anteriormente, TODAS as bases e pigmentos deverão estar vinculados, é esse vínculo que será reponsável por associar os produtos as fórmulas das tintas e consequentemente o controle de estoque de todo esse material."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/5115_Vinc_Cores_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " Abaixo exemplo de listagem exibindo bases e pigmentos do catálogo e seus respectivos vínculos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/Rel_Base_Pig_Vinc.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "75OV/2131 - Tela de Vendas - Busca Catálogo/Tintas -  Ao iniciar a venda deve-se selecionar o 'Produto Formulação Tintas' com a litragem desejada, se configurado corretamente o botão 'Cor' ficará habilitado, ao pressioná-lo abrirá a busca para seleção da cor."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/75OV_Tintas_new.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O catálogo trazido será o configurado no cadastro do produto genérico (1232)  como explicado anteriormente, a busca é feita no modo 'Contendo' e poderá ser feita pelo 'Nome' da cor ou pela 'Descrição da Base' , uma vez escolhida a cor, na parte direita ficará disponibilizado as bases disponíveis para essa escolha, caso a base escolhida não possua vínculo (5115) será exibido uma mensagem alertando sobre a situação, isso não será impeditivo para a emissão da venda."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/FSCO_Tint_cor_2.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Outra possibilidade disponível é a tinta customizada, no qual o operador escolhe a base e pigmentos que serão utilizados na formulação, para abrir essa função pressionar o botão 'Customizar',  também é possível inserir uma descrição da tinta que foi formulada que será impresso na danfe."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/RMTG.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " "
      },
      {
        "type": "p",
        "text": "Escolhido a tinta formulada do catálogo ou customizada, no retorno a '75OV - Cadastro de Orçamentos' o saldo exibido será o menor dentre os itens pertencentes a composição, ao posicionar o foco sobre o campo 'Saldo Estoque' será exibido o código do produto como o menor saldo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "As mesmas funções referente ao Módulo Tintas também estão disponíveis em '2131 - Cadastro de Pedidos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2136 - Formulações e Montagens - Para o controle dos pedidos que possuem tintas formuladas foi criado o relatório que aponta a fórmulação e a quantidade solicitada/utilizada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/2136_tinta.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/2136_Rel.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de danfe impresso com as informações das tintas formuladas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20%27Tintas/Danfe_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20e%20Opera%C3%A7%C3%A3o%20M%C3%B3dulo%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "RVEN/F8 - Visualização montagem de Produto Formulado Tintas",
          "RUS2 - Novo Parâmetro 'Utiliza Preço Unitário Calculado da Formulação?'",
          "1232 - Novo Campo 'Tipo Produto'",
          "1232 - Novos Campos Módulo 'Tintas'"
        ]
      }
    ]
  },
  {
    "id": "AP-123",
    "slug": "juncao_de_processos_de_pagamento_e_baixa_de_pagamento_a_fornecedor_utilizando_cheques_de_terceiros",
    "title": "Junção de Processos de Pagamento e Baixa de Pagamento a Fornecedor utilizando cheques de terceiros",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro"
    ],
    "updatedAt": "2020-09-16",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa orientar em relação a junção de processos de pagamento e ao uso de cheques de terceiros que tiveram entrada pela opção '7561 - Cadastro de Cheques' e '7511 - CAIXA - Frente de Loja' para o pagamento a forne",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/123/juncao_de_processos_de_pagamento_e_baixa_de_pagamento_a_fornecedor_utilizando_cheques_de_terceiros",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa orientar em relação a junção de processos de pagamento e ao uso de cheques de terceiros que tiveram entrada pela opção '7561 - Cadastro de Cheques' e '7511 - CAIXA - Frente de Loja' para o pagamento a fornecedores."
      },
      {
        "type": "p",
        "text": "1 - Junção de Processos de Pagamento -  Para efeito de pagamento a fornecedores é possível, caso seja conveniente, juntar todos os processos de um mesmo terceiro num único registro, para fazê-lo é necessário acessar '4311 - Processos de Pagamento' em modo 'Alteração' e pressionar o botão 'Junção de Documentos' , para habilitar o botão é necessário 'Senha Gerente' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/4311_Junc_Doc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao pressionar o botão 'Junção de Documentos' abrirá a 'PJPR - Seleção de Processos para Junção' , escolher o terceiro desejado e os processos que serão unificados:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/PJPR_Selec_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após a confirmar a operação será criado um novo processo de pagamento, no qual, poderá ser dado novo parcelamento e novas datas de vencimento"
      },
      {
        "type": "p",
        "text": "2 - Pagamento a Fornecedor utilizando cheques de terceiros -  Acessar '4312/41BP - Baixas - Contas a Pagar' modo 'Inclusão' e selecionar através da busca (F3) o título a ser pago:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/4312_Inc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/Sele%C3%A7%C3%A3o_Titulo_pag_cheque_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3 - Após a seleção do título ao posicionar o foco sobre o campo 'Valor Baixa' pressionar a tecla 'F3' para abrir a seleção dos cheques a serem utilizados no pagamento a fornecedor:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/Selec_chequ_valor.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Conforme os cheques são selecionados é apresentado nas labels 'Total Selecionado' , 'Total Almejado (Valor Título)' e 'Diferença' os valores que irão compor a baixa. "
      },
      {
        "type": "p",
        "text": "4 - Se existir alguma diferença entre o valor dos cheques selecionados e o valor do título serão exibidas duas mensagens, uma referente ao valor da diferença a maior  e outra referente ao valor da diferença a menor :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/MSg_dif_maior.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/MSg_dif_menor.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Em ambos os casos os cheques serão QUITADOS no momento da baixa INDEPENDENTE da diferença encontrada."
      },
      {
        "type": "p",
        "text": "5 - Mediante a existência de diferença entre os valores selecionados eles devem ser ajustados na baixa, para o valor a maior deve ser inserido a diferença no campo 'Juros' , para o valor a menor deve ser inserido no campo 'Desconto' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/4312_Difs.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "6 -  Ao final de todo o processo os cheques utilizados estarão em consultas e relatórios com o status 'B - Baixado (finan)' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pagamento%20a%20Fornecedor%20utilizando%20cheques%20de%20terceiro/7561_status_cheque.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " "
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "41BC - Impressão dos cheques vinculados a baixa de títulos de contas a receber em recibo de cliente",
          "Impressão dos Cheques Vinculados ao Recebimento",
          "4312 - Baixa de novo tipo de documento 'DR'"
        ]
      }
    ]
  },
  {
    "id": "AP-121",
    "slug": "erro_75cf_70208_erro_sat_2000000_",
    "title": "Erro 75CF- 70208 - *ERRO SAT: 2000000 -",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-09-10",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao exibir essa mensagem durante a abertura da opção '7511/75CF - Cupom Fiscal' ou no momento da emissão do documento fiscal, está sendo informando que a comunicação entre o computador e o aparelho SAT através da porta us",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/121/erro_75cf_70208_erro_sat_2000000_",
    "content": [
      {
        "type": "p",
        "text": "Ao exibir essa mensagem durante a abertura da opção '7511/75CF - Cupom Fiscal' ou no momento da emissão do documento fiscal, está sendo informando que a comunicação entre o computador e o aparelho SAT através da porta usb perdeu sua conexão, faz - se necessário realizar alguns testes afim de retornar a comunicação: "
      },
      {
        "type": "p",
        "text": "1- Abrir o ativador do aparelho/marca e usar a opção 'Testar Comunicação'  para saber o status da comunição atual;"
      },
      {
        "type": "p",
        "text": "2 - Desligar o computador e em seguida desconectar os cabos que fazem a conexão entre o aparelho SAT e o computador, reconectar na mesma porta usb ou outra que esteja disponível, voltar a ligar e conferir comunicação;"
      },
      {
        "type": "p",
        "text": "3 - Caso ainda não exista comunicação após os testes mencionados acima, entrar em contato com o revendedor autorizado e solicitar uma visita local para conferência mais detalhada."
      }
    ]
  },
  {
    "id": "AP-122",
    "slug": "erro_75cf_70208_cf_e_emitido_com_obs_4000999_erro_ao_atualizar_registro_de_movimento_",
    "title": "Erro 75CF- 70208- *CF-e Emitido com Obs: 4000999 - Erro ao atualizar registro de Movimento!!",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-09-10",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao exibir essa mensagem após a emissão de um documento SAT, faz - se necessário testar a comunicação com o computador através do ativador do aparelho SAT afim de saber se a conexão está estável, pois o hardware pode esta",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/122/erro_75cf_70208_cf_e_emitido_com_obs_4000999_erro_ao_atualizar_registro_de_movimento_",
    "content": [
      {
        "type": "p",
        "text": "Ao exibir essa mensagem após a emissão de um documento SAT, faz - se necessário testar a comunicação com o computador através do ativador do aparelho SAT afim de saber se a conexão está estável, pois o hardware pode estar tendo falhas ao atualizar a memória interna."
      }
    ]
  },
  {
    "id": "AP-120",
    "slug": "rotinas_de_fechamento_e_condensacao_de_arquivos_sistema_hadron",
    "title": "Rotinas de fechamento e condensação de arquivos sistema Hádron",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-09-09",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "Todas as rotinas que serão descritas abaixo tem o objetivo de fornecer um acesso mais rápido a informação por meio da condensação de arquivos, essas rotinas devem ser realizadas periodicamente e deverão ser ensinadas par",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/120/rotinas_de_fechamento_e_condensacao_de_arquivos_sistema_hadron",
    "content": [
      {
        "type": "p",
        "text": "Todas as rotinas que serão descritas abaixo tem o objetivo de fornecer um acesso mais rápido a informação por meio da condensação de arquivos, essas rotinas devem ser realizadas periodicamente e deverão ser ensinadas para que os próprios clientes possam fazê-las."
      },
      {
        "type": "p",
        "text": "2340 - Fechamento diário - Integra faturamento ao livro fiscal de saída, estoque e contas a receber, também apaga o arquivo PDNOTAS.DAT que é criado ao realizar emissão de nota fiscal. Gerará faturas referente as notas fiscais emitidas no dia para condição de pagamento que tenha no campo  ‘Tipo Plano’  o valor  ‘M’."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/2340_Fec.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O link que segue é referente ao artigo que trata a emissão de faturas  https://ajuda.procion.com/artigo/guia/12/emissao_de_faturas ."
      },
      {
        "type": "p",
        "text": "2520 - RFFC - Fechamento Mensal -  Para acessá-lo é necessário senha gerente, a rotina deverá ser realizada após o término do mês/período com todos os lançamentos referente aos módulos Faturamento e Compras já concluídos. Os lançamentos referente ao mês fechado serão condensados para liberação de espaço em disco."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/2520_Fec.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2410 - Criação de Arquivos de Vendas - Gera o arquivo (PMVEmmaa.DAT) utilizado na emissão de relatórios como o '2450 - Elaborado de Vendas' entre outros, a rotina deve ser realizada diariamente. O Mês/Ano trazido será sempre o referente ao último fechamento feito pela opção '2520' , porém não impede que possa criar arquivos referente a outros meses em que o fechamento ainda não foi realizado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/2410_Cria_Arq.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3230 - Fechamento Diário Compras - A rotina integra o compras ao estoque, contas a pagar, acumulados utilizados para consultas e relatórios e previsões, processá-lo ao final do dia."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/3230_Fech.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4520 - Condensação de Contas a Receber - Este programa elimina títulos quitados com data de pagamento até a data informada em tela, ao realizar esse processo o arquivo ficará menor e consequentemente os relatórios e consultas ficarão mais rápidos aos serem emitidos. Se informado em tela a data '01/01/60' o sistema fará uma varredura em todo o arquivo e caso encontre algum registro danificado fará a reabertura do título para ser baixado novamente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/4520_Condens.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4530 - Condensação de Contas a Pagar -   Este programa elimina títulos quitados com data de pagamento até a data informada em tela, ao realizar esse processo o arquivo ficará menor e consequentemente os relatórios e consultas ficarão mais rápidos aos serem emitidos. Se informado em tela a data '01/01/60' o sistema fará uma varredura em todo o arquivo e caso encontre algum registro danificado fará a reabertura do título para ser baixado novamente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/4530_Condens.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5410 - Valorização Contábil Estoque - A rotina realiza o cálculo dos custos contábeis referente aos lançamentos de estoque, esse cálculo é utilizado para a composição de custo de produção e inventário, para realizá-lo é necessário que demais módulos que utilizem cadastro de produto e estoque não estejam em uso. O Mês/Ano trazido será sempre o último referente ao fechamento realizado pela rotina '5511' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/5410_Val_Estoque.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5511 - Atualização dos Arquivos do Estoque - Anterior a esse processo é necessário realizar o cálculo de custo contábil de estoque (5410) e que nele não seja apresentado nenhuma inconsistência, somente sob essa condição abrirá a opção '5511' . Essa rotina realiza a transferência de saldos mensais e acumula valores para emissão de relatórios gerenciais. Esse processo deverá ser realizado ao final do mês/período após todos os lançamentos tiverem sido concluídos, o arquivo de movimentação de estoque (PHEM0000) ficará menor e um backup referente ao mês fechado será criado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/5511_Fech_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5515 - Criação de Informações Estatísticas do Estoque - Este programa faz a geração de dados para informações estatísticas de movimentações dos produtos nos estoques tais como produtos A B C, mínimo e máximo, giro/antigiro e análise de movimentações, o link que segue é referente ao artigo que trata todo esse processo  https://ajuda.procion.com/artigo/guia/35/parametros_processos_relatorios_estoque_abc_minimo_maximo_giro_disponibilidade ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/5515_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7552 - Condensação de Orçamentos - A rotina elimina orçamentos com validade até a data informada, ao realizar o processo é possível escolher o tipo do documento a ser condensado (Orçamento, Pré-Venda, Faturado, Todos) , ao final será criado um arquivo de backup."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/7552_Condens.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7553 - Integração E.C.F x Estoque Financeiro - A rotina confere e integra cupons fiscais e documentos SAT ao estoque e contas a receber."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Rotinas%20de%20fechamento%20e%20condensa%C3%A7%C3%A3o%20de%20arquivos%20sistema%20H%C3%A1dron/7553_Integr.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Parametros - Processos - Relatórios Estoque ABC - Mínimo/Máximo - Giro - Disponibilidade",
          "Emissão de Faturas"
        ]
      }
    ]
  },
  {
    "id": "AP-118",
    "slug": "configuracao_de_backup_utilizando_7_zip",
    "title": "Configuração de Backup utilizando 7-Zip",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-08-20",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "O  7-Zip  é um compactador de arquivos com alta taxa de compressão que se destaca por suportar uma grande variedade de formatos. Comprime nas formas 7z, XZ, BZIP2, GZIP, TAR, ZIP e WIM e faz a descompressão em ARJ, CAB, ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/118/configuracao_de_backup_utilizando_7_zip",
    "content": [
      {
        "type": "p",
        "text": "O  7-Zip  é um compactador de arquivos com alta taxa de compressão que se destaca por suportar uma grande variedade de formatos. Comprime nas formas 7z, XZ, BZIP2, GZIP, TAR, ZIP e WIM e faz a descompressão em ARJ, CAB, CHM, RAR e outros. É fácil de usar e conta com funções similares a de seus principais concorrentes. Permite extrair e adicionar, assim como copiar, mover, excluir e gerenciar arquivos comprimidos."
      },
      {
        "type": "p",
        "text": "Os resultados da taxa de compressão dependem muito dos dados usados, geralmente o  7-Zip  comprime para o formato 7z de 30 a 70% melhor que no formato zip. E o  7-Zip  comprime para o formato zip de 2 a 10% melhor que outro programa compatível com o zip."
      },
      {
        "type": "p",
        "text": "O  7-Zip  funciona em Windows 10 / 8 / 7 / Vista / XP / 2013 / 2008 / 2003 / 2000 / NT. Há uma versão portada para Linux/Unix da versão linha de comando."
      },
      {
        "type": "h3",
        "text": "No servidor Prócion os programas necessários para a configuração do backup encontram-sem em I:\\PROCION\\Backup\\7-Zip."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20de%20Backup%20utilizando%207-Zip/BK_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Para instalar o 7-ZIP clique em 'Install' , após o término da instalação pressionar o botão 'Close' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20de%20Backup%20utilizando%207-Zip/BK_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20de%20Backup%20utilizando%207-Zip/BK_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "  "
      },
      {
        "type": "h3",
        "text": "Para configurar o backup siga os passos abaixo:"
      },
      {
        "type": "p",
        "text": "1 - Verificar se o tipo do sistema no micro em que vai configurar o Backup é Windows 32 ou 64 Bits;"
      },
      {
        "type": "p",
        "text": "2 - Instalar o aplicativo \"7z1902\" de acordo com o tipo do sistema Windows (7z1902_32Bits ou 7z1902_64Bits);"
      },
      {
        "type": "p",
        "text": "3 - Criar o atalho na área de trabalho do icone de Backup (BACKUP 7-ZIP.bat);"
      },
      {
        "type": "p",
        "text": "4 - Editar o arquivo BACKUP 7-ZIP.bat ajustar as Letras das unidades de gravação (Pendrive) e banco de dados \"PROGEST\";\n    \n    Exemplo: 7z.exe a \"E:\\PROGEST.7z\" \"P:\\PROGEST\" "
      },
      {
        "type": "p",
        "text": "             \"E:\\PROGEST.7z\" -> onde será gravado (Pendrive)\n             \"P:\\PROGEST\"    -> onde se localiza a base de dados (Pasta PROGEST)"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20de%20Backup%20utilizando%207-Zip/BK_4.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-119",
    "slug": "manifestacao_de_nota_fiscal_eletronica",
    "title": "Manifestação de Nota Fiscal Eletrônica",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-08-20",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "A manifestação de destinatário eletrônica é o registro de eventos por parte de quem recebeu uma NF-e (nota fiscal eletrônica), se alguma empresa emitiu uma nota fiscal contra o seu CNPJ, você, como destinatário, informa ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/119/manifestacao_de_nota_fiscal_eletronica",
    "content": [
      {
        "type": "h3",
        "text": "O que é manifestação de nota fiscal eletrônica?"
      },
      {
        "type": "p",
        "text": "A manifestação de destinatário eletrônica é o registro de eventos por parte de quem recebeu uma NF-e (nota fiscal eletrônica), se alguma empresa emitiu uma nota fiscal contra o seu CNPJ, você, como destinatário, informa ao Fisco que tem conhecimento sobre a emissão e se a operação está confirmada, se não foi realizada ou se você a desconhece. Por parte do destinatário a vantagem de utilizar esse recurso é identificar se seu CNPJ ou Inscrição Estadual pode ter sido utilizado de forma indevida em alguma operação comercial, por parte do emissor formaliza o vínculo comercial e com o registro do evento dispensa a assinatura no canhoto da Danfe."
      },
      {
        "type": "p",
        "text": "A manifestação de nota fiscal eletrônica é obrigatória de acordo com o Sinef (Sistema Nacional de Informações Econômicas e Fiscais) para as categorias:"
      },
      {
        "type": "ul",
        "items": [
          "Estabelecimentos distribuidores de combustíveis, em relação às NF-e que acobertarem operações com combustíveis e lubrificantes, derivados ou não de petróleo;",
          "Postos de combustíveis e transportadores revendedores retalhistas, em relação às NF-e que acobertarem operações com combustíveis e lubrificantes, derivados ou não de petróleo;",
          "Estabelecimentos adquirentes de álcool para fins não combustíveis, transportado a granel, em relação às NF-e que acobertarem operações com essa mercadoria;",
          "Estabelecimentos distribuidores ou atacadistas, em relação às NF-e que acobertarem operações com cigarros, bebidas alcoólicas (inclusive cervejas e chopes), refrigerantes e água mineral;",
          "NF-e com valor de operação superior a R$ 100 mil. A obrigatoriedade, nesse caso, incide sobre todos os tipos de mercadoria, exceto quando as operações se dão entre estabelecimentos da mesma empresa."
        ]
      },
      {
        "type": "h2",
        "text": "Tipos de manifestação de destinatário"
      },
      {
        "type": "p",
        "text": "Ciência da Operação: R egistra que o destinatário tem conhecimento da emissão da NF-e contra o seu CNPJ, não quer dizer que ele manifesta ciência sobre a operação comercial realizada, apenas sobre a existência da nota,  a partir desse evento ele pode baixar o arquivo XML referente à NF-e."
      },
      {
        "type": "p",
        "text": "Confirmação da Operação: O evento é registrado nessa categoria caso seja reconhecido por parte do destinatário que a mercadoria referente a NF-e foi recebida, é possível confirmar mesmo se o produto não chegou, porém, não será mais possível cancelar a NF-e."
      },
      {
        "type": "p",
        "text": "Operação não realizada:  Se o destinatário reconhece a operação descrita na NF-e, mas não recebeu a mercadoria acordada, deve-se registrar o evento 'Operação não realizada' . Vale também para situações em que houve um sinistro da carga durante o transporte ou se o produto errado é entregue."
      },
      {
        "type": "p",
        "text": "Desconhecimento de Operação:  É quando o destinatário declara que não solicitou a operação descrita na NF-e. Registra-se esse evento quando a inscrição estadual e CNPJ do destinatário são usados indevidamente por parte do emitente da nota fiscal. Manifestando desconhecimento, o destinatário se protege de possíveis passivos tributários advindos de operações fraudulentas."
      },
      {
        "type": "h3",
        "text": "Manifestando Notas Fiscais Eletrônicas no sistema Hádron"
      },
      {
        "type": "h3",
        "text": "Para realizar a manifestação de notas fiscais acessar a opção '3217 - Consulta NFe's SEFAZ' e utilizar o botão 'Consulta DF-e' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifesta_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao final da consulta será exibido uma mensagem dizendo quantas notas fiscais foram encontradas e as operações possíveis (Ciência da Op, Confirmação da Op, Desconhecimento da Op e Op. Não Realizada) , os dados NÃO serão carregados em tela nesse momento, para que sejam visualizados deve-se primeiro escolher uma das operações disponíveis."
      },
      {
        "type": "h3",
        "text": "Conforme a operação escolhida é feita e a comunicação com a Sefaz é realizada automaticamente o status é atualizado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifestaa_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Nas operações 'Ciência da Op' e 'Confirmação da Op.' é possível realizar o processo e efetuar o download do arquivo xml ao mesmo tempo através do botão 'Conf + Download' , conforme o processo é realizado o status é atualizado automaticamente, caso o arquivo xml ainda não esteja disponível para download na Sefaz ao final das 5 tentativas será exibido uma mensagem dizendo para efetuar a ação mais tarde."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifesta_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em 'Desconhecimento da Op' e 'Op. Não Realizada' a opção em lote (Todos) não ficará disponível, esse processo será feito nota a nota sendo que para o evento 'Op. Não Realizada' deve-se inserir uma justificativa com o mínimo de 15 caracteres."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifestaa_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Existe uma funcão exclusiva para efetuar download dos arquivos xml após a operações de Ciência e Confirmação da operação e uma função qua realiza a impressão da Danfe caso o arquivo encontre-se disponível na base de dados do cliente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifestaa_5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao inserir a senha gerente será habilitado o botão 'Manutenção' que tem a função de alterar o status de uma nota fiscal que já possui algum evento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifestaa_6.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao clicar sobre o botão se abrirá duas combo box, a primeira refere-se ao status atual do documento e a segunda ao que deseja-se alterar, os dados serão carregados em tela e será possível escolher todos de uma vez só."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifestaa_7.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para transportadoras que trabalham com a emissão de CT-e existe um filtro no qual é possível selecionar em tela somente as notas fiscais para transporte através do filtro 'T - NF-e (a Transportar)' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesta%C3%A7%C3%A3o%20de%20Nota%20Fiscal%20Eletr%C3%B4nica/Manifestaa_8.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " "
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Conferência Quantitativa - Entrada de Materiais",
          "Importação de Arquivo XML para NFe de Entrada de Mercadorias",
          "Cotação e emissão de Ordem de Compra"
        ]
      }
    ]
  },
  {
    "id": "AP-117",
    "slug": "emissao_de_notas_fiscais_no_processo_de_industrializacao_por_conta_e_ordem_de_terceiro",
    "title": "Emissão de Notas Fiscais no processo de Industrialização por conta e ordem de terceiro",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "producao"
    ],
    "updatedAt": "2020-08-13",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "Algumas indústrias optam por delegar à um terceiro parte do seu processo produtivo. É nesta hora que o processo de industrialização por conta e ordem de terceiro entra em ação. De um lado nós teremos a indústria que quer",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/117/emissao_de_notas_fiscais_no_processo_de_industrializacao_por_conta_e_ordem_de_terceiro",
    "content": [
      {
        "type": "h3",
        "text": "Industrialização por conta e ordem de terceiro"
      },
      {
        "type": "p",
        "text": "Algumas indústrias optam por delegar à um terceiro parte do seu processo produtivo. É nesta hora que o processo de industrialização por conta e ordem de terceiro entra em ação. De um lado nós teremos a indústria que quer terceirizar parte do seu processo produtivo e do outro lado nós teremos o terceiro, aquele que executará parte da produção de alguém."
      },
      {
        "type": "h3",
        "text": "Fluxo básico de trabalho:"
      },
      {
        "type": "p",
        "text": "A. A indústria enviará para o terceiro o insumo necessário para a transformação. Uma NF-e de  Remessa para industrialização por encomenda  deve ser emitida;"
      },
      {
        "type": "h3",
        "text": "B. O terceiro realizará a transformação necessária;"
      },
      {
        "type": "p",
        "text": "C. O terceiro deve devolver o insumo que sobrou através de uma NF-e de  Retorno de mercadoria recebida para industrialização e não aplicada no referido processo;"
      },
      {
        "type": "p",
        "text": "D.  O terceiro deve ainda devolver virtualmente o insumo que ele consumiu através de uma NF-e de  Retorno de mercadoria utilizada na industrialização por encomenda;"
      },
      {
        "type": "p",
        "text": "E. E por último, o terceiro cobrará o seu serviço e outros insumos que ele empregou através de uma NF-e de  Industrialização efetuada para outra empresa ."
      },
      {
        "type": "h3",
        "text": "Emissão realizada pela Indústria:"
      },
      {
        "type": "p",
        "text": "A indústria irá disponibilizar para o terceiro o insumo necessário para executar o serviço, para isto, ela deve emitir uma NF-e de  Remessa para industrialização por encomenda ."
      },
      {
        "type": "p",
        "text": "Esta é a primeira NF-e emitida no processo. Ela serve para transferir o insumo do estoque da indústria para o estoque do terceiro. Será utilizada também no transporte."
      },
      {
        "type": "h3",
        "text": "O Cadastro da transação em '2113 - Transações'  e '11TB - Cadastro de Tabela de Tributações' deverá seguir as orientações abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5901_6901.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/5901_6901_2.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5901_6901_2.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Obs: Transação ' Tipo da Venda - NN - Não Venda' ou 'RN - Remessa Consig/Benefic'."
      },
      {
        "type": "p",
        "text": "Obs:  Nesse momento não será realizado uma geração de receita através dessa emissão, utilizar em '2111 - Cadastro de Condições de Pagamento - Data Base - SD - À Vista, Sem Duplicata' ."
      },
      {
        "type": "h3",
        "text": "Emissão realizada pelo Terceiro:"
      },
      {
        "type": "p",
        "text": "O terceiro irá receber o insumo, efetuar o beneficiamento da matéria-prima, devolver o produto transformado, devolver virtualmente o insumo utilizado e cobrar pelo serviço."
      },
      {
        "type": "h3",
        "text": "A. Emissão devolvendo a matéria - prima que não foi utilizada:"
      },
      {
        "type": "p",
        "text": "O terceiro receberá da indústria o insumo necessário para efetuar a industrialização. Nem sempre todo o insumo enviado é utilizado, neste caso, o terceiro deve devolver o insumo restante para a indústria através de uma NF-e de  Retorno de mercadoria recebida para industrialização e não aplicada no referido processo ."
      },
      {
        "type": "h3",
        "text": "O Cadastro da transação em '2113 - Transações'  e '11TB - Cadastro de Tabela de Tributações' deverá seguir as orientações abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5903_6903.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5903_6903_2.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Obs: Transação ' Tipo da Venda - NN - Não Venda' ou 'BN - Retorno de Beneficiamento'."
      },
      {
        "type": "p",
        "text": "Obs:  Nesse momento não será realizado uma geração de receita através dessa emissão, utilizar em '2111 - Cadastro de Condições de Pagamento - Data Base - SD - À Vista, Sem Duplicata' ."
      },
      {
        "type": "h3",
        "text": "B. Emissão devolvendo a matéria - prima utilizada na industrialização:"
      },
      {
        "type": "p",
        "text": "O terceiro precisa indicar para a indústria o quanto ele utilizou do insumo no processo produtivo, esta indicação é feita através de uma NF-e de  Retorno de mercadoria utilizada na industrialização ."
      },
      {
        "type": "p",
        "text": "Este documento realiza uma espécie de retorno virtual do insumo, pois, na verdade, ele já não existe mais da forma na qual ele foi enviado, esta é uma NF-e obrigatória, sempre a emitirá no processo de industrialização por conta e ordem de terceiro."
      },
      {
        "type": "h3",
        "text": "O Cadastro da transação em '2113 - Transações'  e '11TB - Cadastro de Tabela de Tributações' deverá seguir as orientações abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5902_6902.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5902_6902_2.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Obs: Transação ' Tipo da Venda - NN - Não Venda' ou 'BN - Retorno de Beneficiamento'."
      },
      {
        "type": "p",
        "text": "Obs:  Nesse momento não será realizado uma geração de receita através dessa emissão, utilizar em '2111 - Cadastro de Condições de Pagamento - Data Base - SD - À Vista, Sem Duplicata' ."
      },
      {
        "type": "h3",
        "text": "C. Emissão Recebendo pelo serviço executado: "
      },
      {
        "type": "p",
        "text": "O terceiro precisa receber pelo serviço prestado, para isto, será emitida uma NF-e de Industrialização efetuada para outra empresa, esta NF-e não movimentará o estoque. Ela será usada apenas para gerar a cobrança e tributar devidamente os impostos. Esta é uma NF-e obrigatória. Você sempre a emitirá no processo de industrialização por conta e ordem de terceiro. "
      },
      {
        "type": "h3",
        "text": "O Cadastro da transação em '2113 - Transações'  e '11TB - Cadastro de Tabela de Tributações' deverá seguir as orientações abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5124_6124.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Industrializa%C3%A7%C3%A3o%20por%20conta%20e%20ordem%20de%20terceiro/5124_6124_2.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Obs: Transação ' Tipo da Venda - VN - Venda' ou 'BN - Retorno de Beneficiamento'."
      },
      {
        "type": "p",
        "text": "Obs:  Nesse momento será realizado uma geração de receita através dessa emissão, utilizar em '2111 - Cadastro de Condições de Pagamento - Data Base'  valores condizentes para que o financeiro seja criado no módulo 'Contas à Receber' ."
      },
      {
        "type": "h3",
        "text": "Obs: Normalmente existe uma confusão quanto ao nome dos produtos que cada NF-e deve conter."
      },
      {
        "type": "h3",
        "text": "A regra é simples:"
      },
      {
        "type": "p",
        "text": "a. Nas notas de retorno, você utilizará o mesmo produto que você recebeu da indústria.\n b. Na nota de cobrança do serviço, você utilizará o nome do produto que você gerou."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Nota Fiscal para Área de Livre Comércio/Zona Franca de Manaus",
          "Nota Fiscal de Anulação de Frete",
          "Nota Fiscal de Exportação Direta e Indireta",
          "Notas Fiscais de Complemento de Imposto",
          "Emissão de NFC-e - Nota Fiscal Consumidor Eletrônica",
          "Nota Fiscal de Devolução de Compra de Mercadorias a Fornecedor - Saída"
        ]
      }
    ]
  },
  {
    "id": "AP-116",
    "slug": "erro_hadron_hadron8.exe_imagem_incorreta",
    "title": "Erro - HADRON: HADRON8.EXE - Imagem Incorreta",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-08-13",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "- Ao realizar a transferência\\cópia de um programa para o servidor e, posteriormente, ao tentar abrir a opção exibir a mensagem de erro 'X:\\Hadronw\\HADEXE\\PHADXXXX.dll não foi criado para ser executado no Windows ou cont",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/116/erro_hadron_hadron8.exe_imagem_incorreta",
    "content": [
      {
        "type": "p",
        "text": "- Ao realizar a transferência\\cópia de um programa para o servidor e, posteriormente, ao tentar abrir a opção exibir a mensagem de erro 'X:\\Hadronw\\HADEXE\\PHADXXXX.dll não foi criado para ser executado no Windows ou contém erro. Tente instalar o programa novamente usando a mídia de instalação original ou contate o administrador de sistemas ou fornecedor do software para obter suporte' significa que ao realizar a transferência do arquivo o mesmo foi corrompido ficando com o tamanho de '0KB' , na sequência também será exibida a mensagem 'Loading \"X:\\Hadronw\\HADEXE\\PHADXXXX.dll\" failed. (null)'. Para resolver a situação é necessário realizar a transferência\\cópia do arquivo novamente. "
      }
    ]
  },
  {
    "id": "AP-115",
    "slug": "integracao_hadron_web_x_e_commerce",
    "title": "Integração Hádron-Web x E-Commerce",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-08-03",
    "readTime": "7 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa fornecer orientações referente a configurações e ferramentas existentes na plataforma Hádron-Web para vendas no módulo E-Commerce, anterior a esse texto é recomendável ler os três artigos nos links abaixo:",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/115/integracao_hadron_web_x_e_commerce",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa fornecer orientações referente a configurações e ferramentas existentes na plataforma Hádron-Web para vendas no módulo E-Commerce, anterior a esse texto é recomendável ler os três artigos nos links abaixo:"
      },
      {
        "type": "h3",
        "text": "I nstalação ODBC MySql:"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/manual/47/hadron_mobile_manual_de_configuracoes"
      },
      {
        "type": "h3",
        "text": "Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace):"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/91/hadron_web_manutencao_de_cadastro_de_produtos_e_commerce_marketplace_"
      },
      {
        "type": "h3",
        "text": "Recepção e Emissão de Pedidos origem Hadron-Web:"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/guia/92/recepcao_e_emissao_de_pedidos_origem_hadron_web"
      },
      {
        "type": "p",
        "text": "O acesso a plataforma Hádron-Web será feito pelo endereço  https://hadronweb.com.br/admin/  ou  http://app.hadronweb.com.br/admin/ , informações para o primeiro acesso (Sigla/Operador/Senha) serão anteriormente fornecidos pelo departamento de Desenvolvimento Web. Para o módulo E-Commerce a plataforma Hádron-Web funcionará como um Back Office/Retaguarda, no qual, será possível a configuração de informações (layout/promoções/fretes/cupons de descontos/produtos) para a página da loja virtual, visualização de clientes e vendas além da manutenção de seus status."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_login_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao acessar a plataforma Hádron-Web será exibido um resumo referente a quantidade total de clientes, valor total em pedidos, total em quantidade de pedidos e produtos, além das últimas vendas realizadas com um ranking apontando os produtos mais vendidos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Home_Hadron_Web.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "  "
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Produtos"
      },
      {
        "type": "p",
        "text": "Nessa seção estarão relacionados todos os produtos anteriormente enviados para o banco de dados remoto pelo Hádron-ERP, será possível fazer manutenções referente a descrições, informações complementares, fotos, variações, videos e mecanismos de busca (Meta Seo)."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Produtos_H%C3%A1dron_Web_Menu.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao iniciar o modo de edição dos produtos (Ações - Editar) abrirá as opções abaixo:"
      },
      {
        "type": "h3",
        "text": "Produto Geral:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Produtos_H%C3%A1dron_Web_Geral.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto Complemento:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Produtos_H%C3%A1dron_Web_Complemento.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto Meta Seo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Produtos_H%C3%A1dron_Web_Meta_Seo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs1:Meta tags são parte das tags HTML que descrevem o conteúdo da sua página para os mecanismos de busca e visitantes do site. As metatags aparecem apenas no código da página e qualquer pessoa pode verificá-las pelo código-fonte (Ctrl + U)."
      },
      {
        "type": "p",
        "text": "Obs2: SEO é a abreviação de Search Engine Optimization, traduzido como Otimização para Mecanismos de Busca .  Esse termo compreende um conjunto de técnicas, estratégias, métodos, análises, processos e outros elementos que pretendem elevar o posicionamento, por reputação e relevância de um website ou blog nos resultados orgânicos dos sites de busca — como Google, Bing e Yahoo Search — colocando-o, de preferência, entre as primeiras posições."
      },
      {
        "type": "h3",
        "text": "Produto Imagens:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Produtos_H%C3%A1dron_Web_Imagens.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto Vínculos: Nessa seção serão criadas variações referente ao mesmo produto, variação de tamanho, cores, etc."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Produtos_H%C3%A1dron_Web_Vinculos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto Informações: Todas as informações apresentadas nessa seção só poderão ser alteradas via Hádron-ERP."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Produtos_H%C3%A1dron_Web_Informa%C3%A7%C3%B5es.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Clientes"
      },
      {
        "type": "p",
        "text": "Nessa seção serão apresentados todos os clientes cadastrados na plataforma, ao acessar (Ações - Editar) será possível consultar informações cadastrais, endereços e pedidos realizados. As manutenções referente ao cadastro serão feitas na própria página E-Commerce do cliente ou no Hádron ERP."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Clientes.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Edi%C3%A7%C3%A3o_Clientes.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Vendas"
      },
      {
        "type": "h3",
        "text": "Nessa seção as vendas poderão ser visualizadas além da possibilidade de manutenção de seus status."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Vendas_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Vendas_Status.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Configurações - Parâmetros"
      },
      {
        "type": "p",
        "text": "Nessa seção serão definidos parâmetros gerais para a loja virtual, tabela de preço, código do representante padrão, imagem de logotipo, opção de site (E-Commerce/Catálogo), contatos, e-mails utilizados para recebimento e envio e suas respectivas configurações."
      },
      {
        "type": "h3",
        "text": "Parâmetros Geral:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Config_Param_Geral.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Parâmetros Contato:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Config_Param_Contato.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Parâmetros Emails:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Config_Param_Emails.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Parâmetros Servidor SMTP:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Config_Param_Servidor_SMTP.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Configurações - Usuários"
      },
      {
        "type": "p",
        "text": "Nessa seção serão cadastrados usuários que terão acesso a plataforma Hádron-Web e a loja virtual do cliente, é possível definir diferentes perfis de acesso as funcionalidades."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Config_Usuarios.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Config_Usuarios_edi%C3%A7%C3%A3o.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Configurações - Log Acesso"
      },
      {
        "type": "h3",
        "text": "Nessa seção será apresentado um registro de log de acesso referente ao operador e dispositivo utilizado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Config_Log_Acesso.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "."
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site"
      },
      {
        "type": "p",
        "text": "Nessa seção são definidas configurações que estão diretamente ligadas a parte visual da loja virtual do cliente e itens que poderão compor o valor de venda do pedido."
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Visualizar:"
      },
      {
        "type": "h3",
        "text": "Ao clicar em 'Visualizar' abrirá a página da loja virtual do cliente com as configurações anteriormente definidas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Visualizar.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Visualizar_Loja.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Preferências"
      },
      {
        "type": "p",
        "text": "Em 'Preferências' são definidos características visuais da página da loja virtual do cliente, imagens referente a ícones, exibição ou não de informações para produtos e anúncios, plugins para Google, Facebook e Analytics, mídias socias, vínculos referenciando outros links e definição de layout e cores do site."
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Preferências - Geral"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Pref_Geral.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Preferências - Página inicial"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Pref_Pagina_Inicial.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Preferências - Produtos"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Pref_Produtos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Preferências - Plugins"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Pref_Plugins.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Preferências - Social Mídia"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Pref_Social_Midia.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Preferências - Layout"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Hadron_Web_Menu_Meu_Site_Pref_Layout.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Páginas"
      },
      {
        "type": "p",
        "text": "Nessa seção poderá ser vinculado outras páginas ligadas a instituição da loja virtual do cliente, elas poderão ser do tipo Institucional, Páginal Inicial e Ajuda."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Meu_Site_Paginas.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Categorias"
      },
      {
        "type": "p",
        "text": "Nessa seção serão exibidas todas as categorias que foram cadastradas no Hádron-ERP, na plataforma será possível a adição de descrição e imagem. Para a alteração do nome principal, realizar no Hádron-ERP."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Meu_Site_Categorias.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Banners"
      },
      {
        "type": "p",
        "text": "Para destacar categorias na página inicial da sua loja, além de contar com os menus principal e do rodapé, é possível apresentar  banners com imagens e links , que direcionarão o visitante da loja para categorias específicas."
      },
      {
        "type": "p",
        "text": "Obs: Para uma boa visualização no site, a imagem deve ser no mínimo 1920px de largura, a altura poderá variar, porém, o valor recomendado é 500px."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Meu_Site_Banners.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Propagandas"
      },
      {
        "type": "p",
        "text": "Nessa seção será possível a criação de propagandas que direcionem o cliente para áreas específicas da loja virtual chamando a sua atenção para um produto ou categoria específica, essa propaganda poderá ser alocada em diferentes posições dentro da página inicial conforme o desejo do operador responsável."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Meu_Site_Propagandas.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Leads - Contatos"
      },
      {
        "type": "p",
        "text": "Nessa seção serão apresentados todos os Leads/Contatos referente a loja virtual do cliente, um Lead é uma oportunidade de negócio para a empresa. De forma mais concreta, Lead é alguém que forneceu suas informações de contato (nome, email, telefone, etc.) em troca de uma oferta de valor no seu site (conteúdo, ferramenta, avaliação, pedidos sobre produto/serviço, entre outros)."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Meu_Site_Leads.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Cupom de Desconto"
      },
      {
        "type": "p",
        "text": "Nessa seção será incluso e exibido os cupons de descontos existentes, esse cupom poderá ser definido em porcentagem ou valor, definindo limite de quantidade referente ao seu uso, também é possível definir uma data de validade do mesmo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Meu_Site_Cupom_Desconto.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Hádron-Web - Menu - Meu Site - Fretes"
      },
      {
        "type": "p",
        "text": "Nessa seção serão definidos padrões de valores de frete agregando valor ou não a venda, é possível definir CEP mínimo e máximo, tamanhos referente a largura, altura e comprimento, valor mínimo e máximo, peso mínimo e máximo e prazo de entrega."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/H%C3%A1dron_Web_Menu_Meu_Site_Cupom_Fretes.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Principais campos a serem preenchidos na composição de um frete estão grifados nas figuras abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Frete_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E_Commerce_Mercado_Livre/Frete_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Recepção e Emissão de Pedidos origem Hadron-Web",
          "Hádron-Web - Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace)",
          "Hádron Mobile - Manual de Operações",
          "Hádron Mobile - Manual de Configurações"
        ]
      }
    ]
  },
  {
    "id": "AP-113",
    "slug": "mensagem_erro_2230_70067_titulo_xx_nnnnnn_ja_enviado_ao_banco_",
    "title": "Mensagem - Erro 2230- 70067 - Título XX - NNNNNN já Enviado ao banco!",
    "category": "erros",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro",
      "erro"
    ],
    "updatedAt": "2020-07-13",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao ocorrer esta mensagem quando for cancelar a nota fiscal na opção '2230 - Cancelamento de Notas Fiscais'  é necessário enviar o título mencionado (Sigla + Número + Parcela) para o 'Local 000/000'  através da opção '421",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/113/mensagem_erro_2230_70067_titulo_xx_nnnnnn_ja_enviado_ao_banco_",
    "content": [
      {
        "type": "p",
        "text": "Ao ocorrer esta mensagem quando for cancelar a nota fiscal na opção '2230 - Cancelamento de Notas Fiscais'  é necessário enviar o título mencionado (Sigla + Número + Parcela) para o 'Local 000/000'  através da opção '4214 - Envio de títulos'.  São os seguintes passos: Acessar a opção '4214' , clicar no botão 'Gerente' , preencher 'operador + senha' com nivel de permissão para tal procedimento, clicar no botão 'Incluir' , no campo 'Data de envio'  preencher com a data atual, em  'Local'  manter zeros  (000/000)  para que seja considerada a 'Modalidade: K - Carteira' , no campo documento preencher a mesma com (Sigla + Número + Parcela)  conforme mensagem em  '2230' , ao clicar no botão 'Confirma'  será informado uma vez que o mesmo título foi enviado para o banco cadastrado, porém, ao pressionar o botão 'Confirma'  mais uma vez o título será desvinculado ao banco e o cancelamento da nota fiscal será permitido."
      }
    ]
  },
  {
    "id": "AP-110",
    "slug": "mensagem_erro_75cf_70208_erro_sat_2006099_0000_",
    "title": "Mensagem - Erro 75CF- 70208- *ERRO SAT: 2006099 - 0000!",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-07-13",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao ocorrer este erro, é necessário que seja conferido a conexão com a internet que pode estar instável ou o aparelho emissor SAT está com data incorreta em sua memória, consequentemente, o aparelho não consegue atualizar",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/110/mensagem_erro_75cf_70208_erro_sat_2006099_0000_",
    "content": [
      {
        "type": "p",
        "text": "Ao ocorrer este erro, é necessário que seja conferido a conexão com a internet que pode estar instável ou o aparelho emissor SAT está com data incorreta em sua memória, consequentemente, o aparelho não consegue atualizar para a data atual e ao emitir o documento ocorre a rejeição, se faz necessário entrar em contato com o revendedor autorizado para que o aparelho seja atualizado manualmente."
      }
    ]
  },
  {
    "id": "AP-111",
    "slug": "mensagem_erro_enfi_70040_problemas_com_doc_erro_enfi_70040_problemas_com_a_nf_",
    "title": "Mensagem - Erro ENFI- 70040- Problemas com DOC: / Erro ENFI- 70040- Problemas com a NF:",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-07-13",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao ocorrer este erro, possivelmente o arquivo xml na pasta destino '\\U001\\FATURA\\NFE\\PRO' está inexistente/removido ou o caminho do mesmo foi trocado.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/111/mensagem_erro_enfi_70040_problemas_com_doc_erro_enfi_70040_problemas_com_a_nf_",
    "content": [
      {
        "type": "p",
        "text": "Ao ocorrer este erro, possivelmente o arquivo xml na pasta destino '\\U001\\FATURA\\NFE\\PRO' está inexistente/removido ou o caminho do mesmo foi trocado."
      }
    ]
  },
  {
    "id": "AP-112",
    "slug": "mensagem_erro_enfp_cnf_89_falha_na_chamada_da_dll_ponte_",
    "title": "Mensagem - Erro ENFP- CNF-89 - Falha na chamada da DLL ponte!",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-07-13",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao ocorrer este erro, se faz necessário conferir as permissões para as pastas do sistema, permissões no antivirus, se o caminho da rede está disponível e se necessário reiniciar tanto servidor quanto os computadores term",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/112/mensagem_erro_enfp_cnf_89_falha_na_chamada_da_dll_ponte_",
    "content": [
      {
        "type": "p",
        "text": "Ao ocorrer este erro, se faz necessário conferir as permissões para as pastas do sistema, permissões no antivirus, se o caminho da rede está disponível e se necessário reiniciar tanto servidor quanto os computadores terminais que acessam o sistema, pois, possivelmente algum arquivo esteja \"preso\" na rede."
      }
    ]
  },
  {
    "id": "AP-114",
    "slug": "mensagem_rejeicao_ie_do_destinatario_nao_informada",
    "title": "Mensagem - Rejeição: IE do destinatário não informada",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-07-13",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao ocorrer essa mensagem, é necessário que seja conferido em '1221 - Cadastro de Terceiros' se o mesmo possui inscrição estadual no portal Sintegra, caso não exista, confirmar se os campos no cadastro do cliente na aba '",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/114/mensagem_rejeicao_ie_do_destinatario_nao_informada",
    "content": [
      {
        "type": "p",
        "text": "Ao ocorrer essa mensagem, é necessário que seja conferido em '1221 - Cadastro de Terceiros' se o mesmo possui inscrição estadual no portal Sintegra, caso não exista, confirmar se os campos no cadastro do cliente na aba 'Identificação' campo  'Situação'  esteja '2 - Não contribuinte' , campo 'I.Estadual'  como 'ISENTO'  e na aba 'Fiscal/Contábil'  o campo 'Tipo de cliente'  como 'C - Cliente Consumidor (sem créd. ICM)'  para a emissão ocorrer normalmente."
      }
    ]
  },
  {
    "id": "AP-109",
    "slug": "mensagem_erro_12057_nao_foi_possivel_estabelecer_conexao_com_o_servidor_de_revogacao_ou_uma_resposta_definitiva_nao_pode_ser_obtida",
    "title": "Mensagem - Erro 12057 : Não foi possível estabelecer conexão com o servidor de revogação ou uma resposta definitiva não pôde ser obtida",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-07-03",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Para solucionar siga os passos: Acesse  'Opções do Internet Explorer - Opções da Internet - Avançadas' e desmarque as opções: 'Verificar revogação de certificados do servidor' , 'Verificar se há assinaturas em programas ",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/109/mensagem_erro_12057_nao_foi_possivel_estabelecer_conexao_com_o_servidor_de_revogacao_ou_uma_resposta_definitiva_nao_pode_ser_obtida",
    "content": [
      {
        "type": "h3",
        "text": "Esse erro costuma ocorrer quando é emitido uma Nota Fiscal de Serviços Eletrônica (NFS-e) ."
      },
      {
        "type": "p",
        "text": "Para solucionar siga os passos: Acesse  'Opções do Internet Explorer - Opções da Internet - Avançadas' e desmarque as opções: 'Verificar revogação de certificados do servidor' , 'Verificar se há assinaturas em programas baixados' e 'Verificar se há certificados revogados do fornecedor' ."
      }
    ]
  },
  {
    "id": "AP-108",
    "slug": "rejeicao_nfc_e_nao_pode_referenciar_documento_fiscal",
    "title": "Rejeição : NFC-e não pode referenciar documento fiscal",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-07-03",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Ao tentar referenciar a Nota Fiscal de Consumidor Eletrônica (NFC-e modelo 65) através da opção '2131 - Cadastro de Pedidos' Aba 'Notas Referenciadas'  e ocorrer a rejeição informada é porque não é permitido o acobertame",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/108/rejeicao_nfc_e_nao_pode_referenciar_documento_fiscal",
    "content": [
      {
        "type": "p",
        "text": "Ao tentar referenciar a Nota Fiscal de Consumidor Eletrônica (NFC-e modelo 65) através da opção '2131 - Cadastro de Pedidos' Aba 'Notas Referenciadas'  e ocorrer a rejeição informada é porque não é permitido o acobertamento  do documento, pois, o modelo (65) já tem uma estrutura similar a Nota Fiscal Eletrônica (NF-e modelo 55) , sendo possível somente a emissão de acobertamento para Cupom Fiscal e/ou SAT."
      },
      {
        "type": "p",
        "text": "Obs1:  O modelo '65' não substitui o modelo '55' para vendas interestaduais, sendo somente usado para situações onde não é possível emitir CF-e modelo 59 (SAT) ."
      },
      {
        "type": "p",
        "text": "Obs2:  Caso a emissão do NFC-e seja feita por engano, é possível cancelar o documento dentro do prazo de 24H ou após o prazo ter sido ultrapassado emitir uma nota fiscal eletrônica de devolução de acordo com a legislação de cada estado."
      }
    ]
  },
  {
    "id": "AP-107",
    "slug": "nota_fiscal_de_devolucao_de_compra_de_mercadorias_a_fornecedor_saida",
    "title": "Nota Fiscal de Devolução de Compra de Mercadorias a Fornecedor - Saída",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-05-28",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "2113 - Cadastro de Transações -  No cadastro da transação deve-se indicar a 'Característica' , o 'Tipo de Venda' e o 'CFOP' adequado para a operação. Utilizar 'Característica - 11 - Devolução, Remessas Troca/Garantia' e ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/107/nota_fiscal_de_devolucao_de_compra_de_mercadorias_a_fornecedor_saida",
    "content": [
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações -  No cadastro da transação deve-se indicar a 'Característica' , o 'Tipo de Venda' e o 'CFOP' adequado para a operação. Utilizar 'Característica - 11 - Devolução, Remessas Troca/Garantia' e 'Tipo Venda - CD - Devolução de Compras' . No grupo 'Destaque do Imposto em Dados Adicionais' caso a operação tenha 'ICMS-ST' é recomendado marcar a checkbox para que não ocorra problemas na emissão ao validar na Sefaz. Em relação o CFOP é aconselhável procurar ajuda especializada pois o código varia conforme característica tributária do produto e origem/destino da UF."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/2113_Devoluc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111/11TB - Cadastro de Tabelas de Tributação:  A nota fiscal de devolução deve ser um espelho referente a primeira nota fiscal de venda, isso também inclui os impostos, porém, no caso do  CST '010' existe uma particularidade. O  CST '010' deve calcular o ICMS de uma operação posterior que não é devida pelo emitente (substituto), assim, é gerado um valor e recolhido por guia a parte para garantir o recebimento e, na devolução, ele deve retornar 'espelhando' somente a operação dele, ou seja, o ICMS próprio. Sendo assim, ao emitir nota fiscal de a devolução, deve-se utilizar a CST '000' para que seja recebido de volta o crédito do icms da operação do substituto tributário e informar em 'Dados Adicionais' o 'ICMS-ST' para que seja apresentado na apuração o retorno do valor e o código de subitem da GIA que permite esse ressarcimento (pode ser um valor de várias devoluções em um lançamento na apuração). Esse mesmo princípio será utilizado referente ao CST '070',  no qual, deve também calcular o ICMS de operação posterior, porém com redução de base, nesse caso ao emitir a nota fiscal de devolução utilizar o CST '020' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/11_TB_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "OBS: Ao utilizar 'Tributação - 1 - Tributado (Isento)' em empresas optante do 'Simples Nacional' a informação referente ao campo 'Sit. Simples Nac'  deverá ser igual a '900 - Outros' ."
      },
      {
        "type": "p",
        "text": "O valor do imposto referente ao 'ICMS-ST' ficará em 'Outras Despesas Acessórias' na Danfe sendo também descrito em 'Dados Adicionais' , o valor referente ao imposto 'IPI' sairá em campo 'próprio' quando a empresa emitente faz crédito de IPI,  do contrário em 'Dados Adicionais' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/NF_Dev_Artigo.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/NF_artigo_2.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos - Os impostos incidentes em emissões referente ao regime Simples Nacional são todos relacionados em 'Dados Adicionais' na danfe, porém, existem situações em que é necessário o destaque dos impostos em campo próprio, nesse caso na aba 'Principal' deve-se alterar a informação referente ao campo 'Regime Operação' de 'S - Simples Nacional' para 'R - R.P.A' , dessa forma o sistema emitirá uma nota como fosse em Regime Normal."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/2131_Dev.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos - Detalhamento de ICMS - Na aba 'Itens' em 'Detalhamento de ICMS' é possível verificar os valores que estão sendo aplicados na nota fiscal de devolução referente ao ICMS e ICMS-ST , para esse tipo de emissão o checkbox 'Dest. em Dados Adic?' sempre deverá estar marcado evitando assim rejeição na emissão."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/2131_Detalhament_ICMS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Erros comuns na emissão: A falta de alguma informação no pedido ou uma configuração que não siga as orientações dadas acima levarão a rejeição da nota fiscal no momento da emissão, por exemplo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/Rejeicao_NF_complement.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Solução: Falta de preenchimento da informação referente a aba 'Notas Referenciadas' , em uma nota fiscal de devolução deve-se referenciar a nota fiscal de compra."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/2131_NF_Referenc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Outro exemplo de rejeição:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/Rejeicao_NF_Base_ST.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Solução:  Na aba 'Itens' em 'Detalhamento de ICMS' deve-se marcar o checkbox  'Dest. em Dados Adic?',  para que não seja necessário marcar item a item a cada emissão, já deixar parametrizado em '2113 - Cadastro de Transações' como dito anteriormente acima."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Devolu%C3%A7%C3%A3o%20de%20Compra%20de%20Mercadorias%20a%20Fornecedor%20-%20Sa%C3%ADda/soluc_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Nota Fiscal para Área de Livre Comércio/Zona Franca de Manaus",
          "Emissão de NFC-e - Nota Fiscal Consumidor Eletrônica",
          "Nota Fiscal de Exportação Direta e Indireta",
          "Nota Fiscal de Anulação de Frete",
          "Notas Fiscais de Complemento de Imposto"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "2131 - Cópia de Pedido entre Empresas",
          "2131/7513 - Impressão da composição do produto em dados adicionais da NFE"
        ]
      }
    ]
  },
  {
    "id": "AP-106",
    "slug": "nota_fiscal_de_exportacao_direta_e_indireta",
    "title": "Nota Fiscal de Exportação Direta e Indireta",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-05-28",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "No caso das exportações, o número '7'  indica que é uma saída de mercadorias do país. Os três dígitos seguintes indicam a natureza mais específica da operação. Exemplo, '7.101'  representa venda de produção do estabeleci",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/106/nota_fiscal_de_exportacao_direta_e_indireta",
    "content": [
      {
        "type": "h2",
        "text": "CFOP na Nota Fiscal de Exportação"
      },
      {
        "type": "p",
        "text": "No caso das exportações, o número '7'  indica que é uma saída de mercadorias do país. Os três dígitos seguintes indicam a natureza mais específica da operação. Exemplo, '7.101'  representa venda de produção do estabelecimento enquanto '7.102'  indica venda de mercadoria comprada ou recebida de terceiros. Já a  'CFOP 7501'  representa uma  exportação indireta ."
      },
      {
        "type": "p",
        "text": "EXPORTAÇÃO INDIRETA ou VENDA TRADING — à  A operação de exportação indireta consiste na venda de produtos ou mercadorias destinados à exportação, os quais saem do estabelecimento industrial ou comercial localizado no território nacional com destino para empresas comerciais exportadoras, trading companies ou qualquer outra empresa habilitada a operar com o comércio exterior, destinatárias, ambas localizadas no mesmo território nacional. Neste processo a empresa industrial ou comercial vendedora  vende  para empresas comerciais exportadoras, trading companies ou qualquer outra empresa habilitada a operar com o comércio exterior, que será a responsável pela venda e saída do produto e mercadoria com destino para empresas industrial ou comercial localizada no outro território internacional (outro país)."
      },
      {
        "type": "h2",
        "text": "Impostos na Nota Fiscal de Exportação"
      },
      {
        "type": "p",
        "text": "No Brasil há incentivos fiscais para a exportação. Portanto, não há incidência de tributos como PIS, COFINS, ICMS e IPI . No campo 'dados adicionais'  você pode informar o motivo porque tal tributo não está sendo recolhido."
      },
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações: Diferente a nota fiscal de importação, a de exportação não possui uma característica própria, utilizar '00 - Normal' para esse tipo de emissão."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Nota%20de%20Exporta%C3%A7%C3%A3o%20Direta%20e%20Indireta/2113_Export.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111/11TB - Cadastro de Tabelas de Tributações: Como dito anteriormente acima, existem incentivos fiscais para a exportação, portanto, todas as incidências referente aos impostos devem ser retiradas do cadastro da tributação."
      },
      {
        "type": "p",
        "text": "ATENÇÃO:  Obrigatoriamente deve-se utilizar a CST '041 - Não Tributada' para Regime Normal e CSOSN '300 - Imune' para empresas optante do Simples Nacional , do contrário haverá rejeição na emissão."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Nota%20de%20Exporta%C3%A7%C3%A3o%20Direta%20e%20Indireta/1111_Export_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "RUS2 - Parâmetros Especiais Faturamento:  Para a finalidade de emissão de nota fiscal de exportação indireta deve-se habilitar o parâmetro 'NFs Referenciadas: 2 - Libera (operação triangular)' presente na aba 'Pedidos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Nota%20de%20Exporta%C3%A7%C3%A3o%20Direta%20e%20Indireta/RUS2_Export.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos:  A nota fiscal de exportação indireta deve referenciar uma outra nota fiscal emitida anteriormente, inserida a correta CFOP (7501) o botão 'Exportação Indireta' será habilitado, informar 'Número do Registro de Exportação' , 'Chave da NFe' e 'Data de Emissão' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Nota%20de%20Exporta%C3%A7%C3%A3o%20Direta%20e%20Indireta/2131_Export_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Nota%20de%20Exporta%C3%A7%C3%A3o%20Direta%20e%20Indireta/2131_Export_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao realizar o referenciamento da nota fiscal automaticamente essa informação será inserida na aba 'Notas Referenciadas' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Nota%20de%20Exporta%C3%A7%C3%A3o%20Direta%20e%20Indireta/2131_Export_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Aba 'Fechamento Fiscal' sem incidência de qualquer imposto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Nota%20de%20Exporta%C3%A7%C3%A3o%20Direta%20e%20Indireta/2131_Export_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Emissão de NFC-e - Nota Fiscal Consumidor Eletrônica",
          "Nota Fiscal de Anulação de Frete",
          "Nota Fiscal para Área de Livre Comércio/Zona Franca de Manaus",
          "Notas Fiscais de Complemento de Imposto"
        ]
      }
    ]
  },
  {
    "id": "AP-105",
    "slug": "uso_aplicacoes_emprestimos_sistema_hadron",
    "title": "Uso Aplicações\\Empréstimos Sistema Hádron",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro"
    ],
    "updatedAt": "2020-05-26",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "A  aplicação financeira  equivale a compra de um ativo ou título de uma empresa ou instituição com a intenção de conseguir uma boa remuneração em um determinado período de tempo. Entre os principais tipos de  aplicações ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/105/uso_aplicacoes_emprestimos_sistema_hadron",
    "content": [
      {
        "type": "p",
        "text": "A  aplicação financeira  equivale a compra de um ativo ou título de uma empresa ou instituição com a intenção de conseguir uma boa remuneração em um determinado período de tempo. Entre os principais tipos de  aplicações  estão aquelas que possuem rendimento fixo e rendimento variável."
      },
      {
        "type": "p",
        "text": "Empréstimo  é uma dívida feita entre o consumidor e o banco ou a financeira. O consumidor pega dinheiro e tem um prazo para pagar o valor com juros. Não precisa ser feito apenas para a compra de um bem e, por isso, a financeira nem sempre tem algo para tomar de você."
      },
      {
        "type": "p",
        "text": "A inclusão de ambos citados acima será feito pela opção '4113 - Cadastro de Aplicações/Empréstimos' , deverão ser informados data do último vencimento e seu respectivo juros mensal, obrigatoriamente o 'Local/Banco' e 'Local/Portador' referente a instituição financeira que efetuou a 'Aplicação/Empréstimo' também deve ser informado, os lançamentos poderão estar vinculados a 'Conta Contábil' e 'Centro de Custo' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/4113_Aplic_Emprest.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4114 - Cadastro de Movimentos de Aplicações Empréstimos: Utilizado para efetuar lançamentos de aumento e diminuição de valores referente a 'Aplicação/Empréstimo' cadastrado anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/4114_Aplic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Opções de consulta referente a 'Aplicações/Empréstimos' :"
      },
      {
        "type": "p",
        "text": "4113/411A - Listagem de Aplicações/Empréstimos"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/4113_411A.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "RFIM - Análise Financeira (Botão de acesso presente na tela principal do sistema)"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/RFIM.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4410 - Elaborados de Fluxo de Caixa"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/4410_Aplic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4427 - Fluxo de Caixa Consolidado"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/4427_Aplic_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4431 - Posição Financeira Diária"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/4431_Aplic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4437 - Posição Diária do Ativo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20Aplica%C3%A7%C3%B5es%5CEmpr%C3%A9stimos%20Sistema%20H%C3%A1dron/4437_Aplic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "'Desc. Usual Vendas' x 'Desc. Financeiro'",
          "Financeiro Único - Fluxo de Caixa/Extrato"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "4410 - Novos Campos em Elaborado",
          "4410 - Novo Campo 'Data Real'",
          "4410 - Novo intervalo de datas para filtro 'Vencidos Até / prever para'",
          "4410 - Novo Checkbox 'Financeiro Único'",
          "4410 - Ordenação de relatório utilizando 'Quebra por Locais'"
        ]
      }
    ]
  },
  {
    "id": "AP-104",
    "slug": "importacao_de_lancamentos_contabeis",
    "title": "Importação de Lançamentos Contábeis",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-05-21",
    "readTime": "7 min",
    "author": "Prócion Sistemas",
    "summary": "Este programa permite a integração entre módulos de outros aplicativos, a partir de registros exportados por estes, e o módulo Contabilidade do Sistema Hádron, gerando-se lançamentos contábeis mensais. Tais aplicativos p",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/104/importacao_de_lancamentos_contabeis",
    "content": [
      {
        "type": "p",
        "text": "Este programa permite a integração entre módulos de outros aplicativos, a partir de registros exportados por estes, e o módulo Contabilidade do Sistema Hádron, gerando-se lançamentos contábeis mensais. Tais aplicativos podem ser a planilha MS-Excel (ou similares) ou quaisquer outros sistemas que permitam exportar seus dados no leiaute indicado abaixo."
      },
      {
        "type": "h3",
        "text": "No Sistema Hádron, deve-se estar dentro do 'Mês/Ano' base desejado para se realizar a integração."
      },
      {
        "type": "h3",
        "text": "Os lançamentos serão criados com tipo ‘ X ’, ‘ Y ’ ou ‘ Z ’, conforme especificado abaixo."
      },
      {
        "type": "p",
        "text": "Caso haja lançamentos anteriores já integrados com o MESMO TIPO e dentro do mesmo período, estes serão APAGADOS para serem relançados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/7241%20-%20Importa%C3%A7%C3%A3o%20de%20Lan%C3%A7amentos%20Cont%C3%A1beis/7241_Import.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Nome do Arquivo:   Informa-se aqui o caminho e o nome do Arquivo (formato TXT) a ser importado. O Sistema Hádron tem como padrão a pasta PROTRAB , mas o usuário poderá buscar o arquivo origem em outra pasta, o arquivo deve ser gravado em formato TXT."
      },
      {
        "type": "p",
        "text": "Tipo do Lançamento:  Tipo dos lançamentos que serão gerados na contabilidade. Deve ser ' X' , ' Y'  ou ' Z' , para identificação e/ou distinção da origem. Por exemplo, pode-se adotar o tipo ' X'  para lançamentos de custos de produção originados da planilha Excel e o tipo ' Y'  para arquivos de contas a receber gerados por sistema de outro prestador de serviços de informática. Nesses casos, lançam-se todos os dados nos respectivos aplicativos origem e, no final do mês, importam-se esses dados. Caso haja erros, corrigem-se-os em suas respectivas origens e importam-se-os novamente. O Sistema Hádron fará a troca dos lançamentos automaticamente (sem gerar duplicidade) eliminando os lançamentos anteriores de mesmo tipo e gravando os novos. Portanto, todos os registros referentes ao período devem ser exportados juntamente de novo."
      },
      {
        "type": "p",
        "text": "Dígito Verificador:  O sistema origem pode exportar seus dados sem os dígitos verificadores do Sistema Hádron. Nesse caso, NÃO  marque a checkbox e o Sistema Hádron fará a importação calculando tais dígitos. Caso contrário, marque e o Sistema Hádron fará as críticas necessárias (este método é mais seguro), pois, sendo a digitação das contas feita no sistema origem com os respectivos dígitos verificadores, há menos chance de haver erros de digitação."
      },
      {
        "type": "p",
        "text": "Separador de casas decimais:  Indica qual o separador de casas decimais utilizado pelo sistema origem, se a ',' (vírgula) ou o '.' (ponto) ."
      },
      {
        "type": "h3",
        "text": "Procedimentos para importar dados do EXCEL"
      },
      {
        "type": "h3",
        "text": "Passo 1 : Utilizar as colunas de ' A'  até ' H'  (8 colunas), sendo:"
      },
      {
        "type": "h3",
        "text": "Coluna ' A' : Referência"
      },
      {
        "type": "h3",
        "text": "Coluna ' B' : Dia"
      },
      {
        "type": "h3",
        "text": "Coluna ' C' : Conta contábil devedora"
      },
      {
        "type": "h3",
        "text": "Coluna ' D' : Centro de custo da conta devedora"
      },
      {
        "type": "h3",
        "text": "Coluna ' E' : Conta contábil credora"
      },
      {
        "type": "h3",
        "text": "Coluna ' F' : Centro de custo da conta credora"
      },
      {
        "type": "h3",
        "text": "Coluna ' G' : Valor (formatado ou não)"
      },
      {
        "type": "h3",
        "text": "Coluna ' H' : Histórico"
      },
      {
        "type": "h3",
        "text": "As colunas ' B' , ' G'  e ' H'  são de preenchimento obrigatório;"
      },
      {
        "type": "h3",
        "text": "As colunas ' A' , ' D'  e ' F'  devem existir porém podem ficar em branco;"
      },
      {
        "type": "p",
        "text": "As colunas ' C'  e ' E'  podem ser preenchidas ou não, porém, pelo menos uma delas deve estar preenchida e a soma dos valores a débito e a crédito devem bater no final."
      },
      {
        "type": "h3",
        "text": "Passo 2: Salvar arquivo utilizando:"
      },
      {
        "type": "h3",
        "text": "I – Opção 'Arquivo' ;"
      },
      {
        "type": "h3",
        "text": "II – Opção 'Salvar Como' ; No campo ' Salvar como tipo'  – escolher tipo texto (separado por tabulações);"
      },
      {
        "type": "h3",
        "text": "III – Definir o nome do arquivo;"
      },
      {
        "type": "h3",
        "text": "IV – Botão 'Salvar' ."
      },
      {
        "type": "p",
        "text": "Passo 3: No Sistema Hádron, abrir o arquivo na mesma pasta em que foi salvo pelo Excel, preencher os campos da tela conforme explicado anteriormente e confirmar a integração."
      },
      {
        "type": "h3",
        "text": "Regras para geração do arquivo por outros sistemas:"
      },
      {
        "type": "p",
        "text": "O arquivo a ser importado deverá ser mensal , ou seja, conter todas as informações de um mês. A sua organização deve ser LINE SEQUENTIAL (texto com separação de registros 0D e 0A hexadecimais) e sua extensão deverá ser ‘ TXT ’. O formato dos registros devem obedecer ao especificado abaixo (separam-se os campos por ‘ ; ’):"
      },
      {
        "type": "p",
        "text": "111...11 ; 22 ; 33333 ; 44 ; 55555 ; 66 ; 777.....77 ; 888.........88"
      },
      {
        "type": "h3",
        "text": "Onde:"
      },
      {
        "type": "p",
        "text": "111....11: (opcional) Identificação do documento: Campo alfanumérico de até 15 posições que identificam o registro. Será apenas utilizado para localização do documento no caso de inconsistência na importação;"
      },
      {
        "type": "p",
        "text": "22: (obrigatório) Dia do lançamento (já que mês/ano será o mês/ano base contábil);"
      },
      {
        "type": "p",
        "text": "33333: (obrigatório *) Conta Contábil Analítica Devedora (acompanhada ou não do dígito verificador). Esta conta deverá ser consistente com o tradutor do plano de contas cadastrado no Sistema Hádron (0 a 9999 + dígito);"
      },
      {
        "type": "p",
        "text": "44: (opcional) Centro de Custos da conta Devedora. Campo necessário apenas se a conta contábil do Sistema Hádron necessitar (0 a 99);"
      },
      {
        "type": "p",
        "text": "55555: (obrigatório *) Conta Contábil Analítica Credora (acompanhada ou não do dígito verificador). Esta conta deverá ser consistente com o tradutor do plano de contas cadastrado no Sistema Hádron (0 a 9999 + dígito);"
      },
      {
        "type": "p",
        "text": "66: (opcional) Centro de Custos da conta Credora. Campo necessário apenas se a conta contábil do Sistema Hádron necessitar (0 a 99);"
      },
      {
        "type": "p",
        "text": "777...77: (obrigatório) Valor do Lançamento. Poderá ou não ser utilizada a vírgula ou ponto, porém o Sistema utilizará, as duas últimas como sendo a casa dos centavos se não utilizados ponto ou vírgula (por exemplo: 12345 = 123,45; 123.45 = 123,45; 12,345 = 12,34; 123,4 = 123,40) (até 13 dígitos);"
      },
      {
        "type": "p",
        "text": "88888: (obrigatório) Histórico do lançamento (até 170 caracteres)."
      },
      {
        "type": "p",
        "text": "(*) Pode-se deixar a conta a débito (ou crédito) em branco desde que a outra conta (crédito ou débito) seja preenchida e, na soma final, o débito e o crédito batam."
      },
      {
        "type": "h3",
        "text": "Exemplo de registros válidos: (pode-se notar que os registros não necessitam de formatação rígida)"
      },
      {
        "type": "p",
        "text": "1234;21;7-5;2;102-4;2;100,00; Nota fiscal 1234 para fulano"
      },
      {
        "type": "p",
        "text": "1235;22;7-5;;102-4;;50,00;Nota fiscal 1235 para cicrano"
      },
      {
        "type": "p",
        "text": "1340;23;;;102-4;;75,00;Nota fiscal 1340 para beltrano"
      },
      {
        "type": "p",
        "text": "1340;23;7-5;;;;75,00;Recebimento Nota fiscal 1340"
      },
      {
        "type": "p",
        "text": ";31;7-5;;102-4;;1023.00;Notas fiscais a vista do período"
      },
      {
        "type": "h3",
        "text": "Exemplo de Registros inválidos:"
      },
      {
        "type": "p",
        "text": "1234;21;7-5;2;102-4;2;100,00 (falta histórico)"
      },
      {
        "type": "p",
        "text": "22;7-5;;102-4;;50,00;N.fiscal 1235 para ciclano (falta uma coluna)"
      },
      {
        "type": "p",
        "text": "1340;;;;102-4;;75,00;N.fiscal 1340 para beltrano (dia não informado)"
      },
      {
        "type": "h3",
        "text": "Observações:"
      },
      {
        "type": "p",
        "text": "( 1 ) Se algum registro estiver inconsistente ou débito/crédito não baterem, nenhum dado será importado;"
      },
      {
        "type": "p",
        "text": "( 2 ) O sistema que gerará o arquivo para integração com a contabilidade deverá fazê-lo com os tradutores contábeis utilizados pelo Módulo Contabilidade do Sistema Hádron. Os tradutores contábeis correspondem a códigos reduzidos de 4 dígitos vinculados às contas contábeis de 6 níveis do Plano de Contas. No Sistema Hádron, apresentam-se com seus respectivos dígitos verificadores, porém, os outros sistemas não necessitam utilizar-se desses dígitos."
      },
      {
        "type": "p",
        "text": "Os outros sistemas poderão conter campos de 4 dígitos que o usuário preencherá com os correspondentes tradutores contábeis ou, se por algum motivo não puderem ter esse campo ou este já estiver sendo utilizado de outra forma, deve-se criar uma tabela de relacionamento entre as transações de seus programas e as contas do Plano de Contas do Sistema Hádron."
      },
      {
        "type": "p",
        "text": "( 3 ) Da mesma forma que os tradutores contábeis, devem-se indicar os respectivos centros contábeis utilizados pelo Sistema Hádron. Tal informação pode constar em campos \" ad hoc \" (para isso) dos outros sistemas ou através de tabelas internas ou externas de relacionamento. Se as contas de débito ou crédito forem contas de centros, os respectivos centros devem ser informados. Caso contrário, podem estar zerados (se não estiverem, vide observações acima). Pode-se ter lançamentos com um centro informado e o outro zerado, desde que a definição das correspondentes contas assim o permita. Por exemplo:"
      },
      {
        "type": "h3",
        "text": "Lançamento N :"
      },
      {
        "type": "h3",
        "text": "Debitar conta X (não de centro) com centro débito igual a 0 ."
      },
      {
        "type": "h3",
        "text": "Creditar conta Y (de centro) com centro crédito diferente de 0 ."
      }
    ]
  },
  {
    "id": "AP-103",
    "slug": "uso_do_codigo_csosn_sistema_hadron",
    "title": "Uso do código CSOSN Sistema Hádron",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-05-19",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "O CSOSN ou Código de Situação da Operação do Simples Nacional é uma numeração para operações de empresas optantes pelos Simples Nacional na emissão de NFe.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/103/uso_do_codigo_csosn_sistema_hadron",
    "content": [
      {
        "type": "h2",
        "text": "O que é CSOSN?"
      },
      {
        "type": "p",
        "text": "O CSOSN ou Código de Situação da Operação do Simples Nacional é uma numeração para operações de empresas optantes pelos Simples Nacional na emissão de NFe."
      },
      {
        "type": "h3",
        "text": "Os códigos foram estabelecidos para fins de identificar a origem da mercadoria e o regime de tributação na operação."
      },
      {
        "type": "p",
        "text": "Empresas optantes pelo Simples Nacional, utilizam os códigos CSOSN, já as empresas optantes pelo Regime Normal utilizam os códigos CST."
      },
      {
        "type": "p",
        "text": "Existem vários códigos, cada um é inserido de acordo com o tipo de tributação da empresa ou o tipo de transação da mercadoria, assim como o regime tributário da mesma."
      },
      {
        "type": "h3",
        "text": "Tabela CRT"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20do%20c%C3%B3digo%20CSOSN%20Sistema%20H%C3%A1dron/Tab_CRT.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A definição de Código de Regime Tributário é simples, o contribuinte precisa apenas indicar se é optante pelo Simples Nacional (1), ou Regime Normal (3). Se tiver passado o sublimite da receita bruta fixado pelo estado, deve utilizar o código 2."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20do%20c%C3%B3digo%20CSOSN%20Sistema%20H%C3%A1dron/1112_CSOSN.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Tabela CSOSN"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20do%20c%C3%B3digo%20CSOSN%20Sistema%20H%C3%A1dron/Tab_CSOSN.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h2",
        "text": "Tenha ajuda especializada!"
      },
      {
        "type": "p",
        "text": "Para que o preenchimento do CSOSN seja feito de forma correta,  é importante o auxilio contábil , para que não haja problemas fiscais futuramente."
      },
      {
        "type": "p",
        "text": "1111 - 11TB - Cadastro de Tabelas de Tributações"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20do%20c%C3%B3digo%20CSOSN%20Sistema%20H%C3%A1dron/11TB_CSOSN.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Lembrando que após criar a regra tributária a mesma deve estar obrigatoriamente associada ao produto de alguma forma, ou diretamente em seu cadastro ou pela regra criada utilizando o código NCM como mostra as figuras abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20do%20c%C3%B3digo%20CSOSN%20Sistema%20H%C3%A1dron/1232_CSOSN.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20do%20c%C3%B3digo%20CSOSN%20Sistema%20H%C3%A1dron/1243_CSOSN.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Uma má configuração das tabelas de tributação levará a exibir a mensagem abaixo ao faturar a venda, toda correção deverá ser feita em '1111 - 11TB - Cadastro de Tabelas de Tributações'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Uso%20do%20c%C3%B3digo%20CSOSN%20Sistema%20H%C3%A1dron/CSOSN_Erro_Config.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Tributações exclusivas por Transação x CFOP",
          "Cadastro de Complementos Gerais N.C.M"
        ]
      }
    ]
  },
  {
    "id": "AP-102",
    "slug": "geracao_de_arquivos_para_balanca",
    "title": "Geração de Arquivos para balança",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-05-18",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Para Isso existe o campo 'Id.Balança'  em  '1232 - Cadastro de Produtos' , com tamanho de 15 posições com 2 formas de utilização estabelecida na aba 'Produtos'  da opção '1111 - Parâmetros Globais do Sistema' .",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/102/geracao_de_arquivos_para_balanca",
    "content": [
      {
        "type": "h3",
        "text": "Arquivos de Cargas para balanças devem respeitar o formato próprio de cada fabricante."
      },
      {
        "type": "h3",
        "text": "Estes arquivos podem conter informações específicas a cada balança que não dispomos em nosso cadastro de Produtos."
      },
      {
        "type": "p",
        "text": "Para Isso existe o campo 'Id.Balança'  em  '1232 - Cadastro de Produtos' , com tamanho de 15 posições com 2 formas de utilização estabelecida na aba 'Produtos'  da opção '1111 - Parâmetros Globais do Sistema' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20de%20Arquivos%20para%20balan%C3%A7a/1232_Balanc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20de%20Arquivos%20para%20balan%C3%A7a/1111_Produt_Balanc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na Opção '1332 - Elaborados de Produtos' , deve-se utilizar códigos de listagem a partir do número  '501' para a geração de arquivos. Escolhido o campo 'ID Balança'  serão solicitados 'Tamanho'  e 'Complemento'  que serão adicionados dentro do arquivo gerado no tamanho especificado."
      },
      {
        "type": "p",
        "text": "Se marcar o campo '1111 - Parâmetros Globais Sistemas - Aba Produtos - Permite utilização de Diversas Balanças?' , o comportamento será de utilizar o complemento como PONTEIRO DE INÍCIO DA STRING do campo a ser gravado."
      },
      {
        "type": "h3",
        "text": "Exemplo 1 :"
      },
      {
        "type": "p",
        "text": " No arquivo, a balança solicita que o produto informe o tipo ' H01'  para hortifruti e ' C07'  para Carnes junto ao código no formato:"
      },
      {
        "type": "p",
        "text": "  TTTCCCCPPPPPPPPP onde TTT é o tal tipo, CCCC é o código Interno e PPPPPPP é o valor, então no campo 'ID.BALANÇA' coloca-se 'H01'  e 'C07'  (pelo tipo do produto) e monta-se o arquivo na 1332 (código acima de 500) para gerar a string. "
      },
      {
        "type": "p",
        "text": "Se marcado  'Permite utilização de Diversas Balanças?'   na 1332 ,  cadastra-se o campo 'ID balança'  com Tamanho 3 e Complemento 1 para \"pegar\" 3  caracteres começando da posição 1 ."
      },
      {
        "type": "p",
        "text": "Se NÃO marcado 'Permite utilização de Diversas Balanças?'   na 1332 ,  cadastra-se  o campo 'ID balança'  com Tamanho 3 e Complemento 3 (pois sempre a posição inicial será 1);"
      },
      {
        "type": "h3",
        "text": "Exemplo 2 (Só funciona se  'Permite utilização de Diversas Balanças?'  estiver  marcado):"
      },
      {
        "type": "h3",
        "text": "O Cliente possui 2 balanças diferentes, cada uma necessitando de uma carga montada especifica."
      },
      {
        "type": "p",
        "text": "A balança 1: linha do arquivo : TCCCCDDPPPPPPPP onde T e o tipo 'H'  ou 'C'  para hortifruti e carnes; CCCC é o código do produto; DD é o número do departamento e PPPPP o preço."
      },
      {
        "type": "p",
        "text": "A balança 2: linha do arquivo : CCCCPPPPPPPPFDD onde CCCC é o código do produto;  PPPPP o preço; F é a Forma de venda 'U'  ou 'P  significando 'Valor por Unidade'  e \"Peso'  e DD é o departamento."
      },
      {
        "type": "p",
        "text": "O campo  'ID Balança'  do produto ficaria: C03P12 indicando produto  'C' (carne) e Departamento 03 da balança 1, e 'P' (por peso) e  Departamento 12 para a balança 2,  no 1332 montaria o arquivo da balança 1 com:"
      },
      {
        "type": "h3",
        "text": "ID Balanca: Tamanho 1, complemento (posição inicial) 1 ( C )"
      },
      {
        "type": "h3",
        "text": "Código interno: tamanho 4"
      },
      {
        "type": "h3",
        "text": "ID Balança: Tamanho 2, complemento 2 ( 03 )"
      },
      {
        "type": "h3",
        "text": "Preco: tamanho 8"
      },
      {
        "type": "h3",
        "text": "O arquivo da balança 2  com:"
      },
      {
        "type": "h3",
        "text": "Código interno: tamanho 4"
      },
      {
        "type": "h3",
        "text": "Preco: tamanho 8"
      },
      {
        "type": "h3",
        "text": "ID Balanca: Tamanho 3, complemento (posição inicial) 4 ( P12)"
      }
    ]
  },
  {
    "id": "AP-101",
    "slug": "alteracao_de_faixas_de_ceps_cidades",
    "title": "Alteração de Faixas de CEPS - CIDADES",
    "category": "comunicacao",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-05-16",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "https://www.correios.com.br/enviar-e-receber/ferramentas/cep/novas-cidades-codificadas-por-logradouros",
    "sourceUrl": "https://ajuda.procion.com/artigo/comunicacao/101/alteracao_de_faixas_de_ceps_cidades",
    "content": [
      {
        "type": "h3",
        "text": "Alteradas Faixas de CEPS das seguintes cidades:"
      },
      {
        "type": "h3",
        "text": "PIRAPORA / MG"
      },
      {
        "type": "h3",
        "text": "FRUTAL/MG"
      },
      {
        "type": "h3",
        "text": "ÁGUAS DE SÃO PEDRO/SP (*** ATENÇÃO: O CEP antigo não valerá mais pois a faixa alterada não compreende o antigo CEP)"
      },
      {
        "type": "h3",
        "text": "FÓZ DO IGUAÇU/PR (apenas alterações de CEPs dentro da faixa antiga)"
      },
      {
        "type": "h3",
        "text": "Consulte:"
      },
      {
        "type": "p",
        "text": "https://www.correios.com.br/enviar-e-receber/ferramentas/cep/novas-cidades-codificadas-por-logradouros"
      },
      {
        "type": "p",
        "text": "para conferir"
      }
    ]
  },
  {
    "id": "AP-99",
    "slug": "venda_pedido_programado_operacoes",
    "title": "Venda/Pedido Programado - Operações",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2020-05-04",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "5111 - Tipos de Estoque -  Deve-se cadastrar o estoque responsável pela movimentação de produtos para Venda Programada .",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/99/venda_pedido_programado_operacoes",
    "content": [
      {
        "type": "h3",
        "text": "Este artigo dará orientações referente ao processo de Venda Programada , parâmetros, operações, manutenção e consultas."
      },
      {
        "type": "p",
        "text": "5111 - Tipos de Estoque -  Deve-se cadastrar o estoque responsável pela movimentação de produtos para Venda Programada ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/5111_Prog_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros Globais Sistema - Estoque/Produção - Estoque Ped. Programado -  Feito o cadastro do tipo de estoque deve-se associá-lo ao parâmetro."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/1111_Prog_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "75OV - Cadastro de Orçamentos - Nessa tela deverá ser escolhida a operação tipo 'P - Venda Programada' , deve-se obrigatoriamente definir uma previsão de 'Data Entrega' e o campo 'Número do Pedido do Cliente' deverá ser preenchido, na falta dessa informação, escolher um número de forma aleatória."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7512_Prog_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao final do documento será habilitado o botão 'Programado' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7512_Prog_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O documento será transformado em 'Pedido Programado' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7512_Prog_5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5140 - Visualização de Estoques de Produtos -  Feito o processamento o saldo será adicionado ao estoque 'Ped. Programado'  configurado anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/5140_Prog_6.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7516 - Controle de Pedidos / Entregas - Nessa tela serão realizadas todas as operações e manutenções referente aos Pedidos Programados, a medida em que a mercadoria é entregue de forma parcial ou total, um novo documento referente a quantidade de entrega é gerado para que seja emitida a nota fiscal que acompanhará a mercadoria e os movimentos referentes ao 'Estoque Programado' e 'Estoque Principal' sejam criados. "
      },
      {
        "type": "p",
        "text": "7516 - Visualiza ou Altera datas de Entrega - Nessa tela será possível realizar a manutenção das datas de entrega item a item, inserir o número do Pedido Programado origem e clicar sobre o campo 'Dt. Entrega' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Prog_10.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Manut_Data.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7516 - Voltar Pré-Vendas para Programados Originais - Uma vez realizada a geração do documento para entrega é possivel fazer o caminho inverso e efetuar o retorno da quantidade para o Pedido Programado origem, inserir o número da Pré-Venda gerada e apontar a quantidade que deseja-se retornar."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Prog_9.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Manut_Retorn_Boleto.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7516 - Cancelamento de Item de Pedido Programado -  Na existência de item(s) que não serão mais entregues e consequentemente não será mais necessário seu controle, é possível cancelá-lo do Pedido Programado origem."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Prog_8.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Manut_Cancel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7516 - Processar Pedido Programado - A medida em que a entregas forem sendo realizadas, nessa tela será apontado a quantidade e o documento 'Pré-Venda' será gerado para que seja emitida a nota fiscal de produtos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Prog_7.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao clicar sobre o botão 'Processa e Emite'  um novo documento será gerado e a tela '75NV - Emissão de Orçamentos' será trazida para que a nota fiscal seja emitida."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Prog_11.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Número do documento gerado (Pré-Venda) a partir do apontamento da quantidade de entrega."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7516_Prog_12.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Tela '75NV - Emissão de Orçamentos' que finaliza o processo ao emitir a nota fiscal de produtos, o valor faturado será proporcional a quantidade entregue. A partir dessa emissão serão criados os movimentos de estoque que fará a baixa do 'Estoque Ped. Programado' e 'Estoque Principal' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/75NV_Emiss_Prog.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7535 - Controle de Pedidos / Entregas - Através desse relatório será possível o acompanhamento referente as entregas pendentes e os Pedidos Programados já satisfeitos item a item."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7531_Programad.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pedido%20Programado%20-%20Opera%C3%A7%C3%B5es/7535_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      }
    ]
  },
  {
    "id": "AP-98",
    "slug": "consignacao_operacoes",
    "title": "Consignação - Operações",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-04-29",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "5111 - Tipos de Estoque - Deve-se cadastrar o estoque responsável pela movimentação de produtos em consignação.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/98/consignacao_operacoes",
    "content": [
      {
        "type": "h3",
        "text": "Este artigo dará orientações referente ao processo de Consignação , parâmetros, operações, manutenção e consultas."
      },
      {
        "type": "p",
        "text": "5111 - Tipos de Estoque - Deve-se cadastrar o estoque responsável pela movimentação de produtos em consignação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/5111_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros Globais Sistema - Estoque/Produção - Estoque Consignação - Feito o cadastro do tipo de estoque deve-se associá-lo ao parâmetro."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/1111_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1225 - Manutenção de Status dos Clientes - O terceiro precisa estar autorizado a realizar consignações, no campo 'Permite Consignação?' escolher a opção 'S - Sim' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/1225_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "75OV - Cadastro de Orçamentos -  Quando o terceiro estiver apto a realizar consignações o botão 'Consignação' ficará habilitado como opção de documento ao final do processo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/7512_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito a inclusão do documento este ficará com o status de 'Pré-Consignação' , para que a 'Consignação' seja realizada deve-se acessar a opção '75NV - Emissão de Orçamentos' ."
      },
      {
        "type": "p",
        "text": "Obs: Quando feito o processo em '7511 - CAIXA - Frente de Loja'   a opção '75NV - Emissão de Orçamentos' será trazida automaticamente."
      },
      {
        "type": "p",
        "text": "75NV - Emissão de Orçamentos - Nessa tela serão feitos todos os processamentos referente a 'Consignação' (Processamento da Consignação/Devolução/Faturamento) , dito anteriormente acima o status inicial é 'Pré-Consignação' , deve-se processar o documento para que os movimentos de estoque sejam gerados e seu status seja alterado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/75NV_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5140 - Visualização de Estoques de Produtos - Feito o processamento da consignação o saldo será adicionado ao estoque consignado configurado anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/5140_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7514 - Manutenção de Consignações - Nessa tela serão apontadas as devoluções de produtos referentes as consignações existentes pra cada terceiro, um documento de devolução será gerado e posteriormente deverá ser processado em '75NV - Emissão de Orçamentos' para que os itens retornem ao estoque principal."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/7514_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Abaixo documento de devolução gerado referente a manutenção da consignação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/7514_Dev_Rel_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O documento referente a 'Devolução' deve ser processado anterior ao faturamento da 'Consignação' , ao tentar inverter a ordem do processo o sistema exibirá uma mensagem de aviso e forçará o operador a realizar a 'Devolução' em primeiro lugar."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/75NV_Dev_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao final desse processo os produtos voltarão ao estoque principal e ficarão disponíveis para venda/consignação novamente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/75NV_Dev_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito a devolução do documento consignado poderá ser feito o faturamento referente aos itens pendentes, o valor da devolução foi abatido do documento original, ao emitir a nota fiscal será gerado a movimentação de baixa de estoque no produto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/75NV_Fatur.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5140 - Visualização de Estoques de Produtos -  Visualização dos saldos referente aos estoques 'Principal' e 'Consignado' ao final do processo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/5140_Consig_Final.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5131 - Elaborados de Estoque - Listagem 21 - Resumo das movimentações entre os estoque referente ao exemplo dado acima."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%A3o%20-%20Opera%C3%A7%C3%A3o/5131_List_Consig.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-96",
    "slug": "geracao_automatica_de_pedidos_",
    "title": "Geração Automática de 'Pedidos'",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2020-04-20",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementada nova funcionalidade através da opção '7517 - Geração Automática de Pedidos' , será possível a seleção de vários documentos 'Orçamentos' ou 'Pré - Vendas' para que sejam gerados de forma automatica registros ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/96/geracao_automatica_de_pedidos_",
    "content": [
      {
        "type": "p",
        "text": "Implementada nova funcionalidade através da opção '7517 - Geração Automática de Pedidos' , será possível a seleção de vários documentos 'Orçamentos' ou 'Pré - Vendas' para que sejam gerados de forma automatica registros no controle de pedidos, posteriomente, esse pedidos poderão ser emitidos ou alterados através da opção '2131 - Cadastro de Pedidos' , os novos registros também poderão ser inclusos em controles de Cargas referente a opções da '2151 - Acerto de Cargas' e '2153 - Montagem de Cargas' ."
      },
      {
        "type": "p",
        "text": "Não será possível a escolha dos documentos 'Pré-Vendas' e 'Orçamentos' de forma simultânea, incluso filtro referente ao tipo de documento."
      },
      {
        "type": "p",
        "text": "Obs: Utilizado parametrização referente ao 'RIBO - Controle de Depósitos e Expedições' o tipo 'Orçamento' não ficará disponível para geração automática de pedidos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20Autom%C3%A1tica%20de%20Pedidos/7517_Gera_Autom_Pedidos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Os documentos terão origem em 'N - Normal (7512)' , 'T - Tablet (Mobile)' e 'W - Web (E - Commerce)' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20Autom%C3%A1tica%20de%20Pedidos/7517_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao final do processo será gerado um relatório especificando os registros criados e/ou com algum tipo de rejeição."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20Autom%C3%A1tica%20de%20Pedidos/7517_3_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Controle de Depósitos e Expedições"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "RIBO - Ajustes sincronia '7512 - Cadastro de orçamentos x RIBO'",
          "RIBO - Exibição de tarjas coloridas na conferência 'Expedição/Depósito'",
          "2153 - Montagem de Cargas",
          "7517 - Nova opção 'Geração Automática de Pedidos'"
        ]
      }
    ]
  },
  {
    "id": "AP-97",
    "slug": "hadron_mobile_manual_de_operacoes",
    "title": "Hádron Mobile - Manual de Operações",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-04-20",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Este artigo visa dar orientações sobre o uso do aplicativo 'Hádron Mobile' , operações de cadastro, atualizações, vendas, envio e visualização dos pedidos.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/97/hadron_mobile_manual_de_operacoes",
    "content": [
      {
        "type": "p",
        "text": "Este artigo visa dar orientações sobre o uso do aplicativo 'Hádron Mobile' , operações de cadastro, atualizações, vendas, envio e visualização dos pedidos."
      },
      {
        "type": "p",
        "text": "1- Ativação do dispositivo e primeiro acesso ao aplicativo - Depois de instalado o aplicativo 'Hádron Mobile'  primeiro será necessário inserir 'Sigla do Cliente' , 'Chave do Produto' e nome do 'Operador Principal' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/_Mobile_1_Licenca.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em seguida será pedido o operador e senha para acessar o aplicativo, anterior a isso deve-se atualizar as informações referente aos operadores em seu primeiro acesso, a senha utilizada é a configurada na opção '1215 - Cadastro de Representantes - Loja Virtual' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/__Mobile_2_Login.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/_Mobile_3_1215_Sen.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "     "
      },
      {
        "type": "p",
        "text": "2 - Menu Principal -  Nessa tela será feito o acesso a todas as funcionalidades do sistema, configurações, cadastros, atualização de produtos/clientes/parâmetros, vendas e envios de informações."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Mobile_4_Menu_Principal.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Mobile_5_Menu_Principal_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "                     "
      },
      {
        "type": "p",
        "text": "3 - Configurações - As configurações estão dividas em quatro blocos, 'Produtos', 'Pedidos', 'Clientes' e 'Atualização' , esses parâmetros definidos operador a operador visam ajudar a visualização dos produtos no momento da venda e, posteriormente, o envio dos pedidos com a exibição ou não de algumas informações conforme normas da empresa."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Conf_Pedidos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Conf_Clientes_Atualiza%C3%A7%C3%A3o.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "      "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Conf_Produtos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4 - Cadastro de Clientes -  Os clientes cadastrados não poderão ser utilizados imediatamente na venda, o aplicativo enviará um pré-cadastro ao banco de dados principal no 'ERP Hádron' , realizada a aprovação e o ajustes financeiros esse cadastro será devolvido a base de dados do Mobile por meio do botão 'Atualização' citado anteriormente acima. Nessa seção será possível realizar consultas referente a clientes já cadastrados como contatos, endereço, limite de crédito, crédito liberado, atraso a pagamentos, compras e consignações em aberto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Cliente_Consult.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Cliente%20Add_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "           "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Cliente%20Add_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4 - Consulta de Produtos -  Nessa tela será realizada a consulta de produtos, preços, condições de pagamento, impostos, imagens e especifiações."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Consult_Prod_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5 - Orçamento - Nessa seção serão realizadas as vendas, as regras de negócio obedecerão os parâmetros definidos no 'ERP Hádron' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Venda_Cliente.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Venda_Cliente_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "           "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/___Venda_Cliente_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Para buscar produtos digitar código ou parte da descrição:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Vend_10.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Vend_11.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "            "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Vend_12.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao final são exibidos os totais e ao pressionar em 'Salvar' o pedido será enviado:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Vend_Final_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Vend_Final_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "         "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Vend_Final_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/Vend_Final_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "         "
      },
      {
        "type": "p",
        "text": "6 - Listar -  Nessa seção serão consultadas as vendas realizadas pelo representante, será possível a partir dela realizar uma cópia do pedido e iniciar uma nova venda ou visualizar e enviar uma cópia em .pdf por e-mail e whatsapp. Para que as opções fiquem disponíveis segurar pressionado sobre o documento desejado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/List_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/List_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "        "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile%20-%20Manual%20de%20Opera%C3%A7%C3%B5es/List_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Recepção e Emissão de Pedidos origem Hadron-Web",
          "Hádron-Web - Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace)",
          "Hádron Mobile - Manual de Configurações"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "RGBW - Alterações Mobile / E-Commerce",
          "PLMC - Limite de Crédito Cliente - Mobile x ERP",
          "7584 - Exibir 'Cidade' do Terceiro"
        ]
      }
    ]
  },
  {
    "id": "AP-95",
    "slug": "financeiro_unico_fluxo_de_caixa_extrato",
    "title": "Financeiro Único - Fluxo de Caixa/Extrato",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro"
    ],
    "updatedAt": "2020-04-17",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Este artigo visa dar orientações referente a utilização do Módulo Financeiro agrupado por empresas existentes no banco de dados, será utilizado a opção '4410 - Elaborados de Fluxo de Caixa' para extrair as informações re",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/95/financeiro_unico_fluxo_de_caixa_extrato",
    "content": [
      {
        "type": "p",
        "text": "Este artigo visa dar orientações referente a utilização do Módulo Financeiro agrupado por empresas existentes no banco de dados, será utilizado a opção '4410 - Elaborados de Fluxo de Caixa' para extrair as informações referentes ao acúmulo financeiro de todo o Grupo ."
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - Vínculos Usuários - Financeiro: "
      },
      {
        "type": "p",
        "text": "Campo 'Compartilhamento' - Nesse campo será definido o modo que é feito a operação das informações referentes aos módulos 'Contas à Receber' e 'Contas à Pagar' e \"Fluxo de Caixa\". Essa configuração deve ser realizada empresa a empresa existente no banco de dados, são três modos:"
      },
      {
        "type": "p",
        "text": "- 0 - Financeiro e Locais Próprios: Nesse modo a empresa terá seu próprio Módulo Financeiro, ou seja, o todas as operações financeiras (cadastros e relatórios) serão realizadas dentro deste Usuário."
      },
      {
        "type": "p",
        "text": "- 1 - Financeiro Próprio, Locais Matriz:  Assim como no modo \"1\",  nesse modo a empresa terá seu próprio Módulo Financeiro, porém, os 'Locais/Bancos'   serão utilizados de forma compartilhada com a empresa definida em ' Empresa Locais'.  É totalmente desaconselhado o uso desse modo pois se utilizado um mesmo código de local/banco que compartilham esse arquivo, o saldo da conta sofrerá alterações indesejáveis e a credibilidade dos extratos será comprometida. O unico objetivo do uso desse modo é concentrar os saldos bancários de todas as empresas desde que estas não possuem a mesma conta corrente;"
      },
      {
        "type": "p",
        "text": "- 2 - Financeiro e Locais da Matriz:  Nesse serão utilizadas as mesmas tabelas (Contas a Receber, Pagar, Locais/Bancos e Fluxo de Caixa) do usuário definido como 'Empresa Financeiro', ou seja, Independentemente se o usuario for esse ou o definido como \"Empresa Financeiro\" as Bases de Dados estarão sendo as mesmas."
      },
      {
        "type": "h3",
        "text": "Campo  'Empresa Matriz Financeiro'  : Código do Usuário a se concentrar as operações na emissão do Fluxo de Caixa."
      },
      {
        "type": "h3",
        "text": "Atualmente o Usuário 1 será a  'Matriz Financeira'  caso se deseja concentrar Várias empresas no Mesmo Grupo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Financeiro%20%C3%9Anico%20-%20Fluxo%20de%20Caixa_Extrato/1112_Fluxo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Mediante a parametrização escolhida os campos 'Empresa Financeiro' e 'Empresa Locais' são modificados automaticamente ficando desabilitados para alteração, apenas o campo 'Empresa Matriz Financeiro' ficará habilitado para que seja inserido o código da empresa."
      },
      {
        "type": "p",
        "text": "Obs: Exceto quando essa empresa também é a 'Matriz Financeira' , nessa configuração ela poderá visualizar todo o financeiro referente ao Grupo ."
      },
      {
        "type": "p",
        "text": "4410 - Elaborados de Fluxo de Caixa: Iremos utilizar dois campos afim de auxiliar a visualização das informações conforme os parâmetros descritos acima, ao montar o elaborado além das informações financeiras usuais, também utilizaremos duas variáveis que ajudarão a identificar a empresa a qual pertence o título e a empresa a qual pertence o 'Local/Banco' referente ao lançamento, são as variáveis 'Usuário Local (Banco)' e 'Usuário Financeiro'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Financeiro%20%C3%9Anico%20-%20Fluxo%20de%20Caixa_Extrato/4410_Nov_Campos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao marcar o checkbox 'Acumula Empresas do Mesmo Grupo?' os dados financeiros serão unificados conforme parâmetros definidos."
      },
      {
        "type": "p",
        "text": "Atenção: Este CheckBox somente estará disponível à empresas que possuirem uma ou mais empresas com vínculo de  'Empresa Matriz Financeiro'   Vinculada a ela"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Financeiro%20%C3%9Anico%20-%20Fluxo%20de%20Caixa_Extrato/4410.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de relatório com os dados financeiros de todo o Grupo :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Financeiro%20%C3%9Anico%20-%20Fluxo%20de%20Caixa_Extrato/4410_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "'Desc. Usual Vendas' x 'Desc. Financeiro'",
          "Consignações gerando 'Previsões' - Contas a receber",
          "Geração de DARFs para pagamento via sistema - Documento de Arrecadação de Receitas Federais"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "4410 - Ordenação de relatório utilizando 'Quebra por Locais'",
          "4410 - Novo Checkbox 'Financeiro Único'"
        ]
      }
    ]
  },
  {
    "id": "AP-94",
    "slug": "processos_de_acertos_de_estoque",
    "title": "Processos de Acertos de Estoque",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2020-04-15",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Através da opção '5518 - Processos de Acertos de Estoque' é possível por meio de um arquivo '.TXT' importar uma contagem feita previamente através de um coletor ou mesmo um arquivo manipulado manualmente. A opção trabalh",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/94/processos_de_acertos_de_estoque",
    "content": [
      {
        "type": "p",
        "text": "Através da opção '5518 - Processos de Acertos de Estoque' é possível por meio de um arquivo '.TXT' importar uma contagem feita previamente através de um coletor ou mesmo um arquivo manipulado manualmente. A opção trabalha com 4 tipos de processos:"
      },
      {
        "type": "p",
        "text": "1 - Listagem de Acerto - Lista os itens do arquivo importado e compara ao saldo atual presente no sistema exibindo suas diferenças, porém, não realiza o acerto;"
      },
      {
        "type": "p",
        "text": "2 - Acerto de Estoque - Lista os itens do arquivo importado e compara ao saldo atual presente no sistema, exibe as diferenças de estoque e cria os movimentos de acerto tipo 'ACT' para que o saldo presente no sistema fique igual ao do arquivo. O 'Valor Médio' do movimento criado utiliza a informação presente na tabela 'Valor Última Compra (A)' , para que o valor do movimento não fique 'zeros' caso não exista informação na tabela marcar o checkbox 'Forçar 0,01 no valor da última compra quando zerado';"
      },
      {
        "type": "p",
        "text": "3 - Listagem Saldo Inicial - Lista os saldos importados no arquivo e compara ao saldo inicial presente no sistema, porém, não realiza o ajuste;"
      },
      {
        "type": "p",
        "text": "4 - Processo Saldo Inicial -  Lista os saldos importados no arquivo e compara ao saldo inicial presente no sistema realizando o ajuste, não são criados movimentos de estoque;"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processos%20de%20Acerto%20de%20Estoque/5518_Tela_5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O arquivo trabalhará com duas colunas, a primeira com 6 posições fará referência ao 'Código do Produto' e a segunda com 10 posições a 'Quantidade/Saldo' do mesmo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processos%20de%20Acerto%20de%20Estoque/5518_Arquivo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Movimentos criados a partir do acerto de estoque realizado através do arquivo importado:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Processos%20de%20Acerto%20de%20Estoque/5518_Tela_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Implementação/Geração - Bloco K",
          "Parametros - Processos - Relatórios Estoque ABC - Mínimo/Máximo - Giro - Disponibilidade"
        ]
      }
    ]
  },
  {
    "id": "AP-93",
    "slug": "abatimento_de_valor_de_pis_cofins_em_valor_contabil_do_produto",
    "title": "Abatimento de Valor de PIS/COFINS em Valor Contábil do Produto",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2020-04-09",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado novo parâmetro em '1112 - Aba - Fiscal - Abate Pis/Cofins do Custo Contábil Estoque?' , utilizado o parâmetro os valores de PIS/COFINS referente aos lançamentos efetuados em '3212 - Cadastro de Documentos de",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/93/abatimento_de_valor_de_pis_cofins_em_valor_contabil_do_produto",
    "content": [
      {
        "type": "p",
        "text": "Implementado novo parâmetro em '1112 - Aba - Fiscal - Abate Pis/Cofins do Custo Contábil Estoque?' , utilizado o parâmetro os valores de PIS/COFINS referente aos lançamentos efetuados em '3212 - Cadastro de Documentos de Entrada' e '5121 - Cadastro de Entradas' serão abatidos do 'Valor Contábil' do produto exibido em '1232 - Cadastro de Produtos - Aba - Preços' referente ao custo do produto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Abatimento%20de%20Valor%20de%20PIS_COFINS%20em%20Valor%20Cont%C3%A1bil%20do%20Produto/1112_Abate_PIS_COFINS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - Fiscal:"
      },
      {
        "type": "p",
        "text": "5121 - Cadastro de Entradas:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Abatimento%20de%20Valor%20de%20PIS_COFINS%20em%20Valor%20Cont%C3%A1bil%20do%20Produto/5121_Abate_PIS_COFINS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3212 - Cadastro de Documentos de Entrada - Aba - Itens:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Abatimento%20de%20Valor%20de%20PIS_COFINS%20em%20Valor%20Cont%C3%A1bil%20do%20Produto/3212_Abate_PIS_COFINS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos - Aba - Preços:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Abatimento%20de%20Valor%20de%20PIS_COFINS%20em%20Valor%20Cont%C3%A1bil%20do%20Produto/1232_Abate_PIS_COFINS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Procedimentos para geração e controle das informações do arquivo EFD-PIS/COFINS"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "1112 - Novo parâmetro que abate 'VALOR' do ICMS da base de cálculo para PIS/COFINS",
          "7211 - Novos campos critérios para contabilização de Valor 'PIS/COFINS'",
          "7224 - Novos critérios para contabilização referente aos valores de 'PIS' e 'COFINS'.",
          "7223 - Novos critérios para contabilização referente aos valores de 'PIS' e 'COFINS'.",
          "7138 - Incluso valor de Frete na base de PIS/COFINS"
        ]
      }
    ]
  },
  {
    "id": "AP-92",
    "slug": "recepcao_e_emissao_de_pedidos_origem_hadron_web",
    "title": "Recepção e Emissão de Pedidos origem Hadron-Web",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2020-03-26",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo visa fornecer orientações referente a recepção e emissão de pedidos com origem no módulo 'Hádron-Web' para E-Commerce e MarketPlace.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/92/recepcao_e_emissao_de_pedidos_origem_hadron_web",
    "content": [
      {
        "type": "p",
        "text": "O artigo visa fornecer orientações referente a recepção e emissão de pedidos com origem no módulo 'Hádron-Web' para E-Commerce e MarketPlace."
      },
      {
        "type": "p",
        "text": "Loja Virtual do Cliente (Hádron-Web) - E-Commerce/MarketPlace  - O cliente ao adquirir o módulo 'Hádron-Web' terá uma retaguarda responsável por gerir e receber status de pedidos ja realizados nas plataformas de vendas, através dela também será possível a manutenção de seus produtos."
      },
      {
        "type": "h3",
        "text": "Relação de Pedidos na retaguarda:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Recep%C3%A7%C3%A3o%20e%20Emiss%C3%A3o%20de%20Pedidos%20E-Commerce/Loja_Virtu_4_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Visualização do pedido na retaguarda da 'Loja Virtual':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Recep%C3%A7%C3%A3o%20e%20Emiss%C3%A3o%20de%20Pedidos%20E-Commerce/Loja_Virtu_5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao final do processo de venda no site automaticamente o pedido será enviado para o 'SGBW - Gerenciador do Banco de Dados Remoto', ao aprovar o pedido será gerado uma numeração de 'Pré-Venda' para posterior emissão da nota fiscal."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Recep%C3%A7%C3%A3o%20e%20Emiss%C3%A3o%20de%20Pedidos%20E-Commerce/SGBW_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Cadastro do Intermediador (MarketPlace)"
      },
      {
        "type": "p",
        "text": "Na primeira venda efetuada será enviado ao gerenciador o cadastro do terceiro referente ao MarketPlace, caso o registro ainda não exista no sistema abrirá a opção '1221 - Cadastro de Terceiros' para que ação seja concluída. No campo 'Observação'  inserir a identificação (Usuário) da loja do cliente dentro do MarketPlace, esse terceiro fará o papel do intermediador da compra via web, informação essa necessária para a composição do arquivo xml referente a emissão da nota fiscal, a ausência dessa informação causará rejeição ao emitir o documento. "
      },
      {
        "type": "p",
        "text": "Obs: O processamento dos novos clientes com origem em vendas via Web (E-Commerce/MarketPlace/Mobile) deverão ser processados pelo 'SGBW - Gerenciador do Banco de Dados Remoto' para que as vendas possam ser finalizadas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Recep%C3%A7%C3%A3o%20e%20Emiss%C3%A3o%20de%20Pedidos%20E-Commerce/Identific_1221_Market_Place.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "75NV\\7513 - Emissão de Orçamentos - Através dessa tela com o número da 'Pré-Venda' gerado anteriormente será realizada a emissão da Nota Fiscal Eletrônica."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Recep%C3%A7%C3%A3o%20e%20Emiss%C3%A3o%20de%20Pedidos%20E-Commerce/75NV_EC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7584 - Manutenção Pedidos Web - Através dessa tela é possível gerenciar os status dos pedidos de origem 'E-Commerce/MarketPlace' , informações referente a NF-e, Transporte, Entrega e Finalização de toda a operação, a cada mudança de status um e-mail é enviado ao cliente e as informações na retaguarda do 'Hádron-Web'  são atualizadas, essa atualização de status também poderá seguir o caminho inverso, se a manutenção da venda for realizada no Loja Virtual do cliente esse será automaticamente atualizado dentro do 'Hádron-ERP' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Recep%C3%A7%C3%A3o%20e%20Emiss%C3%A3o%20de%20Pedidos%20E-Commerce/7584_EC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Hádron-Web - Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace)",
          "Hádron Mobile - Manual de Configurações",
          "Hádron Mobile - Manual de Operações"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "PLMC - Limite de Crédito Cliente - Mobile x ERP",
          "RGBW - Alterações Mobile / E-Commerce"
        ]
      }
    ]
  },
  {
    "id": "AP-91",
    "slug": "hadron_web_manutencao_de_cadastro_de_produtos_e_commerce_marketplace_",
    "title": "Hádron-Web - Manutenção de Cadastro de Produtos (E-Commerce/MarketPlace)",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-03-25",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "O artigo abaixo visa dar orientações referente ao cadastro e manutenção de produtos para o módulo Hádron-Web em vendas  E-Commerce e MarketPlace , campos obrigatórios, envio das informações e manutenção de produtos em ma",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/91/hadron_web_manutencao_de_cadastro_de_produtos_e_commerce_marketplace_",
    "content": [
      {
        "type": "p",
        "text": "O artigo abaixo visa dar orientações referente ao cadastro e manutenção de produtos para o módulo Hádron-Web em vendas  E-Commerce e MarketPlace , campos obrigatórios, envio das informações e manutenção de produtos em massa."
      },
      {
        "type": "h3",
        "text": "OBS1: Ver 'Instalação ODBC MySql' e 'Configurações 'SGBW - Gerenciador do Banco de Dados Remoto' em artigo no link abaixo:"
      },
      {
        "type": "p",
        "text": "https://ajuda.procion.com/artigo/manual/47/hadron_mobile_manual_de_configuracoes"
      },
      {
        "type": "p",
        "text": "OBS2: Para produtos que serão utilizados para vendas em MarketPlace somente os campos referentes a 'Preços', 'Categoria' e o checkbox 'Produto Ativado para Loja Virtual' devem ser preenchidos, as demais informações citadas abaixo serão inseridas na própria plataforma de venda Web."
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos - No cadastro de produtos alguns campos são obrigatórios para que o registro esteja em condições para ser enviado ao banco de dados na \"Nuvem\", abaixo segue as informações obrigatórias tela a tela do cadastro."
      },
      {
        "type": "h3",
        "text": "Aba - Principal: Informar campos referente a seção 'Volumes' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1232_EC_11.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Aba - Preços - Informar valor na tabela de preço conforme parametrização pelo cliente em  'Hádron-Web - Loja Virtual do Cliente' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1232_EC_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Aba - Complementos - Preencher campos referente a seção 'Despacho '."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1232_EC_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Aba - e-Commerce -  Na aba 'e-Commerce'  do cadastro de produtos deve-se associar uma 'Categoria',  marcar a checkbox 'Produto ativado para Loja Virtual?' e vincular a imagem do produto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1232_EC_6.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A imagem deverá ter a extensão '.JPG' e resolução aproximada de '1000 x 1000' , ao associar a imagem ao produto o arquivo ficará salvo no diretório do sistema '\\PICS\\PRODUTOS\\' conforme o exemplo abaixo:"
      },
      {
        "type": "h3",
        "text": "Obs: Não utilizar na descrição das imagens nomes extensos e traços (-)."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1232_EC_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O cadastro de 'Categorias' poderá também ser acessado pela opção '2115 - Cadastro de Categorias de Clientes/Produtos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/2115_EC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7581 - Manutenção de Produtos do E-commerce/Mobile -  Existe também a possibilidade de realizar uma manutenção coletiva de produtos para esta finalidade, inclusive pode-se efetuar diversas outras alterações referente ao cadastro de produtos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/7581_EC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros Globais Sistema – Aba - Vendas – Serviços B. Dados' – 1 – RGBW."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1111_RGBW.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - No cadastro de empresas aba 'Principal' deve-se apontar o terminal responsável pelo envio das informações ao banco de dados hospedado na \"nuvem\" , também é necessário marcar o checkbox 'E-Commerce' para que o módulo seja habilitado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1112_EC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1119 - Parâmetros de Terminal - Aba - F. Loja'  apontar o número do terminal responsável pelo gerenciamento do banco de dados WEB, ao entrar no terminal abrirá o  'SGBW - Gerenciador do Banco de Dados Remoto'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/1119_Gerenciador_Web.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "SGBW - Gerenciador do Banco de Dados Remoto - Realizado todos os ajustes referente ao cadastro de produtos, no terminal configurado para o envio das informações abrirá o 'SGBW - Gerenciador de Banco de Dados Remoto', através dessa tela os registros serão enviados ao banco de dados hospedado na \"nuvem\", selecionar os itens relacionados as seções 'Produtos' e 'Complementares E-Commerce/Mobile' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/E-Commerce%20-%20Manuten%C3%A7%C3%A3o%20de%20Cadastro%20de%20Produtos/RGBW_EC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Hádron Mobile - Manual de Operações",
          "Hádron Mobile - Manual de Configurações",
          "Recepção e Emissão de Pedidos origem Hadron-Web"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "PLMC - Limite de Crédito Cliente - Mobile x ERP",
          "RGBW - Alterações Mobile / E-Commerce"
        ]
      }
    ]
  },
  {
    "id": "AP-90",
    "slug": "nota_fiscal_para_area_de_livre_comercio_zona_franca_de_manaus",
    "title": "Nota Fiscal para Área de Livre Comércio/Zona Franca de Manaus",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-03-19",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "As operações comerciais envolvendo mercadorias nacionais (ou nacionalizadas) realizadas com destinatários localizados na Zona Franca de Manaus, Áreas de Livre Comércio são desoneradas do ICMS e IPI .",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/90/nota_fiscal_para_area_de_livre_comercio_zona_franca_de_manaus",
    "content": [
      {
        "type": "p",
        "text": "As operações comerciais envolvendo mercadorias nacionais (ou nacionalizadas) realizadas com destinatários localizados na Zona Franca de Manaus, Áreas de Livre Comércio são desoneradas do ICMS e IPI ."
      },
      {
        "type": "p",
        "text": "As Áreas de Livre Comércio constituem locais delimitados geograficamente, onde são comercializados produtos importados com isenção de tributos, quando destinados a consumo na região ou a viajantes (turistas).  "
      },
      {
        "type": "p",
        "text": "Da mesma forma, os produtos nacionais (ou nacionalizados), quando remetidos para as referidas localidades, estão contemplados com a isenção do ICMS e IPI , sendo assegurado ao estabelecimento industrial remetente direito à manutenção dos créditos relativos aos respectivos insumos empregados na industrialização dos produtos remetidos à Zona Franca de Manaus e Áreas de Livre Comércio . "
      },
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações -  Deve-se cadastrar uma transação utilizando o cfop '6109 - Ven.pr.est.ZFM/ALC' , esse cfop é apropriado para transações interestaduais com destino para Zona Franca de Manaus e Áreas de Livre Comércio ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20para%20%C3%81rea%20de%20Livre%20Com%C3%A9rcio_Zona%20Franca%20de%20Manaus/2113_ZF_NF.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1221 - Cadastro de Terceiros - O cadastro de cliente deve ter algumas informações que faça o sistema identificar que o mesmo esteja localizado nas áreas de Livre Comércio e tribute a venda com o devido incentivo fiscal."
      },
      {
        "type": "p",
        "text": "Aba 'Identificação' campo 'Tipo Suframa' escolher entre as alternativas '1 - Zona Franca de Manaus', '2 - Área de Livre Comércio' e '3 - Amazônia Ocidental',  campo 'I.Suframa' digitar a inscrição Suframa."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20para%20%C3%81rea%20de%20Livre%20Com%C3%A9rcio_Zona%20Franca%20de%20Manaus/1221_ZF_.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Aba 'Fiscal/Contábil' apontar no campo 'Dígito ICM' o número respectivo a alíquota de (-7) configurado em '1111 - Parâmetros de Sistema - Aba - Tabelas Fiscais' , no campo 'Mot. Des. ICMS' apontar o motivo da desoneração '07 - SUFRAMA' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20para%20%C3%81rea%20de%20Livre%20Com%C3%A9rcio_Zona%20Franca%20de%20Manaus/1221_ZF_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos - Abaixo segue um exemplo de pedido para 'Zona Franca de Manaus':"
      },
      {
        "type": "h3",
        "text": "Na aba 'Principal' utilizar a transação com o CFOP '6109' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20para%20%C3%81rea%20de%20Livre%20Com%C3%A9rcio_Zona%20Franca%20de%20Manaus/2131_ZF_10.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A tributação deverá utilizar a 'CST - 040' e tributação '1 - Tributado (isento)'  mais isenção de IPI para os tipos  '1 - Zona Franca Manaus' e '2 - Área Livre Comércio', para o tipo Suframa '3 - Amazônia Ocidental' deve-se utilizar 'CST - 00' , tributação '1 - Tributado (isento)' mais isenção de IPI (Não há desoneração de ICMS)."
      },
      {
        "type": "p",
        "text": "Obs: A regra é válida somente para mercadorias nacionais ou nacionalizadas, para produtos importados segue a tributação padrão de ICMS referente a alíquota de 4%."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20para%20%C3%81rea%20de%20Livre%20Com%C3%A9rcio_Zona%20Franca%20de%20Manaus/2131_ZF_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na aba 'Fechamento' serão exibidos os valores referente a base de ICMS 'Isenta' e o valor do ICMS abatido que ficará no campo 'Descontos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20para%20%C3%81rea%20de%20Livre%20Com%C3%A9rcio_Zona%20Franca%20de%20Manaus/2131_ZF_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Abaixo parte de uma DANFE emitida para a  Zona Franca de Manaus/Áreas de Livre Comércio:"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20para%20%C3%81rea%20de%20Livre%20Com%C3%A9rcio_Zona%20Franca%20de%20Manaus/DANFE_ZF.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Nota Fiscal de Exportação Direta e Indireta",
          "Emissão de NFC-e - Nota Fiscal Consumidor Eletrônica",
          "Notas Fiscais de Complemento de Imposto",
          "Nota Fiscal de Anulação de Frete"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "1221 - Definição quantidade de vias cliente (NFe/CT-e/MDFe)"
        ]
      }
    ]
  },
  {
    "id": "AP-89",
    "slug": "notas_fiscais_de_complemento_de_imposto_",
    "title": "Notas Fiscais de Complemento de Imposto",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-03-12",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Nota Fiscal Complementar de Imposto,  a  Nota Fiscal Complementar  tem a função de corrigir informações da NF-e original. Com a  Nota Fiscal Complementar de Imposto  você pode acrescentar valor e  complementar  o ICMS, I",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/89/notas_fiscais_de_complemento_de_imposto_",
    "content": [
      {
        "type": "h3",
        "text": "Abaixo seguem orientações referente a emissão de uma nota fiscal de 'Complemento de Imposto (IPI/ICMS/ICMS-ST)' :"
      },
      {
        "type": "p",
        "text": "Nota Fiscal Complementar de Imposto,  a  Nota Fiscal Complementar  tem a função de corrigir informações da NF-e original. Com a  Nota Fiscal Complementar de Imposto  você pode acrescentar valor e  complementar  o ICMS, ICMS-ST e IPI."
      },
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações - Deve-se cadastrar uma transação para cada finalidade referente a esse tipo de emissão, o campo 'Característica N.F' irá definir o tipo de imposto a ser complementado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2113_Complement.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "São quatro características possíveis:"
      },
      {
        "type": "p",
        "text": "21 - Complemento ICMS Base + Valor - Será destacado na nota fiscal 'Base' do complemento do imposto e seu respectivo 'Valor' ;"
      },
      {
        "type": "p",
        "text": "22 - Complemento ICMS Valor - Será destacado na nota fiscal somente o 'Valor' referente ao ICMS a complementar;"
      },
      {
        "type": "p",
        "text": "23 - Complemento IPI - Será destacado na nota fiscal somente o 'Valor' referente ao IPI a complementar;"
      },
      {
        "type": "p",
        "text": "24 - Complemento ICMS-ST - Será destacado na nota fiscal somente o 'Valor' do ICMS-ST a complementar."
      },
      {
        "type": "p",
        "text": "Para cada transação cadastrada com essa finalidade deve-se atentar a CFOP  utilizada que deve ser condizente a operação anteriormente realizada, ou seja, a nota fiscal que deseja-se complementar o imposto, no exemplo abaixo é uma transação de complemento IPI utilizando a CFOP '5101' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2113_Complement_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos -  O produto deve ser cadastrado com  'Tipo - 99- Outros' ,  'NCM - 00 00 00 00'  e  'Unidade - R$'  ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/1232_Complement.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos -  Abaixo modelo de pedido e nota fiscal de ' Complemento de Imposto'  ."
      },
      {
        "type": "h3",
        "text": "Utilizar a transação anteriormente cadastrada com a devida característica para complemento de imposto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2131_Complement.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A aba 'Itens'  abrirá em seu  'Detalhamento',  atentar-se a tributação que será utilizada nesse processo, deverá ser condizente a situação tendo como referência a nota fiscal emitida anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2131_Complement_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Nas seções 'IPI' e 'ICMS' ao clicar sobre os botão abrirá a tela para que o valor do imposto que deseja-se complementar seja digitado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2131_Complement_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "No exemplo abaixo complemento referente ao IPI :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2131_Complement_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Na figura abaixo a tela onde serão lançados os complementos referentes ao ICMS (Base e/ou Valor) e ICMS-ST :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2131_Complement_5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após a Inclusão dos valores, na aba 'Notas Referenciadas' deve-se referenciar a nota fiscal emitida anteriormente, no qual deseja-se complementar o valor do imposto. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2131_Complement_6.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao final do processo na aba 'Fechamento Fiscal' serão exibidos os valores com sua respectiva CFOP ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/2131_Complement_7.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Abaixo exemplo de nota fiscal de complemento de imposto referente ao IPI , o devido valor será destacado em campo próprio na Danfe."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Notas%20Fiscais%20de%20Complemento%20de%20Imposto/NF_Complement_Impost.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Nota Fiscal para Área de Livre Comércio/Zona Franca de Manaus",
          "Emissão de NFC-e - Nota Fiscal Consumidor Eletrônica",
          "Nota Fiscal de Anulação de Frete",
          "Nota Fiscal de Exportação Direta e Indireta"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "2131 - Cópia de Pedido entre Empresas",
          "2131/7513 - Impressão da composição do produto em dados adicionais da NFE"
        ]
      }
    ]
  },
  {
    "id": "AP-88",
    "slug": "nota_fiscal_de_anulacao_de_frete",
    "title": "Nota Fiscal de Anulação de Frete",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-03-11",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Um  nota  de  anulação de frete  é um documento que é emitido para  anular  um Conhecimento de Transporte Eletrônico – CT-e emitido com erros e que não pode mais ser cancelado. Não é um documento que substitui o CT-e, ma",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/88/nota_fiscal_de_anulacao_de_frete",
    "content": [
      {
        "type": "h3",
        "text": "Abaixo seguem orientações referente a emissão de uma nota fiscal de 'Anulação de Frete' :"
      },
      {
        "type": "p",
        "text": "Um  nota  de  anulação de frete  é um documento que é emitido para  anular  um Conhecimento de Transporte Eletrônico – CT-e emitido com erros e que não pode mais ser cancelado. Não é um documento que substitui o CT-e, mas sim que realiza a  anulação  de valores relativos à prestação de serviços de  frete ."
      },
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações -  Uma transação com a CFOP 'X.206' e característica '00'  deve ser criada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Anula%C3%A7%C3%A3o%20de%20Frete/2113_Anu_Frete.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos - O produto deve ser cadastrado com 'Tipo - 99- Outros' ,  'NCM - 00 00 00 00' e 'Unidade - R$' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Anula%C3%A7%C3%A3o%20de%20Frete/1232_Anu_Frete.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos - Abaixo modelo de pedido e nota fiscal de 'Anulação de Frete' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Anula%C3%A7%C3%A3o%20de%20Frete/2131_Anu_Frete.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Anula%C3%A7%C3%A3o%20de%20Frete/2131_Anu_Frete_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Detalhamento do item:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Anula%C3%A7%C3%A3o%20de%20Frete/2131_Anu_Frete_3.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Modelo da nota fiscal emitida:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nota%20Fiscal%20de%20Anula%C3%A7%C3%A3o%20de%20Frete/NF_anu_frete.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Nota Fiscal de Exportação Direta e Indireta",
          "Cadastro de Transação - Checkbox para destaque de impostos em 'Dados Adicionais' - ICMS/ICMS-ST",
          "Tributações exclusivas por Transação x CFOP",
          "Cadastro de Transação - Checkbox para destaque de impostos em 'Dados Adicionais' - ICMS/ICMS-ST",
          "Emissão de NFC-e - Nota Fiscal Consumidor Eletrônica",
          "Notas Fiscais de Complemento de Imposto"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "1232 - Novo campo 'Aplicação'",
          "2131 - Cópia de Pedido entre Empresas",
          "2131/7513 - Impressão da composição do produto em dados adicionais da NFE",
          "2131 - Nota fiscal 'Devolução' - ‘Dest. em Dados Adic?’",
          "7511/75CF - Emissão de NFCe (Nota Fiscal Consumidor)"
        ]
      }
    ]
  },
  {
    "id": "AP-87",
    "slug": "fixacao_de_precos_em_pre_venda_orcamento_7512_75ov_",
    "title": "Fixação de Preços em 'Pré - Venda/Orçamento' - '7512/75OV'",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2020-02-19",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Para clientes que possuem grupo de vendas com a mesma condição de pagamento vinculados a diferentes tabelas de preços, alteram tabelas pela tecla 'F4'  , manipulam preços de forma manual e fazem 'Junção de documentos' , ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/87/fixacao_de_precos_em_pre_venda_orcamento_7512_75ov_",
    "content": [
      {
        "type": "p",
        "text": "Para clientes que possuem grupo de vendas com a mesma condição de pagamento vinculados a diferentes tabelas de preços, alteram tabelas pela tecla 'F4'  , manipulam preços de forma manual e fazem 'Junção de documentos' , foi necessário criar um novo parâmetro, sua finalidade é que os valores alterados ao serem unificados num só documento sejam mantidos."
      },
      {
        "type": "h3",
        "text": "RUS2 - PArâmetros Especiais de Faturamento - Aba - Orçamento - Fixação de Preços:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Fixa%C3%A7%C3%A3o%20de%20Pre%C3%A7os%20em%20Pr%C3%A9%20-%20Venda_Or%C3%A7amento/RUS2_Fix_Prec.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "0 - Fixa preço apenas se Digitado: Essa é forma padrão de trabalho, o preço será 'fixado' somente se digitado o valor no campo;"
      },
      {
        "type": "p",
        "text": "1 - Fixa através da Tecla 'F12' no campo: Ao pressionar a tecla 'F12' sobre o campo 'Unitário' o valor ficará na cor 'Vermelho' e seu preço será fixado na junção;"
      },
      {
        "type": "p",
        "text": "2 - Fixa através do Botão: Ao utilizar o botão 'Fixa Preços' todos os preços dos produtos ficarão na cor 'Vermelho' , serão fixados na tabela e mantidos durante a junção."
      },
      {
        "type": "p",
        "text": "Obs1: Ao utilizar alteração de preços manual, independentemente do parâmetro citado acima, marcar no cadastro do vendedor '1215' a checkbox 'Permissão para alterar Preços?;"
      },
      {
        "type": "p",
        "text": "Obs2: Utilizados os parâmetros '1' e '2' deve-se também habilitar a forma 'Ação Alt. Preços - 1 - Alterar preços de TODAS as Condições' presente na 'RUS2' , os parâmetros atuarão em conjunto;"
      },
      {
        "type": "p",
        "text": "Obs3: A forma de junção padrão na versão 12 (0)  é exatamente igual a da versão 11, portanto, essa é uma forma alternativa ao que já vem sendo feito."
      },
      {
        "type": "p",
        "text": "Ao escolher os parâmetros '1' e '2' será habilitado o botão 'Fixar Preços' do lado direito da grid de produtos na '75OV - Cadastro de Orçamentos'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Fixa%C3%A7%C3%A3o%20de%20Pre%C3%A7os%20em%20Pr%C3%A9%20-%20Venda_Or%C3%A7amento/75ov_fix_prec.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Junção de Orçamentos"
        ]
      }
    ]
  },
  {
    "id": "AP-86",
    "slug": "como_criar_regras_tributarias_utilizando_campo_aplicacao_para_tributacoes_nn_",
    "title": "Como criar regras tributárias utilizando campo 'Aplicação' para tributações 'NN'",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-02-18",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Devido a uma necessidade específica de um cliente que possuia para o mesmo 'Código NCM' diferentes 'CEST' com diferentes 'IVAs interestaduais' , foi implementado uma forma de se criar uma exceção de regra tributária atra",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/86/como_criar_regras_tributarias_utilizando_campo_aplicacao_para_tributacoes_nn_",
    "content": [
      {
        "type": "p",
        "text": "Devido a uma necessidade específica de um cliente que possuia para o mesmo 'Código NCM' diferentes 'CEST' com diferentes 'IVAs interestaduais' , foi implementado uma forma de se criar uma exceção de regra tributária através do campo 'Aplicação' presente nas opções  '1243 - Complemenos Gerais N.C.M' e '1232 - Cadastro de Produtos' , esse tipo de configuração funcionará somente para a tributação 'NN' ."
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros de Sistema - Aba - Produtos:  Marcar o checkbox 'Produtos com Tipos de Aplicações Diferentes?' , ao habilitar o parâmetro será liberado o campo 'Aplicação' em '1232 - Cadastro de Produtos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Regra%20Tribut%C3%A1ria%20NN/1111_Aplic_.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1243 - Cadastro Gerais N.C.M:  A aplicação tipo 'Normal' será a regra default para a tributação 'NN' cadastrado no NCM do produto, para criar a regra de exceção deve-se utilizar no campo 'Aplicação' os tipos '1, 2 e 3' e realizar a configuração tributária para essa situação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Regra%20Tribut%C3%A1ria%20NN/1243_Aplic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos: Criado a regra tributária deve-se apontar no cadastro do produto sua utilização, na aba 'Principal' apontar o uso no campo 'Aplicação' . A partir desse momento é desconsiderada a regra default para o 'NN - NCM - Normal' e passa-se a utilizar a regra para o 'NN - NCM - Tipo 1, 2 ou 3' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Regra%20Tribut%C3%A1ria%20NN/1232_Aplic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " "
      },
      {
        "type": "p",
        "text": "1239 - Acertos Gerais de Produtos: Para facilitar a manutenção do cadastro de produtos que venham a utilizar a regra, foi implementado o campo 'Aplicação'  para que possa-se realizar a atualização em massa de produtos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Regra%20Tribut%C3%A1ria%20NN/1239_Aplic.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Cadastro de Complementos Gerais N.C.M"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "1239 - Alteração campo 'Aplicação'",
          "1243 - Nova informação campo 'Aplicação'",
          "1232 - Novo campo 'Aplicação'"
        ]
      }
    ]
  },
  {
    "id": "AP-85",
    "slug": "importacao_de_vendas_com_cartao_de_credito_pos_point_of_sale_",
    "title": "Importação de Vendas com Cartão de Crédito POS (Point of Sale)",
    "category": "manual",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro",
      "vendas"
    ],
    "updatedAt": "2020-02-14",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Revisado a importação de vendas realizadas em cartão de crédito via máquina POS,  a partir do arquivo disponibilizado pela operadora do cartão é possível importa-lo com o objetivo de criar no sistema o registro para cont",
    "sourceUrl": "https://ajuda.procion.com/artigo/manual/85/importacao_de_vendas_com_cartao_de_credito_pos_point_of_sale_",
    "content": [
      {
        "type": "p",
        "text": "Revisado a importação de vendas realizadas em cartão de crédito via máquina POS,  a partir do arquivo disponibilizado pela operadora do cartão é possível importa-lo com o objetivo de criar no sistema o registro para controle de recebimento e, posteriormente, a geração do documento 'CC' vinculado ao contas à receber."
      },
      {
        "type": "p",
        "text": "7511/75CC - Cadastro de Convênios/Cartões de Crédito:  Deve-se realizar o cadastro para um situação de 'Crédito' e uma de 'Débito'  a cada bandeira utilizada, não é necessário cadastrar todas as situações possíveis de parcelamento, apenas 'Crédito/Débito' para que o sistema possa reconhecer a situação do registro e criá-lo no sistema."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Vendas%20POS/7511_75CC.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "75TI - Importação das Vendas POS:  O Acesso a tela será via '7518 - Integração TEF x Contas a Receber' botão '75TF - Cadastro de TEF a Receber' , o botão 'Importar arquivo de Vendas Gerado pelas Operadoras' abrirá a tela para que o arquivo seja selecionado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Vendas%20POS/7518_75TI_New.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Selecionado o arquivo e realizada a importação será gerado um relatório com os registro importados no sistema:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Vendas%20POS/75TI_Rel.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "OBS: Caso o arquivo contenha o mesmo 'N.S.U' ou 'AUT' de um registro já existente no sistema, será exibido um relatório de erro referente ao valor e nenhum registro será importado."
      },
      {
        "type": "h3",
        "text": "O registro criado terá como característica a origem 'P - POS'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Vendas%20POS/75TF_75TI.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Abaixo arquivos importados na tela '7518 - Integração TEF x Contas a Receber':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Vendas%20POS/7518_75TI.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O modelo referente a 'Importação de Cartões Visa / Master' deve ser arquivo CSV ou TXT , separado por ; (ponto e vírgula) disponibilzado pela operadora."
      },
      {
        "type": "h3",
        "text": "Colunas Necessárias na seguinte Ordem:"
      },
      {
        "type": "h3",
        "text": "A - Data de Venda;"
      },
      {
        "type": "h3",
        "text": "B - Data da Autorização (*);"
      },
      {
        "type": "h3",
        "text": "C - Código Estabelecimento;"
      },
      {
        "type": "h3",
        "text": "D -  Bandeira (*);"
      },
      {
        "type": "h3",
        "text": "E - Forma de Pagamento (D/C) (*);"
      },
      {
        "type": "h3",
        "text": "F - Quantidade de Parcelas (*);"
      },
      {
        "type": "h3",
        "text": "G - Resumo de Operação;"
      },
      {
        "type": "h3",
        "text": "H - Valor da Venda (*);"
      },
      {
        "type": "h3",
        "text": "I - Comissão (percentual) (*);"
      },
      {
        "type": "h3",
        "text": "J - Valor Descontado;"
      },
      {
        "type": "h3",
        "text": "K - Data de Previsão do Pagamento (*);"
      },
      {
        "type": "h3",
        "text": "L - Valor Líquido Da Venda (*);"
      },
      {
        "type": "h3",
        "text": "M - Canal da Venda;"
      },
      {
        "type": "h3",
        "text": "N - Número Lógico;"
      },
      {
        "type": "h3",
        "text": "O - Código de Autorização (*);"
      },
      {
        "type": "h3",
        "text": "P - NSU (*);"
      },
      {
        "type": "h3",
        "text": "Q - Número do Cartão;"
      },
      {
        "type": "h3",
        "text": "R - TID;"
      },
      {
        "type": "h3",
        "text": "S - Receba Rápido;"
      },
      {
        "type": "h3",
        "text": "T - Comissão mínima."
      },
      {
        "type": "h3",
        "text": "Colunas com (*) são obrigatórias"
      },
      {
        "type": "h3",
        "text": "Datas devem estar no formato DD/MM/AAAA ou DD/MM/AA (inclusive as barras)"
      },
      {
        "type": "h3",
        "text": "Tags : 7518, Vendas, Contas a Receber, TEF, POS"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "7518 - Importação de vendas Cartão POS"
        ]
      }
    ]
  },
  {
    "id": "AP-84",
    "slug": "ciot_conceitos_e_operacao",
    "title": "CIOT - Conceitos e Operação",
    "category": "guia",
    "module": "Logística",
    "tags": [],
    "updatedAt": "2020-02-10",
    "readTime": "9 min",
    "author": "Prócion Sistemas",
    "summary": "Em vigência desde 2011, o CIOT (Código Identificador da Operação de Transportes) foi criado para combater as ineficientes e injustas formas de pagamento de frete realizadas aos motoristas de transporte de cargas, como a ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/84/ciot_conceitos_e_operacao",
    "content": [
      {
        "type": "h3",
        "text": "O que é CIOT? "
      },
      {
        "type": "p",
        "text": "Em vigência desde 2011, o CIOT (Código Identificador da Operação de Transportes) foi criado para combater as ineficientes e injustas formas de pagamento de frete realizadas aos motoristas de transporte de cargas, como a carta frete. Desde a publicação da Resolução nº 3658 de 19/04/2011, o Governo pôs em prática uma série de regras que garantem os direitos dos transportadores autônomos e equiparados."
      },
      {
        "type": "p",
        "text": "Essa é a sigla para Código Identificador da Operação de Transportes e, de modo geral, trata-se de um código obtido apenas por meio do cadastramento da operação de transporte no sistema da ANTT (Agência Nacional de Transportes Terrestres)."
      },
      {
        "type": "h3",
        "text": "Quando o CIOT deve ser gerado?"
      },
      {
        "type": "p",
        "text": "De acordo com a Resolução nº 5862 do dia 17 de dezembro de 2019, o CIOT deve ser gerado em todas as operações de transporte contratadas. Antes disso, o CIOT era obrigatório apenas quando contratado Transportador Autônomo de Carga (TAC) ou TAC equiparado."
      },
      {
        "type": "h3",
        "text": "Quem deve gerar o CIOT?"
      },
      {
        "type": "p",
        "text": "Toda empresa que contrata motoristas autônomos, cooperativas, frotas terceirizadas, empresa de transporte de carga (ETC) ou cooperativa de transporte de carga (CTC), devem gerar o CIOT. Portanto, se você é se encaixa em algum das categorias citadas acima, deve ter sua atividade de transporte registrada por meio desse código. Do mesmo modo, caso contrate um motorista autônomo ou cooperativa de transportes para algum serviço, precisa cumprir com essa norma."
      },
      {
        "type": "h3",
        "text": "Como emitir o CIOT?"
      },
      {
        "type": "p",
        "text": "O primeiro passo para quem precisa emiti-lo é procurar uma administradora de pagamento eletrônico e informar uma série de informações. Isso pode ser feito via telefone, internet ou mesmo por um sistema de gestão. Confira os dados obrigatórios:"
      },
      {
        "type": "ul",
        "items": [
          "O RNTRC e o CPF ou CNPJ do contratado e, se existir, do subcontratado;",
          "O nome, a razão ou denominação social, o CPF ou CNPJ, e o endereço do contratante e do destinatário da carga;",
          "O nome, a razão ou denominação social, o CPF ou CNPJ, e o endereço do subcontratante e do consignatário da carga, se existirem;",
          "Os endereços de origem e de destino da carga, com a distância entre esses dois pontos;",
          "O tipo e a quantidade da carga;",
          "Valor do frete pago ao contratado e, se existir, ao subcontratado, com a indicação da forma de pagamento e do responsável pela sua liquidação;",
          "Valor do piso mínimo de frete aplicável à Operação de Transporte;",
          "Valor do Vale-Pedágio obrigatório desde a origem até o destino, se aplicável;",
          "As placas dos veículos que serão utilizados na Operação de Transporte;",
          "A data de início e término da Operação de Transporte; e",
          "Dados da Instituição, número da agência e da conta onde foi ou será creditado o pagamento do frete."
        ]
      },
      {
        "type": "p",
        "text": "O pagamento poderá ser realizado de duas maneiras: por meio de depósito direto em conta corrente ou PEF (pagamento eletrônico de frete), por intermédio de uma administradora homologada pela ANTT."
      },
      {
        "type": "h3",
        "text": "Quais serviços não podem ser cobrados pelas administradoras?"
      },
      {
        "type": "p",
        "text": "É preciso ficar atento aos serviços que não podem ser cobrados pela administradora de pagamentos. Isso quer dizer que o transportador autônomo tem o direito de receber os seguintes serviços sem taxa adicional:"
      },
      {
        "type": "ul",
        "items": [
          " Habilitação, emissão e fornecimento da primeira via do cartão;",
          " Consulta de saldo e extrato sem impressão;",
          " Um extrato impresso por mês;",
          " Envio de extrato anual com dados de cada mês;",
          " Créditos dos valores relacionados ao frete;",
          " Uso do cartão na função débito;",
          " Emissão da primeira via do cartão adicional para dependente;",
          " Uma transferência para conta do transportador a cada 15 dias."
        ]
      },
      {
        "type": "h2",
        "text": "Quais as administradoras de pagamento homologadas pela ANTT?"
      },
      {
        "type": "p",
        "text": "Em geral, o Governo seleciona, fiscaliza e permite que essas empresas façam esse tipo de trabalho, simplificando a vida do emissor, abaixo algumas instituições homologadas pela ANTT:"
      },
      {
        "type": "ul",
        "items": [
          "NDDigital ; (Prócion Sistemas é homologada desde 2018)",
          "Pamcard (Pamcary) ;",
          "REPOM ;",
          "Centro de Gestão de Meios de Pagamentos LTDA ;",
          "Vectio (Target) ;",
          "Banco Bradesco ;",
          "Banco do Brasil ;",
          "IPC Administração (e-Frete) ."
        ]
      },
      {
        "type": "h3",
        "text": "No  site da ANTT  é possível conferir a lista atualizada com todas as empresas autorizadas."
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros para a emissão de 'Conhecimento de Transporte Eletrônico' e 'Manifesto Eletrônico de Documentos Fiscais'"
      },
      {
        "type": "p",
        "text": "Para realizar a emissão do CIOT são necessários a emissão do CT-e  e MDF-e, habilitar em '1111 - Aba - Faturamento' a emissão de ambos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/1111_CIOT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Abas - Fiscal/Faturamento"
      },
      {
        "type": "p",
        "text": "Criar na aba 'Fiscal' a série referente a emissão do CT-e/MDF-e, na aba 'Faturamento' escolher o ambiente de emissão e apontar o número de terminal responsável pelo gerenciamento do certificado digital."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/1112_Fiscal_CIOT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/1112_Faturamento_CIOT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs: Os parâmetros citados até agora são os básicos para habilitar a emissão de CT-e/MDF-e, porém, são necessários outros parâmetros que venham a complementar a configuração da emissão, como o cadastro de transação, configurações de parâmetros de terminal, cadastro de tributações e outros que não serão citados, pois não estão relacionados ao objetivo do artigo. "
      },
      {
        "type": "p",
        "text": "1221 - Cadastro de Terceiros - Transportadora"
      },
      {
        "type": "p",
        "text": "O transportador autônomo deve ser cadastrado com o tipo 'Transportador' em '1221 - Cadastro de Terceiros' para que o mesmo fique habilitado no módulo de 'Transportes' no sistema 'Hádron'  , obrigatoriamente deverá ser uma pessoa 'F - Física' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/1221_pessoa_fisica.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4371 - Cadastro de Contas Corrente"
      },
      {
        "type": "p",
        "text": "Após cadastrar o transportador autônomo é necessário criar e vincular a conta corrente do terceiro, a inclusão será feita pela opção '4371 - Cadastro de Contas Corrente' , caso o terceiro possua mais de uma conta corrente utilizar o campo 'Sequência' , 'conta corrente 1 = Sequência 1' , 'conta corrente 2 = Sequência 2'  sendo assim sucessivamente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/4371_CIOT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1217 - Cadastro de Veículos"
      },
      {
        "type": "p",
        "text": "Feito a inclusão do transportador autônomo e a conta corrente, no cadastro de veículos deve-se fazer a associação entre 'Veículo x Transportador x Conta Corrente' , o vínculo será realizado na aba 'Propriedades' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/1217_CIOT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7331 - Cadastro de Conhecimentos"
      },
      {
        "type": "p",
        "text": "Ao realizar a emissão do Conhecimento de Transporte Eletrônico deve-se vincular o terceiro anteriormente cadastrado ao processo, o número do 'Controle' será utilizado no procedimento seguinte que é a emissão do 'Recibo de Carreteiro' , valor esse que será utilizado na transmissão do CIOT."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/7331_CIOT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7352 - Pagamento a Carreteiro"
      },
      {
        "type": "p",
        "text": "Anterior ao CIOT é necessário a emissão do 'Recibo de Carreteiro' , nele estarão todas as informações necessárias ao CIOT (Transportador, Valores, Conta Corrente, Remetente, Destinatário, Cidades Origem e Destino) , o número do 'Controle' do CT-e anteriormente emitido será referência para esse processo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/7352_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/7352_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado a emissão do recibo, através do botão 'Emissão e Envio de Arquivos para CIOT' será gerado o arquivo no diretório configurado para que Administradora faça a transmissão para a ANTT , o número do 'Recibo' será referência nesse processo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/CIOT_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/CIOT_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de layout do arquivo CIOT:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/CIOT_3_layout.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2156 - Gerenciamento de CIOTs"
      },
      {
        "type": "p",
        "text": "O gerenciamento dos arquivos transmitidos será feito pela opção '2156 - Gerenciamento de CIOTs' , através dessa tela poderá ser feito a manutenção do arquivo (Consulta, Cancelamento, Encerramento) , é aconselhável o encerramento do CIOT em conjunto com o encerramento do 'Manifesto de Documento Fiscal eletrônico (MDF-e)' , caso o processo referente ao CIOT não seja concluído, após 2 meses a própria ANTT fará o encerramento do CIOT."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/2156.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Automação envio pagamento de 'Vale Pedágio' no CIOT - Parceria NDD Digital"
      },
      {
        "type": "p",
        "text": "Para que o valor refente ao 'Vale Pedágio' seja enviado de forma automática junto a emissão do CIOT é necessário utilizar a versão '1 - Versão '4.2.8.0' com Tabela de Frete' em conjunto com os parâmetros 'Meio de Pagto - 2 - Conta Corrente do Transportador' e 'Pagto Vale Ped - 1 - Movimentação em Cartão' , também deverá ser informado o código da 'Gestora' , essa informação ficará sobre responsabilidade da NDD Digital."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/CIOT_New_AGG.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Definido o parâmetro em '7362 - Gereciamento de CIOTs' , no cadastro de veículos (1217) deverá ser informado o 'Cartão Pedágio' na aba 'Geral' e 'Cat. de Pedágio' na aba 'Propriedades'."
      },
      {
        "type": "p",
        "text": "A informação inserida no campo  'Cartão Pedágio' refere-se ao cartão de crédito do motorista que será depositado a quantia referente ao valor do pedágio do trajeto origem e destino, essa informação será transmitida na emissão do CIOT."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/1217_Cart_Vale_Pedagio_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "No campo  'Cat. de Pedágio' é escolhido a forma de tabelamento do frete, conforme escolha é calculado um valor de pedágio tendo como referência origem e destino do motorista, esse valor é transmitido na emissão do CIOT e a quantia será depositada no cartão do terceiro através do software 'nddCargo' tendo como referência o próprio número do CIOT."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/CIOT/1217_Categor_Vale_Pedagio_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Erro ao emitir Conhecimento de Transporte - Rejeição 687",
          "Manifesto de Documentos Fiscais Eletrônicos- MDF-e"
        ]
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "7362 - Nova versão e parâmetros para implementação de automação de 'Vale Pedágio' no CIOT",
          "1217 - Cadastro de Veículos - Novo campo 'C/Corr. Vínculo'",
          "1217 - Novo campo 'Categoria de Pedágio'",
          "EMFP - Emissão de Manifesto - Montagem de Cargas Avulsas",
          "2152 - Emissão de Manifesto - Montagem de Cargas Avulsas",
          "7331 - Correção 'Leitura/Gravação' da condição de pagamento"
        ]
      }
    ]
  },
  {
    "id": "AP-83",
    "slug": "nova_ordem_de_servico",
    "title": "Nova Ordem de Serviço",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "producao"
    ],
    "updatedAt": "2020-01-28",
    "readTime": "9 min",
    "author": "Prócion Sistemas",
    "summary": "Ao acessar a opção '1111 - Aba - Estoque'  é necessário apontar no campo 'Estoque de Oficina' o código do estoque a ser utilizado para a movimentação de produtos referente a execução da ordem de serviço, o estoque deverá",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/83/nova_ordem_de_servico",
    "content": [
      {
        "type": "h3",
        "text": "Parametrização Geral - Nota Fiscal de Serviço - NFS-e/Ordem de Serviço"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros - Aba - Faturamento"
      },
      {
        "type": "h3",
        "text": "Ao acessar a opção ‘1111 - Aba - Faturamento’ é necessário apontar no campo ‘Versão NFS-e’ o uso da nota fiscal de serviço."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/NFSe_1111.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros - Aba - Estoque"
      },
      {
        "type": "p",
        "text": "Ao acessar a opção '1111 - Aba - Estoque'  é necessário apontar no campo 'Estoque de Oficina' o código do estoque a ser utilizado para a movimentação de produtos referente a execução da ordem de serviço, o estoque deverá estar previamente cadastrado na opção '5111 - Tipos de Estoque'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/1111_Estoque_Oficina.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - Fiscal"
      },
      {
        "type": "p",
        "text": "No cadastro de empresas  '1112 - Aba - Fiscal'  é necessário criar a série para emissão de nota fiscal de serviço e apontar no campo 'NF Eletrônica Serviços'  a respectiva série, utilizar modelo 'PS' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/1112_Fiscal_OS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na aba 'Faturamento'  deve-se apontar no campo 'Nota Fiscal Eletrônica de Serviços - Tipo'  qual modelo a ser utilizado para emissão da NFS-e  - '1 – DSFNET/2 – ABRASF'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/NFSe_1112_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações"
      },
      {
        "type": "p",
        "text": "No cadastro de transações '2113'  deve-se cadastrar a transação referente a emissão de nota fiscal eletrônica de serviço com sua respectiva ' Série', 'Tipo Venda', 'CFOP' ,  'N.B.S Vinculado' e 'Serviço Vinculado'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/2113_Serv.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado o cadastro da transação de serviço, deve-se realizar o vínculo com o código da transação utilizado para emissão de nota fiscal de produto. Essa ação é necessária para que na emissão o sistema consiga separar a nota fiscal de produto da de serviço com seus respectivos itens e valores."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/2113_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "RUS2 - Parâmetros Especiais Faturamento"
      },
      {
        "type": "h3",
        "text": "RUS2 - Parâmetros Especiais Faturamento - Aba - Geral Loja"
      },
      {
        "type": "p",
        "text": "Ao acessar a tela de parâmetros marcar a checkbox 'Permite Mão de Obra?'  e vincular o código da transação de venda de  PRODUTOS  no campo 'Operações Saídas - Transação'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/RUS_2_Geral.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "RUS2 - Parâmetros Especiais Faturamento - Aba - O.Serviços"
      },
      {
        "type": "p",
        "text": "Com a criação da nova Ordem de Serviço foi necessário criar parâmetros exclusivos que atendessem diversas formas de trabalho, abaixo segue um descritivo de cada um deles."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/RUS2_OS_New.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1 - Tipo O. Serviços:"
      },
      {
        "type": "p",
        "text": "Tipo - 0 - Atendimento Cliente COM Faturamento:  Nesse modo ao realizar o fechamento da Ordem de Serviço (7413)  será gerado um número de orçamento para ser faturado pela opção '75NV - Emissão de Orçamentos' , serão emitidas as respectivas notas fiscais de produtos e serviços."
      },
      {
        "type": "p",
        "text": "Tipo - 5 - Assistência Técnica SEM Faturamento:  Nesse modo ao realizar o fechamento da Ordem de Serviço (7413) não é gerado um número de orçamento para ser faturado, somente será criado a movimentação de estoque de produtos referente a execução da Ordem de Serviço realizada na opção '7412 - Execução de Ordens de Serviços' ."
      },
      {
        "type": "p",
        "text": "2 - Refaz preços na alteração de O.S?:  Habilitado o parâmetro ao alterar a Ordem de Serviço pela  '7411 - Cadastro de Ordens de Serviço' serão feitas as críticas referentes a atualização de preço dos produtos e a validade do documento;"
      },
      {
        "type": "p",
        "text": "3 - Permite abrir O.S Vazia? -  Habilitado o parâmetro é possível cadastrar uma Ordem de Serviço vazia, ou seja, não é necessário inserir nenhum produto ou serviço na opção '7411 - Cadastro de Ordens de Serviços' ."
      },
      {
        "type": "p",
        "text": "4 - Permite Inserir Itens após Início Execução? - Habilitado o parâmetro   uma vez inciada a execução (7412) é possível inserir novos itens na opção '7411 - Cadastro de Ordens de Serviço' ."
      },
      {
        "type": "p",
        "text": "5 - Realiza Estágio de Aprovação das O.S.? -  Habilitado o parâmetro o botão 'Grava'  ficará disponível na opção '7411 - Cadastro de Ordens de Serviço' , ao utilizá-lo a Ordem de Serviço ficará com o status de 'Orçamento' e não será possível sua execução até que seja alterado para ' A provado' através do botão 'Confirma' ."
      },
      {
        "type": "p",
        "text": "6 - Executor Obrigatório? -  Habilitado o parâmetro obriga o preenchimento do campo 'Executor' presente na opção '7412 - Execução de Ordens de Serviço' ."
      },
      {
        "type": "p",
        "text": "7 - Permite Inserir Itens Novos na Execução? -  Habilitado o parâmetro permite que sejam inseridos novos itens na execução da Ordem de Serviço (7412) do que fora previsto na opção '7411 - Cadastro de Ordens de Serviços' ."
      },
      {
        "type": "p",
        "text": "8 - Permite que a Quantidade Ultrapasse a Prevista? -  Habilitado o parâmetro permite que a quantidade executada na Ordem de Serviço (7412) ultrapasse o que fora previsto na opção '7411 - Cadastro de Ordens de Serviços' ."
      },
      {
        "type": "p",
        "text": "9 - Realiza Etapa de Encerramento da O.S? -  Escolhido o parâmetro será habilitado na opção '7412 - Execução de Ordens de Serviço' o botão 'Encerra Execuções da Ordem de Serviço',  ao utilizá-lo a Ordem de Serviço ficará com o status de 'Encerrada'  e não será mais possível realizar nenhuma execução."
      },
      {
        "type": "p",
        "text": "10 - Encerra O.S apenas com Itens Utilizados = Previstos? -  Habilitado o parâmetro o encerramento da Ordem de Serviço será possível somente se a execução realizada (7412) for igual a prevista (7411) ."
      },
      {
        "type": "p",
        "text": "11 - Fechamento Faturamento:  "
      },
      {
        "type": "p",
        "text": "Tipo - E - Pelo Valor Executado -  No fechamento da Ordem de Serviço (7413) o valor do boleto gerado para faturamento levará em consideração a quantidade executada pela opção '7412 - Execução de Ordens de Serviço' ."
      },
      {
        "type": "p",
        "text": "Tipo - X - Maior Valor Executado e/ou Previsto -  No fechamento da Ordem de Serviço (7413) o valor do boleto gerado para faturamento levará em consideração sempre a maior quantidade utilizada em todo o processo, seja na opção '7411 - Cadastro de Ordens de Serviços' ou '7412 - Execução de Ordens de Serviço' ."
      },
      {
        "type": "p",
        "text": "Tipo - P - Pelo Valor Previsto -  No fechamento da Ordem de Serviço (7413) o valor do boleto gerado para faturamento levará em consideração sempre a quantidade prevista em '7411 - Cadastro de Ordens de Serviços' ."
      },
      {
        "type": "h3",
        "text": "Ordem de Serviço Cadastro Preliminares"
      },
      {
        "type": "p",
        "text": "7411/741O – Cadastro de Objetos da Ordem de Serviço"
      },
      {
        "type": "p",
        "text": "Esse cadastro visa inserir itens que são específicos do ramo de atuação em que a Ordem de Serviço será implementada, esses itens podem ser de preenchimento obrigatório ou não, exibidos ou não na nota fiscal conforme cadastro do objeto. O campo 'Tipo' possui algumas características pré-definidas que fazem referência a terceiros, produtos, máscaras de placas de carro, número de série, repostas Sim/Não ou campo livre conforme a utilização do objeto."
      },
      {
        "type": "h3",
        "text": "Acesso ao cadastro de 'Objetos da O.S...' pelo botão presente na tela '7411 - Cadastro de Ordens de Serviços' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/Cad_Obj_OS_Bot_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/Cad_Obj_OS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " "
      },
      {
        "type": "p",
        "text": "7411/741D – Cadastro de Requisições"
      },
      {
        "type": "p",
        "text": "Essa tela visa o cadastro da requisição de  'Produtos/Serviços'  relacionados a Ordem de Serviço e sua respectiva execução, conforme a característica do serviço a ser executado pode-se cadastrar diversas requisições que contenham os produtos necessários para sua realização, a requisição por sua vez ao ser inserida no cadastro da Ordem de Serviço (7411) inclui de forma automática todos os itens necessários mediante a seleção do checkbox 'Insere automaticamente os Produtos/Serviços na O.S?' ."
      },
      {
        "type": "h3",
        "text": "Acesso ao cadastro de 'Cadastro de Serviços/Ocorrências...' pelo botão presente na tela '7411 - Cadastro de Ordens de Serviços' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/Cad_Req_OS_Botao.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/Cad_Req_OS_Inc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ordem de Serviço Procedimentos de Cadastro, Execução e Fechamento/Encerramento"
      },
      {
        "type": "p",
        "text": "7411 – Cadastro de Ordens de Serviço"
      },
      {
        "type": "p",
        "text": "No cadastro de Ordem de Serviço serão relacionados os 'Objetos' e 'Serviços/Ocorrências'  cadastrados anteriormente, também é possível incluir produtos e serviços que não foram cadastrados previamente na requisição para posterior execução na ordem de serviço. Mesmo nos produtos e serviços cadastrados previamente na requisição, pode se alterar quantidades e valores conforme os parâmetros utlizados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7411_OS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "No cadastro de Ordem de Serviço não existirá um botão de exclusão, foi inserido um botão 'Cancelar' que dará a Ordem de Serviço o status de 'Cancelado' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7411_Botao_Cancel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Na aba 'Complemento' pode-se adicionar informações complementares referentes a OS, essas informações serão exibidas em relatórios."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7411_OS_Complement_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito o cadastro da Ordem de Serviço é na execução que será apontado a real quantidade utilizada de produtos e horas de serviços gastos com a realização da OS. Serão trazidos os valores do cadastro da Ordem de Serviço (7411) , porém, mediante parâmetro é possível alterar esses valores para mais ou para menos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7412_Botao_Execuc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7412_OS_new.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao realizar a 'Devolução' de um material utilizado na execução, seu lançamento deve possuir sinal negativo (-) para que o item entre novamente no estoque. Ao pressionar o botão 'Consulta Valores Totais O.S' (Senha Gerente) é possível visualizar o valor de faturamento referente ao que foi executado até o momento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7412_OS_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Habilitado o parâmetro 'Realiza Estapa de Encerramento da O.S?' o botão 'Encerra execuções da Ordem de Serviços' ficará disponível e ao utilizá-lo a OS ficará com o status 'Encerrada',  uma vez utilizado o parâmetro é obrigatório fazer o encerramento anterior ao '7413 - Fechamento da Ordem de Serviços' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7412_Botao_Encerr.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7412_Encerr.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7413 - Fechamento da Ordem de Serviços"
      },
      {
        "type": "p",
        "text": "Realizada toda a execução da Ordem de Serviço é necessário fazer seu fechamento, ao fazê-lo o sistema gerará um número de orçamento que será processado na tela '75NV - Emissão de Orçamentos' e fará a emissão das notas fiscais de produtos e serviços com seus respectivos itens e valores. Nesse ponto ainda é possível alterar valor do item, efetuar descontos, trocar a condição de pagamento e realizar bonificações."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7413_OS.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O orçamento gerado ficará disponível na '75OV - Cadastro de Orçamentos' somente no modo 'Consulta' e ao fazê-lo terá uma mensagem indicando sua origem."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/75OV_OS_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A tela '75NV - Emissão de Orçamentos'  fará a emissão das notas fiscais de produtos e serviços com seus respectivos itens e valores."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Nova_Ordem_Servi%C3%A7o/7513_OS.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-82",
    "slug": "juncao_de_orcamentos",
    "title": "Junção de Orçamentos",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-01-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "A junção de orçamentos visa unificar diversos documentos de um mesmo cliente afim de que seja gerado apenas uma nota fiscal/fatura, para realizá-lo deve-se atentar ao parâmetro 'RUS2 - Parâmetro Especiais Faturamento - R",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/82/juncao_de_orcamentos",
    "content": [
      {
        "type": "p",
        "text": "A junção de orçamentos visa unificar diversos documentos de um mesmo cliente afim de que seja gerado apenas uma nota fiscal/fatura, para realizá-lo deve-se atentar ao parâmetro 'RUS2 - Parâmetro Especiais Faturamento - Representante Pedido' , se utilizado 'Representante Pedido - 0 - Por Item'  ao realizar a junção os documentos devem estar com o 'Grupo de Vendas' e 'Clientes' iguais, o documento resultado da junção ao ser faturado separará item a item pra cada representante presente nos documentos origem sua respectiva comissão cada qual com sua respectiva porcentagem. Se utilizado 'Representante Pedido - 1 - Um por Pedido' ao realizar a junção os documentos devem estar com 'Grupo de Vendas', 'Representante' e 'Clientes' iguais, pois, todo o valor de venda e seu respectivo comissionamento irá somente pra um vendedor."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Jun%C3%A7%C3%A3o%20de%20Or%C3%A7amentos/RUS_Junc_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O acesso a 'Junção de Orçamentos' será pela tela '75NV - Emissão de orçamentos' , pressionar a tecla 'F8' no campo 'Orçamento' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Jun%C3%A7%C3%A3o%20de%20Or%C3%A7amentos/75NV_Junc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "É possível a junção de 5 diferentes tipos de documentos, cada qual somente com seu próprio tipo com exceção de  '0 - Orçamentos e Pré-Vendas' , no qual, dois diferentes tipos podem ser unificados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Jun%C3%A7%C3%A3o%20de%20Or%C3%A7amentos/75JO_Junc_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Não havendo conformidade nos documentos selecionados conforme os parâmetros descritos acima, será exibido uma mensagem de aviso e o botão 'Confirma' não será habilitado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Jun%C3%A7%C3%A3o%20de%20Or%C3%A7amentos/75JO_Junc_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Existindo conformidade entre os documentos selecionados e os parâmetros definidos, será habilitado o botão 'Confirma' para que seja realizada a junção e seja gerado um novo documento resultante da união entre os documentos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Jun%C3%A7%C3%A3o%20de%20Or%C3%A7amentos/75NV_Junc_2.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-81",
    "slug": "novos_campos_para_apuracao_do_complemento_restituicao_do_icms_st_emissao_nota_fiscal_eletronica_",
    "title": "Novos campos para apuração do Complemento/Restituição do ICMS-ST - Emissão Nota Fiscal Eletrônica",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-01-24",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "De utilização a critério da UF para possibilitar a apuração do 'Complemento/Restituição do ICMS-ST' de operações subsequentes que exijam o preenchimento do 'Grupo ICMS60' , foram adicionados novos campos nesse grupo e ta",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/81/novos_campos_para_apuracao_do_complemento_restituicao_do_icms_st_emissao_nota_fiscal_eletronica_",
    "content": [
      {
        "type": "p",
        "text": "De utilização a critério da UF para possibilitar a apuração do 'Complemento/Restituição do ICMS-ST' de operações subsequentes que exijam o preenchimento do 'Grupo ICMS60' , foram adicionados novos campos nesse grupo e tags dentro arquivo xml da Nota Fiscal Eletrônica ."
      },
      {
        "type": "p",
        "text": "O  'Complemento/Restituição do ICMS-ST'  será destinado para operações com clientes tipo 'R - Revendedor'  que por meio das novas tags implementadas poderá acompanhar se o valor do imposto foi retido a maior, correspondente à diferença entre o valor que serviu de base à retenção e o valor da operação ou prestação realizada com consumidor ou usuário final."
      },
      {
        "type": "p",
        "text": "Deve-se informar a Base de Cálculo utilizada para o Valor da Substituição Tributária, a Alíquota do ICMS, Valor do ICMS Subtituto e Valor ICMS ST Retido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/ICMS_60_Tag.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Os valores apresentados baseiam na fórmula: BCST Retido = ((Valor do Custo x QTD) x (1 + (IVA/100))) + (Valor do Custo x QTD) Vl ST Retido = (BCST Retido x Aliq ST) - VL ICM do Custo Total da operação = (Valor do Custo x QTD) + Vl ST Retido"
      },
      {
        "type": "p",
        "text": "Deve-se escolher a forma do  'Tipo do Cáculo ICMS-60 no XML' a ser utilizado pelo sistema, o acesso será por  'RUSA - Parâmetros dependentes de Termo de Reponsabilidade'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/RUSA_1_acess.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "0 - Cálculo Manual -  Nesse tipo deve-se informar de forma manual os valores em 'Detalhamento ICMS - Botão - ICMS' ."
      },
      {
        "type": "p",
        "text": "2 - Método 'PEPS' pelas Entradas -  Esse tipo baseia-se pela forma 'Primeiro Registro de Entrada Primeiro Registro a Sair' , ou seja, será considerado o primeiro registro referente a lançamentos realizados pela '3212 - Cadastro de Documentos de Entradas'."
      },
      {
        "type": "p",
        "text": "3 - Métodos 'MÉDIA' pelas Entradas -  Nesse tipo será considerado a média referente aos lançamentos realizados pela  '3212 - Cadastro de Documentos de Entradas'."
      },
      {
        "type": "p",
        "text": "6 - Pelo 'Custo Última Compra' (1232) -  Será considerado o valor presente na tabela 'Custo Última Compra' presente no cadastro de produtos."
      },
      {
        "type": "p",
        "text": "7 - Pelo 'Custo Inventário' (1232) -  Será considerado o valor presente na tabela 'Custo Inventário' presente no cadastro de produtos."
      },
      {
        "type": "p",
        "text": "Selecionado a forma deve-se imprimir o 'Termo de Responsabilidade' para que o responsável pela empresa assine mediante a forma de cálculo escolhida."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/RUSA_2_term.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/RUSA_3_Term_Resp.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "A visualização dos valores será feito em '2131 - Cadastro de Pedidos - Detalhamento ICMS - Botão - ICMS 60'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/Val_ST_Item_bot%C3%A3o_acesso.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "É possível alterar a forma escolhida através de 'Senha Gerente' no momento da emissão, feito a troca pressionar o botão 'Calcula' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/Val_ST_Item.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Foi criado em '2134 - Listagem de Pedidos' o tipo '9 - Relação Subst. Tribut.' para que possa-se realizar uma conferência do pedido anterior a emissão da nota fiscal."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/2134_Val_ST.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/2134_Val_ST_Rel.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Caso o banco de dados não possua um histórico referente as entradas é possível realizar um lançamento de \"acerto\" para que o imposto fique condizente ao saldo de estoque presente no sistema, a inclusão será feita pela tela 'Registro de Entradas no Estoque' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/ICMS_ST_060/5126_Val_ST_Entrada.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-80",
    "slug": "geracao_de_darfs_para_pagamento_via_sistema_documento_de_arrecadacao_de_receitas_federais",
    "title": "Geração de DARFs para pagamento via sistema - Documento de Arrecadação de Receitas Federais",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro"
    ],
    "updatedAt": "2020-01-23",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Para realizar a geração de guias de pagamento referente a 'DARF - Documento de Arrecadação de Receitas Federais',  deve-se incluir o processo de pagamento através da opção '4311 - Processos de Pagamento' utilizando sempr",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/80/geracao_de_darfs_para_pagamento_via_sistema_documento_de_arrecadacao_de_receitas_federais",
    "content": [
      {
        "type": "p",
        "text": "Para realizar a geração de guias de pagamento referente a 'DARF - Documento de Arrecadação de Receitas Federais',  deve-se incluir o processo de pagamento através da opção '4311 - Processos de Pagamento' utilizando sempre o tipo 'DR' , também é necessário associar o respectivo 'Código do Tributo' referente ao imposto a ser pago."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20de%20DARFs%20para%20pagamento%20via%20sistema/4311_DR.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Realizado a inclusão do 'Processo de Pagamento' a impressão da guia será feita pela opção '4263 - Emissão de DARF' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20de%20DARFs%20para%20pagamento%20via%20sistema/4363_DR.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na guia impressa não será gerado um código de barras, pois, a 'INSTRUÇÃO NORMATIVA SRF Nº 96, DE 27 DE NOVEMBRO DE 2001'   IMPOSSIBILITA a geração do Darf com código de barras! No ato do pagamento será consultado o 'Código da Receita' e o 'CNPJ' para que a guia seja quitada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20de%20DARFs%20para%20pagamento%20via%20sistema/DARF_DR.PNG",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-78",
    "slug": "edicao_de_etiquetas_impressoras_zebra_argox",
    "title": "Edição de Etiquetas - Impressoras Zebra/Argox",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-01-20",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "Para que o Sistema Hádron realize a impressão de etiquetas com código de barras nas impressoras 'Zebra' e 'Argox' , é preciso fazer uma edição especial do arquivo de impressão. O sistema já possui um editor de etiquetas ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/78/edicao_de_etiquetas_impressoras_zebra_argox",
    "content": [
      {
        "type": "p",
        "text": "Para que o Sistema Hádron realize a impressão de etiquetas com código de barras nas impressoras 'Zebra' e 'Argox' , é preciso fazer uma edição especial do arquivo de impressão. O sistema já possui um editor de etiquetas que gera de maneira simples e interativa essas etiquetas, no entanto, para essas impressoras é necessário trabalhar com sua própria linguagem para atingirmos resultados mais satisfatórios. Este manual tem a finalidade de explicar de forma geral os procedimentos de edição destes arquivos, que serão usados pelo sistema."
      },
      {
        "type": "p",
        "text": "O primeiro passo é instalar o programa de edição de etiquetas, neste manual será utilizado o programa 'ZebraDesigner' , que é um programa que edita etiquetas para as impressoras 'Zebra' . É importante ressaltar a importância a certos pontos referente a edição de etiquetas como: dimensão; espaçamentos; fontes (não é aconselhável utilizar fontes do windows para trabalhar os textos da etiqueta, e sim, as fontes próprias da impressora); tipo de código de barra (Ean-13, code128, etc)."
      },
      {
        "type": "h3",
        "text": "Exemplo modelo de montagem de etiqueta no 'ZebraDesigner' : "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Modelo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Finalizada a etiqueta, devemos através da função de impressão gerar um arquivo que contenha as informações inseridas conforme a montagem realizada acima: código númerico, descrição e código de barras. Para tanto, temos que realizar uma 'Impressão em Arquivo' , esse procedimento gerará um arquivo editável com a extensão 'prn' que posteriormente será alterado para poder ser lido pelo sistema. Para gerar o arquivo clicar no botão de 'Impressão' e selecionar a função 'Imprimir em Arquivo (ficheiro)' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Arquivo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O campo 'Quantidade' faz referência ao número de etiquetas (colunas) por linha e deve ser preenchido, escolher um nome para o arquivo da etiqueta e clicar em 'Salvar' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Save.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Com o arquivo criado temos que edita-lo fazendo com que ele possa ser interpretado pelo sistema, é neste momento que escolhemos as variáveis que serão enviadas para a impressão da etiqueta. O sistema trabalha com um padrão de variáveis que sempre começará com um arroba '@' , seguido de um código formado por letras, número e símbolos, este código indicará qual valor será enviado à etiqueta. Por exemplo, se estamos editando uma etiqueta de produtos e queremos enviar a descrição deste para ser impresso, inserir o código '@V11'  no lugar desejado na etiqueta."
      },
      {
        "type": "h3",
        "text": "Devemos editar o arquivo que geramos anteriormente, abri-lo com o 'Bloco de Notas' do 'Windows' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Edit_Etiquet.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A imagem acima contém o arquivo com a códificação original da etiqueta que criamos, nele estão todos os valores, dimensões, tipo de texto, tipo de código de barras, etc que encontram - se na etiqueta, estes valores e códigos podem ser alterados e é exatamente o que precisamos fazer. Neste caso, o arquivo que criamos contém três campos: um numérico referente ao código do produto, um referente ao código de barras e outro para descrição (alfanumérico). Podemos observar que existem três setores do documento que se assemelham, que são as três etiquetas (colunas) criadas para cada linha. Para facilitar a visualização as três partes (etiquetas) estão dividas com salto entre linhas."
      },
      {
        "type": "h3",
        "text": "Na imagem abaixo podemos visualizar onde encontra-se cada uma das etiquetas:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Edit_Etiquet_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A primeira coisa que devemos fazer é inserir o cabeçalho, ele serve para que o sistema reconheça o arquivo no formato 'Hádron' . Já temos um modelo e não precisamos nos preocupar em formar uma linha de comando nova, o modelo de cabeçalho utilizado será: 01/20080/01/0100/61/000000-4-Etiqueta EAN 3 carreiras , ficará assim no documento:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Edit_Etiquet_3_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O próximo passo é substituir os valores dos campos pelos códigos (Arroba @)  respectivo a informação dentro do sistema. Se nos atentarmos ao arquivo facilmente encontramos as áreas a serem substituídas, elas estão com os valores que inserimos ao criar a etiqueta no 'ZebraDesigner' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Edit_Etiquet_4_4.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Feitas todas as substituições necessárias o resultado final é este:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Edit_Etiquet_5.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para finalizar devemos salvar o arquivo, nos atentar à extensão utilizada que sempre será 'PAD' e o diretório escolhido será a pasta 'REDACOES' presente nas pastas do Sistema Hádron ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Edi%C3%A7%C3%A3o%20de%20Etiquetas%20-%20Impressoras%20Zebra_Argox/Zebra_Dir_Red.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "OBS : As '@' e suas respectivas funcionalidades e informações deverão ser consultadas na opção '1150 - Editor de Formulários' ."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "ul",
        "items": [
          "Conferência Quantitativa - Entrada de Materiais"
        ]
      }
    ]
  },
  {
    "id": "AP-77",
    "slug": "relatorios_modulo_faturamento_rankings",
    "title": "Relatórios Módulo Faturamento - Rankings",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-01-16",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "2631 – Ranking Clientes - Lista os valores de compras por clientes e acumulados em ordem de volume de compras.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/77/relatorios_modulo_faturamento_rankings",
    "content": [
      {
        "type": "p",
        "text": "2631 – Ranking Clientes - Lista os valores de compras por clientes e acumulados em ordem de volume de compras."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido 'Pedidos Pendentes' .",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda', 'Não Venda', 'Todos', 'Devolução', 'Vendas – Devolução', 'Vendas - Bonificações'.",
          "Pode-se filtrar a listagem por representantes, clientes, produtos e série da Nota Fiscal.",
          "O campo 'Quant. Clientes'  permite escolher quantos clientes serão listados (do maior ao menor volume de vendas).",
          "Os campos 'Subtrai ICMS',   'Subtrai IPI' e 'Subtrai ICMS-ST'  permitem subtrair ou não os impostos no relatório."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Rankings/2631_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2632 – Ranking Clientes por Grupos - Lista os valores de compras por clientes e acumulados separando as informações por grupo de produtos."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido 'Pedidos Pendentes' .",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda', 'Não Venda', 'Todos', 'Devolução', 'Vendas – Devolução', 'Vendas - Bonificações'.",
          "Pode-se filtrar a listagem por representantes, clientes, produtos, grupos de produtos, código interno e série da Nota Fiscal.",
          "O campo 'Quant. Clientes'  permite escolher quantos clientes serão listados (do maior ao menor volume de vendas)."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Rankings/2632_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2633 – Ranking Representantes - Lista as vendas por representantes permitindo ordenar pelos itens descritos abaixo."
      },
      {
        "type": "ul",
        "items": [
          "Escolher em que ordenação será exibida a listagem, por ordem de Vendas, Unidades, Preços Unitários Médios, Quantidade de Pedidos, Valor Médio por Pedido ou Itens por Pedido.",
          " A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido 'Pedidos Pendentes' .",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda', 'Não Venda', 'Todos', 'Devolução', 'Vendas – Devolução', 'Vendas - Bonificações'.",
          "Pode-se filtrar a listagem por representantes, produtos, grupos de produtos, código interno e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Rankings/2633_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2634 – Ranking Produtos - Lista as vendas por produtos com preços médios, quantidades e percentuais em ordem de volume de vendas totalizando por valor."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido 'Pedidos Pendentes' .",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda', 'Não Venda', 'Todos', 'Devolução', 'Vendas – Devolução', 'Vendas - Bonificações'.",
          "Pode-se filtrar a listagem por representantes, clientes, produtos, grupos de produtos, código interno, centros e série da Nota Fiscal.",
          "O campo 'Quant. Produtos'  permite escolher quantos produtos serão listados (do maior ao menor volume de vendas)."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Rankings/2634_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2635 – Ranking por Códigos Internos - Lista as vendas por produtos exibindo somente o código interno do produto, a quantidade vendida, o valor total, o preço médio e percentual total."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido 'Pedidos Pendentes' .",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda', 'Não Venda', 'Todos', 'Devolução', 'Vendas – Devolução', 'Vendas - Bonificações'.",
          "Pode-se filtrar a listagem por representantes, clientes, produtos, grupos de produtos, código interno (pode-se listar somente algumas posições do código interno colocando 'X'  no campo 'C.Int.Sintetiza'  para representar quantas posições quer que sejam relacionadas), série da Nota Fiscal e índice (financeiro)."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Rankings/2635_Rel.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-75",
    "slug": "relatorios_modulo_faturamento_analise_de_clientes_pedidos",
    "title": "Relatórios Módulo Faturamento - Análise de Clientes/Pedidos",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2020-01-15",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "2611 – Cliente x Produtos -  Lista os clientes e seus respectivos produtos.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/75/relatorios_modulo_faturamento_analise_de_clientes_pedidos",
    "content": [
      {
        "type": "p",
        "text": "2611 – Cliente x Produtos -  Lista os clientes e seus respectivos produtos."
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordenação em que o relatório será exibido, se por ordem de código ou nome do cliente.",
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido  'Pedidos Pendentes' .",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda' , 'Não Venda' , 'Todos' , 'Devolução' , 'Vendas – Devolução' , 'Vendas - Bonificações' .",
          "No campo 'Tipo Unidade'  pode - se escolher exibir o relatório por unidade padrão do produto ou por unidade de venda.",
          "Pode-se filtrar a listagem por representantes (pode-se realizar 'Quebra'  em 1 representante por grupo de páginas), clientes, produtos, série da Nota Fiscal e condição de pagamento."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2611_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2612 – Clientes Inativos -  Lista os clientes que efetuaram sua última compra em um período informado."
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordenação em que o relatório será exibido, se por ordem de código, nome ou cidade do cliente.",
          "Pode-se filtrar a listagem por representantes (pode-se realizar 'Quebra'  em 1 representante por grupo de páginas), setor do cliente e clientes.",
          "Se optar por 'S'  no campo 'Completa (S/N)'  aparecerá o endereço do cliente, caso opte por 'N' será exibido somente a cidade do cliente.",
          "No campo 'Ult. Movimento'  deve-se informar um período limite para verificar a última compra do cliente."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2612_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2613 – Clientes x Meses -  Lista os valores vendidos para os clientes totalizados por mês."
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordenação em que o relatório será exibido, se por ordem de código ou nome do cliente.",
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido  'Pedidos Pendentes' .",
          "Em  'Status' escolher se o pedido é de 'Venda' , 'Não Venda' , 'Todos' , 'Devolução' , 'Vendas – Devolução' , 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por representantes (pode-se realizar 'Quebra'  em 1 representante por grupo de páginas), grupos de condição de pagamento, clientes, série da Nota Fiscal, UF do cliente e setor do cliente."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2613_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2614 – Cliente x Anos -  Lista os valores vendidos para os clientes totalizados por anos e meses."
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordenação em que o relatório será exibido, se por ordem de código do cliente, nome do cliente ou valor/quantidade.",
          "Informe no campo 'Anos'  o período que deseja-se verificar.",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda' , 'Não Venda' , 'Todos' , 'Devolução' , 'Vendas – Devolução' , 'Vendas - Bonificações' .",
          "No campo 'Tipo Unidade'  pode - se escolher exibir o relatório por unidade padrão do produto ou por unidade de venda.",
          "Pode-se filtrar a listagem por representantes (pode-se realizar 'Quebra'  em 1 representante por grupo de páginas), clientes, setor, condição de pagamento, produtos e série da Nota Fiscal.",
          "Este relatório será emitido no formato paisagem."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2614_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2615 – Prazos Médios Pedidos -  Lista a quantidade de pedidos faturados no mês e calcula o prazo médio de pagamento mensal."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais.",
          "Pode-se filtrar a listagem por representantes (pode-se realizar 'Quebra'  em 1 representante por grupo de páginas), clientes, produtos e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2615_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2616 – Síntese Clientes x Condição de Pagamento -  Lista em valores o quanto foi vendido para o cliente separado por condições de pagamento."
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordenação em que o relatório será exibido, se por ordem de código ou nome do cliente.",
          "A data de emissão refere-se a emissão de Notas Fiscais.",
          "Pode-se filtrar a listagem por grupos de condições de pagamento, condições de pagamento (podendo sintetizar mostrando valor totalizado por cliente sem separar por condição de pagamento), representantes (pode-se realizar 'Quebra'  em 1 representante por grupo de páginas), clientes (podendo sintetizar mostrando valor totalizado por condição de pagamento sem separar por cliente), setor, produtos e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2616_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2617 – Clientes x Compras -  Lista os clientes e produtos separados por documento emitido apresentando quantidades e valores."
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordenação em que o relatório será exibido, se por ordem de código ou nome do cliente.",
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido  'Pedidos Pendentes' .",
          "Em 'Situação' escolher entre 'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é de 'Venda' , 'Não Venda' , 'Todos' , 'Devolução' , 'Vendas – Devolução' , 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem pro representantes, clientes (pode-se realizar 'Quebra'  em 1 cliente por grupo de páginas), setor, produtos, grupo de produtos, código interno, série da Nota Fiscal e condições de pagamento."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2617_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2618 - Análise de Vendas x Vencimentos -  Lista documentos de vendas com seus respectivos vencimentos e margem comparado a tabela de custo."
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordenação em que o relatório será exibido, se por ordem de código ou nome do cliente.",
          "Pode-se filtrar a listagem pro representantes (pode-se realizar 'Quebra'  em 1 representante por grupo de páginas), centro, sub-centro, data emissão.",
          "É possível sintetizar informações pelos checkbox 'Por Documento?' e 'Por Representante?' ."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20Faturamento%20-%20An%C3%A1lise_Clientes_Pedidos/2618_Rel.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-76",
    "slug": "relatorios_modulo_faturamento_analise_de_produtos_representantes",
    "title": "Relatórios Módulo Faturamento - Análise de Produtos/Representantes",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-01-15",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "2621 – Representantes x Produtos -  Lista os representantes com seus respectivos produtos vendidos.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/76/relatorios_modulo_faturamento_analise_de_produtos_representantes",
    "content": [
      {
        "type": "p",
        "text": "2621 – Representantes x Produtos -  Lista os representantes com seus respectivos produtos vendidos."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido   'Pedidos Pendentes' .",
          "Em  'Situação'  escolher entre  'Pendentes' ,  'Emitidos'  ou  'Todos',  em 'Status' se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por representantes, produtos e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2621_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2622 – Produtos x Representantes - Lista os produtos vendidos com seus respectivos representantes."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido   'Pedidos Pendentes' .",
          "Em  'Situação'  escolher entre  'Pendentes' ,  'Emitidos'  ou  'Todos',  em 'Status' se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por representantes, produtos e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2622_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2623 – Produtos x Períodos - Lista os produtos e o quanto foram vendidos em cada mês ou ano."
      },
      {
        "type": "ul",
        "items": [
          "O campo 'Forma'  indica se a listagem será por mês ou ano.",
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido   'Pedidos Pendentes' .",
          "Em 'Status' escolher se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por representantes, produtos, grupo de produtos, código interno e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2623_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2624 – Representantes x Meses - Lista os valores de vendas por representantes totalizados por mês."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido   'Pedidos Pendentes' .",
          "Em  'Situação'  escolher entre  'Pendentes' ,  'Emitidos'  ou  'Todos',  em 'Status' se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por representantes e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2624_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2625 – Vendas/Devoluções por Grupos - Lista os valores de vendas/devoluções separados por grupos e produtos."
      },
      {
        "type": "ul",
        "items": [
          "Escolher ordenação que o relatório será exibido, por descrição de produtos ou volume de vendas.",
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido   'Pedidos Pendentes' .",
          "Em  'Situação'  escolher entre  'Pendentes' ,  'Emitidos'  ou  'Todos',  em 'Status' se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "O campo 'Forma Apres'  indica de que maneira serão agrupados os dados: Agrupa: Exibe e totaliza o grupo e os valores de cada um de seus produtos;",
          "Em Níveis: Identico ao 'Agrupa' , porém exibe e totaliza os níveis superiores dos grupos;",
          "Sintético: Exibe e totaliza os grupos sem exibir sua descrição.",
          "O campo 'Quant. Produtos'  é usado quando utilizado a ordem por volume de vendas, pois este campo permite escolher quantos produtos serão listados (do maior ao menor produto em volume de vendas).",
          "Pode-se filtrar a listagem por representantes, produtos, grupos de produtos, centros e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2625_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2626 – Síntese por Centros Receitas - Lista em valores, custo e margem o quanto foi vendido separado por centros de receitas."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido   'Pedidos Pendentes' .",
          "Em  'Situação'  escolher entre  'Pendentes' ,  'Emitidos'  ou  'Todos',  em 'Status' se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por centros (pode-se sintetizar exibindo valor o totalizado por centros de receitas), representantes (pode-se sintetizar exibindo o valor totalizado por representantes), clientes, produtos (pode-se sintetizar exibindo o valor totalizado por produtos) e série da Nota Fiscal.",
          "No campo 'Tabela de Custos'  deve informar a tabela para o cálculo da margem."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2626_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2627 – Síntese por Condição de Pagamento - Lista o quanto foi vendido (valor e custo) e margem de cada produto, separado por condições de pagamento."
      },
      {
        "type": "ul",
        "items": [
          "A data de emissão refere-se a emissão de Notas Fiscais, sendo assim não será considerada quando for escolhido   'Pedidos Pendentes' .",
          "Em  'Situação'  escolher entre  'Pendentes' ,  'Emitidos'  ou  'Todos',  em 'Status' se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por grupos de condições de pagamento, condições de pagamento (pode-se sintetizar exibindo o valor totalizado por produto sem separar por condição de pagamento), representantes (pode-se realizar  'Quebra'  em 1 representante por grupo de páginas), clientes, produtos (pode-se sintetizar exibindo o valor totalizado por condição de pagamento sem separar por produto), grupos, código interno e série da Nota Fiscal.",
          "No campo 'Tabela de Custos'  deve informar a tabela para o cálculo da margem."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2627_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2628 – Análise de Cotas/Representantes - Lista o quanto foi vendido pelo representante e exibe uma análise sobre sua cota de vendas informada no cadastro de representantes  '1215' ."
      },
      {
        "type": "ul",
        "items": [
          "O campo 'Mês/Ano' refere-se a pedidos emitidos, ou seja, este campo faz referência ao mês de emissão da Nota Fiscal.",
          "O campo 'Sint/Analitico'  permite listar os totais de vendas por representantes se for usado o modo 'Sintético'  ou listar as vendas de cada produto se for usado o modo 'Analítico' .",
          "Em  'Situação'  escolher entre  'Pendentes' ,  'Emitidos'  ou  'Todos',  em 'Status' se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por representantes, produtos  e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2628_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2629 – Análise de Produtos X Estoque X Vendas - Lista a quantidade vendida de cada produto, seu custo de inventário e o saldo de estoque no período escolhido."
      },
      {
        "type": "ul",
        "items": [
          "O campo 'Mês/Ano' refere-se a pedidos emitidos, ou seja, este campo faz referência ao mês de emissão da Nota Fiscal.",
          "Em  'Status' escolher se o pedido é de  'Venda', 'Não Venda', 'Todos', 'Devolução' , ' Vendas – Devolução', 'Vendas - Bonificações' .",
          "Pode-se filtrar a listagem por representantes, produtos, grupos, código interno, UF  e série da Nota Fiscal."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20An%C3%A1lise%20de%20Produtos_Representantes/2629_Rel.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-73",
    "slug": "relatorios_modulo_faturamento_listagem_de_pedidos_elaborados_faturamento_vendas",
    "title": "Relatórios Módulo Faturamento - Listagem de Pedidos/Elaborados Faturamento-Vendas",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2020-01-15",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "2134 – Listagem de Pedidos - Escolhe-se o modelo do relatório que deseja-se utilizar, a ordenação da listagem, se quer pedidos de 'Entrada' ou 'Saída' , se deseja quebrar por representante (sair separado por folha os ped",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/73/relatorios_modulo_faturamento_listagem_de_pedidos_elaborados_faturamento_vendas",
    "content": [
      {
        "type": "p",
        "text": "2134 – Listagem de Pedidos - Escolhe-se o modelo do relatório que deseja-se utilizar, a ordenação da listagem, se quer pedidos de 'Entrada' ou 'Saída' , se deseja quebrar por representante (sair separado por folha os pedidos de cada representante) e qual/quais representantes, se sairá ou não um pedido por folha e qual/quais pedidos, após pode-se filtrar a listagem por data do pedido, clientes, série, carga, condições de pagamento. Já no 'Status' permanecer ' X'  para ver todos os pedidos e na 'Situação' escolher entre  'Pendentes', 'Emitidos' , 'Cancelados' ou 'Todos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20List_Pedidos_Elaborados/2134_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2220 – Relatórios Elaborados de Faturamento"
      },
      {
        "type": "p",
        "text": "Este é um recurso de grande funcionalidade, pois o operador do Sistema Hádron pode elaborar seu próprio relatório. Baseando-se em dados pertinentes aos pedidos pendentes ou que já tenham sido emitidos e transformados em algum documento fiscal, os relatórios podem conter campos que são devidamente agrupados para atender o operador e gerar a informação necessária para uma análise ou tomada de decisão."
      },
      {
        "type": "p",
        "text": "Para incluir um relatório basta acessar esta opção e pressionando o botãode 'Inclusão' será iniciada a criação de um relatório específico, onde pode-se colocar uma descrição para identifica-lo, o tipo (identificando se utilizará todos os pedidos ou somente NF emitidas no dia) e nos campos disponíveis poderá configurar a informação do relatório selecionando-os pelas suas letras iniciais (Ex. para encontrar o campo 'Nome do Cliente'  pressiona-se a letra 'N' ), para finalizar o relatório basta pressionar o botão 'Confirma' ."
      },
      {
        "type": "h3",
        "text": "OBS : O relatório pode conter até três linhas de campos para cada registro que será listado no relatório."
      },
      {
        "type": "p",
        "text": "Para listar um relatório basta acessar esta opção e pressionando o botão 'Listar',  será apresentada uma tela para escolha do relatório onde, pressionando a tecla 'F3'  no campo 'Código' , serão apresentados os relatórios criados e, após selecionar o relatório, pressionar o botão 'Confirma'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20List_Pedidos_Elaborados/2220_Rel_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20List_Pedidos_Elaborados/2220_Rel_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na tela acima escolhe-se em que ordem sairá o relatório, se deseja ou não quebrar por representante, setor ou cidade (sair separado por folha), se os pedido são de 'Entrada' ou 'Saída' , após pode-se filtrar a listagem por representantes, setor, clientes, série, datas de pedido/emissão/saída, valor, natureza de operação, condições de pagamento e/ou carga. Já no 'Status ' permanecer 'X'  para ver todos os pedidos e na 'Situação' escolher entre 'Pendentes' , 'Emitidos' , 'Cancelados' ou 'Todos' ."
      },
      {
        "type": "p",
        "text": "2450 – Relatórios Elaborados de Vendas -  É necessário processar a opção '2410 - Criação de Arquivos de Vendas' para atualizar os dados destes relatórios."
      },
      {
        "type": "p",
        "text": "Este é um recurso de grande funcionalidade, assim como dito na opção '2220 - Elaborados de Faturamento' , pois o operador do Sistema Hádron pode elaborar seu próprio relatório. Os relatórios podem conter campos que são devidamente agrupados para atender o operador e gerar a informação necessária para uma análise ou tomada de decisão."
      },
      {
        "type": "p",
        "text": "Para incluir um relatório basta acessar esta opção e pressionaro botão 'Inclusão',  será iniciada a criação de um relatório específico, onde pode-se colocar uma descrição para identifica-lo, o tipo (identificando se utilizará todos os pedidos ou somente NF emitidas no dia) e nos campos disponíveis poderá configurar a informação do relatório selecionando-os pelas suas letras iniciais (Ex. para encontrar o campo 'Nome do Cliente'  pressiona-se a letra 'N' ), para finalizar o relatório basta pressionar o botão 'Confirma' ."
      },
      {
        "type": "h3",
        "text": "OBS : O relatório pode conter até três linhas de campos para cada registro que será listado no relatório."
      },
      {
        "type": "p",
        "text": "Para listar um relatório basta acessar esta opção e pressionar o botão  'Listar',  será apresentada uma tela para escolha do relatório onde, pressionando a tecla 'F3'  no campo 'Código' , serão apresentados os relatórios criados e, após selecionar o relatório, pressionar o botão 'Confirma' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20List_Pedidos_Elaborados/2450_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na tela abaixo escolhe-se em que ordem sairá o relatório, se deseja ou não quebrar por representante, setor ou cidade (sair separado por folha), se os pedido são de 'Entrada' ou 'Saída' , após pode-se filtrar a listagem por representantes, setor, clientes, série, datas de pedido/emissão/saída, valor, natureza de operação, condições de pagamento e/ou carga. Já no status permanecer 'X'  para ver todos os pedidos e na situação escolher entre 'Pendentes' , 'Emitidos' , 'Cancelados' ou 'Todos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20List_Pedidos_Elaborados/2450_Rel_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Formas de uso utilizando os filtros disponíveis:"
      },
      {
        "type": "p",
        "text": "Quebra:  Especificação do campo pelo qual os registros da listagem serão agrupados numa primeira ordem, apresentando-se uma totalização ao final da relação de cada agrupamento e avançando-se a página. A 'Quebra'  selecionada será assumida como primeira 'Totalização'  e primeira 'Ordem Ascendente'."
      },
      {
        "type": "p",
        "text": "Totalizações:  Permite uma totalização (Sub-total 1) e uma sub-totalização (Sub-total 2) para os campos selecionados. Por exemplo totalização 'Representante' e 'Cliente'  apresentam um relatório ordenado por representante e, para um mesmo representante, por cliente. Ao relacionar todos os registros de um determinado cliente, apresenta-se um 'Sub-total 2'   (somatória dos valores do cliente) , ao relacionar todos os registros de um determinado representante, apresenta-se um 'Sub-total 1'   (somatória dos valores do representante) . "
      },
      {
        "type": "p",
        "text": "Ordem Ascendente e Descendente:  Permite até quatro ordenações ascendentes (do menor valor para o maior) e duas descendentes (do maior valor para o menor) relacioanados."
      },
      {
        "type": "h3",
        "text": "Síntese:"
      },
      {
        "type": "p",
        "text": "1. Analítico: Os registros são impressos detalhadamente, um a um."
      },
      {
        "type": "p",
        "text": "2. Sintético: Os registros são acumulados (sintetizados) conforme as ordens especificadas (exceto campos de valores e quantidades). Por exemplo, se as ordens forem 'Representantes/Produtos' , os valores e quantidades serão apresentados totalizados (acumulados) para cada conjunto representante/produto."
      },
      {
        "type": "p",
        "text": "3. Sintético Valor <: Neste caso, os registros, além de sintetizados pelos campos especificados nas oedenações, são apresentados na ordem crescente dos valores acumulados. Os campos 'Ordem'  passam a ser secundários. A seleção deste campo habilita o campo 'Natureza do Valor Sintético' ."
      },
      {
        "type": "p",
        "text": "  Natureza do Valor Sintético"
      },
      {
        "type": "p",
        "text": "1 - Base : Valor nominal da venda.\n 2 - Líquido :   'Valor Base'  subtraídos os descontos e IRRF (serviços).\n 3 - Venda :   'Valor líquido'  somado a acréscimos e ICMS retido na fonte.\n 4 - Total :   'Valor de venda'  somado ao IPI.\n 5 - Essencial :   'Valor de venda'  subtraídos os valores de ICMS e de comissão."
      },
      {
        "type": "p",
        "text": "4. Sintético Valor >: Identico ao item  3 acima, porém, a apresentação dá-se em ordem decrescente dos valores acumulados."
      },
      {
        "type": "p",
        "text": "5. Sintético Qtd <: Identico ao item  3 acima, porém, a apresentação dá-se em ordem crescente das quantidades acumuladas."
      },
      {
        "type": "p",
        "text": "6 . Sintético Qtd >: Identico ao item 5 acima, porém, a apresentação dá-se em ordem decrescente das quantidades acumuladas."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-74",
    "slug": "relatorios_modulo_faturamento_relatorios_analiticos_sinteticos",
    "title": "Relatórios Módulo Faturamento - Relatórios Analíticos/Sintéticos",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-01-15",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "2421 – Relação Pedidos x Produtos - Analítico -  Lista os pedidos e os produtos que o compõem.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/74/relatorios_modulo_faturamento_relatorios_analiticos_sinteticos",
    "content": [
      {
        "type": "p",
        "text": "2421 – Relação Pedidos x Produtos - Analítico -  Lista os pedidos e os produtos que o compõem."
      },
      {
        "type": "ul",
        "items": [
          "Escolher em que ordenação será exibido o relatório, em  'Situação' escolher entre  'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é 'Venda' , 'Não Venda' , 'Todos' ou 'Entrada' .",
          "O campo 'Mês/Ano Refer'  não é usado para a situação 'Pendente' , pois refere-se a pedidos 'Emitidos' , ou seja, este campo faz referência ao mês de emissão da Nota Fiscal.",
          "Pode-se filtrar a listagem por representantes, produtos, grupos de produtos, códigos internos de produtos e datas de pedido ou emissão."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Relat%C3%B3rios%20Anal%C3%ADticos_Sint%C3%A9ticos/2421_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2422 – Relação Produtos x Pedidos - Analítico -  Lista o produtos e os pedidos em que eles estão inseridos."
      },
      {
        "type": "ul",
        "items": [
          "Esta tela é semelhante à anterior '2421' , a diferença está na ordem, pois ordena primeiramente por produto. Outra diferença é que pode-se filtrar por 'Cliente' e 'Data de saída' do produto."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Relat%C3%B3rios%20Anal%C3%ADticos_Sint%C3%A9ticos/2422_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2431 – Relação Representantes x Produtos - Sintético -  Lista os representantes e os respectivos produtos vendidos."
      },
      {
        "type": "ul",
        "items": [
          "Em  'Situação' escolher entre  'Pendentes' , 'Emitidos' ou 'Todos' , em 'Status' se o pedido é 'Venda' , 'Não Venda' , 'Todos' ou 'Entrada' .",
          "O campo 'Mês/Ano Refer'  não é usado para a situação 'Pendente' , pois refere-se a pedidos 'Emitidos', ou seja, este campo faz referência ao mês de emissão da Nota Fiscal.",
          "Pode-se filtrar a listagem por representantes (pode-se realizar a 'Quebra'  em 1 representante por grupo de páginas), produtos, grupos de produtos, códigos internos de produtos e datas de pedido, data de emissão, série da Nota Fiscal e/ou o número da ECF (Emissor de Cupom Fiscal)."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Relat%C3%B3rios%20Anal%C3%ADticos_Sint%C3%A9ticos/2431_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2432 – Relação Produtos x Representantes - Sintético -  Lista os produtos e quantidades que cada representante vendeu."
      },
      {
        "type": "ul",
        "items": [
          "Esta tela é semelhante à anterior '2431' , a diferença é que não pode-se realizar  'Quebra'  de página por representante e nem filtrar por  'ECF' ."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Relat%C3%B3rios%20Anal%C3%ADticos_Sint%C3%A9ticos/2432_Rel.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2433 – Relação Produtos x Estados - Sintético -  Lista 'Produto X UF' com suas respectivas quantidades e valores."
      },
      {
        "type": "ul",
        "items": [
          "Pode-se filtrar a listagem por data de emissão da Nota Fiscal e produtos."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Relat%C3%B3rios%20M%C3%B3dulo%20Faturamento%20-%20Relat%C3%B3rios%20Anal%C3%ADticos_Sint%C3%A9ticos/2433_Rel.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-72",
    "slug": "modulo_producao_hadron",
    "title": "Módulo Produção - Hádron",
    "category": "guia",
    "module": "ERP - Produção",
    "tags": [
      "producao"
    ],
    "updatedAt": "2020-01-10",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "531C – Listagem de Composição de Produtos",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/72/modulo_producao_hadron",
    "content": [
      {
        "type": "p",
        "text": "5311 – Composição de Produtos"
      },
      {
        "type": "ul",
        "items": [
          "Cadastro da composição de produtos semi-acabados ou acabados e suas variações;",
          "Neste cadastro informa-se a 'Quantidade base' , ou seja, para um item do produto usa-se a composição criada (esta informação é obrigatória);",
          "Pode-se vincular o produto a um 'Processo' produtivo (uma espécie de receita que será impressa junto com a composição) e a seções e subseções de produção (para cálculo do custo da produção), lembrando que a seção pode ser o produto e a subseção as variações do mesmo (tamanho, embalagem, peso, cor, etc.);",
          "Segue abaixo um exemplo da tela de cadastro de uma composição de produto."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/5311_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "531C – Listagem de Composição de Produtos"
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordem de impressão da listagem, pode-se filtrar por produtos, grupos e código interno;",
          "A Tabela de Custo deve ser informada para verificar o custo total do produto composto."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/531C_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5312 – Ordens de Produção"
      },
      {
        "type": "ul",
        "items": [
          "Cadastro de Ordens de Produção;",
          "Deve-se informar a data da ordem de produção, no campo 'Pedido' o número da solicitação, o cliente, a data de entrega, o estoque (local aonde entrará o produto após ser produzido), as seções e/ou subseções, o produto e a quantidade a ser produzida."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/5312_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "531O – Listagem de Ordens de Produção"
      },
      {
        "type": "ul",
        "items": [
          "Escolher a ordem de impressão da listagem, pode-se realizar o filtro por número da partida, situação (1 - Abertas, 9 - Em Produção, E – Encerradas e X – Todas) , produtos, grupos, código interno, clientes e datas."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/531O_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5332 – Entrada na Produção"
      },
      {
        "type": "ul",
        "items": [
          "Lançamento da entrada da partida (ordem de produção) em produção;",
          "Deve-se informar a data e a quantidade da partida que entrou em produção."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/5332_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5338 – Lançamento da Produção"
      },
      {
        "type": "ul",
        "items": [
          "Lançamento dos itens que foram produzidos;",
          "Deve-se informar a data em que saíram da produção, a quantidade produzida e caso tenha, lança-se o Lote/Número de Série e validade;",
          "No campo 'Encerrada (S/N)?'  informa se a partida será ou não encerrada, pois pode-se encerrá-la tendo produzido quantidade menor ou maior a informada."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/5338_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5331 – Baixa Estoque – Mat. Primas OP"
      },
      {
        "type": "ul",
        "items": [
          "Esta opção faz o lançamento das baixas de matérias primas utilizadas na(s) partida(s) (ordens de produção) indicadas. Deve-se rodar esta opção após concluir a produção;",
          "Informar o número da partida, a data da baixa e a tabela de custo."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/5331_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5341 – Emissão da Ordem de Produção"
      },
      {
        "type": "ul",
        "items": [
          "Coloca-se o número da(s) partida(s) (ordem de produção) que deseja-se emitir, em que situação (1 - Abertas, 9 - Em Produção, E – Encerradas e X – Todas), se explode as sub planilhas (listar os itens que compõem os produtos semi-acabados) e se deseja que acumule itens que se repetem."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/5341_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5343 – Acompanhamento da Produção"
      },
      {
        "type": "ul",
        "items": [
          "Listagem para acompanhar as etapas de produção.",
          "Escolher ordenação da listagem, pode-se emitir de maneira analítica (detalha cada parte da ordem de produção) ou sintética (mostra uma posição geral da ordem de produção). Depois pode-se filtrar a listagem por número da(s) partida(s) (ordem de produção), situação (1 - Abertas, 9 - Em Produção, E – Encerradas e X – Todas) , produtos, grupos, código interno, clientes e datas."
        ]
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/5343_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Modulo_Produ%C3%A7%C3%A3o_H%C3%A1dron/H%C3%A1dron_fluxo.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-68",
    "slug": "configuracoes_balancas_filizola_modelo_cs_toledo_consideracoes",
    "title": "Configurações Balanças Filizola Modelo CS/Toledo - Considerações",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-01-09",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Quando a balança for da marca Filizola Modelo CS a configuração da porta na opção '1119 - Parâmetros de Terminal - Aba - Balança'  deve seguir uma associação entre a porta inserida no parâmetro do sistema e a existente n",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/68/configuracoes_balancas_filizola_modelo_cs_toledo_consideracoes",
    "content": [
      {
        "type": "p",
        "text": "Quando a balança for da marca Filizola Modelo CS a configuração da porta na opção '1119 - Parâmetros de Terminal - Aba - Balança'  deve seguir uma associação entre a porta inserida no parâmetro do sistema e a existente no software da balança."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/1119_balanc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Porta     Correspondência"
      },
      {
        "type": "p",
        "text": "  1                             A                     "
      },
      {
        "type": "p",
        "text": "  2                             B "
      },
      {
        "type": "p",
        "text": "  3                             C"
      },
      {
        "type": "p",
        "text": "  4                             D"
      },
      {
        "type": "p",
        "text": "  5                             E"
      },
      {
        "type": "p",
        "text": "  6                             F"
      },
      {
        "type": "p",
        "text": "  7                             G"
      },
      {
        "type": "p",
        "text": "  8                             H"
      },
      {
        "type": "p",
        "text": "  9                             I"
      },
      {
        "type": "p",
        "text": "O código interno no cadastro dos produtos deve-se iniciar com a letra B (balança Filizola) ou P (balança Toledo) mais quatro digitos, as letras  'B'  e  'P'  são para a formatação do código de barras que inicia-se com o nro 2+peso+preço do produto nas etiquetas e são usados nos itens para a geração do arquivo de carga nas balanças que possuem etiquetas. Nas balanças que ficam nos caixas não são necessários B ou P no iníco do código dos produtos, apenas marcar o box 'Dependência de Balança'  na aba 'Complementos'  da opção '1232 - Cadastro de Produtos' para que o sistema entenda que é um item de balança e necessita da digitação ou captura do peso do produto."
      },
      {
        "type": "h3",
        "text": "Para balança Filizola:"
      },
      {
        "type": "h3",
        "text": "Para os produtos em 'KG' coloca-se o 'P'  no final do código no campo 'Marca'."
      },
      {
        "type": "h3",
        "text": "Para os produtos em 'UN' coloca-se o 'U'  no final do código no campo 'Marca'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/Prod_1_Marca.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/Prod_3_Marca_Peso.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Em ambos os casos:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/Prod_2_Complemento.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Configuração Smart Editor Balança Filizola:"
      },
      {
        "type": "h3",
        "text": "Etiquetas Peso e Unidade:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/Smart_Editor_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Configuração por Unidade:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/Smart_Editor_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Configuração por Peso:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/Smart_Editor_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Geração de arquivo para a balança:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/1332_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Configura%C3%A7%C3%A3o%20Balan%C3%A7a%20Filizola_Modelo%20CS/1332_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Para balança Toledo (Ver base da Mian)"
      },
      {
        "type": "p",
        "text": "- No campo 'UN 1'  colocar 'KG' e no campo 'UN 2'  colocar o digito 0 para peso."
      },
      {
        "type": "p",
        "text": "- No campo 'UN 1'  colocar 'UN' e no campo 'UN 2'  colocar o digito 1 para unidade."
      }
    ]
  },
  {
    "id": "AP-70",
    "slug": "modulo_controle_de_compradores",
    "title": "Módulo Controle de Compradores",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-01-09",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Para que o módulo seja habilitado é necessário acessar a opção '1111 - Parâmetros Globais Sistema - Aba - Terceiros - Campo - Controle de Compradores',  existem três opções: '0 - Não' – Não habilita o controle, '1 – Por ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/70/modulo_controle_de_compradores",
    "content": [
      {
        "type": "h3",
        "text": "Parametrização"
      },
      {
        "type": "p",
        "text": "Para que o módulo seja habilitado é necessário acessar a opção '1111 - Parâmetros Globais Sistema - Aba - Terceiros - Campo - Controle de Compradores',  existem três opções: '0 - Não' – Não habilita o controle, '1 – Por cliente' – (Cria o vínculo somente 'Cliente X Comprador' ) e '5 – Por Cliente x Operador'  (Cria o vínculo Cliente X Comprador X Operador do sistema ), essa última opção oferece uma maior segurança, pois, cria uma amarração exclusiva entre o cliente x comprador x operador, impedindo a possibilidade da venda ser transferida a um outro comprador que não seja aquele incluso dentro desse vínculo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/1111_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1226 – Cadastro de Compradores"
      },
      {
        "type": "p",
        "text": "Na opção '1226 - Cadastro de Compradores' serão cadastrados, alterados e exclusos os compradores. O código é dado de maneira automática e através do campo 'Terceiro Referente'  pode-se (não obrigatóriamente) vincular um terceiro (informações detalhadas deste comprador) cadastrado na opção '1221 - Cadastro de Terceiros' . Outra possibilidade que a opção oferece é o uso do setor que pode ser utilizado futuramente como filtro em relatórios."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/1226_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Pelo botão 'Listar Compradores'  pode-se relacionar todos os compradores cadastrados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/1226_List_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "122V – Compradores x Terceiros"
      },
      {
        "type": "p",
        "text": "Através do botão 'Compradores x Terceiros'  presente na opção (1226)  será criado o vínculo entre o comprador e o(s) cliente(s) atendido(s) por ele. No campo 'Código'  através do comando F3 seleciona-se o comprador anteriormente cadastrado, no campo 'Terceiro'  é escolhido o cliente que estará vinculado ao comprador selecionado acima. No campo 'Nivel'  pode-se dar uma classificação (nota) do comprador junto ao cliente, que poderá ser usada em futuras implementações dentro do sistema."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/122V_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Através do botão 'Listar Vínculo Comprador X Terceiro'  é possível listar os vínculos criados como pode ser visto abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/122R_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O comprador poderá estar vinculado a vários clientes e o cliente poderá estar vinculado a vários compradores."
      },
      {
        "type": "p",
        "text": "122W – Compradores x Operadores"
      },
      {
        "type": "p",
        "text": "Utilizado o parâmetro em  '1111 – Parâmetros Globais Sistema - Aba - Terceiros - 5 – Por Cliente x Operador',  é através da opção (1226)  botão 'Compradores X Operadores'  que será criado o vínculo entre ambos. Vale ressaltar que criado esse vínculo as vendas somente serão feitas mediante a esse caráter exclusivo de condições (Comprador x Cliente x Operador) ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/122W_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O mesmo operador pode estar vinculado a mais compradores e vice-versa"
      },
      {
        "type": "h3",
        "text": "Campos para o vínculo de compradores opções 7512/2131"
      },
      {
        "type": "p",
        "text": "Criados os cadastros e vínculos referentes ao módulo o código do comprador será inserido no momento do pedido e/ou orçamento anterior ao processamento da venda."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/2131_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Na tela '2131 - Cadastro de Pedidos' aba 'Complementos'  campo 'Comprador'  serão exibidos os vínculos anteriormente criados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/75ov_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A mesma situação ocorrerá na opção '7512 - Cadastro de Orçamentos' aba 'Complemento',  o campo 'Comprador'  exibirá os vínculos criados anteriormente para que seja feita a associação do comprador a venda."
      },
      {
        "type": "h3",
        "text": "Elaborado 2450 - campo, filtro, quebra, totalização e ordenação"
      },
      {
        "type": "p",
        "text": "Mediante ao controle implementado, na opção '2450 - Elaborado de Vendas' são realizadas as análise necessárias frente aos vínculos criados associados as vendas emitidas, ao criar o relatório deve-se adicionar o campo 'Código do Comprador' e ao emiti-lo pode utilizar-se do filtro, quebra, totalização e ordenação presente na opção '2450' referente ao mesmo campo."
      },
      {
        "type": "h3",
        "text": "Campo 'Código Comprador'  em elaborado '2450' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/2450_Compradores.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/M%C3%B3dulo%20Controle%20de%20Compradores/2450_Compradores_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "."
      }
    ]
  },
  {
    "id": "AP-69",
    "slug": "procedimentos_para_geracao_e_controle_das_informacoes_do_arquivo_efd_pis_cofins_",
    "title": "Procedimentos para geração e controle das informações do arquivo EFD-PIS/COFINS",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-01-09",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "1112 - Cadastro de Empresas - Aba - Responsabilidades - Campo - ' Responsável 4'.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/69/procedimentos_para_geracao_e_controle_das_informacoes_do_arquivo_efd_pis_cofins_",
    "content": [
      {
        "type": "h3",
        "text": "Parametrização no Sistema Hádron ."
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - Responsabilidades - Campo - ' Responsável 4'."
      },
      {
        "type": "ul",
        "items": [
          "Nome do contabilista responsável pela escrituração (previamente cadastrado no 1221) ;",
          "CPF do contabilista (será usado o que está na tela e não o que foi colocado no cadastro 1221);",
          "CRC do contabilista (será usado o que está na tela e não o que foi colocado no cadastro 1221);",
          "CNPJ do escritório contábil (será usado o que está no cadastro 1221);",
          "Endereço, telefone, fax, e-mail e código de município do contabilista não serão colocados (não é obrigatório)."
        ]
      },
      {
        "type": "p",
        "text": "1112 - Cadastro de Empresas - Aba - SPED."
      },
      {
        "type": "h3",
        "text": "Campo - 'Regime Tributário':"
      },
      {
        "type": "ul",
        "items": [
          "N – Regime Não-Cumulativo;",
          "C – Regime Cumulativo;",
          "E – Regime Especial (Cumulativo e Não-Cumulativo)."
        ]
      },
      {
        "type": "h3",
        "text": "Campo - 'Método':"
      },
      {
        "type": "ul",
        "items": [
          "D – Apropriação Direta;",
          "R – Rateio Proporcional (Será usado quando o “Regime Tributário” for igual a “N” ou “E”, pois este campo não é usado para Regime Cumulativo)."
        ]
      },
      {
        "type": "h3",
        "text": "Campo - 'Apuração Contribuição':"
      },
      {
        "type": "ul",
        "items": [
          "E – Exclusiv. Alíquota Básica;",
          "E – Alíquotas Específicas."
        ]
      },
      {
        "type": "h3",
        "text": "Campo - 'Indicador da Natureza':"
      },
      {
        "type": "ul",
        "items": [
          "00 – Sociedade Empresária em Geral;",
          "01 – Sociedade Cooperativa;",
          "02 – Sujeita ao PIS/Pasep exclusivamente com base na folha de salários."
        ]
      },
      {
        "type": "h3",
        "text": "Campo - 'Tipo de Atividade':"
      },
      {
        "type": "ul",
        "items": [
          "0 – Industrial ou equiparado a industrial;",
          "1 – Prestador de serviços;",
          "2 - Atividade de comércio;",
          "3 – Atividade financeira;",
          "4 – Atividade imobiliária;",
          "9 – Outros."
        ]
      },
      {
        "type": "h3",
        "text": "Campo - 'Integra Empresa':"
      },
      {
        "type": "h3",
        "text": "Deve ser indicado o número da empresa Matriz em todas a filiais."
      },
      {
        "type": "p",
        "text": "1232 - Cadastro de Produtos."
      },
      {
        "type": "p",
        "text": "Deve-se atentar para as alterações no campo 'Descrição do Produto' , pois toda a alteração deverá ser informada no arquivo de cada mês. Deve-se acompanhar mudanças tributárias e manter a tributação correta no item."
      },
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações."
      },
      {
        "type": "p",
        "text": "Deve ser preenchido o campo 'Nat. Operação (NFe)'  para cada transação '2113'  de acordo com o tipo de operação/prestação indicado pelo código CFOP . Nos casos onde essa descrição já está definida, é importante que seja feita uma revisão verificando se as descrições das naturezas de operação/prestação estão de acordo com o código CFOP ."
      },
      {
        "type": "h3",
        "text": "Observação da Nota Fiscal - Arquivo do Livro Fiscal (mensal por documento)."
      },
      {
        "type": "p",
        "text": "É preenchido pelas informações gravadas nos dados adicionais de cada Nota Fiscal. Podem ser visualizadas pela listagem '2134' , marcando a opção 'Imprime Observações' ."
      },
      {
        "type": "h3",
        "text": "Unificação de arquivos da Filiais na Matriz"
      },
      {
        "type": "p",
        "text": "Primeiramente deve ser feita a atualização em todas as empresas do grupo, depois verificar na Matriz se os dados de cada Filial já estão incorporados à base de dados como outra empresa (U002, U003, etc.) ."
      },
      {
        "type": "h3",
        "text": "Caso a Filial NÃO ESTEJA incorporada a base da Matriz :"
      },
      {
        "type": "ul",
        "items": [
          "Acessar a opção a '1111 - Aba - Outros – Campo - Quantidade de Usuários'  e colocar a quantidade de empresas (Matriz + Filiais) ;",
          "Cadastrar na '1112' as Filiais;",
          "Copiar, depois de atualizados e rodado o '7121' na Filial, todos os diretórios de cada base de dados das Filiais em seu respectivo diretório na base de dados da Matriz (restaurar um backup);"
        ]
      },
      {
        "type": "h3",
        "text": "Caso a Filial JÁ ESTEJA incorporada a base da Matriz :"
      },
      {
        "type": "ul",
        "items": [
          "Copiar os diretórios ou arquivos, descritos abaixo, de cada base de dados das Filiais em seu respectivo diretório na base de dados da Matriz (depois de atualizados): ECF (pode ser somente os subdiretórios referente ao mês que será informado. Ex: O sub diretório MES1206 à Refere-se ao mês 06 de 2012)  ;",
          "Fiscal ( em cada filial deve-se rodar o 7121 e 7131 , depois acessar o diretório 'PROGEST\\FISCAL' , no 'Menu EXIBIR'  marcar a opção 'Detalhes' , ordenar pela coluna 'Data de Modificação'  e depois copiar todos os arquivos com a mesma data do dia);",
          "Contab (somente os arquivos dentro da Contab, pois não precisa dos sub diretórios);",
          "Princ."
        ]
      },
      {
        "type": "p",
        "text": "7182 - SPED PIS/COFINS - Aba - Totalizações."
      },
      {
        "type": "p",
        "text": "A empresa que usar o método do Rateio Proporcional com base na Receita Bruta , na apuração de créditos vinculados a mais de um tipo de receita (Regime Tributário Não-Cumulativo ou Especial) deve lançar os valores das receitas anteriormente rateados pelo contador."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Procedimentos%20para%20gera%C3%A7%C3%A3o%20e%20controle%20das%20informa%C3%A7%C3%B5es%20do%20arquivo%20EFD-PIS-COFINS/7182_Sped.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Tabela de Receita Bruta Mensal para Fins de Rateio de Créditos Comuns"
      },
      {
        "type": "ul",
        "items": [
          "Receita Bruta Não-Cumulativa - Tributada no Mercado Interno: informar neste campo o valor total da receita bruta auferida no mercado interno pela pessoa jurídica, vinculadas a receitas tributadas no regime não cumulativo: a alíquotas básicas de 1,65% (PIS/Pasep) e de 7,6% (Cofins);",
          "a alíquotas próprias do regime monofásico (diferenciadas e/ou por unidade medida de produto);",
          "a outras alíquotas específicas.",
          "Receita Bruta Não-Cumulativa – Não Tributada no Mercado Interno (Vendas com suspensão, alíquota zero, isenção e sem incidência das contribuições): informar neste campo o valor total da receita bruta auferida no mercado interno pela pessoa jurídica, vinculadas a vendas efetuadas com suspensão, isenção, alíquota zero ou não-incidência das contribuições sociais.",
          "Receita Bruta Não-Cumulativa – Exportação: informar neste campo o valor total da receita bruta auferida relativa a operações de: exportação de mercadorias para o exterior;",
          "prestação de serviços para pessoa física ou jurídica residente ou domiciliada no exterior, cujo pagamento represente ingresso de divisas;",
          "vendas a empresa comercial exportadora com o fim específico de exportação.",
          "Receita Bruta Cumulativa: informar neste campo o valor total da receita bruta auferida pela pessoa jurídica, vinculada a receitas tributadas no regime cumulativo a alíquotas de 0,65% (PIS/Pasep) e de 3% (Cofins).",
          "Receita Bruta Total: informar o total da receita bruta auferida no período, correspondente ao somatório dos valores das receitas descritas acima."
        ]
      },
      {
        "type": "h3",
        "text": "Tags : Sped, fiscal"
      }
    ]
  },
  {
    "id": "AP-49",
    "slug": "2131_mensagem_de_erro_52057",
    "title": "2131 - Mensagem de Erro - 52057",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Erro - Mensagem: 52057 – A Unidade Tributável Vinculada ao N.C.M. para esta operação , não é nenhuma das vinculadas ao Produto. Operação não permitida.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/49/2131_mensagem_de_erro_52057",
    "content": [
      {
        "type": "p",
        "text": "Erro - Mensagem: 52057 – A Unidade Tributável Vinculada ao N.C.M. para esta operação , não é nenhuma das vinculadas ao Produto. Operação não permitida."
      },
      {
        "type": "p",
        "text": "O erro deve-se a unidade cadastrada na opção '1243 - Complementos Gerais N.C.M - Botão - 12NC - Cadastro de N.C.M.s (Nomenclatura Comum do Mercosul)'  campo 'Unidade Tributária'  não estar atualizada conforme a legislação."
      },
      {
        "type": "p",
        "text": "SOLUÇÃO: Alterar o cadastro do produto (1232)  campo 'UN1'  para a unidade correspondente ao NCM do item identificado na opção '12NC' . Se o campo 'UN1'  estiver preenchido como 'CX'  e a 'Unidade Tributária'  for 'UN' , pode-se utilizar o campo 'UN2'  com respectivo valor para o campo 'Conversão'  que estará resolvido."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Erro_1243_12NC/Err_1243_12NC.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-51",
    "slug": "2131_enfp_mensagem_de_erro_70070",
    "title": "2131/ENFP - Mensagem de Erro - 70070",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Mensagem: ENFP - 70070 - Mensagem NFe: 500021- CRIT-SCHEMA-ORI-OBJ-Erro na Análise do XML: ‘Cliente:XXXX-X; Pedido.XXX/XXXXXX;...'viola a restrição patternde '[!y|]{1}[y]{0'}[!y]{1}|[!y]{1)' Falha da análi.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/51/2131_enfp_mensagem_de_erro_70070",
    "content": [
      {
        "type": "p",
        "text": "Mensagem: ENFP - 70070 - Mensagem NFe: 500021- CRIT-SCHEMA-ORI-OBJ-Erro na Análise do XML: ‘Cliente:XXXX-X; Pedido.XXX/XXXXXX;...'viola a restrição patternde '[!y|]{1}[y]{0'}[!y]{1}|[!y]{1)' Falha da análi."
      },
      {
        "type": "p",
        "text": "Solução:  No campo 'Informações Complementares' , observações que foram copiadas com CTRL+C/CRTL+V  e que contém quebra de linhas, na assinatura do XML ocorre o erro, copiar no bloco de notas e colar de volta ou ir apagando os espaços entre as descrições e deixar preenchido tudo por linha e também observar se não há mais uma linha acrescentada em branco com o enter."
      }
    ]
  },
  {
    "id": "AP-52",
    "slug": "2139_peml_mensagem_de_erro_70120",
    "title": "2139/PEML - Mensagem de Erro - 70120",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/52/2139_peml_mensagem_de_erro_70120",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem: Erro 2139-70120 - E-mail: A mensagem não pode ser enviada para o servidor SMTP."
      },
      {
        "type": "h3",
        "text": "Solução:  Conferir se o e-mail preenchido está correto com a porta e smtp ou trocar por outro."
      }
    ]
  },
  {
    "id": "AP-56",
    "slug": "2220_041_nao_imprime_cfops_em_relatorio",
    "title": "2220/041 - Não imprime CFOPs em relatório",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/56/2220_041_nao_imprime_cfops_em_relatorio",
    "content": [
      {
        "type": "h3",
        "text": "Situação:  Não são impressas as CFOPs em relatórios de vendas."
      },
      {
        "type": "h3",
        "text": "Solução:  Para que seja impresso no relatório as CFOPs deve-se usar o filtro ' Ordem = 09 – CFOP' ."
      }
    ]
  },
  {
    "id": "AP-57",
    "slug": "7352_mensagem_de_erro_70019",
    "title": "7352 - Mensagem de Erro - 70019",
    "category": "erros",
    "module": "Logística",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução:  Falta criar a tabela da folha referente ao mês seguinte, acessar a opção '6233' e criar as tabelas no botão 'Tabelas da Folha' .",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/57/7352_mensagem_de_erro_70019",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem: Erro 7352- 70019 – Erro leitura arquivo 23TBF! Aba 'Proventos e Descontos' após teclar enter no campo Valor."
      },
      {
        "type": "p",
        "text": "Solução:  Falta criar a tabela da folha referente ao mês seguinte, acessar a opção '6233' e criar as tabelas no botão 'Tabelas da Folha' ."
      }
    ]
  },
  {
    "id": "AP-50",
    "slug": "7512_75ov_geral_mensagem_de_erro_51786",
    "title": "7512/75OV/Geral - Mensagem de Erro - 51786",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução: Possível perda da rede, fechando a opção e abrindo novamente pode resolver ou falta da alíquota N.C.M cadastrada na '1243' na opção '12NA' (Cadastro de Alíquotas por N.C.M).",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/50/7512_75ov_geral_mensagem_de_erro_51786",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem: 51786 - Erro ao ler Alíquotas no NCM/NBS."
      },
      {
        "type": "p",
        "text": "Solução: Possível perda da rede, fechando a opção e abrindo novamente pode resolver ou falta da alíquota N.C.M cadastrada na '1243' na opção '12NA' (Cadastro de Alíquotas por N.C.M)."
      }
    ]
  },
  {
    "id": "AP-61",
    "slug": "certificado_digital_erro_ao_emitir_nota_fiscal_eletronica",
    "title": "Certificado Digital - Erro ao emitir Nota Fiscal Eletrônica",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/61/certificado_digital_erro_ao_emitir_nota_fiscal_eletronica",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  Erro interno, mas a fonte é desconhecida."
      },
      {
        "type": "h3",
        "text": "Solução:  Conferir certificado digital pois ao realizar a emissão da NFe falhou a comunicação com o PC."
      }
    ]
  },
  {
    "id": "AP-63",
    "slug": "consulta_ao_contribuinte_certificado_fornecido_nao_e_valido_erro_ao_emitir_nota_fiscal_eletronica",
    "title": "Consulta ao Contribuinte - Certificado Fornecido não é Válido - Erro ao emitir Nota Fiscal Eletrônica",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução: Rejeição ao emitir nota fiscal eletrônica, marcar na opção  '1225 - Manutenção de Status de Cliente'  para realizar consulta ao contribuinte, pois, a UF do terceiro está com algum problema ao efetuar o processo.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/63/consulta_ao_contribuinte_certificado_fornecido_nao_e_valido_erro_ao_emitir_nota_fiscal_eletronica",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  O certificado fornecido não é válido."
      },
      {
        "type": "p",
        "text": "Solução: Rejeição ao emitir nota fiscal eletrônica, marcar na opção  '1225 - Manutenção de Status de Cliente'  para realizar consulta ao contribuinte, pois, a UF do terceiro está com algum problema ao efetuar o processo."
      }
    ]
  },
  {
    "id": "AP-58",
    "slug": "enfg_erro_ao_emitir_nota_fiscal_eletronica",
    "title": "ENFG - Erro ao emitir Nota Fiscal Eletrônica",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/58/enfg_erro_ao_emitir_nota_fiscal_eletronica",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem: ENFG -  O conjunto de chaves não está definido."
      },
      {
        "type": "h3",
        "text": "Solução:  Desconectar/conectar, trocar o certificado de porta usb e abrir o gerenciador de certificado para emitir novamente."
      }
    ]
  },
  {
    "id": "AP-64",
    "slug": "erro_sat_nao_vinculado_ao_ac",
    "title": "Erro - SAT não vinculado ao AC",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/64/erro_sat_nao_vinculado_ao_ac",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  SAT não vinculado ao AC."
      },
      {
        "type": "h3",
        "text": "Solução:  Pedir para que seja gerado novamente na Prócion a chave referente SAT pois seu conteúdo está errado."
      }
    ]
  },
  {
    "id": "AP-66",
    "slug": "erro_soap_name_space_action_emissao_de_nota_fiscal_eletronica",
    "title": "Erro - Soap Name Space Action - Emissão de Nota Fiscal Eletrônica",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução: Sefaz (UF) do contribuinte não permite consulta, assinalar na opção '1225 - Manutenção de Status dos Clientes' o checkbox 'Permite HOJE a emissão de NFe sem Consulta?' .",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/66/erro_soap_name_space_action_emissao_de_nota_fiscal_eletronica",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  Soap Name Space Action."
      },
      {
        "type": "p",
        "text": "Solução: Sefaz (UF) do contribuinte não permite consulta, assinalar na opção '1225 - Manutenção de Status dos Clientes' o checkbox 'Permite HOJE a emissão de NFe sem Consulta?' ."
      }
    ]
  },
  {
    "id": "AP-67",
    "slug": "erro_ao_carregar_o_certificado_digital_0215700",
    "title": "Erro ao carregar o certificado digital - 0215700",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução:  Remover certificados expirados na aba 'Conteúdo -> botão certificado'  clicar no botão 'Limpar estado SSL'  nesta mesma aba.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/67/erro_ao_carregar_o_certificado_digital_0215700",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  Erro não identificado NFE."
      },
      {
        "type": "p",
        "text": "Solução:  Remover certificados expirados na aba 'Conteúdo -> botão certificado'  clicar no botão 'Limpar estado SSL'  nesta mesma aba."
      },
      {
        "type": "h3",
        "text": "Configurar as permissões das pastas que o sistema utiliza, acesso total."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Erros_Telas/Erros_Certificados/0215700.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-65",
    "slug": "erro_ao_efetuar_login_em_certificado_digital_9900200",
    "title": "Erro ao efetuar login em certificado digital - 9900200",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/65/erro_ao_efetuar_login_em_certificado_digital_9900200",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  9900200 - Erro HTTP 403 - Falha na requisição, verifique o Certificado Digital!."
      },
      {
        "type": "h3",
        "text": "Solução:  Certificado digital expirado ou com problemas no leitor do cartão."
      }
    ]
  },
  {
    "id": "AP-62",
    "slug": "erro_ao_emitir_conhecimento_de_transporte_rejeicao_687",
    "title": "Erro ao emitir Conhecimento de Transporte - Rejeição 687",
    "category": "erros",
    "module": "Logística",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução:  Conferir na ANTT se o RNTRC da empresa emitente e do proprietário do veículo são os mesmos presentes na consulta, após isso, conferir se no CT-e/NF-e o proprietário/transportadora foram emitidos corretamente co",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/62/erro_ao_emitir_conhecimento_de_transporte_rejeicao_687",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  RNTRC deve estar associado ao transportador indicado."
      },
      {
        "type": "p",
        "text": "Solução:  Conferir na ANTT se o RNTRC da empresa emitente e do proprietário do veículo são os mesmos presentes na consulta, após isso, conferir se no CT-e/NF-e o proprietário/transportadora foram emitidos corretamente com as mesma informações."
      }
    ]
  },
  {
    "id": "AP-59",
    "slug": "geral_mensagem_de_erro_0000_ato_39",
    "title": "Geral - Mensagem de Erro - 0000 - ATO - 39",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/59/geral_mensagem_de_erro_0000_ato_39",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem: Erro 0000-ATO-39 – Conflito em atributos de arquivos! Tabela\\PROGEST\\MASTER\\PFUSUARI.DAT."
      },
      {
        "type": "h3",
        "text": "Mensagem: Erro 0000-ATO-39 – Conflito em atributos de arquivos!Tabela ?\\PROGEST\\MASTER\\PHTREQPT.DAT."
      },
      {
        "type": "h3",
        "text": "Solução:   Corrompeu o arquivo da área de trabalho que fica na pasta MASTER\\PHATRAB.DAT , substituir através do backup."
      }
    ]
  },
  {
    "id": "AP-54",
    "slug": "geral_mensagem_de_erro_1124_pro_39",
    "title": "Geral - Mensagem de Erro - 1124 - PRO - 39",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/54/geral_mensagem_de_erro_1124_pro_39",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:   Erro 1124- PRO-39 - Conflito em atributos de arquivos! Tabela X:\\PROGEST\\U00X\\PRINC\\PHPRODUT.DAT."
      },
      {
        "type": "h3",
        "text": "Solução:  Rodar conversão de arquivos novamente ou Recovery no programa COBFUT32 dentro da pasta do terminal."
      }
    ]
  },
  {
    "id": "AP-55",
    "slug": "geral_mensagem_de_erro_1124_pro_9_065",
    "title": "Geral - Mensagem de Erro - 1124 - PRO - 9 - 065",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução:  Processo em uso por outro terminal, por exemplo, alterando um mesmo produto em outro terminal ou \"preso\" processo no servidor, reiniciar todos os pc’s que utilizem o sistema para resolver a situação.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/55/geral_mensagem_de_erro_1124_pro_9_065",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem: Erro 1124-PRO-9-065 - Arquivo bloqueado! Tabela X:\\PROGEST\\U00X\\PRINC\\PHPRODUT.DAT."
      },
      {
        "type": "p",
        "text": "Solução:  Processo em uso por outro terminal, por exemplo, alterando um mesmo produto em outro terminal ou \"preso\" processo no servidor, reiniciar todos os pc’s que utilizem o sistema para resolver a situação."
      }
    ]
  },
  {
    "id": "AP-53",
    "slug": "nfe_enfc_erro_ao_efetuar_login_em_certificado_digital",
    "title": "NFE (ENFC) - Erro ao efetuar login em certificado digital",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Artigo importado da base Ajuda Prócion.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/53/nfe_enfc_erro_ao_efetuar_login_em_certificado_digital",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem:  Não é possível encontrar o certificado no repositório."
      },
      {
        "type": "h3",
        "text": "Solução:  Reinstalar o CAPICOM-KB931906-v2102."
      }
    ]
  },
  {
    "id": "AP-60",
    "slug": "rsne_erro_ao_emitir_nota_fiscal_eletronica",
    "title": "RSNE - Erro ao emitir Nota Fiscal Eletrônica",
    "category": "erros",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal",
      "erro"
    ],
    "updatedAt": "2020-01-08",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Solução:  Caso a empresa tenha mais de 2 certificados digitais A3 habilitar o parâmetro '1111 -  Aba - Faturamento - Sempre Solicita Certificado?' , para que ao abrir o terminal do sistema possa-se escolher o respectivo ",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/60/rsne_erro_ao_emitir_nota_fiscal_eletronica",
    "content": [
      {
        "type": "h3",
        "text": "Mensagem: Rejeição -   CNPJ-Base do Emitente difere do CNPJ-Base do Certificado Digital."
      },
      {
        "type": "p",
        "text": "Solução:  Caso a empresa tenha mais de 2 certificados digitais A3 habilitar o parâmetro '1111 -  Aba - Faturamento - Sempre Solicita Certificado?' , para que ao abrir o terminal do sistema possa-se escolher o respectivo certificado a empresa que foi efetuado o login."
      }
    ]
  },
  {
    "id": "AP-48",
    "slug": "emissao_de_nfc_e_nota_fiscal_consumidor_eletronica",
    "title": "Emissão de NFC-e - Nota Fiscal Consumidor Eletrônica",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2020-01-03",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "Antes de inciar as configurações a serem realizadas no sistema Hádron, deve-se fazer o credenciamento da empresa para a emissão de NFC-e junto a Sefaz-SP, acessar o link:",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/48/emissao_de_nfc_e_nota_fiscal_consumidor_eletronica",
    "content": [
      {
        "type": "p",
        "text": "Antes de inciar as configurações a serem realizadas no sistema Hádron, deve-se fazer o credenciamento da empresa para a emissão de NFC-e junto a Sefaz-SP, acessar o link:"
      },
      {
        "type": "p",
        "text": "https://portal.fazenda.sp.gov.br/servicos/Paginas/Empresa.aspx"
      },
      {
        "type": "h3",
        "text": "Em seguida acessar o menu 'Documentos Fiscais':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/Empresa_Menu.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Acessar a seção 'NFC-e - Nota Fiscal de Consumidor Eletrônica':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/NFC_e_Menu.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Nos dois itens em destaque é possível realizar o credenciamento tanto no ambiente de testes quanto em produção, ter o certificado digital instalado no computador que irá realizar o processo."
      },
      {
        "type": "p",
        "text": "Feito o credenciamento será gerado o 'Código CSC' e o 'Identificador CSC' , anotar a informação pois será inserido em '1112 - Aba - Faturamento'."
      },
      {
        "type": "p",
        "text": " "
      },
      {
        "type": "p",
        "text": "Implementado no sistema 'Hádron - V12' a emissão da NFC-e (Nota Fiscal Consumidor Eletrônica) , ela é um documento eletrônico, parte do SPED, que irá substituir as Notas Fiscais de Venda a Consumidor, modelo 2 e o cupom fiscal emitido por impressora ECF, não confundir com uma NFe. Este documento digital fiscal serve para  registrar as transações comerciais realizadas entre uma empresa e o consumidor final,  abaixo seguem as configurações que devem ser realizadas para a emissão do documento dentro sistema."
      },
      {
        "type": "p",
        "text": "1112 - Parâmetros - Cadastro de Empresas: Na aba 'Fiscal' deve-se configurar a série referente a emissão da NFC-e , utilizar o modelo '65' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/1112_Fiscal.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em seguida na aba 'Faturamento' apontar o 'Ambiente de Emissão' e o 'Número Terminal' responsável por gerenciar o certificado digital."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/1112_NFCe_term.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Informar na aba 'Faturamento'  campos 'Código CSC (NFC-e)' e 'Identificador CSC (NFC-e)' a respectiva informação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/1112_NFCe_CSC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros de Sistema:  Na aba 'Faturamento' deve-se apontar o 'Ambiente de Emissão' que será utilizado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/1111_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1119 - Parâmetros de Terminal:   Na aba 'NFe/CFe' definir parâmetros referente ao número da  'Empresa' emissora do documento fiscal e o número do 'Terminal' responsável por gerenciar o certificado digital. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/1119_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros - 11TB - Cadastro de Tabelas de Tributações:  A emissão da NFC-e prevê a tributação de 'IPI ', porém, o valor referente ao imposto não terá campo próprio, o valor será alocado em ' Outras Despesas' e descrito em 'Informações Complementares' ."
      },
      {
        "type": "h3",
        "text": "Obs: Não serão permitidas operações de emissão de NFC-e com cálculo de 'ST' para 'Consumidor Final'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/Trib_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1215 - Cadastro de Representantes: O cadastro do vendedor deverá ter no campo 'Origem da Venda' a informação 'V - Vendedor', 'P - Própria' ou 'A - Auto Atendimento' , do contrário haverá rejeição na emissão pois a Sefaz fará a crítica referente a uma venda não presencial ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/1215_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2113 - Cadastro de Transações:  Conforme parâmetros definido em '1112 - Cadastro de Empresas - Aba - Fiscal' criar a respectiva transação responsável pela emissão da NFC-e , registro esse que posteriormente deverá estar vinculado em 'RUS2 - Parâmetros Especiais Faturamento' . "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/2113_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "RUS2 - Parâmetros Especiais Faturamento:  Criado o registro no item acima, deve-se realizar o vínculo no parâmetro 'Operações Saídas' para que o código da transação seja default ao realizar as emissões de NFC-e ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/RUS2_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7519 - Parâmetros de Terminal Frente de Loja:  Deve-se realizar o cadastro do terminal pois serão realizadas emissões via '7511/75CF' , porém, não é necessário o cadastro do equipamento, escolher sempre o tipo 'N - NFC-e' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/7519_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7512/75OV - Cadastro de Orçamentos:  Ao realizar as vendas os produtos deverão possuir uma condição fiscal em seu cadastro que satisfaça a emissão de uma NFC-e , do contrário será exibido a mensagem abaixo que faz referência a situação do produto referente ao 'ICMS' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/75OV_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7513/75NV - Emissão Orçamentos:  Uma vez que o 'Orçamento/Pré-Venda' esteja em condições que atendam a emissão de uma NFC-e , será habilitado o botão 'NFCe/Tef' para que seja concluída a operação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/7513_NFCe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Igualmente a NF-e (Nota Fiscal Eletrônica) a NFC-e (Nota Fiscal Consumidor Eletrônica) possui numeração própria a cada documento fiscal emitido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/75CF_Emiss.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao final da emissão/comunicação com a SEFAZ será gerado um arquivo XML e impresso um documento com as características abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emissao_NFCe/NFCe_doc_fiscal.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-45",
    "slug": "cadastro_de_complementos_gerais_n.c.m",
    "title": "Cadastro de Complementos Gerais N.C.M",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-27",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "Nessa opção criaremos regras tributárias tendo como referência o código NCM (Nomenclatura Comum do Mercosul) , para casos mais comuns pode-se criar uma regra geral utilizando o NCM ‘00000000’ , por exemplo, empresas pert",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/45/cadastro_de_complementos_gerais_n.c.m",
    "content": [
      {
        "type": "p",
        "text": "Nessa opção criaremos regras tributárias tendo como referência o código NCM (Nomenclatura Comum do Mercosul) , para casos mais comuns pode-se criar uma regra geral utilizando o NCM ‘00000000’ , por exemplo, empresas pertencentes ao regime Simples Nacional. Porém, empresas que pertencem ao regime de Lucro Presumido ou Lucro Real exigem regras mais específicas, que além de sua variação por NCM possuem variação por UF origem x destino . Nessa tela poderemos criar essa correlação NCM x UF origem X UF destino , cada qual com suas próprias características referentes a alíquotas de ICMS, ICMS-ST, PIS, COFINS e isenções ."
      },
      {
        "type": "p",
        "text": "Obs: Mesmo utilizando essa tela faz-se necessário o cadastro da tributação pela ' 1111 - 11TB - Cadastro de Tabelas de Tributações' , porém, de forma simplificada, visto que as principais características serão inseridas na ' 1243 - Complementos Gerais N.CM' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Complementos%20Gerais%20-%20NCM/Cad_1243.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1 – Código N.C.M – Classificação fiscal, no qual, será criada a regra tributária, vale lembrar que pode se criar múltiplas regras usando o mesmo NCM combinado a variação dos campos ‘Aplicação’ e ‘Operação Com’ ;"
      },
      {
        "type": "p",
        "text": "2 – UF Origem – Unidade federativa de origem da operação, o campo vem desabilitado pois traz a informação do cadastro da empresa na opção '1112 - Cadastro de Empresas' ;"
      },
      {
        "type": "p",
        "text": "3 – Aplicação – Dentro desse combo teremos três opções: ‘ N – Normal’ utilizada para operações de venda, ‘R – Remessa’ para operações de remessa para conserto, garantia, industrialização com seus respectivos retornos e ‘D – Devolução’ para operações de devolução de venda e compra de mercadorias;"
      },
      {
        "type": "p",
        "text": "Obs: Para as regras criadas há a possibilidade de criar-se exceções a ela, na opção ‘1242 – Complementos dos Códigos Fiscais de Operações’ é possível vincular uma cfop a um determinado código de tributação, nesse caso a regra aplicada nessa tela sobrepõem a da ' 1243' ;   "
      },
      {
        "type": "p",
        "text": "4 – Operação Com –  Esse campo define o tipo de cliente que será usado para a regra a ser criada, pode ser uma situação geral, no qual, valerá a condição usada no cadastro do cliente ' 1221'  ou definida na opção de emissão de pedidos ' 2131' . Caso queira-se criar uma regra mais específica existem as opções ‘1 – Op. RPA’ , ‘2 – Op. Simples Nacional’ e ‘3 – Op. Consumidor Final’ ;"
      },
      {
        "type": "p",
        "text": "5 – Descrição Auxiliar – Descrição simplificada da regra a ser criada;"
      },
      {
        "type": "p",
        "text": "6 – Carac. Fiscal – Existem características fiscais específicas para determinados grupos de produtos tais como, combustíveis, lubrificantes e solventes que interferem na maneira como os impostos são calculados, nesse campo é possível selecionar um grupo específico, no qual a regra será aplicada, caso contrário é possível inserir essa informação no próprio cadastro do produto ' 1232' , por via de regra geral utilizar a opção ‘N – Normal’ ;"
      },
      {
        "type": "p",
        "text": "7 – Validade – Data de validade da regra criada;"
      },
      {
        "type": "p",
        "text": "8 – ICMS Interno – Alíquota de ICMS interna utilizada na UF;"
      },
      {
        "type": "p",
        "text": "9 – ICMS Interestadual – Alíquota de ICMS utilizada para operações interestaduais;"
      },
      {
        "type": "p",
        "text": "10 – Tributação – São dois campos, no qual, serão informadas as tributações próprias para operações de saída e entrada previamente criadas na opção ' 1111 - 11TB - Cadastro de Tabelas de Tributações' ;"
      },
      {
        "type": "p",
        "text": "11 – Isenção ICMS – Percentual de isenção na base de ICMS;"
      },
      {
        "type": "p",
        "text": "12 – IVA ST – Percentual de índice de valor agregado (IVA) que será utilizado para o cálculo do ICMS-ST;"
      },
      {
        "type": "p",
        "text": "13 – Isenção Base ST – Percentual de isenção na base do ICMS-ST;"
      },
      {
        "type": "p",
        "text": "14 – PIS – Alíquota de PIS proveniente do cadastro da empresa ' 1112' ;"
      },
      {
        "type": "p",
        "text": "15 – COFINS – Alíquota de COFINS proveniente do cadastro da empresa ' 1112' ;"
      },
      {
        "type": "p",
        "text": "16 – FCP – Percentual referente ao ‘Fundo de Combate à Pobreza’ ;"
      },
      {
        "type": "p",
        "text": "17 – Cnae? – Usado esse recurso todos os clientes vinculados a essa UF passarão a utilizar uma carga de tributação média vinculada a seu CNAE, os campos ‘CNAE’ e ‘Carga Média’ presentes no cadastro de clientes ' 1221'  deverão ser obrigatoriamente preenchidos;"
      },
      {
        "type": "p",
        "text": "18 – Inc. Fiscal? – Campo de uso futuro com o intuito de influenciar o cálculo de impostos para produtos que possuam incentivo fiscal por parte do governo;"
      },
      {
        "type": "p",
        "text": "Obs: Para que o produto aceite a configuração tributária feita por NCM, no cadastro de produto ‘1232 – Aba Fiscal – Cód. Tributação’ deverá possuir a informação ‘NN’ ;"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Complementos%20Gerais%20-%20NCM/retorno_1243.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " - Indica que a informação trazida ao campo tem origem numa outra configuração de NCM, para habilitar o campo e inserir uma informação própria clique sobre ele;"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Complementos%20Gerais%20-%20NCM/verde_1243.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " - Indica que a informação presente no campo tem origem própria, ou seja, não possui sua informação baseada numa configuração de NCM já existente;"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Complementos%20Gerais%20-%20NCM/azul_1243.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " - Indica que a informação presente no campo para essa UF é copiada da unidade federativa origem, para habilitar o campo e inserir uma informação própria clique sobre ele;"
      },
      {
        "type": "h3",
        "text": "Configuração de tributação referente as linhas 'XX - Exterior' e 'PX - Prod. Import. fora UF.:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Complementos%20Gerais%20-%20NCM/1243_XX_PX_config_trib_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "p",
        "text": "XX - Exterior - Vendas exportação e emissão de nota fiscal de entrada importação - Configurar o campo na cor azul com a tributação para saída exportação e campo na cor verde com tributação para entrada nota fiscal de importação."
      },
      {
        "type": "p",
        "text": "PX - Prod. Import. fora UF. - Configurar tributação para emissão de notas fiscais de venda cujo produtos tem origem na importação, conforme informação inserida em cadastro de produtos (1232) aba 'Fiscal' campo 'Sit. Tributária (T.A)' aonde a alíquota de ICMS aplicada será de 4%."
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-46",
    "slug": "cadastro_de_padroes_e_grupos_de_venda",
    "title": "Cadastro de Padrões e Grupos de Venda",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2019-12-27",
    "readTime": "4 min",
    "author": "Prócion Sistemas",
    "summary": "Anterior a esse passo, deverão ser cadastradas as condições de pagamento em  '2111 - Cadastro de Condições de Pagamento' , representantes em  '1215 - Cadastro de Representantes' , tabelas de preço na opção  '1232 - Cadas",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/46/cadastro_de_padroes_e_grupos_de_venda",
    "content": [
      {
        "type": "p",
        "text": "1214/12PV – Cadastro de Padrões de Venda"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Padr%C3%B5es%20e%20Grupos%20de%20Venda/Cifrao.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Anterior a esse passo, deverão ser cadastradas as condições de pagamento em  '2111 - Cadastro de Condições de Pagamento' , representantes em  '1215 - Cadastro de Representantes' , tabelas de preço na opção  '1232 - Cadastro de Produtos' e definidas as regras de negócio para desconto máximo, rentabilidade e preço mínimo. Para definiri os 'Padrões de Venda' acessar o botão  presente na tela '1214 - Grupo de Padrões de Venda' ."
      },
      {
        "type": "h3",
        "text": "Feito o acesso pelo botão abrirá a tela abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Padr%C3%B5es%20e%20Grupos%20de%20Venda/Padr%C3%B5es_venda.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1 – Descrição – Descrição livre da condição de pagamento;"
      },
      {
        "type": "p",
        "text": "2 – Ativo – Se a condição de pagamento está ativa ou não dentro cadastro de padrões de venda;"
      },
      {
        "type": "p",
        "text": "3 – Tab. – Respectiva tabela de preço vinculada a condição e pagamento;"
      },
      {
        "type": "p",
        "text": "4 – Condição de Pagamento – Código de cadastro da condição de pagamento e sua respectiva descrição (2111) ;"
      },
      {
        "type": "p",
        "text": "5 – Par – Quantidade de parcelas referente a condição de pagamento usada;"
      },
      {
        "type": "p",
        "text": "6 – Desconto/Acréscimo – Se a condição terá desconto ou acréscimo quando usada;"
      },
      {
        "type": "p",
        "text": "7 - % - Respectivo valor referente ao desconto ou acréscimo;"
      },
      {
        "type": "p",
        "text": "8 - Preço Min. – Porcentagem de desconto/acréscimo que poderá ser dado na venda tendo como referência a tabela de preço mínimo no cadastro de produtos;"
      },
      {
        "type": "p",
        "text": "9 – Rentab. – Porcentagem de desconto/acréscimo que poderá ser dado na venda tendo como referência a tabela de rentabilidade no cadastro de produtos;"
      },
      {
        "type": "p",
        "text": "10 – Rep? – Ao utilizar essa opção a condição ignora valores respectivos a percentuais (descontos/acréscimos) e busca no cadastro do representante (1215)  essas informações;"
      },
      {
        "type": "h3",
        "text": "Obs: É aconselhável deixar todas as condições existentes relacionadas mesmo que momentaneamente não estejam sendo usadas;"
      },
      {
        "type": "p",
        "text": "Feito o cadastro dos 'Padrões de venda'  podemos efetuar o cadastro do 'Grupo de Padrões de Venda'  que posteriormente será vinculado ao cadastro de representantes. O"
      },
      {
        "type": "p",
        "text": "cadastro de 'Grupo de Padrões de Venda'  visa estabelecer um padrão de condições que se aplique a determinada 'Situação x Representante' , por exemplo, vendedores que"
      },
      {
        "type": "p",
        "text": "supostamente só poderiam emitir vendas a venda à vista estarão inseridos num grupo que contemple somente condições que satisfaçam essa regra, impedindo que o"
      },
      {
        "type": "p",
        "text": "mesmo consiga efetuar vendas a prazo ou com condições privilegiadas referente a uma tabela de preço mais favorável."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Padr%C3%B5es%20e%20Grupos%20de%20Venda/1214_Grupo_padr%C3%B5es_venda.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1 – Código – Código do 'Grupo'  a ser criado, esse valor será dado pelo usuário;"
      },
      {
        "type": "p",
        "text": "2- Ativo? – Se o grupo está disponível para ser utilizado na tela de vendas em '7512 - Cadastro de Orçamentos' ;"
      },
      {
        "type": "p",
        "text": "3 – Descrição – Descrição do grupo cadastrado;"
      },
      {
        "type": "p",
        "text": "4 – Nível – Nível a qual pertence o grupo, por exemplo, um grupo, no qual, possua nível 3 automaticamente trará consigo os grupos de níveis 2, 1 e 0. Tendo a figura acima como referência, esse grupo de nível 1 teria como opção também outros grupos de níveis 1 e 0 no momento da venda;"
      },
      {
        "type": "p",
        "text": "5 – E/S – Se o grupo será usado em operações de entrada ou saída;"
      },
      {
        "type": "p",
        "text": "6 – Padrão de Venda\\Tab\\ Condição de Pagamento – Código do padrão de venda cadastrado anteriormente '12PV' com suas respectivas informações referentes a 'Descrição', 'Tabela de preço'  e 'Descrição da condição de pagamento'  vinculada;"
      },
      {
        "type": "p",
        "text": "7 – Nível – Sub nível de padrão de venda dentro do mesmo grupo;"
      },
      {
        "type": "p",
        "text": "Criado os padrões de venda '12PV' e posteriormente os grupos de venda, o próximo passo é vinculá-lo ao cadastro de representantes (1215) :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Padr%C3%B5es%20e%20Grupos%20de%20Venda/1215_grupo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Criado o vínculo o representante/vendedor poderá atuar somente sob as condições do grupo inserido em seu cadastro mais outros grupos de nível igual e inferior como"
      },
      {
        "type": "p",
        "text": "explicado acima, esse valor será trazido como padrão em  '7512 - Cadastro de Orçamentos' , e como pode ser visto abaixo estarão disponíveis somente seus respectivos grupos. Caso tenha a necessidade de usar alguma outra condição, a mesma será liberada por meio de senha gerente acionado através do botão 'Especial' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Cadastro%20de%20Padr%C3%B5es%20e%20Grupos%20de%20Venda/75OV_Pad_Grup_Vend.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-44",
    "slug": "condensacao_de_itens_orcamento_pre_venda_7512_cadastro_de_orcamentos",
    "title": "Condensação de itens 'Orçamento/Pré-venda' - 7512 - Cadastro de Orçamentos",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado a condensação de itens com o mesmo código e características em  '7512 - Cadastro de Orçamentos' , essa função é liberada mediante o parâmetro em  'RUS2 - Parâmetros Especiais de Faturamento - Aba - Geral Loj",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/44/condensacao_de_itens_orcamento_pre_venda_7512_cadastro_de_orcamentos",
    "content": [
      {
        "type": "p",
        "text": "Implementado a condensação de itens com o mesmo código e características em  '7512 - Cadastro de Orçamentos' , essa função é liberada mediante o parâmetro em  'RUS2 - Parâmetros Especiais de Faturamento - Aba - Geral Loja - Junção Produtos'."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Condensa%C3%A7%C3%A3o%20de%20Itens/RUS2_Cond_Item.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "A condensação será executada pressionando o botão 'Condensa Itens com mesmo código e características' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Condensa%C3%A7%C3%A3o%20de%20Itens/75OV_Condes_Itens_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Itens com mesmo código e preço serão unificados na mesma linha (item) após a condensação:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Condensa%C3%A7%C3%A3o%20de%20Itens/75OV_Condes_Itens_2.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-39",
    "slug": "datas_livres_funcionamento_rtdt",
    "title": "Datas Livres - Funcionamento RTDT",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Devido ao parâmetro em  '1112 - Cadastro de Empresas - Aba - Faturamento - Impostos 1ª Parcela'  que configura a cobrança dos impostos no faturamento 'IPI/ST – Antecipado/Primeira Parcela/Rateio' , a opção que calcula e ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/39/datas_livres_funcionamento_rtdt",
    "content": [
      {
        "type": "p",
        "text": "Devido ao parâmetro em  '1112 - Cadastro de Empresas - Aba - Faturamento - Impostos 1ª Parcela'  que configura a cobrança dos impostos no faturamento 'IPI/ST – Antecipado/Primeira Parcela/Rateio' , a opção que calcula e gerencia os vencimentos referente ao financeiro 'RTDT - Parcelas'  teve uma alteração em seu comportamento que afetou principalmente a condição de pagamento tipo 'DL – Datas Livres' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Datas%20Livres%20-%20Funcionamento%20RTDT/1112_New_RTDT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O sistema forçará o uso de todas parcelas cadastradas na condição de pagamento tipo  'Datas Livres' , sendo assim, não será possível utilizar menos parcelas que o parametrizado no cadastro da condição de pagamento, pois o valor lançado será dividido entre todas as parcelas possíveis, na figura abaixo está cadastrado uma condição tipo 'Datas Livres'  com 12 parcelas ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Datas%20Livres%20-%20Funcionamento%20RTDT/2111_New_RTDT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Tendo a figura acima como exemplo, ao escolher uma condição de pagamento tipo 'DL - Datas Livres' o campo 'Número de Parcelas' é desabilitado e automaticamente serão gerados '12' vencimentos conforme seu cadastro. "
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Datas%20Livres%20-%20Funcionamento%20RTDT/New_2131_RTDT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Caso seja necessário escolher a quantidade de parcelas que deseja - se utilizar no momento do faturamento para o tipo 'Datas Livres' , deve - se cadastrar a condição de pagamento com o valor '00'  no campo 'Número de Parcelas' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Datas%20Livres%20-%20Funcionamento%20RTDT/2111_New_RTDT_Parc_zeros.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Dessa forma ao abrir a 'RTDT - Parcelas'  o programa trará o valor 'Número de Parcelas – 01'  como padrão e conforme a necessidade será possível manipular o valor de parcelas, desobrigando o sistema a “forçar” uma situação previamente parametrizada."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Datas%20Livres%20-%20Funcionamento%20RTDT/New_2131_Parc_RTDT.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-40",
    "slug": "descontos_em_produtos_promocionais_7512_cadastro_de_orcamentos",
    "title": "Descontos em 'Produtos' Promocionais - 7512 - Cadastro de Orçamentos",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado dentro da opção '7512 - Cadastro de Orçamentos' um indicativo   para produtos em 'Promoção' , que possibilitará ou não realizar descontos para os produtos que estejam nessa condição.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/40/descontos_em_produtos_promocionais_7512_cadastro_de_orcamentos",
    "content": [
      {
        "type": "p",
        "text": "Implementado dentro da opção '7512 - Cadastro de Orçamentos' um indicativo   para produtos em 'Promoção' , que possibilitará ou não realizar descontos para os produtos que estejam nessa condição."
      },
      {
        "type": "h3",
        "text": "Definição no produto em '1232 - Cadastro de Produtos - Promoção?':"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Descontos%20em%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Parâmetro para habilitar/desabilitar descontos em produtos promocionais '1111 - Parâmetros Globais Sistema - Aba - Caixa - Proíbe Descontos em produtos Promocionais?':"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Descontos%20em%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Visualização e rateio de descontos em  '7512 - Cadastro de Orçamentos' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Descontos%20em%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O produto marcado como 'Promoção'  terá seu valor 'Unitário'  exibido na cor 'Amarelo' , uma vez habilitado o parâmetro que próíbe o desconto em produtos promocionais não será possível manipular o valor do item e o valor do desconto será rateado somente em itens que estejam fora dessa condição."
      }
    ]
  },
  {
    "id": "AP-47",
    "slug": "hadron_mobile_manual_de_configuracoes",
    "title": "Hádron Mobile - Manual de Configurações",
    "category": "manual",
    "module": "Portal do Cliente",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2019-12-27",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "Este artigo não tem o objetivo de fornecer orientações referente a operações diretamente realizadas no aplicativo 'Hádron Mobile' , e sim para procedimentos e configurações que devem ser realizados anterior ao envio das ",
    "sourceUrl": "https://ajuda.procion.com/artigo/manual/47/hadron_mobile_manual_de_configuracoes",
    "content": [
      {
        "type": "p",
        "text": "Este artigo não tem o objetivo de fornecer orientações referente a operações diretamente realizadas no aplicativo 'Hádron Mobile' , e sim para procedimentos e configurações que devem ser realizados anterior ao envio das informações para o banco de dados presente na 'Nuvem' ."
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1111_Param_web_Internet.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1111_RGBW_Marca.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após habilitar o parâmetro acima, criar o arquivo em '1232 - Cadastro de Produtos - Aba - Principal - Marca' , como mostra a figura abaixo. A abertura e funcionamento do programa  'SGBW - Gerenciador do Banco de Dados Remoto' depende da criação do arquivo 'PHMARCAS.DAT' ."
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/RGBW_Mobile_1232_Marca.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao clicar sobre o botão 'Baixa Parâmetros do HádronWeb' será realizado download das informações necessárias para a configuração do banco de dados do cliente, os campos 'End.(URL)' , 'Database' , 'User' e 'Password' serão automaticamente preenchidos."
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/RGBC_Artigo_Bot%C3%A3o_Down_Param.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O 'ODBC MySql'  tem a função de criar a interface para acesso de dados, ele fará a “ponte” entre o banco de dados local (Hádron) e o banco de dados que estará na 'Nuvem' (Mobile) , para realizar o download do instalador acessar o link https://dev.mysql.com/downloads/connector/odbc/   (Efetuar download sempre na versão 32 bit, somente a inicialização muda conforme a versão do Windows) . Em conjunto será necessário a instalação do 'Visual Studio C++ Framework'  através do link https://support.microsoft.com/pt-br/help/2977003/the-latest-supported-visual-c-downloads  compatível com a versão do 'ODBC MySql' utilizada  (Efetuar download sempre na versão 32 bit)."
      },
      {
        "type": "p",
        "text": "O 'ODBC MySql'  servirá tanto para as funções executadas no 'Mobile' quanto para operações referentes ao 'Hádron-Web' (E-Commerce/MarketPlace) ."
      },
      {
        "type": "h3",
        "text": "Para inicializar o ODBC executar os comandos:"
      },
      {
        "type": "h3",
        "text": "Windows 32 bit: Digitar na função 'Executar'  do Windows o comando odbcad32.exe ;"
      },
      {
        "type": "h3",
        "text": "Windows 64 bit: Digitar na função 'Executar'  do Windows o comando %systemdrive%\\Windows\\SysWoW64\\odbcad32.exe;"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/ODBC_exec.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Ao digitar o comando abrirá a tela abaixo, selecionar a aba 'DSN de Sistema'  e clicar no botão 'Adicionar'  :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/ODBC_Add_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Na sequência escolher a opção 'MySQL ODBC 5.3 ANSI Driver' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/ODBC_Add_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Os campos  'TCP/IP Server', 'Port', ' User' , ' Password',  e 'Database'  são dados que serão previamente informados pelo departamento de Desenvolvimento Web, estas informações também estarão presentes em nosso 'CRM Prócion - Clientes' aba 'Internet' na página da sigla do cliente. "
      },
      {
        "type": "h3",
        "text": "Obs: Não será mais necessário inserir a informação referente ao campo 'Password' e executar a função 'Test' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/ODBC_Add_3.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Configurações Hádron – 1112 - Cadastro de Empresas - Aba - Principal"
      },
      {
        "type": "p",
        "text": "Na opção '1112 - Cadastro de Empresas - Aba - Principal'  será definido a utilização do serviço através do checkbox 'Mobile' , marcar somente o serviço contratado/utilizado, os módulos WEB são distintos e não possuem uma interdependência para seu funcionamento. O número do terminal responsável pelo gerenciador 'SGBW - Gerenciador do Banco de Dados Remoto'  que fará o envio/recepção das informações entre o banco local e a 'Nuvem'  também deverá ser definido."
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1112_Param_Mobile_New.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na opção '1119 - Parâmetros de Terminal - Aba - F. Loja'   marcar o checkbox 'Terminal Gerencia Banco de Dados Web?' e inserir o número da empresa no qual o terminal será responsável pelo gerenciamento do banco de dados WEB, ao acessar o sistema abrirá o 'SGBW - Gerenciador do Banco de Dados Remoto'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1119_Gerenciador_Web.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Manutenção de Produtos – 1232 - Cadastro de Produtos"
      },
      {
        "type": "p",
        "text": "Na opção  '1232 - Cadastro de Produtos - Aba - e-Commerce'  é necessário que esteja marcado o checkbox 'Produto ativado para Mobile?', indicando para o sistema que o upload do registro deverá ser feito para a 'Nuvem'  como indica a figura abaixo:"
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1232_New_artigo_Mobile.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Outros campos obrigatoriamente devem possuir informações no cadastro de produtos, são eles:"
      },
      {
        "type": "h3",
        "text": "Aba - Principal:  Informar campos referente a seção  'Volumes' ."
      },
      {
        "type": "p",
        "text": "Aba - Preços:  Informar valor na(s) tabela(s) de preço(s) conforme parametrização do 'Grupo de Vendas' , são as tabelas no intervalo de '0 a 8' ."
      },
      {
        "type": "p",
        "text": "OBS:  A parametrização fiscal do cadastro de produtos deverá estar em conformidade com os impostos incidentes ou não  (ICMS/ICMS-ST/IPI),  dessa forma eles serão calculados da maneira correta no momento da venda dentro do aplicativo Mobile. O relatório  '1232 - Cadastro de Produtos - Listagem de Consistência Fiscal de Produtos' aponta possíveis erros existentes no cadastro que estão impedindo o item de tributar da maneira correta ou até mesmo travando o upload do registro para o banco de dados."
      },
      {
        "type": "h3",
        "text": "Acesso do relatório via o botão 'Consistência da Tributação dos Produtos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1232_List_Consist_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1232_List_Consist_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Existe a possibilidade de realizar uma manutenção coletiva de produtos para este módulo, pode-se efetuar diversas outras alterações referente ao cadastro de produtos, é a opção '7581 - Manutenção de Produtos do E-Commerce/Mobile'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/7581_Mob.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na opção '1215 - Cadastro de Representantes',  inserir a senha que será utilizada no aplicativo Mobile e vincular o código do 'Grupo de Vendas'  que contém as tabelas de preços e as possíveis condições de pagamento para o vendedor utilizar no aplicativo."
      },
      {
        "type": "h3",
        "text": "Senha do representante que será utilizada no acesso do aplicativo Mobile:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1215_Mob_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Código do 'Grupo de Vendas' que será utilizado pelo representante:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1215_Mob_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "No cadastro do  'Grupo de Vendas'  vinculado ao representante, não utilizar condições que pagamento que apontem para as tabelas 'A, B, C, D, E, F, G, H, I, J' , será feito o upload somente das tabelas de preços utilizadas em processos de venda, ou seja, as tabelas no intervalo  '0 a 8' ."
      },
      {
        "type": "h3",
        "text": "Não utilizar condições que apontem paras tabelas 'A, B, C, D, E, F, G, H, I, J',  como mostra a figura abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1214_12PV.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Envio de Códigos de Dígitos de ICMS para o Mobile – 1243 - Complementos Gerais N.C.M"
      },
      {
        "type": "p",
        "text": "Obs: O passo abaixo deverá ser feito somente em clientes que NÃO trabalham exclusivamente com tributações do tipo 'NN', e utilizam em '1232 - Cadastro de Produtos - Aba - Fiscal - Cod. Tributação' registros cadastrados em '1111 - Parâmetros Globais Sistema - 11TB - Cadastro de Tabelas de Tributações."
      },
      {
        "type": "p",
        "text": "No cadastro do código de 'NCM – 00.00.00.00' (Geral)  deve - se inserir o 'Dígito de ICMS' configurado na opção '1111 - Parâmetros Globais Sistema - Aba - Tabelas Fiscais' para cada estado conforme alíquota, essa informação será utilizada pelo aplicativo Mobile para cálculos de impostos  'ICMS/ICMS - ST/IPI' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/1243_Mob.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Realizadas todas as configurações e ações prévias as informações serão enviadas através do gerenciador do banco de dados remoto."
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/SGBW_Upload_Dados.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "RGBP – Filtros de Atualização da Loja Virtual"
      },
      {
        "type": "p",
        "text": "Os itens poderão ser selecionados para envio/atualização através de filtros referente as tabelas de dados tratadas pelo aplicativo Mobile. Ao manipular os filtros de dados, escolher exclusivamente itens que realmente sofreram alteração, dessa forma, somente as tabelas que tiveram mudanças serão atualizadas, isso agiliza o procedimento do envio dos dados."
      },
      {
        "type": "image",
        "src": "http://crm.procion.com/webroot/file_manager/files/Artigos/H%C3%A1dron%20Mobile/RGBP_New_Mobile.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-38",
    "slug": "multiplo_qtde_tipo_mul_qtd_venda_7512_cadastro_de_orcamentos_",
    "title": "Multiplo Qtde/Tipo Mul Qtd - Venda '7512 - Cadastro de Orçamentos'",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado em  '1232 - Cadastro de Produtos - Aba - Principal'   novo campo 'Tipo Mul Qtd'  que visa 'Bloquear'  ou 'Completar'  quantidades múltiplas, para vendas realizadas na opção '7512 - Cadastro de Orçamentos'  e",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/38/multiplo_qtde_tipo_mul_qtd_venda_7512_cadastro_de_orcamentos_",
    "content": [
      {
        "type": "p",
        "text": "Implementado em  '1232 - Cadastro de Produtos - Aba - Principal'   novo campo 'Tipo Mul Qtd'  que visa 'Bloquear'  ou 'Completar'  quantidades múltiplas, para vendas realizadas na opção '7512 - Cadastro de Orçamentos'  em produtos que utilizam informação no campo  'Múltiplo Qtde'.  Como exemplo, o recurso pode ser utilizado para o comércio de pisos e outros materiais de construção vendidos em  'M2'."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Multiplo%20Qtde%20-%20Tipo%20Mul%20Qtd%20-%20Venda%207512/1232_New_Mult_Qtde.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na opção '0 – Bloqueia'  a quantidade inserida em  '7512 - Cadastro de Orçamentos'  deverá estritamente seguir o múltiplo definido no cadastro do produto."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Multiplo%20Qtde%20-%20Tipo%20Mul%20Qtd%20-%20Venda%207512/75OV_New_Mult_Qtde_Bloq.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na opção '1 – Completa'  a quantidade inserida em  '7512 - Cadastro de Orçamentos'  será arredondada ajustando o valor para cima, conforme o múltiplo definido no cadastro do produto. No exemplo abaixo, a quantidade utilizada foi de  '20 M2' , valor esse diferente ao múltiplo utilizado no cadastro do item."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Multiplo%20Qtde%20-%20Tipo%20Mul%20Qtd%20-%20Venda%207512/75OV_New_Mult_Qtde_Complet_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Automaticamente o sistema fará o ajuste no campo 'Quantidade' inserindo o valor respectivo ao múltiplo que está cadastrado no produto."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Multiplo%20Qtde%20-%20Tipo%20Mul%20Qtd%20-%20Venda%207512/75OV_New_Mult_Qtde_Complet_2.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-41",
    "slug": "operacoes_em_transferencia_de_estoque_7512_7513",
    "title": "Operações em Transferência de Estoque - 7512/7513",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado operações de ' Transferência de Estoque'  pelas opções '7512 - Cadastro de Orçamentos' e  '7513 - Emissão de Orçamentos'  de forma automatizada, abaixo seguem as orientações:",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/41/operacoes_em_transferencia_de_estoque_7512_7513",
    "content": [
      {
        "type": "p",
        "text": "Implementado operações de ' Transferência de Estoque'  pelas opções '7512 - Cadastro de Orçamentos' e  '7513 - Emissão de Orçamentos'  de forma automatizada, abaixo seguem as orientações:"
      },
      {
        "type": "h3",
        "text": "Criar 'Grupo Padrão'  em '1214 - Grupo de Padrões de Venda'  para operações de 'Transferências' entre estoques."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%B5es%20em%20transfer%C3%AAncia%20de%20estoque%20-%207512%20-%207513/New_1214_Transf.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "No cadastro em '2113 - Transações'  ao escolher o tipo de venda 'TN – Transferência (Não Venda)'  será habilitado o campo 'Tributação Exclusiva' , tributação essa que será usada no processo da emissão da nota fiscal de 'Transferência' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%B5es%20em%20transfer%C3%AAncia%20de%20estoque%20-%207512%20-%207513/New_2113_Transf.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Criar vínculo referente a transação que será usada no processo de transferência (2113)  e o grupo de venda (1214)  em  'RUS2 - Parâmetros Especiais Faturamento - Aba - Geral Loja - Operações Transferências' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%B5es%20em%20transfer%C3%AAncia%20de%20estoque%20-%207512%20-%207513/New_RUS2_Transf.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Tela de vendas (7512 - Cadastro de Orçamentos):"
      },
      {
        "type": "p",
        "text": "Foi incluso um novo tipo de operação ' T – Transferência' , escolhida a operação o item terá a característica no botão  'Op'  como 'Transferência' , o campo referente a 'Padrões de Venda'  ficará em branco pois a operação não gerará financeiro após a emissão do documento fiscal, ao clicar sobre o botão 'Transferência'  o documento será gerado para o faturamento em  '7513 - Emissão de Orçamentos' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%B5es%20em%20transfer%C3%AAncia%20de%20estoque%20-%207512%20-%207513/New_7512_Transf.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao inserir o número da 'Pré - Venda - Tranferência' automaticamente será trazida a transação e o grupo de vendas conforme parâmetros definidos em  'RUS2 - Parâmetros Especiais Faturamento - Aba - Geral Loja - Operações Transferências' , os valores referentes ao financeiro ficarão com zeros."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%B5es%20em%20transfer%C3%AAncia%20de%20estoque%20-%207512%20-%207513/New_7513_Transf.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-43",
    "slug": "setorizacao_de_cliente_terceiro_via_ddd",
    "title": "Setorização de 'Cliente/Terceiro' via DDD",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Criado novo parâmetro em  '1111 – Parâmetros Globais Sistema - Aba - Terceiros – Setorização Clientes – D – Fixo pelo DDD do Terceiro' , que associa o DDD do terceiro ao campo 'Setor'  de forma automática em  '1221 - Cad",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/43/setorizacao_de_cliente_terceiro_via_ddd",
    "content": [
      {
        "type": "p",
        "text": "Criado novo parâmetro em  '1111 – Parâmetros Globais Sistema - Aba - Terceiros – Setorização Clientes – D – Fixo pelo DDD do Terceiro' , que associa o DDD do terceiro ao campo 'Setor'  de forma automática em  '1221 - Cadastro de Terceiros' , esse parâmetro visa facilitar a montagem de cargas com o mesmo destino 'Região/UF'."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Setoriza%C3%A7%C3%A3o%20de%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Setoriza%C3%A7%C3%A3o%20de%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Setoriza%C3%A7%C3%A3o%20de%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-37",
    "slug": "tributacoes_exclusivas_por_transacao_x_cfop_",
    "title": "Tributações exclusivas por Transação x CFOP",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Na opção  '1242 - Complementos dos Códigos Fiscais de Operações'  foi retirado em versões anteriores, a possibilidade de vincular um código de tributação diretamente a um CFOP, regra essa que sobressaia sobre as demais e",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/37/tributacoes_exclusivas_por_transacao_x_cfop_",
    "content": [
      {
        "type": "p",
        "text": "Na opção  '1242 - Complementos dos Códigos Fiscais de Operações'  foi retirado em versões anteriores, a possibilidade de vincular um código de tributação diretamente a um CFOP, regra essa que sobressaia sobre as demais existentes no sistema. Atendendo a uma solicitação, foi criada uma forma que seja possível formular essa regra pelo programa '2113 - Transações' ."
      },
      {
        "type": "h3",
        "text": "No cadastro de CFOPs (1242)  marcar o checkbox 'Habilita escolha de Tributação na Transação?'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Tributa%C3%A7%C3%B5es%20exclusivas%20por%20Transa%C3%A7%C3%A3o%20x%20CFOP/1242_Trib_exclus.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado o passo acima, o campo 'Tributação Exclusiva'  ficará habilitado para que seja vinculado o código da tributação exclusiva para o CFOP/Transação:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Tributa%C3%A7%C3%B5es%20exclusivas%20por%20Transa%C3%A7%C3%A3o%20x%20CFOP/2113_Trib_exclus.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Criado o vínculo ‘CFOP x Transação x Tributação’ , a emissão acatará a regra fiscal/tributária configurada:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Tributa%C3%A7%C3%B5es%20exclusivas%20por%20Transa%C3%A7%C3%A3o%20x%20CFOP/2131_Trib_exclus.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Tributa%C3%A7%C3%B5es%20exclusivas%20por%20Transa%C3%A7%C3%A3o%20x%20CFOP/2131_Trib_exclus_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Obs: As regras criadas terão validade para pedidos feitos na opção '2131 – Cadastro de Pedidos'."
      }
    ]
  },
  {
    "id": "AP-42",
    "slug": "venda_rapida_7512_cadastro_de_orcamentos",
    "title": "Venda Rápida - 7512 - Cadastro de Orçamentos",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [
      "vendas"
    ],
    "updatedAt": "2019-12-27",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Criado parâmetro em 'RUS2 - Parâmetros Especiais Faturamento - Aba - Orçamentos'  para 'Venda Rápida' em  '7512 - Cadastro de Orçamentos' , visando agilizar a 'Venda Balcão'  foram criados parâmetros que definem um valor",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/42/venda_rapida_7512_cadastro_de_orcamentos",
    "content": [
      {
        "type": "p",
        "text": "Criado parâmetro em 'RUS2 - Parâmetros Especiais Faturamento - Aba - Orçamentos'  para 'Venda Rápida' em  '7512 - Cadastro de Orçamentos' , visando agilizar a 'Venda Balcão'  foram criados parâmetros que definem um valor padrão para a 'Pré - Venda/Orçamento'  preenchendo o cabeçalho da tela de vendas e posicionando o foco no campo do produto ao realizar a inclusão do documento."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Venda%20Rapida%20-%207512/RUS2_Vend_Rapid.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Criar vínculo 'Operador x Representante'  na opção '1116 - Cadastro de Operadores' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Venda%20Rapida%20-%207512/1116_Vend_Rapid.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Criado o vínculo, ao realizar o login no sistema com o operador e efetuar a inclusão da 'Pré - Venda/Orçamento'  pelo botão 'Venda Rápida',  o cabeçalho da tela  '7512 - Cadastro de Orçamentos'  será preenchido com o cliente padrão definido no parâmetro e o código do representante vinculado, automaticamente o foco ficará posicionado na grid produtos para que os itens seja inclusos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Venda%20Rapida%20-%207512/75ov_Vend_rap_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Venda%20Rapida%20-%207512/75Ov_Venda_Rapida.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-36",
    "slug": "comissionamento_minimo_maximo_comissao_escalonada",
    "title": "Comissionamento Mínimo/Máximo - Comissão Escalonada",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-26",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": " Para clientes que utilizam a comissão escalonada, foram inseridos novos parâmetros para cálculo e base de comissionamento.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/36/comissionamento_minimo_maximo_comissao_escalonada",
    "content": [
      {
        "type": "p",
        "text": " Para clientes que utilizam a comissão escalonada, foram inseridos novos parâmetros para cálculo e base de comissionamento."
      },
      {
        "type": "p",
        "text": "Anteriormente o valor da comissão do representante escalonava até 'zero porcento'  mediante os descontos aplicados na venda, porém, alguns clientes por contrato devem pagar um valor de comissão mínimo independentemente do valor de desconto utilizado na venda.  Para a situação, criou - se na opção '1215 - Cadastro de Representantes - Aba - Vendas'  o campo 'Mínimo Comissão' , ou seja, o valor será escalonado entre o máximo e mínimo comissionamento possível, como apontado na figura abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Comissionamento%20M%C3%ADnimo%20-%20M%C3%A1ximo%20-%20Comiss%C3%A3o%20Escalonada/1215_comiss.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Também foi criada uma nova forma de base para o cálculo da comissão escalonada, anteriormente a base de cálculo desse tipo de comissionamento variava somente pela diferença de valor entre  'Tabela de Venda' x 'Preço Mínimo(G)'.  Inserido um novo parâmetro, no qual, será possível escolher uma nova forma de base para cálculo pela diferença de valor entre a 'Tabela de Venda' x Base Rentabilidade (F)'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Comissionamento%20M%C3%ADnimo%20-%20M%C3%A1ximo%20-%20Comiss%C3%A3o%20Escalonada/RUS2_Comiss.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-34",
    "slug": "implementacao_geracao_bloco_k",
    "title": "Implementação/Geração - Bloco K",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2019-12-20",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Em '1111 – Parâmetros Globais Sistema - Abas - Estoque e Fiscal'  ativar  'Forma de Integração - Online' , Após habilitar os módulos criar os arquivos referente a ambos, gerar apurações fiscais do grupo '7140 - Apurações",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/34/implementacao_geracao_bloco_k",
    "content": [
      {
        "type": "h3",
        "text": "Implementado a geração do 'Bloco K'  para o Sped Fiscal, abaixo algumas considerações:"
      },
      {
        "type": "p",
        "text": "Em '1111 – Parâmetros Globais Sistema - Abas - Estoque e Fiscal'  ativar  'Forma de Integração - Online' , Após habilitar os módulos criar os arquivos referente a ambos, gerar apurações fiscais do grupo '7140 - Apurações / Geraçao de Arquivos' mesmo que em branco :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/Bloco_K_Est_Online.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/Bloco_K_Fiscal_Online.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Em '1112 – Cadastro de Empresas - Aba - Sped'  marcar os checkbox 'Gera SPED Fiscal?'  e 'Gera Livro P3 (Bloco K)?' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/Bloco_K_1112_SPED.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Importação de Saldo de Produtos –  Existindo a necessidade, será possível importar um arquivo informando os saldos de produtos que irão compor o bloco K, realizar a importação no Mês/Ano base referente a geração do arquivo. A importação será feita através da tela '5112 – Complemento de Produtos' , ao inserir a 'Senha Gerente' será habilitado o botão 'Importa Saldos Iniciais' , anterior ao processo o programa gerará um relatório com os dados que constam no arquivo."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/5112_Importa_Bloco_K.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Formato do Arquivo – O arquivo deverá ser salvo com o formato  'Tipo – CSV (Separado por vírgulas)'  obedecendo o posicionamento informado na figura abaixo:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/Arquivo_modelo_import_5112_Bloco_K.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Obs: O 'Valor Contábil' informado na coluna '6' deverá ser '= (Valor contábil unitário x Saldo do item)'."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/Formato_Arquivo_Import_CSV.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Fechamento de Estoque – Para clientes que já utilizam o sistema com os módulos 'Estoque' e 'Fiscal' de forma 'Online' , realizar o fechamento de estoque executando os processos nos programas '5410 - Valorização Contábil Estoque' , '5512 - Ajustes de Estoques Negativos' e '5511 - Atualização dos Arquivos do Estoque' .Para novos clientes ou clientes que até então não utilizavam o módulo de estoque,  “forçar” o fechamento através da tela '1115 – Alteração de Task/Cód. Fechamento' . Para a geração do 'SPED - Bloco – K'  obrigatoriamente o estoque do período informado deverá estar fechado dentro do sistema."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/New_1115_Bloco_K.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Geração do 'Bloco K' Exportação para 'Outros Sistemas' –  Utilizar o programa  '7176 – Geração do Arquivo EFD (SPED Fiscal)' , caso o estoque do período informado não esteja fechado será exibida a mensagem abaixo:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/Bloco_K_7176_Erro_N_Fech.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado no estoque o fechamento do Mês/Ano de forma correta, o arquivo será gerado normalmente, pressionar o botão 'Processa' . Outra possibilidade é a geração e exportação somente do 'Bloco K' para outros sistemas que tenham a necessidade da informação existente no ERP, por exemplo, escritórios de contabilidade. Esse processo será realizado através do botão 'Gera Bloco K (somente o registro, exportação...)' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/7176_Registro_Exporta%C3%A7%C3%A3o.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Abaixo, exemplo de layout do arquivo  'Bloco K' após ser gerado:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Gera%C3%A7%C3%A3o%20-%20Bloco%20K/7176_Exemplo_Arquivo_Bloco_k.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-35",
    "slug": "parametros_processos_relatorios_estoque_abc_minimo_maximo_giro_disponibilidade",
    "title": "Parametros - Processos - Relatórios Estoque ABC - Mínimo/Máximo - Giro - Disponibilidade",
    "category": "guia",
    "module": "ERP - Estoque",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2019-12-20",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Abaixo seguem algumas orientações referentes há alguns cálculos estatísticos que o sistema Hádron executa para 'Estoque ABC - Mínimo/Máximo - Giro - Disponibilidade'.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/35/parametros_processos_relatorios_estoque_abc_minimo_maximo_giro_disponibilidade",
    "content": [
      {
        "type": "p",
        "text": "Abaixo seguem algumas orientações referentes há alguns cálculos estatísticos que o sistema Hádron executa para 'Estoque ABC - Mínimo/Máximo - Giro - Disponibilidade'."
      },
      {
        "type": "p",
        "text": "Definição de parâmetros para cálculos estatísticos de estoque em '1111 – Parâmetros Globais Sistema - Aba - Estoque – Estoque/Gerencial'.  Nessas configurações serão definidas a quantidade de dias/meses que o sistema utilizará para efetuar os cálculos para  'Estoque ABC - Mínimo/Máximo - Giro – Disponibilidade' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/1111_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5515 – Criação de Informações Estatísticas do Estoque – Muitas vezes ao acessar os relatórios gerenciais do grupo '5530 – 5531/5532/5533/5534/5535'  é exibida a mensagem abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/Msg_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A mensagem acima deve - se a inexistência do arquivo 'UPR' , para criá-lo executar o processo em  '5515 – Criação de Informações Estatísticas do Estoque'  :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5515_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Criado o arquivo, proceder no grupo '5520 – Cálculos'  os processos referentes a 'Produtos ABC'  e 'Estoques Mínimos e Máximos' , são eles:"
      },
      {
        "type": "p",
        "text": "5521 – Produtos ABC:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5521_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5522 – Estoques Mínimos/Máximos:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5522_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Grupo 5530 – Relatórios Gerenciais – Realizados os procedimentos acima, será possível dentro do grupo '5530 – 5531/5532/5533/5534/5535'  emitir algumas análises referente ao histórico de movimentação de estoque, com o período definido anteriormente nos parâmetros acima:"
      },
      {
        "type": "p",
        "text": "5531 – Relação Produtos ABC:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5531_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5531_Rel_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5532 – Análise de Movimentações:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5532_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Abaixo os dois tipos:"
      },
      {
        "type": "p",
        "text": "1 – Por Médias e Valores ABC:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5532_Rel_Est_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2 – Valorizado por Tabela de Preços:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5532_Rel_Est_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5533 – Giro/Antigiro :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5533_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5533_Rel_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5534 – ABC do Valor do Estoque - Diferente da relação ABC anterior, está é baseada no valor ($) movimentado pelo item e não pela quantidade:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5534_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5534_Rel_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5535 – Movimentos Mensais Produtos:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5535_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Tipo – 1 – Quantitativo: (Infelizmente ficou pequeno devido ao tamanho do relatório)"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5535_Rel_Est.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Tipo – 2 – Valorizado:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Calculos%20Estatisticos%20-%20Estoque/5535_Rel_Est_2.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-31",
    "slug": "calculo_custo_compras_nova_opcao_3215",
    "title": "Cálculo Custo/Compras - Nova opção 3215",
    "category": "guia",
    "module": "ERP - Compras",
    "tags": [
      "estoque"
    ],
    "updatedAt": "2019-12-19",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Criado novo recurso em '3215 - Acerto de Preços e Custos' , será possível realizar a manutenção de tabelas de preços e fator, mediante o lançamento do documento de compras de mercadorias feito pela opção '3212 - Cadastro",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/31/calculo_custo_compras_nova_opcao_3215",
    "content": [
      {
        "type": "p",
        "text": "Criado novo recurso em '3215 - Acerto de Preços e Custos' , será possível realizar a manutenção de tabelas de preços e fator, mediante o lançamento do documento de compras de mercadorias feito pela opção '3212 - Cadastro de Documentos de Entradas'.   "
      },
      {
        "type": "p",
        "text": "Após o lançamento do documento de compras de mercadorias, o programa possibilitará a alteração das tabelas de preços  'Valor Última Compra (A)' , 'Preço Sugestão(E)'  e 'Tabela Preço à Vista' definido no parâmetro '1111 - Parâmetros Globais sistemas - Aba - Produtos - Preço a Vista' , além do fator 'F0'  presente no cadastro do produto."
      },
      {
        "type": "p",
        "text": "Em '1232 – 12FP – Cadastro de Fórmulas de Tabelas de Preços'  é necessário que seja configurado uma fórmula de produtos que utilize o 'Fator – F0'  e tenha seu resultado final na tabela 'Preço Sugestão (E)' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20-%20Compras%20-%20Nova%20op%C3%A7%C3%A3o%203215/New_1232_12FP.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Caso não exista a fórmula configurada ao acessar a opção '3215 - Acerto de Preços e Custos'  será exibida a mensagem abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20-%20Compras%20-%20Nova%20op%C3%A7%C3%A3o%203215/Mensag_3215.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Em '1112 – Cadastro de Empresas - Aba - Fiscal' , definir o parâmetro para 'Compras - Cálculo Custo' ."
      },
      {
        "type": "p",
        "text": "O Parâmetro possibilitará 3 opções: '0 – Automático' – Não permite manipular valores pela opção  '3215 - Acerto de Preços e Custos' ,  '2 – Permite Redefinir Custos' – Somente a coluna referente ao custo será habilitada para a manipulação de valores e '4 – Permite Redefinir Preços' – Todas as colunas inclusive o 'Fator 0'  serão habilitadas para que os valores possam ser manipulados."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20-%20Compras%20-%20Nova%20op%C3%A7%C3%A3o%203215/1112_New_3215.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em '1111 – Parâmetros Globais Sistema - Aba - Produtos - Tabelas de Preços – Preço a Vista' – A tabela definida no parâmetro será a atualizada mediante o lançamento de valor na coluna 'Preço'  na opção  '3215 - Acerto de Preços e Custos' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20-%20Compras%20-%20Nova%20op%C3%A7%C3%A3o%203215/1111_New_3215.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "É possível realizar o acesso a opção '3215 - Acerto de Preços e Custos'  pela própria '3212 - Cadastro de Documentos de Entradas'  pelo botão 'Confirma e Ajusta' , além de realizar a inclusão do registro/documento abrirá o programa para que os ajustes possam ser realizados:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20-%20Compras%20-%20Nova%20op%C3%A7%C3%A3o%203215/3212_New_3215.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3215 – Acerto de Preços e Custo :  Coluna 'Ult. Com Atu' – Traz o valor da última alteração realizada pela própria tela '3215' , coluna 'Vl Item Doc' – traz o valor original do documento (3212) , coluna 'Val Item' – Ajusta o valor referente a tabela '1232 - Cadastro de Produtos -  Val. Última Compra (A)' , coluna 'Fator' – ajusta valor referente ao campo '1232 – Cadastro de Produtos - F0', coluna 'Preço Sug'  – Ajusta valor referente a tabela '1232 – Cadastro de Produtos - Preço Sugestão (E)' , coluna 'Preço' – Ajusta o valor referente a '1232 - Cadastro de Produtos - Tabela à Vista'  definida no parâmetro '1111 – Parâmetros Globais Sistema - Aba - Produtos – Tabelas de Preços – Preço a Vista' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/C%C3%A1lculo%20Custo%20-%20Compras%20-%20Nova%20op%C3%A7%C3%A3o%203215/3215_3215.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-33",
    "slug": "descontos_especiais_para_atacado_referencia_por_valor_tabela_a_vista",
    "title": "Descontos especiais para Atacado - Referência por valor - Tabela à Vista",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-19",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": " Ao utilizar o parâmetro em '1111 – Parâmetros Globais Sistema - Aba - Vendas – Procede descontos especiais para Atacado' será possível aplicar descontos de maneira automática ao produto, conforme a quantidade de itens d",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/33/descontos_especiais_para_atacado_referencia_por_valor_tabela_a_vista",
    "content": [
      {
        "type": "p",
        "text": " Ao utilizar o parâmetro em '1111 – Parâmetros Globais Sistema - Aba - Vendas – Procede descontos especiais para Atacado' será possível aplicar descontos de maneira automática ao produto, conforme a quantidade de itens definido em '1232 - Cadastro de Produtos - Aba - Preços - Descontos automáticos nas vendas' que caracterize a venda como 'Atacado' ."
      },
      {
        "type": "p",
        "text": "1111 – Parâmetros Globais Sistema - Aba - Vendas – Procede descontos especiais para Atacado:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Descontos%20especiais%20para%20Atacado%20-%20Refer%C3%AAncia%20por%20valor%20-%20Tabela%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Definir 'Tabela Referência' em '1111 – Parâmetros Globais Sistema - Aba - Produtos – Tabelas de Preços – Preço à Vista – Referência para todas as tabelas' –  Escolhida a tabela 'À Vista',  esta será utilizada como parâmetro para cálculo da porcentagem de desconto aplicado ao produto, quando quantidade do item for caracterizada como venda 'Atacado' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Descontos%20especiais%20para%20Atacado%20-%20Refer%C3%AAncia%20por%20valor%20-%20Tabela%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em '1232 – Cadastro de Produtos - Aba - Preços - Descontos automáticos na vendas' definir 'Quantidade' e  'Valor de Venda' que caracterize a venda como 'Atacado' , o valor de desconto proporcional será calculado quando comparado a tabela 'À Vista - Referência' :"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Descontos%20especiais%20para%20Atacado%20-%20Refer%C3%AAncia%20por%20valor%20-%20Tabela%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Em '75OV/7512 - Cadastro de Orçamentos' valor aplicado na venda quando quantidade do item for caraterizada como 'Atacado' ."
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Descontos%20especiais%20para%20Atacado%20-%20Refer%C3%AAncia%20por%20valor%20-%20Tabela%20",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-30",
    "slug": "importacao_de_tabelas_de_precos_de_produtos",
    "title": "Importação de Tabelas de Preços de Produtos",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-19",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "A função existente em  '1232 – Cadastro de Produtos'  chamada 'Importação de Tabela de Preços de Fornecedores...' , permite importar tabelas de preços com variadas finalidades (venda/compra/custo/rentabilidade/preço míni",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/30/importacao_de_tabelas_de_precos_de_produtos",
    "content": [
      {
        "type": "p",
        "text": "A função existente em  '1232 – Cadastro de Produtos'  chamada 'Importação de Tabela de Preços de Fornecedores...' , permite importar tabelas de preços com variadas finalidades (venda/compra/custo/rentabilidade/preço mínimo/preço sugestão, etc)  através de uma fórmula cadastrada que aponte para a tabela de preço que deseja-se atualizar."
      },
      {
        "type": "p",
        "text": "Em '1111 - Parâmetros Globais Sistema - Aba - Produtos – Tabela de Preço Download –  Escolher uma tabela de preço para que a função seja liberada, apesar de ser possível escolher apenas uma tabela, poderão ser cadastradas diversas 'fórmulas'  direcionando para diferentes tabelas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20de%20tabelas%20de%20pre%C3%A7os%20de%20produtos/1111_import_tab.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em '1232 – Cadastro de Produtos' inserir 'Senha Gerente'  para habilitar o botão 'Importação de Tabela de Preços de Fornecedores'.  "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20de%20tabelas%20de%20pre%C3%A7os%20de%20produtos/1232_import_tab.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de planilha\\tabela a ser importada:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20de%20tabelas%20de%20pre%C3%A7os%20de%20produtos/planilha_import_tab.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na tela 'DTP1 – Importação de Tabelas de Preços'  serão inclusas as  'Fórmula x Planilha de preços' – No programa será configurado a tabela de preço destino e os parâmetros que serão recebidos mediante as colunas da planilha usada na importação, poderão ser cadastradas diversas fórmulas  apontando para diferentes tabelas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20de%20tabelas%20de%20pre%C3%A7os%20de%20produtos/DTP1_import_tab.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "DTP1 – Importação de Tabelas de Preços – Na mesma tela será poderá ser listado uma prévia do que irá ser processado, caso esteja em conformidade pressionar o botão 'Processa' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20de%20tabelas%20de%20pre%C3%A7os%20de%20produtos/DTP1_import_tab_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado o processamento será exibida uma relação dos produtos alterados, antigos e novos valores conforme os parâmetros definidos anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20de%20tabelas%20de%20pre%C3%A7os%20de%20produtos/DTP1_import_tab_3.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-32",
    "slug": "montagem_de_carga_nro._sequencial_entrega",
    "title": "Montagem de Carga - Nro. Sequencial - Entrega",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-19",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Mediante a montagem de carga em '2151 - Acerto de Carga'  é possível inserir uma sequência de entrega dos pedidos que compõem a mesma pelo campo 'Nro. Sequencial' , os relatórios presentes nas opções '2134/2221'  e os pr",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/32/montagem_de_carga_nro._sequencial_entrega",
    "content": [
      {
        "type": "p",
        "text": "Mediante a montagem de carga em '2151 - Acerto de Carga'  é possível inserir uma sequência de entrega dos pedidos que compõem a mesma pelo campo 'Nro. Sequencial' , os relatórios presentes nas opções '2134/2221'  e os próprios para carregamento do grupo '2320 - 2321, 2322, 2323, 2325, 2326 e 2328'  irão imprimir os pedidos na ordem de carregamento sequencial, desde que, utilize-se ordenação por 'Carga'  ou o checkbox 'Quebra por Carga' ."
      },
      {
        "type": "p",
        "text": "2151 – Acerto de Carga - A Task do campo 'Nro. Sequencial'  salta de 10 em 10 para cada pedido inserido na carga, para que eventualmente possam ser encaixados outros pedidos na mesma, criada uma nova carga essa task inicia-se novamente:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Montagem%20de%20Carga%20-%20Nro.%20Sequencial%20-%20Entrega/2151_carga.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Utilizar a ordenação por 'Carga'  ou marcar o checkbox 'Quebra por Carga'  para que os pedidos sejam impressos na ordem sequencial:"
      },
      {
        "type": "p",
        "text": "2134 – Listagem de Pedidos:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Montagem%20de%20Carga%20-%20Nro.%20Sequencial%20-%20Entrega/New_2134_Carga.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2221 – Elaborados de Faturamento/Cliente:"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Montagem%20de%20Carga%20-%20Nro.%20Sequencial%20-%20Entrega/New_2221_Carga.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Relatórios do grupo '2320 – Relatórios de Carregamento' , ordenar por 'Carga'  ou 'Quebra por Carga' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Montagem%20de%20Carga%20-%20Nro.%20Sequencial%20-%20Entrega/2321_carga.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://crm.procion.com/webroot/file_manager/files/Artigos/Montagem%20de%20Carga%20-%20Nro.%20Sequencial%20-%20Entrega/New_2323_Carga.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-26",
    "slug": "_desc._usual_vendas_x_desc._financeiro_",
    "title": "'Desc. Usual Vendas' x 'Desc. Financeiro'",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro",
      "vendas"
    ],
    "updatedAt": "2019-12-18",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Criado novo campo em  '1221 - Cadastro de terceiros - Aba - Clientes - Desconto Usual (itens)'  que visa separar o desconto que será aplicado na venda, do desconto aplicado no financeiro, os parâmetros foram realocados e",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/26/_desc._usual_vendas_x_desc._financeiro_",
    "content": [
      {
        "type": "p",
        "text": "Criado novo campo em  '1221 - Cadastro de terceiros - Aba - Clientes - Desconto Usual (itens)'  que visa separar o desconto que será aplicado na venda, do desconto aplicado no financeiro, os parâmetros foram realocados em '1111 - Parâmetros Globais Sistema - Aba - Terceiros' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Desc.%20Usual%20Vendas%20x%20Desc.%20Financeiro/1111_Desc_Finan.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Desc.%20Usual%20Vendas%20x%20Desc.%20Financeiro/1221_Desc_Finan.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em '1111 – Parâmetros Globais Sistema - Aba - Terceiros – 'Desc. Financeiro': 'S – Sim' ou 'C – Sim com desc. do Cliente'  – Utilizado alguma das duas formas, caso o campo '1221 – Cadastro de Terceiros – Aba - Clientes - Desconto Financeiro'  não possua valor, a origem do desconto financeiro será no próprio cadastro da condição de pagamento em '2111 - Cadastro de Condições de Pagamento' ."
      },
      {
        "type": "p",
        "text": "2111 – Cadastro de Condições de Pagamento – Desconto Financeiro:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Desc.%20Usual%20Vendas%20x%20Desc.%20Financeiro/Desc_financ_2111.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em '1111 – Parâmetros Globais Sistema - Aba - Financeiro – Desconto p/Pgto. Antecipado' – A porcentagem inserida no parâmetro será utilizada como desconto em baixas que serão efetuadas somente pela opção '4213 – Baixas por Cliente'  através do botão 'Acrescer Juros ao valor da baixa' , caso exista juros a ser calculado o valor será apontado, do contrário será utilizado o valor do parâmetro para desconto desde que a baixa esteja sendo realizada anterior ao seu vencimento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Desc.%20Usual%20Vendas%20x%20Desc.%20Financeiro/Desc_Financ_pagto_antecip_1111.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Desc.%20Usual%20Vendas%20x%20Desc.%20Financeiro/Desc_financ_41BC.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-28",
    "slug": "cadastro_de_transacao_checkbox_para_destaque_de_impostos_em_dados_adicionais_icms_icms_st",
    "title": "Cadastro de Transação - Checkbox para destaque de impostos em 'Dados Adicionais' - ICMS/ICMS-ST",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-18",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado em  '2113 - Cadastro Transações'  dois novos checkbox, eles visam dar prioridade ao destaque dos impostos 'ICMS/ICMS-ST'  em 'Dados Adcionais'  na emissão da NFe, situação essa muito utilizada em notas fisca",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/28/cadastro_de_transacao_checkbox_para_destaque_de_impostos_em_dados_adicionais_icms_icms_st",
    "content": [
      {
        "type": "p",
        "text": "Implementado em  '2113 - Cadastro Transações'  dois novos checkbox, eles visam dar prioridade ao destaque dos impostos 'ICMS/ICMS-ST'  em 'Dados Adcionais'  na emissão da NFe, situação essa muito utilizada em notas fiscais de devolução ou emissões realizadas por empresas do regime 'Simples Nacional x RPA'.  No cadastro de pedidos via '2131 - Cadastro de Pedidos'  os checkbox 'Dest. em Dados Adicionais'  presentes 'Detalhamento dos itens'  virão preenchidos, conforme cadastro da transação para todos os itens presentes no pedido."
      },
      {
        "type": "p",
        "text": "2113 – Cadastro de Transações – Novos campos (Checkbox) :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Checkbox%20impostos%20em%20%27Dados%20Adicionais%27%20-%20ICMS%20-%20ICMS-ST/2113_Checkbox_impostos.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 – Cadastro de Pedidos – Aba - Itens - Detalhamento dos itens:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Checkbox%20impostos%20em%20",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-27",
    "slug": "novo_parametro_para_calculo_de_volumes_1112_2131_",
    "title": "Novo Parâmetro para Cálculo de Volumes '1112/2131'",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-18",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Criado novo parâmetro referente ao cálculo de volumes em '1112 – Cadastro de Empresas - Aba - Faturamento – Cálculo de Volumes – P – No Pedido' , será possível definir no pedido em '2131 - Cadastro de Pedidos',  se o cál",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/27/novo_parametro_para_calculo_de_volumes_1112_2131_",
    "content": [
      {
        "type": "p",
        "text": "Criado novo parâmetro referente ao cálculo de volumes em '1112 – Cadastro de Empresas - Aba - Faturamento – Cálculo de Volumes – P – No Pedido' , será possível definir no pedido em '2131 - Cadastro de Pedidos',  se o cálculo de volumes será feito de forma automática ou não. Independentemente do parâmetro utilizado (S – Sim / N – Não / P – No Pedido) o campo 'Peso Bruto'  estará habilitado para que possa ser manipulado."
      },
      {
        "type": "p",
        "text": "Ao utilizar os parâmetros para cálculo automático (S – Sim ou C – Calcular no pedido) os valores referentes a 'Volume'  e 'Peso Líquido'  ficam desabilitados para manipulação, utilizado os parâmetros (N – Não ou N – Não Calcular) os valores serão sugeridos, porém, todos os campos ficarão habilitados para que os valores possam ser alterados."
      },
      {
        "type": "h3",
        "text": "Parâmetro – 1112 – Cadastro de Empresas - Aba - Faturamento – Cálculo Volumes :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20par%C3%A2metro%20para%20c%C3%A1lculo%20de%20volumes/1_1112_calc_volumes.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 – Cadastro de Pedidos - Definição de 'Cálculo Volumes' por Pedido na aba 'Principal’:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20par%C3%A2metro%20para%20c%C3%A1lculo%20de%20volumes/1_2131_calc_volumes.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 – Cadastro de Pedidos - Aba- Complementos  – Os valores que forem alterados mediante o sugerido nos campos 'Qtd. Vol', 'Peso Liq'  e 'Peso Bru'  ficarão na cor 'Amarelo' , será exibido um 'TipText'  descrevendo a situação:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20par%C3%A2metro%20para%20c%C3%A1lculo%20de%20volumes/1_2131_calc_volumes_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Utilizado o parâmetro de 'Múltiplas Embalagens'  e no pedido feito em  '2131 - Cadastro de Pedidos'  usado o recurso, os valores alterados ao calculado automaticamente pelo sistema nos campos 'Volume' , 'Peso Líquido'  e 'Peso Bruto'  não serão acatados, visto que não é possível mensurar a qual item pertence os relativos valores alterados pelo operador."
      },
      {
        "type": "p",
        "text": "1111 – Parâmetros Globais Sistema - Aba - Produtos - Produtos com Múltiplas Embalagens?:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20par%C3%A2metro%20para%20c%C3%A1lculo%20de%20volumes/1_1111_calc_mult_emb.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " Exemplo de pedido feito em '2131 - Cadastro de Pedidos'  utilizando o parâmetro de 'Múltiplas Embalagens' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20par%C3%A2metro%20para%20c%C3%A1lculo%20de%20volumes/1_2131_calc_mult_emb.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2131 - Cadastro de Pedidos - Aba - Complementos – Ao manipular os valores calculados automaticamente pelo sistema, os mesmos não serão acatados, na emissão da nota fiscal será utilizado o valor original conforme o parâmetro utilizado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Novo%20par%C3%A2metro%20para%20c%C3%A1lculo%20de%20volumes/1_2131_calc_mult_emb_2.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-29",
    "slug": "operacao_de_desmontagem_montagem_composicao_de_produtos",
    "title": "Operação de Desmontagem/Montagem - Composição de Produtos",
    "category": "guia",
    "module": "ERP - Produção",
    "tags": [
      "producao"
    ],
    "updatedAt": "2019-12-18",
    "readTime": "3 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado no sistema nova forma de trabalho que visa os processos de 'Desmontagem/Montagem'  de materiais a partir de composição de produtos cadastrados em '5311 – Cadastro de Composição de Produtos'.  O novo processo",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/29/operacao_de_desmontagem_montagem_composicao_de_produtos",
    "content": [
      {
        "type": "p",
        "text": "Implementado no sistema nova forma de trabalho que visa os processos de 'Desmontagem/Montagem'  de materiais a partir de composição de produtos cadastrados em '5311 – Cadastro de Composição de Produtos'.  O novo processo apesar de aparentemente fornecer um resultado em termos de estoque (Baixa M.P/Entrada P.A)  igual ao Módulo Produção (5312/5331/5332/5338) , não oferece o mesmo controle referente a acompanhamento de etapas da produção e respectivos relatórios."
      },
      {
        "type": "p",
        "text": "1111 – Parâmetros Globais Sistema – Aba Estoque/Produção – Processos de Desmontagens/Montagens?"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%A3o%20Desmontagem%20-%20Montagem%20-%20Composi%C3%A7%C3%A3o%20de%20Produtos/1111_mont_desmont.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5311 – Cadastro de Composição de Produtos – Conceito de 'Desmontagem/Montagem' :"
      },
      {
        "type": "p",
        "text": "Na tela '5311 - Cadastro de Composição de Produtos'  foi criado o novo campo 'Tipo' , nele será apontado a característica da composição de materiais (Normal/Montagem/Desmontagem) ."
      },
      {
        "type": "p",
        "text": "O conceito de 'Montagem'  baseia-se na forma de produto final acabado (P.A) , ou seja, o produto 'Principal' (No topo da tela) é resultado da soma dos demais itens e quantidades presentes na grid abaixo, como podemos ver na figura, o item 'LEITE UTH SEMI-DESNATADO'  ao final do processo entra no estoque enquanto os seus componentes saem do estoque ao finalizar o procedimento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%A3o%20Desmontagem%20-%20Montagem%20-%20Composi%C3%A7%C3%A3o%20de%20Produtos/5311_mont_desmont.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O Conceito de 'Desmontagem'  é a forma inversa, o produto 'Principal' (No topo da tela) é a matéria prima e os itens da grid são resultado do seu processamento ou desmontagem, tendo como exemplo a figura abaixo, o item 'SUCATA RECICLÁVEL'  sai do estoque enquanto os itens 'ALUMINIO' , 'FERRO' , 'ZINCO'  e 'VIDRO'  entram no estoque com suas respectivas quantidades."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%A3o%20Desmontagem%20-%20Montagem%20-%20Composi%C3%A7%C3%A3o%20de%20Produtos/5311_mont_desmont_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "5311 – Cadastro de Composição de Produtos - 'Desmontagem/Montagem' + 'E' + 'OU' :"
      },
      {
        "type": "p",
        "text": "Desmontagem/Montagem 'E' – Realiza o processo pela 'entrada/saída'  de 'produtos/itens'  presentes na totalidade de sua composição, ou seja, pressupõe-se realmente que na 'Desmontagem/Montagem'  todos os itens relacionados terão participação no processo;"
      },
      {
        "type": "p",
        "text": "Desmonstagem/Montagem 'OU' – Relaciona os 'produtos/itens'  que podem  ser utilizados e/ou produzidos no processo de 'Desmontagem/Montagem'  de materiais, sendo assim os itens da grid podem ser exclusos ou trocados nos lançamentos realizados pela tela '5316 - Desmontagem' ."
      },
      {
        "type": "p",
        "text": "5316 – Desmontagem – Mediante os cadastros da opção '5311 - Cadastro de Composição de Produtos' , na tela '5316 – Desmontagem'  serão feitos os movimentos de estoque conforme os conceitos explicados acima, ao incluir os lançamentos poderão ser alteradas informações referentes a estoque, seção/sub-seção, lote/validade conforme necessidade, inclusive as quantidades calculadas automaticamente, ao final do processo será impresso um relatório com os movimentos gerados:"
      },
      {
        "type": "h3",
        "text": "Exemplo de lançamento de 'Desmontagem':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%A3o%20Desmontagem%20-%20Montagem%20-%20Composi%C3%A7%C3%A3o%20de%20Produtos/5316_mont_desmont.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Relatório exibido ao final do processo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Opera%C3%A7%C3%A3o%20Desmontagem%20-%20Montagem%20-%20Composi%C3%A7%C3%A3o%20de%20Produtos/5316_mont_desmont_rel.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-24",
    "slug": "agrupamento_por_grupo_de_locais_relatorios",
    "title": "Agrupamento por 'Grupo de Locais' - Relatórios",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro"
    ],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado o agrupamento por 'Grupo de Bancos/Locais', afim de emitir relatórios financeiros que apresentem o resultado referente a um grupo empresarial, o filtro pelo intervalo 'Grupo Locais'  foi inserido nas opções ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/24/agrupamento_por_grupo_de_locais_relatorios",
    "content": [
      {
        "type": "p",
        "text": "Implementado o agrupamento por 'Grupo de Bancos/Locais', afim de emitir relatórios financeiros que apresentem o resultado referente a um grupo empresarial, o filtro pelo intervalo 'Grupo Locais'  foi inserido nas opções '4410 – Elaborados de Fluxo de Caixa'  e '4437 – Posição Diária do Ativo'."
      },
      {
        "type": "p",
        "text": "1271 – Cadastro de Bancos/Locais :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Agrupamento%20Por%20Grupo%20de%20Locais/1271_agrupamento_locais.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4410 – Elaborados de Fluxo de Caixa:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Agrupamento%20Por%20Grupo%20de%20Locais/4410_agrupamento_locais.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "4437 – Posição Diária do Ativo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Agrupamento%20Por%20Grupo%20de%20Locais/4437_agrupamento_locais.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-16",
    "slug": "codigo_servico_multiplos_codigos_atividades",
    "title": "Código Serviço - Múltiplos Códigos Atividades",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "É possível vincular um 'Código de serviço'  a mais de um 'Código de atividade' , na opção '1246 - Complemento de Serviços' foi criado o campo referente ao 'Sub-Código'  do serviço, a impressão da descrição do serviço ser",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/16/codigo_servico_multiplos_codigos_atividades",
    "content": [
      {
        "type": "p",
        "text": "É possível vincular um 'Código de serviço'  a mais de um 'Código de atividade' , na opção '1246 - Complemento de Serviços' foi criado o campo referente ao 'Sub-Código'  do serviço, a impressão da descrição do serviço será sempre o do código principal conforme figuras abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cod_Servi_%20Multiplos%20codigos%20Atividades/1246_cod_serv_1.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cod_Servi_%20Multiplos%20codigos%20Atividades/1246_cod_serv_2.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Uma vez realizado o ajuste, vincular o código do serviço a  '2113 - Cadastro de Transações' respectivo para emissão da Nota Fiscal de Serviços. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Cod_Servi_%20Multiplos%20codigos%20Atividades/2113_Cod_Serv.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      }
    ]
  },
  {
    "id": "AP-23",
    "slug": "consignacoes_gerando_previsoes_contas_a_receber",
    "title": "Consignações gerando 'Previsões' - Contas a receber",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro"
    ],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Criado novo parâmetro que possibilita a partir do processamento das consignações, gerar previsões de recebimento referente aos documentos consignados. O documento criado terá a sigla 'CG'  e seus dados não serão alteráve",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/23/consignacoes_gerando_previsoes_contas_a_receber",
    "content": [
      {
        "type": "p",
        "text": "Criado novo parâmetro que possibilita a partir do processamento das consignações, gerar previsões de recebimento referente aos documentos consignados. O documento criado terá a sigla 'CG'  e seus dados não serão alteráveis pela opção ' 4211 – Títulos - Contas à Receber' , seu vencimento será sempre o último dia do mês da emissão do documento. Conforme as devoluções de consignação são efetuadas o respectivo valor do produto é abatido da previsão parcial e total, após o faturamento da consignação esse documento torna-se um título de recebimento padrão (NF, NP, DP, etc..) com vencimento definido conforme a condição de pagamento escolhida, após o procedimento o 'CG'  desaparece, segue abaixo o parâmetro:"
      },
      {
        "type": "p",
        "text": "1112 – Cadastro de Empresas – Aba – Ativo/Financeiro - Inclui Consignações no Contas a Receber?"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%B5es%20gerando%20previs%C3%B5es%20-%20Contas%20a%20receber/1112_CG.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Exemplo de filtro de documento previsão de consignação  'CG'  e relatório a partir da  '4222 – Elaborados de Contas a Receber':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%B5es%20gerando%20previs%C3%B5es%20-%20Contas%20a%20receber/4222_CG.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Consigna%C3%A7%C3%B5es%20gerando%20previs%C3%B5es%20-%20Contas%20a%20receber/4222_Rel_CG.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-18",
    "slug": "erro_comissionamento_emissao_de_vendas_via_7512_75ov_",
    "title": "Erro - Comissionamento - Emissão de Vendas via '7512/75OV'",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro",
      "vendas"
    ],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "- Clientes que realizam vendas via '7512/75OV - Cadastro de Orçamentos'  utilizar o parâmetro abaixo, evitará problemas de comissionamento quando realizado a troca de representantes dentro do pedido.",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/18/erro_comissionamento_emissao_de_vendas_via_7512_75ov_",
    "content": [
      {
        "type": "p",
        "text": "- Clientes que realizam vendas via '7512/75OV - Cadastro de Orçamentos'  utilizar o parâmetro abaixo, evitará problemas de comissionamento quando realizado a troca de representantes dentro do pedido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Erros_Ajuda/Erro_Comission_75ov_Rus_2/75OV_erro_comssiona_rus_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-17",
    "slug": "erro_sat_comunicacao_epson_gersat_",
    "title": "Erro - SAT - Comunicação 'Epson/Gersat'",
    "category": "erros",
    "module": "Portal do Cliente",
    "tags": [
      "erro"
    ],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Aparentemente as novas versões do SAT para 'Epson/Gersat'  não está gerando um arquivo na validação necessário para o funcionamento junto ao 'Hádron' , ao plugar o usb do aparelho no computador será criada uma porta 'COM",
    "sourceUrl": "https://ajuda.procion.com/artigo/erros_correcoes/17/erro_sat_comunicacao_epson_gersat_",
    "content": [
      {
        "type": "p",
        "text": "Aparentemente as novas versões do SAT para 'Epson/Gersat'  não está gerando um arquivo na validação necessário para o funcionamento junto ao 'Hádron' , ao plugar o usb do aparelho no computador será criada uma porta 'COM'  virtual, inserir o número da mesma no arquivo 'GerSat.conf'  ao editá-lo e colar o arquivo na pasta do terminal 'Hádron'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Erros_Ajuda/Erro_Comunic_SAT_Gersat/Erro_SAT_Epson_Gersat.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-20",
    "slug": "exibir_formulacao_de_produtos_em_danfe_nfe",
    "title": "Exibir 'Formulação de Produtos' em Danfe/NFe",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Criado parâmetro na opção  '1111 - Parâmetros Globais Sistema - Aba - Produtos - Exibe Formulação NFe?'  que permite realizar a impressão da composição de produtos em  'Dados Adicionais'  na NFe.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/20/exibir_formulacao_de_produtos_em_danfe_nfe",
    "content": [
      {
        "type": "p",
        "text": "Criado parâmetro na opção  '1111 - Parâmetros Globais Sistema - Aba - Produtos - Exibe Formulação NFe?'  que permite realizar a impressão da composição de produtos em  'Dados Adicionais'  na NFe."
      },
      {
        "type": "h3",
        "text": "Utilizar em conjunto os dois parâmetros marcados abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Imprimir%20Formula%C3%A7%C3%A3o_Danfe_Dados_Adicionais/Formulac_dados_Nfe_1111.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Opção  '1232 - Cadastro de Produtos'  aba  'Complementos'  campo  'Formulação de Produtos: 2 - Produtos COM Formulações por Composição':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Imprimir%20Formula%C3%A7%C3%A3o_Danfe_Dados_Adicionais/Formulac_dados_Nfe_1232.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Impressão dos produtos  'Principal/Composição'  na NFe:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Imprimir%20Formula%C3%A7%C3%A3o_Danfe_Dados_Adicionais/1_Formulac_dados_Nfe_danfe_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Imprimir%20Formula%C3%A7%C3%A3o_Danfe_Dados_Adicionais/1_Formulac_dados_Nfe_danfe_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-19",
    "slug": "geracao_do_arquivo_per_dcomp_ressarcimento_ipi",
    "title": "Geração do arquivo 'PER/DCOMP' - Ressarcimento IPI",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "A sigla 'PER/DCOMP' significa pedido eletrônico de ressarcimento ou restituição e declaração de compensação. Tem como principal função a restituição e a compensação de quantias recolhidas a maior.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/19/geracao_do_arquivo_per_dcomp_ressarcimento_ipi",
    "content": [
      {
        "type": "h3",
        "text": "Orientações referente a opção '7175 - Geração do arquivo 'PER/DCOMP’:"
      },
      {
        "type": "p",
        "text": "A sigla 'PER/DCOMP' significa pedido eletrônico de ressarcimento ou restituição e declaração de compensação. Tem como principal função a restituição e a compensação de quantias recolhidas a maior."
      },
      {
        "type": "h3",
        "text": "Aquivo é criado com os dados do sistema baseado na apuração do IPI, 5 tipos de registros existem:"
      },
      {
        "type": "h3",
        "text": "R11 - Consolidado de NF entradas por cfop (se base calculo >0 e valor IPI =0 o registro é ignorado);"
      },
      {
        "type": "h3",
        "text": "R12 - Consolidado de NF saidas por cfop (se base calculo >0 e valor IPI =0 o registro é ignorado);"
      },
      {
        "type": "h3",
        "text": "R13 - NF de entradas (apenas NF que tenha imposto IPI creditado);"
      },
      {
        "type": "h3",
        "text": "R15 - NF de créditos extemporâneos;"
      },
      {
        "type": "p",
        "text": "R21 - Consolidado dos dados do livro registro de apuração do IPI, o arquivo será utilizado no sistema do da receita federal 'PER/DCOMP' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/PERDCOMP/7175_PERDCOMP.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-25",
    "slug": "hadron_v12_associar_audio_a_mensagem_do_sistema",
    "title": "Hádron V12 - Associar 'Áudio' a mensagem do sistema",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado o vínculo de áudios/sons a mensagens do sistema ao exibi - las, no runtime do terminal foi criado a pasta 'SOUNDS' , nela estão nove tipos de sons padrão que poderão ser associados aos códigos de cada mensag",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/25/hadron_v12_associar_audio_a_mensagem_do_sistema",
    "content": [
      {
        "type": "p",
        "text": "Implementado o vínculo de áudios/sons a mensagens do sistema ao exibi - las, no runtime do terminal foi criado a pasta 'SOUNDS' , nela estão nove tipos de sons padrão que poderão ser associados aos códigos de cada mensagem."
      },
      {
        "type": "h3",
        "text": "Pasta ' SOUNDS'  presente no runtime:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Associar%20%27SOM%27%20a%20mensagem%20do%20sistema/Sound_1_pasta.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Acesso ao cadastro de mensagens no sistema:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Associar%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Na tela 'PMNH - Cadastro de Mensagens'  será feita a associação entre a mensagem e o som correspondente:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Associar%20",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Originalmente a idéia da criação do som associado a mensagem foi para o 'RIBO – Gerenciamento de Depósitos/Expedições' , caso houvesse alguma inconsistência na conferência do pedido, seria emitido um som com a finalidade de avisar o conferente, porém, a função poderá ser aplicada a qualquer mensagem/opção do sistema."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Associar%20",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-21",
    "slug": "retorno_de_remessa_bancaria_carteira_desconto_",
    "title": "Retorno de Remessa Bancária - Carteira 'Desconto'",
    "category": "guia",
    "module": "ERP - Financeiro",
    "tags": [
      "financeiro"
    ],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Realizado o ajuste na baixa de remessa de títulos bancários para carteira tipo  'Desconto' , ao efetuar a baixa do arquivo da remessa de retorno enviado pelo banco, o sistema ao identificar a ocorrência  'Baixa com trans",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/21/retorno_de_remessa_bancaria_carteira_desconto_",
    "content": [
      {
        "type": "p",
        "text": "Realizado o ajuste na baixa de remessa de títulos bancários para carteira tipo  'Desconto' , ao efetuar a baixa do arquivo da remessa de retorno enviado pelo banco, o sistema ao identificar a ocorrência  'Baixa com transferência para Desconto'  não efetuará a baixa do título, sua modalidade será alterada em  '4211 - Títulos - Contas à Receber'  de 'C – Cobrança'  para 'D – Desconto' . Dessa forma será possível através de relatórios analisar os títulos que estão na carteira tipo 'Desconto'  e, transferí-los para um outro local que armazene recebíveis nessa situação pela opção '4214 – Envio de Títulos' ."
      },
      {
        "type": "h3",
        "text": "OBS: Esse tratamento está condicionado a sigla do cliente, aqueles que tiverem a necessidade do controle, por favor, solicitar."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Retorno%20Remessa_Cart_Desconto/4286_Cart_Desc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Retorno%20Remessa_Cart_Desconto/4211_Cart_Desc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "???????"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-22",
    "slug": "troca_de_terceiro_em_documento_consignado_",
    "title": "Troca de Terceiro em Documento 'Consignado'",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-17",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Implementado a troca do terceiro referente a um documento 'Consignado' , a ação será possível através do parâmetro inserido em  'RUS2 - ParâmetrosEspeciais Faturamento - Aba - Orçamentos - Permite Alterar o Código do Ter",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/22/troca_de_terceiro_em_documento_consignado_",
    "content": [
      {
        "type": "p",
        "text": "Implementado a troca do terceiro referente a um documento 'Consignado' , a ação será possível através do parâmetro inserido em  'RUS2 - ParâmetrosEspeciais Faturamento - Aba - Orçamentos - Permite Alterar o Código do Terceiro na Consignação?'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Troca_Terceiro_Consignado/RUS2_Troca_Consignado.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após a liberação do parâmetro, para efetuar a troca do terceiro em documento 'Consignado' , clicar no botão 'Manutenção de Consignações' :"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Troca_Terceiro_Consignado/1_75OV_Troca_Consignado.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após a liberação do parâmetro, para efetuar a troca do terceiro, caso possua um boleto de 'Devolução de Consignação' , será necessário primeiro efetuar o processamento do mesmo, do contrário será exibida a mensagem abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Troca_Terceiro_Consignado/MSG_75Ov_Troca_Consignado.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado a troca do terceiro no documento consignado, será exibida a mensagem abaixo, porém, os valores não serão alterados, será mantido o valor do produto processado na consignação:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Troca_Terceiro_Consignado/75OV_Troca_Consignado_2.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-14",
    "slug": "esocial_primeira_fase_de_implantacao",
    "title": "eSocial Primeira Fase de Implantação",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-16",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "A primeira ação será a de mapear as empresas matriz e filial, conforme o cadastro na opção '1112 - Cadastro de Empresas' deverá ser feito alguns ajustes e verificações, para facilitar essa identificação, na opção '1131 -",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/14/esocial_primeira_fase_de_implantacao",
    "content": [
      {
        "type": "p",
        "text": "A primeira ação será a de mapear as empresas matriz e filial, conforme o cadastro na opção '1112 - Cadastro de Empresas' deverá ser feito alguns ajustes e verificações, para facilitar essa identificação, na opção '1131 - Listagem de Empresas'  é possível relacionar qual empresa é a matriz e qual são suas filiais."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/esocial_1131_rel.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Feita a identificação das empresas deve-se realizar os seguintes acertos na empresa Matriz:"
      },
      {
        "type": "p",
        "text": "- Na aba 'Responsabilidade'  verificar os dados cadastrais dos responsáveis 1 e 4 (CPF, dados para contato) , o acerto deve-se proceder pela opção '1221 - Cadastro de Terceiros' ."
      },
      {
        "type": "h3",
        "text": "Obs: Referente ao número do telefone presente no cadastro, retirar os traços, deverá ficar a máscara '999999999' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/1_esocial_1112_matriz_filial_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "- Na aba 'Folha de Pagamento'  verificar o ambiente do eSocial (1 – Produção/ 2 – Produção Restrita) e a natureza jurídica referente ao campo 'Dados Rais'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/esocial_1112_matriz_filial_3.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs: Utilizado 'Ambiente – Produção Restrita'   (teste) , fazê-lo numa cópia da base de dados original do sistema, para que não haja conflitos das informações transmitidas em ambiente de teste com o ambiente de produção. A alteração do ambiente do eSocial ficará disponível somente mediante senha 'Prócion' ."
      },
      {
        "type": "p",
        "text": "Nas empresas filiais deve-se apontar na aba 'Principal'  campo 'Empresa Matriz'  o código de cadastro da empresa matriz (inclusive na própria empresa matriz) ;"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/esocial_1112_matriz_filial_1.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado os ajustes referentes aos cadastros da empresas matriz e filial deve-se proceder a 'Definição do E-Social do Usuário' , cadastro esse que será feito somente para a empresa matriz."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E112_Tela_1.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E_Def_eSocial.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Caso tenha-se alterado no cadastro da empresa (1112) dados referentes a 'Natureza Jurídica', 'Razão Social', 'CNAE' e 'Dados dos Responsáveis 1 e 4'  após o primeiro envio, deve-se marcar o checkbox 'Confirmar Informações alterados na Empresa?'  para atualização das informações cadastrais."
      },
      {
        "type": "h3",
        "text": "Deve-se realizar o cadastro dos 'Processos'  conforme a necessidade, os mesmo serão usados para vínculos em registros posteriores."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E124_Cad_Proces.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Realizar o cadastro de estabelecimentos para todas as empresas matriz e filial."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E121_Cad_Estabel.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para cada 'FPAS/Terceiros'  existente deve-se efetuar o cadastro do mesmo, vinculando o código do processo caso exista a necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E122_Cad_Lot.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " Efetuar o cadastro dos sindicatos conforme a necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E125_Cad_Sind.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Cadastrar 'Rubrica'  com suspensão de incidência vinculada ao respectivo processo caso exista necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E126_Cad_Rub_Proces.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Através dessa tela serão importados da folha Progest os cadastros de 'Trabalhadores + Dependentes', 'Ocorrências', 'Turnos/Jornada' e 'Cargos'."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E119_Convert.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Realizada a conversão será apresentado um relatório referente aos dados importados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E119_Result.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs: Após a conversão e importação dos dados, a Folha Progest ficará funcionando em paralelo com o sistema Hádron para envio do eSocial , todos os ajustes e inclusões realizados no Hádron deverão ser realizados no Progest e vice-versa, para que não ocorram divergências de informações na futura unificação da folha, nem corra-se o risco da informação inserida no Progest não ser transmitida para o eSocial ."
      },
      {
        "type": "h3",
        "text": "Verificar 'Cargos'  importados e criar novos caso exista necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E131_Cad_Cargos_Empr_Public.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Caso exista a necessidade efetuar o cadastro de carreiras públicas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E132_Cad_Carreira_Public.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Verificar a jornadas de trabalho importadas e criar novas caso exista necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E141_Cad_Jorn_Trab.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Verificar 'Turnos'  importados e criar novos caso exista necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E142_Cad_Turnos.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Uma vez realizado o envio de um evento, ao alterá-lo ou retificá-lo deve-se indicar a operação. Ao acessar o registro já enviado aparecerá no rodapé da tela:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/Alter_Retific.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Caso alguma informação tenha sido enviada de maneira incorreta, optar pela 'Retificação' , ao escolhê-la as datas referentes a validade não são habilitadas, pois, é uma correção referente a um evento enviado anteriormente. Caso seja realmente uma mudança válida a partir de um determinado 'Mês/Ano' , por exemplo, a classificação tributária ou situação do contribuinte, deve-se optar pela 'Alteração' . Nesse caso serão habilitados os campos referentes as datas de validade para que seja informado o mês/ano que iniciará a nova situação vigente."
      },
      {
        "type": "p",
        "text": "Essa opção visa a transmissão dos eventos relativos ao eSocial , é possível através desse programa a correção, a consulta e o desfazimento das inclusões/alterações realizadas."
      },
      {
        "type": "p",
        "text": "A exportação do certificado para a finalidade de transmissão de eventos relacionados ao eSocial possui duas particularidades, atentar-se as marcações relacionadas abaixo:"
      },
      {
        "type": "p",
        "text": "1º - Assinalar 'Exportar todas as propriedades estendidas':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/cert_export_1.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "2º - Escolher 'Criptografia – AES256-SHA256':"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/cert_export_2.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado todos os ajustes e cadastros, como última ação deve-se processar o envio das informações, ao acessar a opção  'E511 - Transmissão de Eventos do eSocial' será feita uma carga inicial com todos os eventos cadastrados/alterados anteriormente, os que estiverem aptos para transmissão ficarão em 'Preparados' , os que possuírem erros ou necessitarem primeiramente do envio do evento “mãe” ficarão em 'Pendentes' , por exemplo, na figura abaixo o evento 'S-1000'  está em pronto para envio, o evento '1010'  ficará somente habilitado quando seu evento \"mãe\" (S-1000) for transmitido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E511_Env_1.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em ambas as situações 'Pendentes/Preparados'  ao clicar com botão direito sobre o evento, aparecerá a opção de verificar o que foi feito e realizar alguma alteração ou desfazer o que foi realizado. Em 'Preparados'  ao selecionar o evento e posteriormente no botão 'Confirma'  o mesmo ficará disponível para 'Processamento/Envio' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E511_Env_2.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Na parte inferior do canto esquerdo da tela é possível selecionar o certificado da empresa em que estão sendo enviados os eventos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E511_Cert.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "No canto superior direito da tela é possível gerar um relatório e visualizar o erro referente aos eventos não enviados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E511_Rel_erro.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E511_Rel_erro_result.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Através da tela 'E512 - Listagem de Histórico de Eventos'  é possível relacionar o histórico referente aos eventos, podendo filtrar por período  (geração/transmissão/processamento) ou tabela(s) conforme necessidade."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E512_Rel.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Visando a segunda fase de implantação do eSocial prevista para setembro de 2018 , após a importação dos dados da Folha Progest, efetuar os ajustes necessários no cadastro de trabalhadores no sistema Hádron."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/eSocial_primeira_fase/E211_Cad_Trabalh.bmp",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-15",
    "slug": "modulo_pro_leite",
    "title": "Módulo Pro Leite",
    "category": "guia",
    "module": "ERP - Compras",
    "tags": [],
    "updatedAt": "2019-12-16",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "Não existe nenhum parâmetro específico referente ao módulo Pró-Leite , porém, são necessárias a configurações nas opções '1111/1112' para a emissão da NFe que encerra todo o processo referente ao módulo.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/15/modulo_pro_leite",
    "content": [
      {
        "type": "p",
        "text": "Não existe nenhum parâmetro específico referente ao módulo Pró-Leite , porém, são necessárias a configurações nas opções '1111/1112' para a emissão da NFe que encerra todo o processo referente ao módulo."
      },
      {
        "type": "p",
        "text": "3411 – Cadastro de Fornecedores"
      },
      {
        "type": "p",
        "text": "O cadastro de fornecedor de leite será realizado após o prévio cadastro do terceiro '1221' , nessa inclusão será feita a busca do terceiro cadastrado e adicionado informações extras que podem ser usadas dentro dos processos no módulo Pró-Leite ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3411_Fornec.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Essa tela cria os ‘Postos’, ‘Linhas’ e associa os ‘Fornecedores’ aos ‘Postos/Linhas’ , ‘Posto’ pode ser interpretado como uma região macro, por exemplo, um bairro rural."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3412_Posto.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Já a ‘Linha’ refere-se a quem irá transportar o leite nesse trajeto, deverá estar associado a um código de terceiro ‘Transportadora’ ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3412_linha.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Já a ‘Seqüencia’ refere-se ao ‘Fornecedor’ , ou seja, quem produz o leite, que deverá estar previamente cadastrado '3411' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3412_sequenc.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Dentro desse contexto temos:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/posto_linhas_seqs.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "No bairro ‘Arace Sto Antonio’ a ‘Transportadora Leite’ coletará leite dos fornecedores ‘Fornecedor Leite B’ e ‘Fornecedor Leite A’ ."
      },
      {
        "type": "p",
        "text": "O cadastro do item pode ser comparado a uma verba dentro de uma folha de pagamento, porém, com uma quantidade limitada de tipos de natureza disponíveis com o qual o módulo trabalha, elas podem possuir característica de ‘Provento’ ou ‘Desconto’ , quando assinalada a checkbox ‘Principal’ esse item será levado automaticamente ao cadastro mestre da folha de pagamento."
      },
      {
        "type": "p",
        "text": "Naturezas tipo  ‘Provento’ devem obrigatoriamente estar associadas a um cadastro de um produto \"Leite\" na opção  '1232' , cada qual com sua característica, por exemplo, ‘Produto Leite C’ ou ‘Produto Leite B’ . Na aba ‘Preço’ será definido o valor desse produto a respectiva tabela (0, 1, 2, 3, 4, 5, 6, 7, 8, 9) , esse valor mediante ao lançamento do leite '3423'  será levado ao cálculo da folha de pagamento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3413_1.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Obs: Na natureza ’24 – Incentivo ICMS - MG’ usada no estado de Minas Gerais é necessário que o produto vinculado possua em seu cadastro no campo ‘Tipo’ o valor ‘99- Outras’ e no campo ‘Unidade’ o valor ‘I$’ além do ‘Fator’ correspondente ao incentivo."
      },
      {
        "type": "p",
        "text": "Naturezas com característica de ‘Desconto’ devem obrigatoriamente estar associadas a um ‘Fator’ , valor esse que será usado para descontar valores no cálculo da folha de pagamento. Por exemplo, na natureza ’15 – INSS’ com desconto de ‘2,3%’ , no campo ‘Fator’ inserir o valor ‘0,023’ , como podemos ver abaixo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3413_1_desc.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A '34FN' acionada através do botão ‘Fórmulas de Tabelas de Preços’ é o cadastro aonde são definidos fórmulas de preço a partir de naturezas, para que os itens da natureza, no momento do cálculo da folha tenham o preço variado de acordo com as condições definidas neste cadastro. No exemplo abaixo a natureza ’06 – Leite C’ terá uma acréscimo de ‘1,50%’ a partir do dia 15 e ‘1,75%’ a partir do dia 25 tendo como base o valor definido na aba ‘Preços’ opção  '3413' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/34FN.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3413_2.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Pode-se associar itens específicos para um determinado fornecedor de acordo com o ‘Posto/Linha’ e o tipo de folha."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3414.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3423/34PL – Fornecimento Diário de Leite e Lançamento Diário de Fornecimento por Linha"
      },
      {
        "type": "p",
        "text": "Através da tela ‘Fornecimento Diário de Leite’ é possível inserir toda a coleta de um mês referente a um ‘Terceiro x Posto/Linha x Item’ , lançamento esse que será base para o cálculo da folha de pagamento para o fornecedor."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3423.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Também é possível através da tela ‘34PL’ incluir as quantidades de leite fornecido para todos os fornecedores do ‘Posto/Linha’ determinado em um dia específico."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/34PL.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizada a coleta é possível oferecer um “bônus” referente a algum padrão de qualidade pré-definido atingido, esse lançamento obrigatoriamente deve-se estar atrelado a um item que possua a natureza ’75 - Prêmio Qualidade’ ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3426.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "É a tela aonde serão criadas as ‘Folhas Mestre de Leite’ para cálculo da folha de pagamento a fornecedores."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3431_1.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Realizado o cadastro mestre da folha deve-se efetuar o cálculo da mesma."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3431_Calc.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Após o cálculo da folha será apresentado o resultado com os valores praticados referente aos fornecedores."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/Result_folha.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Durante o processo do cálculo, as naturezas possuem as seguintes características:"
      },
      {
        "type": "p",
        "text": "04 – Leite B – Preço – Possui tabela de preços;"
      },
      {
        "type": "p",
        "text": "06 – Leite C – Preço – Possui tabela de preços;"
      },
      {
        "type": "p",
        "text": "15 – INSS – Fator – Fator calculado em cima da base acumulada de INSS composta por proventos que possuem/acumulam INSS;"
      },
      {
        "type": "p",
        "text": "16 – Frete – Preço – Possui tabela de preços, é multiplicado na quantidade de leite fornecido;"
      },
      {
        "type": "p",
        "text": "20 – SENAR – Fator – Fator calculado em cima da mesma base do INSS;"
      },
      {
        "type": "p",
        "text": "24 – Incentivo ICMS/MG – Fator - Fator calculado base de ICMS;"
      },
      {
        "type": "p",
        "text": "61 – Incentivo Leite B – Preço – Possui tabela de preços, é multiplicado pela quantidade de leite B fornecido;"
      },
      {
        "type": "p",
        "text": "62 – Incentivo Leite C – Preço – Possui tabela de preços, é multiplicado pela quantidade de leite C fornecido;"
      },
      {
        "type": "p",
        "text": "63 – Desconto Leite B – Preço – Possui tabela de preços. É multiplicado pela quantidade de leite B fornecido;"
      },
      {
        "type": "p",
        "text": "64 – Desconto Leite C – Preço – Possui tabela de preços. É multiplicado pela quantidade de leite C fornecido;"
      },
      {
        "type": "p",
        "text": "71 – Desconto C.C – Item reservado para descontos de conta corrente;"
      },
      {
        "type": "h3",
        "text": "Nessa tela poderão ser efetuadas alterações no cálculo da folha previamente calculada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3432.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Cadastro aonde serão incluídos itens de conta corrente para que sejam abatidos do valor total da folha do fornecedor, pode-se realizar uma inclusão manual do valor ou importar o título do contas à receber através do botão ‘34CR’ ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/34CR.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3433.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Realizado o cálculo da folha e inclusos o itens de conta corrente deve-se efetuar o fechamento da folha."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3434.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao final de todo o processo deve-se gerar o pedido para emissão da nota fiscal de compra referente a toda coleta de leite e valores praticados no período, inserir a transação e respectivas tributações para a geração do pedido."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3451.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3451_msg.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao final de todo o processo alterar o número do pedido gerado na opção ‘2131 - Cadastro de Pedidos’ para efetuar a emissão da nota fiscal eletrônica."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Pro%20Leite/3451_Result.bmp",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-12",
    "slug": "emissao_de_faturas",
    "title": "Emissão de Faturas",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-13",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "Ao acessar a opção '1111 - Parâmetros Globais Sistema - Aba - Financeiro - Emissão de Fatura'  estarão disponíveis as seguintes configurações:",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/12/emissao_de_faturas",
    "content": [
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/1111_parametros.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Ao acessar a opção '1111 - Parâmetros Globais Sistema - Aba - Financeiro - Emissão de Fatura'  estarão disponíveis as seguintes configurações:"
      },
      {
        "type": "h3",
        "text": "N – Não emite Faturas – Não trabalha com a emissão de faturas;"
      },
      {
        "type": "p",
        "text": "S – Gera faturas das notas do dia – Gerará faturas referente as notas fiscais emitidas no dia através da opção '2340 - Fechamento Diário' , desde que na opção '2111 - Cadastro de Condições de Pagamento'  possua no campo 'Tipo Plano'  o valor 'M' ;"
      },
      {
        "type": "p",
        "text": "M – Monta fats p/geração posterior – Todas as condições de pagamento são tratadas como 'Fatura' , qualquer condição de pagamento que não tenha em seu cadastro em '2111 - Cadastro de Condições de Pagamento'  o valor 'M'  no campo 'Tipo Plano'  não gerará financeiro algum;"
      },
      {
        "type": "p",
        "text": "X – Gera/monta fat so na matriz – Todas as condições de pagamento são tratadas como 'Fatura' , qualquer condição de pagamento que não tenha em seu cadastro em '2111 - Cadastro de Condições de Pagamento'  o valor 'M'  no campo 'Tipo Plano'  não gerará financeiro algum, porém, este processo só pode ser realizado pela empresa matriz conforme cadastro em '1112 - Cadastro de Empresas - Aba - Principal' ;"
      },
      {
        "type": "p",
        "text": "C – Gera duplic conforme cliente – Todo faturamento gerará fatura desde que no cadastro da condição de pagamento em '2111 - Cadastro de Condições de Pagamento'  possua o valor 'M'  no campo 'Tipo Plano' , para criar a exceção e gerar duplicata utilizando as mesmas condições de pagamento, é necessário que no cadastro do cliente (1221  - Cadastro de Terceiros)  possua no campo 'Forma Faturamento'  o valor 'D – Duplicata' ;"
      },
      {
        "type": "p",
        "text": "F – Monta fatura conforme cliente - Todas as condições de pagamento que possuírem em seu cadastro em '2111 - Cadastro de Condições de Pagamento'  o valor 'M'  no campo 'Tipo Plano' , realizado o faturamento, as notas fiscais ficarão disponíveis para montagem da fatura em '2163 - Montagem de Faturas'  desde que, no cadastro do cliente (1221 - Cadastro de Terceiros)  esteja no campo 'Forma Faturamento'  o valor 'F – Fatura' ;"
      },
      {
        "type": "p",
        "text": "P – Monta fat p/cond.pagto tipo 'M'  – Todas as condições de pagamento que possuírem em seu cadastro em '2111 - Cadastro de Condições de Pagamento'  o valor 'M'  no campo 'Tipo Plano' , realizado o faturamento, as notas fiscais ficarão disponíveis para montagem da fatura em '2163 - Montagem de Faturas'."
      },
      {
        "type": "p",
        "text": "Mediante as condições descritas acima devido aos parâmetros, o apontamento de uso de fatura/duplicata faz-se no cadastro do cliente em '1221 - Cadastro de Terceiros - Aba - Clientes - Forma Faturamento' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/1221.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "As condições de pagamento que emitirem faturas deverão no campo 'Tipo Plano'  possuir o valor 'M'  ou 'F' . O Valor 'M'  é mediante a montagem de faturas através da opção '2163 - Montagem de Faturas'  para posterior emissão na opção '2164 - Cadastro de Faturas' , o valor 'F'  é usado quando o cliente não utiliza montagem de faturas, ao realizar o faturamento a fatura já é criada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2111.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Nessa tela serão cadastradas as notas fiscais do cliente de forma manual para que seja montada a fatura através da opção '2163 - Montagem de Faturas' , lembrando que a característica do cadastro da condição de pagamento deve obedecer as regras descritas acima."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2161.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Relação das notas fiscais cadastradas na opção '2161 - Entrada de Notas Fiscais' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2162.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Essa tela fará a montagem das faturas referentes aos lançamentos feitos na '2161 - Entrada de Nostas Fiscais'  ou faturamentos realizados utilizando condições de pagamentos com o 'Tipo Plano – M' . Para a montagem da fatura pode-se usar filtros como '1ª Vencimento', 'Código da Condição de Pagamento'  e 'Cliente' , na mesma tela será definido a data da fatura a ser montada/emitida, anteriormente a esse passo é necessário processar a opção '2340 - Fechamento Diário' ."
      },
      {
        "type": "p",
        "text": "Obs: O campo 'Montar Faturas com o 1º vencimento até'  baseia-se na data base definida na condição de pagamento e vencimento inicial."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2163.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizada a montagem das faturas em  '2163 - Montagem de Faturas' , a mesma criará o documento já montado para emissão com as respectivas notas fiscais e seus valores na opção '2164 - Cadastro de Faturas' , altere a montagem feita previamente e realize a emissão da fatura. Também é possível através da mesma tela efetuar uma emissão direta da fatura de maneira manual, relacionando as notas fiscais do cliente e seus respectivos valores para posterior emissão."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2164_2.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2164_2.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/emissao.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Listagem que relaciona montagens, faturas emitidas, pendentes e canceladas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2165.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após a emissão da fatura processar a rotina '2166 – Integração Faturas/Contas a Receber' , esse procedimento gerará o título a ser pago no Contas a Receber do cliente ao final de todo o processo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/Fat_2166.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Essa tela efetua o cancelamento de faturas já emitidas, o financeiro gerado após a emissão da fatura também é cancelado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2167.jpg",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Essa tela elimina as faturas até a data informada com objetivo de diminuir o tamanho do arquivo dentro do banco de dados."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Emiss%C3%A3o%20de%20Faturas/2168.jpg",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-13",
    "slug": "manifesto_de_documentos_fiscais_eletronicos_mdf_e",
    "title": "Manifesto de Documentos Fiscais Eletrônicos- MDF-e",
    "category": "guia",
    "module": "Logística",
    "tags": [],
    "updatedAt": "2019-12-13",
    "readTime": "7 min",
    "author": "Prócion Sistemas",
    "summary": "De acordo com o Manual oficial o Manifesto Eletrônico de Documentos Fiscais (MDF-e) é o documento emitido e armazenado eletronicamente, de existência apenas digital, para vincular os documentos fiscais utilizados na oper",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/13/manifesto_de_documentos_fiscais_eletronicos_mdf_e",
    "content": [
      {
        "type": "p",
        "text": "De acordo com o Manual oficial o Manifesto Eletrônico de Documentos Fiscais (MDF-e) é o documento emitido e armazenado eletronicamente, de existência apenas digital, para vincular os documentos fiscais utilizados na operação e/ou prestação, à unidade de carga utilizada no transporte, cuja validade jurídica é garantida pela assinatura digital do emitente e autorização de uso pela administração tributária da unidade federada do contribuinte."
      },
      {
        "type": "p",
        "text": "O MDF-e deverá ser emitido por empresas prestadoras de serviço de transporte para prestações com mais de um conhecimento de transporte ou pelas demais empresas nas operações, cujo transporte seja realizado em veículos próprios, arrendados, ou mediante contratação de transportador autônomo de cargas, com mais de uma nota fiscal."
      },
      {
        "type": "p",
        "text": "Para atender essa demanda e ficar de acordo com as leis vigentes, foram feitas diversas modificações e novos programas foram criados para o funcionamento do processo que atenderá o MDF-e."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/1111_MDFe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "De acordo com a definição, o Manifesto está vinculado a um outro documento fiscal eletrônico dentro do Sistema, é necessário que esteja configurado o documento origem  (NF-e, CT-e) . O MDF-e usará, com as devidas restrições e pormenores, a estrutura que já existe no sistema para os documentos eletrônicos (Gerenciadores de certificado e impressão, opção '2139 - Visualizador de NF-e's', etc) ."
      },
      {
        "type": "p",
        "text": " Em   '1111 - Parâmetros Globais Sistema - Aba - Faturamento - Versão MDFe'  selecionar a versão do documento base do manifesto: Nota Fiscal eletrônica (NF-e) ou Conhecimento de Transporte eletrônico (CT-e)  e versão do Manifesto."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/2_2131_MDFe.PNG",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Algumas mudanças foram feitas em '2131 - Cadastro de Pedidos' , o manifesto foi elaborado utilizando a estrutura da Numeração de Carga , esse número poderá ser definido no cadastro do pedido (2131) ou, poderá ser associado no programa '2153/R215 - Montagem de Cargas'  que prepara o registro para emissão do MDF-e. Para que a montagem seja feita de forma correta o pedido não deverá ser emitido, apenas salvo, pois os campos referente a transportadora, UFs origem e destino deverão ser preenchidos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/1217_MDFe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para que o MDF-e seja emitido corretamente, os veículos utilizados no processo deverão ser cadastrados atentando - se para aos campos relacionados aos seus documentos, capacidades e modelo. Os modelos básicos podem ser selecionados na própria opção '1217 - Cadastro de Veículos' , caso seja necessário cadastrar um novo modelo, utilizar a opção '1216 - Cadastro de Modelo de Veículos' ."
      },
      {
        "type": "p",
        "text": "Atenção aos cadastros de 'Proprietário' e 'Motorista Principal' em '1221 - Cadastro de Terceiros' , inserir os documentos corretamente. Outra informação essencial é o código  'RNTRC',  campo obrigatório para os veículos de transporte de cargas. Também é imprescindível a definição do CEP/Cidade/UF do veículo e Placa ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/1217_MDFe_RNTRC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/1216_MDFe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/2151_MDFe.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na opção '2151 - Acerto de Cargas' foram feitas todas as adequações para o novo tratamento do manifesto, semelhante ao que foi feito no cadastro de pedidos (2131) , inclusive faz a gravação de uma nova carga com os campos básicos utilizados para a missão do MDF-e. Caso opte por esse caminho, as demais informações necessárias para a emissão do manifesto deverão ser preenchidas em '2153/R215 - Montagem de Cargas' ."
      },
      {
        "type": "p",
        "text": "A Opção '2153/R215 - Montagem de Cargas' foi criada para auxiliar na montagem de um registro vinculado a uma numeração de carga e prepará-la pra gerar o (s) manifesto(s). É importante frisar que uma carga pode gerar vários manifestos, pois de acordo com as definições do MDF-e, deve haver um manifesto para cada par de U.F. em que houver transporte de mais de um documento. O botão de seleção ira trazer uma tela para que os pedidos que irão compor a carga sejam escolhidos. "
      },
      {
        "type": "p",
        "text": "Na aba 'Principal'  da montagem de cargas deve-se definir as placas do veículo que primeiramente deverão estar cadastradas em '1217 - Cadastro de Veículos' e '1216 - Cadastro de Modelos de Veículos' e 'Transportadora'  com até três condutores, todos os terceiros devidamente cadastrados em '1221 - Cadastro de Teceiros' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/2153_R215.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A seleção é composta de duas listas para a composição da carga. Na lista superior estarão os pedidos que foram cadastrados, associados a emissão de um manifesto fiscal, porém, sem numeração de carga. Na lista inferior, estarão os pedidos que além de estarem associados a emissão de um manifesto fiscal, já estão vinculados à numeração de carga que está sendo utilizada."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/2153_busca_MDFE.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na aba  'Percurso'  temos uma tabela de UF's origem e destino, após a seleção dos pedidos deve-se montar os percursos que serão feitos e que gerarão cada um dos manifestos, lembrando que para cada par de U.F. um documento será emitido. Nessa tabela deverão constar as U.F. que o veículo percorrerá, também podem ser inseridos nessa tela detalhes relacionados a Vale Pedágio, Lacres e uma Observação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/2153_R215_Percurso.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na terceira aba 'Carga/CIOT'  deverá constar informações referente ao  'Detalhamento da Carga'  seguindo adequações a  NT2020.001  de março de 2020 para a emissão de  MDF-e  e informações referente ao  CIOT."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/2153_R215_Carga_CIOT.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feita a montagem da carga para o manifesto, aguardar até que os pedidos e sua respectivas notas fiscais sejam processadas para depois emiti - lo. Na opção '2131 - Cadastro de Pedidos' existem botões para facilitar a emissão de múltiplos pedidos e realizar a emissão do manifesto diretamente por essa mesma opção (botão com o ícone de caminhão) ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/MDFe_barra_2131.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/MDFe_EMFP.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A emissão do manifesto segue os padrões de emissão de documentos fiscais, lembrando que uma carga poderá gerar um ou mais manifestos, um para cada par de U.F. (Origem, destino final) . O MDF-e utilizará o mesmo certificado que os documentos fiscais abrangidos por ele (NFe/CTe) , não sendo necessário nenhuma instalação adicional, porém, possui webservices próprios."
      },
      {
        "type": "p",
        "text": "Por não se tratar de um documento que gera valores fiscais, o manifesto utilizará uma série alfanumérica fixa 'M' , não sendo necessária nenhuma configuração no cadastro de usuários (1112 - Cadastro de Empresas) . O gerenciador é o mesmo utilizado para emissão de outros documentos fiscais."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/Gerenciador.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manifesto%20Eletronico%20-%20MDFe/MDFe_2154.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O MDF-e depois de emitido trabalha com eventos para tratar seu 'Encerramento' e 'Cancelamento' ."
      },
      {
        "type": "p",
        "text": "- Encerramento: todo manifesto deve ser encerrado quando o percurso for finalizado, ou quando alguma alteração for necessária para dar prosseguimento à viagem após a emissão. Para encerrar deve-se informar o município de encerramento, caso seja algum diferente das cidades vinculadas aos documentos fiscais (NFe/Cte) que o manifesto abrange, utilizar o campo 'Cidade' . Nota: O não encerramento poderá causar problemas de rejeição, quando o mesmo veículo for novamente utilizado para um novo manifesto dentro do mesmo par de U.F's."
      },
      {
        "type": "p",
        "text": "- Cancelamento: quando for necessário cancelar um manifesto já emitido, deverá ser informada uma justificativa para o seu cancelamento."
      },
      {
        "type": "p",
        "text": "Através da opção  '2154 - Eventos de Manifesto' também é possível informar evento para troca/inclusão de condutor e, realizar a consulta de MDF-es não encerrados para o CNPJ emissor dos manifestos."
      }
    ]
  },
  {
    "id": "AP-11",
    "slug": "controle_de_depositos_e_expedicoes",
    "title": "Controle de Depósitos e Expedições",
    "category": "guia",
    "module": "Portal do Cliente",
    "tags": [],
    "updatedAt": "2019-12-12",
    "readTime": "10 min",
    "author": "Prócion Sistemas",
    "summary": "O Módulo de Controle de Depósitos e Expedições para o Sistema Hádron é uma ferramenta desenvolvida para facilitar a transferência de informações entre o caixa, os depósitos e as expedições facilitando a comunicação inter",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/11/controle_de_depositos_e_expedicoes",
    "content": [
      {
        "type": "p",
        "text": "O Módulo de Controle de Depósitos e Expedições para o Sistema Hádron é uma ferramenta desenvolvida para facilitar a transferência de informações entre o caixa, os depósitos e as expedições facilitando a comunicação interna. Ao identificar cada boleto e pedido na separação dos produtos em depósitos e, na entrega nas expedições, possibilita um processo mais rápido e organizado para o cliente e a empresa."
      },
      {
        "type": "p",
        "text": "Para o correto direcionamento dos boletos e pedidos deve - se cadastrar os depósitos na opção '1143 - Cadastro de Depósitos de Materiais'  no sistema Hádron. Configurar os campos: 'Código' , com a identificação interna numérica do depósito e 'Descrição' , com o nome no qual é atribuído ao depósito para facilitar sua identificação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/1143.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Para o correto direcionamento dos boletos e pedidos deve - se cadastrar as expedições na opção '1144 - Cadastro de Expedições'  no sistema Hádron. Configurar os campos: 'Código' com a identificação interna alfanumérica da expedição,  'Descrição' com o nome no qual é atribuído à expedição para facilitar sua identificação e  'Guichê' com os números dos guichês de cada expedição."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/1144.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Os depósitos em que estão os itens estão devem estar associados como complemento dos produtos, para isso deve-se usar a opção '5112 - Complemento de Produtos' . No campo 'Depósito 1' deve-se colocar o depósito primário do produto, no campo 'Depósito 2' deve-se colocar o depósito secundário do produto caso exista."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/5112.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "É possível definir os depósitos para um grupo de produtos em massa, utilizar a opção '1239 - Acertos Gerais de Produtos' , no campo 'Atualizar' escolher '12 – Depósito Primário'  ou '13 – Depósito Secundário' , através dos filtros em tela definir as características dos produtos que deseja - se efetuar as alterações."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/1239.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/1111_param.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na opção '1111 - Parâmetros Globais sistema - Aba - Vendas'  encontra-se o grupo 'Módulo Depósitos / Expedições'  e suas respectivas alternativas:"
      },
      {
        "type": "p",
        "text": "Modo Depósitos – 'S – Simples': Mantém o sistema sem o 'Módulo de Controle de Depósitos e Expedições'  habilitado, 'E – Controle de Entregas Boletos': Habilita o 'Módulo de Controle de Depósitos e Expedições' ."
      },
      {
        "type": "p",
        "text": "Tipo Guichês – '0 – Não utiliza guichês': Não utiliza guichês na expedição,  '1 – Guichês Simples': Utiliza guichês na expedição, '2 – Guichês Produtos Especiais': Parâmetro não mais utilizado no sistema."
      },
      {
        "type": "h3",
        "text": "Guichês – Número de guichês para distribuição na expedição."
      },
      {
        "type": "p",
        "text": "Depósito Usual - o campo deve ser configurado para que quando um produto não possua depósito definido na opção  '5112 - Complementos de Produtos' , o sistema usará o depósito usual como depósito padrão do produto."
      },
      {
        "type": "p",
        "text": "Separação Boletos – '1 – Envia para separação nos depósitos': Envia pré-venda para separação no depósito anterior a expedição, '2 – Separa fisicamente/envia à Expedição': Envia pré-venda diretamente a expedição."
      },
      {
        "type": "p",
        "text": "Sep. Ped. Fechados - '1 - Envia para separação nos depósitos': Envia pré-venda gerada a partir do controle de entregas (7516 - Controle de Pedidos/Entregas) para separação no depósito anterior a expedição, '2 – Separa fisicamente/envia à Expedição': Envia pré-venda gerada a partir do controle de entregas (7516 - Controle de Pedidos/Entregas) diretamente a expedição."
      },
      {
        "type": "h3",
        "text": "Confer. Depósito – Forma de separação e conferência dos itens vendidos no controle de depósitos: "
      },
      {
        "type": "p",
        "text": "- '0 – Separação Simples': Não há conferência dos itens, apenas a informação de que a pré-venda está 'Em separação'  ou 'Separado';"
      },
      {
        "type": "p",
        "text": "- '1 – Conferência Item a Item': Conferência item a item visualizando a quantidade original da pré-venda;"
      },
      {
        "type": "p",
        "text": "- '2 – Conferência Item a Item (cega)': Conferência item a item de maneira “cega” , ou seja, não há a visualização da quantidade original da pré-venda;"
      },
      {
        "type": "p",
        "text": "- '3 – Montagem de itens': Uma conferência já iniciada que por algum motivo seja interrompida, é possível continuar a partir do ponto de interrupção, nessa situação é possível visualizar a quantidade original da pré-venda;"
      },
      {
        "type": "p",
        "text": "- '4 – Montagem de itens (cega)': Uma conferência já iniciada que por algum motivo seja interrompida, é possível continuar a partir do ponto de interrupção, nessa situação não é possível visualizar a quantidade original da pré-venda, a conferência é feita de maneira “cega” ."
      },
      {
        "type": "h3",
        "text": "Confer. Expedição - Forma de conferência dos itens vendidos no controle de expedição:"
      },
      {
        "type": "p",
        "text": "- '0 – Separação Simples': Não há conferência dos itens, apenas a informação de que a venda está disponível para ser 'Entregue'  após o faturamento;"
      },
      {
        "type": "p",
        "text": "- '1 – Conferência Item a Item': Após o faturamento o pedido é liberado para a conferência item a item de maneira que possa visualizar a quantidade original da pré-venda;"
      },
      {
        "type": "p",
        "text": "- '2 – Conferência item a item (cega)': Após o faturamento o pedido é liberado para a conferência item a item de maneira “cega” , ou seja, não é possível visualizar a quantidade original da pré-venda."
      },
      {
        "type": "p",
        "text": "O terminal utilizado pelo operador deverá ser configurado com suas funções para o  Módulo de Controle de Depósitos e Expedições , a configuração poderá ser feita através da opção '1119 - Parâmetros de Terminal'  na aba 'F.Loja' , definir 'Tipo Terminal' e preencher os campos 'Expedição/Depósito' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/1119_param.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "- Terminal Comum – Ao marcar este campo, o terminal se torna um terminal comum. Sua função no Módulo de Controle de Depósitos e Expedições pode ser de terminal para venda ou qualquer outro que possa gerar boletos e efetuar cadastros."
      },
      {
        "type": "p",
        "text": "- Terminal Depósito – Ao marcar este campo, o terminal se torna um terminal de depósito. Sua função se torna quase que exclusiva para gerenciar o depósito, e ao reiniciar o sistema, a opção RIBO será aberta."
      },
      {
        "type": "p",
        "text": "- Terminal Expedição – Ao marcar este campo, o terminal se torna um terminal de expedição. Sua função se torna quase que exclusiva para gerenciar a expedição e entrega de produtos, e ao reiniciar o sistema, a opção RIBO será aberta."
      },
      {
        "type": "p",
        "text": "- Terminal Caixa – Ao marcar este campo, o terminal se torna um terminal de caixa. Sua função nesse módulo será a de faturamento dos pedidos separados pelo depósito e, conseqüentemente, liberação dos mesmos para a expedição."
      },
      {
        "type": "p",
        "text": "- Forma – A opção forma pode ser marcada com dois valores:  '0 – Não permite alteração pelo vendedor'  – Com esta forma selecionada, ao efetuar uma venda, o boleto será endereçado diretamente para a expedição configurada no campo Expedição desta opção, '1 – Permite alteração de expedição'  – Com esta forma selecionada, ao efetuar uma venda, o vendedor terá que escolher para qual expedição o boleto será endereçado;"
      },
      {
        "type": "p",
        "text": "- Expedição – se o campo 'Terminal Comum'  estiver marcado, deve-se colocar o código da expedição (previamente definida na opção 1144 - Cadastro de Expedições) para qual serão endereçados os boletos gerados neste terminal. Se o campo 'Terminal Expedição'  estiver marcado, deve-se colocar o código de qual expedição (previamente definida na opção 1144 - Cadastro de Expedições) este terminal será."
      },
      {
        "type": "p",
        "text": "- Depósito – Se o campo 'Terminal Depósito'  estiver marcado, deve-se colocar o código de qual depósito (previamente definido na opção 1143 - Cadastro de Depósito de Materiais) este terminal será."
      },
      {
        "type": "p",
        "text": "- Depósito/expedição não imprime boletos automáticos? – Com esse campo marcado os boletos lançados não são impressos automaticamente pelo RIBO assim que são lançados pela '7512' , a impressão somente será feita se for clicado no botão de 'Imprimir' ."
      },
      {
        "type": "p",
        "text": "A geração do boleto deve ser feita através da opção '7512 - Cadastro de Orçamentos' . Se a opção escolhida no final do cadastro for 'Orçamento' , o boleto não será endereçado para nenhum depósito ou expedição. Se a opção escolhida for 'Pré-Venda' , o programa  '7512 - Cadastro de Orçamentos'  gerará um pedido e este será exibido na coluna 'Boletos'  do programa 'RIBO - Gerenciamento de Depósitos/Expedições' nos depósitos e expedições definidos previamente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/7512.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A liberação do caixa deve ser feita através da opção  '75NV/75NV - Emissão de Orçamentos' , ao faturar a venda já cadastrada previamente pelo vendedor será indicado na expedição que os boletos já foram liberados pelo caixa."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/7513.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Após o terminal ser configurado como 'Depósito'  o sistema irá abrir automaticamente após o login a opção 'RIBO - Gerenciamento de Depósitos/Expedições' e no menu do sistema será habilitado o botão que abre o programa."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/Term_Dep_Exped.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A opção 'RIBO - Gerenciamento de Depósitos/Expedições'  imprime somente os boletos que foram separados e direcionados para aquele depósito. "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/Dep_RIBO.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O Botão 'Em Separ'  indica que o pedido já está em processo de separação, descrito em 'Observações' ."
      },
      {
        "type": "p",
        "text": "O Botão 'Separado'  indica que o pedido já foi separado enviando-o a expedição, conforme configuração o mesmo estará descrito como 'Separar'  para que seja realizada a conferência item a item."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/PCFB.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "O botão 'Editar Orçamento'  ao lado da numeração do boleto abre a tela 'PEOC - Manutenção de Boletos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/PEOC_Dep.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O terminal configurado como  'Depósito'  o único campo aberto para alteração é o  'Falta de produtos' , que deve ser marcado quando o produto está em falta no estoque/depósito, ao marcar este campo os outros depósitos podem visualizar a falta do produto na local indicado. "
      },
      {
        "type": "p",
        "text": "Na lista de produtos há um botão na extrema esquerda da tela com um ícone em formato de 'i' , este botão abre uma janela com algumas informações do produto, como Pendências de Compras, Estoque Mínimo, Estoque Máximo e Unidades por Embalagem."
      },
      {
        "type": "p",
        "text": "Após o terminal ser configurado como 'Expedição'  o sistema irá abrir automaticamente após o login a opção 'RIBO - Gerenciamento de Depósitos/Expedições e no menu do sistema será habilitado o botão que abre esta opção."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/Term_Dep_Exped.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A opção 'RIBO - Gerenciamento de Depósitos/Expedições'  imprime somente os boletos que foram separados e direcionados para aquela expedição."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/Exp_RIBO.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O Botão 'Entregue'  habilitado indica que o pedido já foi faturado pelo caixa e está disponível para entrega, conforme configuração o mesmo estará descrito como 'Entregar'  para que seja realizada a conferência item a item."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/PCFB_exp.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O terminal configurado como  'Expedição' , na função  'Editar Orçamento'  os únicos campos abertos para alteração são 'Expedição'  e 'Guichê' , ao serem alterados redireciona os boletos da expedição configurada no terminal para qualquer outra expedição cadastrada no sistema."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/PEOC_Exp.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Controle%20de%20Depositos%20e%20Expedi%C3%A7%C3%B5es/List_7573.bmp",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "A listagem com as movimentações feitas pelo Módulo de Controle de Depósitos e Expedições poderá ser emitida utilizando o filtro por número do boleto ou data da venda."
      },
      {
        "type": "p",
        "text": "As informações da listagem são separadas em informações básicas, de venda, do caixa, do depósito e da expedição, mostrando detalhes e a hora da passagem em cada uma das etapas do processo de venda. Na parte inferior da listagem há totalizadores e indicadores de tempo médio entre as etapas do processo."
      }
    ]
  },
  {
    "id": "AP-10",
    "slug": "gerenciador_de_coletas_e_entregas_crossdocking_",
    "title": "Gerenciador de Coletas e Entregas (Crossdocking)",
    "category": "guia",
    "module": "Logística",
    "tags": [],
    "updatedAt": "2019-12-11",
    "readTime": "5 min",
    "author": "Prócion Sistemas",
    "summary": "Crossdocking, ou cross-docking, define-se como um sistema de distribuição, no qual a mercadoria recebida num armazém ou centro de distribuição, não é estocada como seria prática comum até há pouco tempo, mas é preparada ",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/10/gerenciador_de_coletas_e_entregas_crossdocking_",
    "content": [
      {
        "type": "h3",
        "text": "Definição de Crossdocking"
      },
      {
        "type": "p",
        "text": "Crossdocking, ou cross-docking, define-se como um sistema de distribuição, no qual a mercadoria recebida num armazém ou centro de distribuição, não é estocada como seria prática comum até há pouco tempo, mas é preparada para o carregamento e distribuição ou expedição a fim de ser entregue ao cliente ou consumidor imediatamente, ou, pelo menos, o mais rapidamente possível. Consiste na transferência ou movimento dos produtos ou mercadorias do ponto de recebimento ou recepção, diretamente para o ponto de expedição e entrega, com tempo em estoque limitado ou, se possível, nulo, permitindo que os responsáveis pelos centros de distribuição se concentrem no fluxo de produtos ou mercadorias e não na armazenagem das mesmas."
      },
      {
        "type": "p",
        "text": "O crossdocking pode ser definido como uma operação do sistema de distribuição na qual os produtos de um veículo são recebidos, separados, e encaminhados para outro veículo. Uma aplicação do crossdocking (que literalmente designa \"atravessamento de docas\" ), usada principalmente na execução de entregas em centros urbanos, onde a circulação de veículos de grande porte sofre restrições sobre a sua dimensão e peso, impedindo-os de efetuar as entregas. Tais veículos descarregam seus produtos em um armazém, os produtos cruzam o armazém através de esteiras, e em seguida carregam outro veículo de menor porte, que efetuará as entregas."
      },
      {
        "type": "p",
        "text": "O processo se inicia com a importação de todos os XMLs enviados pelos fornecedores durante o dia. Esse procedimento será responsável pela criação no banco de dados das informações referentes a cada entrega a ser realizada, contendo informações dos itens e dos clientes. A cada importação a rotina valida as informações do cliente contidas no XML com o cadastro de clientes do Hádron, sugerindo as alterações, caso existam, ou efetuando a inclusão, no caso de um novo cliente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/Sem%20t%C3%ADtulo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Mensagem exibida após a importação de xmls que necessitam correções junto ao sistema Hádron:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/Msg_correc_xml.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Tela que aponta inconsistências e efetua correções do XML importado:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/Corre%C3%A7%C3%B5es_importa%C3%A7%C3%A3o.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na imagem acima uma das inconsistências apontadas foi a de  ‘Produto sem Vínculo’ , através da opção '1237' criaremos esse vínculo ‘Produto x Terceiro’ , esse vínculo é necessário para que o produto existente no arquivo XML tenha seu correspondente no cadastro de produtos dentro do sistema Hádron. Esse vínculo será criado apenas uma vez, nas próximas importações referentes ao mesmo terceiro essa relação será reconhecida pelo sistema."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/vinculo_1237.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Tendo sido importados os XMLs, o recebimento físico dos produtos será realizado durante todo o expediente, confrontando com as informações registradas anteriormente. Essa conferência é essencial para que, posteriormente, não seja montada uma carga de entrega com itens que ainda não foram recebidos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/7324_Conferencia.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na sequência será possível a simulação ou montagem efetiva das cargas no sistema, através do roteirizador. Serão exibidos os itens liberados e os pendentes de recebimento físico, pré-agrupados por território de entrega, e o operador poderá simular a montagem de cada carregamento para entrega. A cada item incluído o sistema atualizará a exibição do peso total já selecionado para aquele veículo, e o saldo disponível para carregamento, baseando-se na informação de carga total de cada veículo, previamente cadastrada no sistema. Apesar de ser possível realizar simulações com itens ainda não recebidos, a efetivação de cada carga somente será possível se todos os itens selecionados já tiverem sido fisicamente recebidos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/7324_montagem_carga.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7324 – Manutenção de Documentos para Montagem de Cargas – Saída para Entrega"
      },
      {
        "type": "p",
        "text": "Com a efetivação das cargas no sistema é possível a emissão dos romaneios, conhecimentos de transporte e manifesto. Deverá ser informada ao sistema a aferição do hodômetro referente ao veículo utilizado no momento da saída, nesse processo será atualizado o status do fluxo de entregas frente ao romaneio."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/7324_Saida_entrega.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7324 – Manutenção de Documentos para Montagem de Cargas – Entrega Parcial"
      },
      {
        "type": "p",
        "text": "Durante o procedimento de entrega será possível a atualização do status de cada entrega, através da informação da data e horário efetivo da finalização do descarregamento. Isso será feito através de contato telefônico com o transportador, não sendo disponibilizados nesta etapa quaisquer recursos utilizando GPS ou aplicação mobile, podendo ser implementado em um projeto futuro. Essas informações sobre o horário das entregas serão posteriormente confrontadas com o recebimento dos canhotos devidamente preenchidos."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/1_7324_parcial.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/7324_parcial_2.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "7324 - Manutenção de Documentos para Montagem de Cargas – Finalização da Entrega"
      },
      {
        "type": "p",
        "text": "No retorno de cada veículo, além do recebimento dos canhotos de confirmação de entrega, será informada a nova aferição do hodômetro do veículo, para que seja possível o cálculo dos valores a serem pagos ao transportador. Itens, que por algum motivo não tenham sido entregues no dia, retornarão à fila de itens liberados para entrega, para que sejam incluídos na montagem de cargas do próximo dia. Itens devolvidos serão armazenados separadamente para aguardar definição sobre seu destino e atualizados no sistema com o status pendente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Crossdocking/1_7324_final.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Serão gerados relatórios operacionais e gerenciais em cada etapa, permitindo o acompanhamento detalhado da operação através das opções '7326 (Elaborados de Romaneios Carga)' e '7328 (Romaneios por Veículo)' ."
      }
    ]
  },
  {
    "id": "AP-2",
    "slug": "conferencia_quantitativa_entrada_de_materiais",
    "title": "Conferência Quantitativa - Entrada de Materiais",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2019-12-10",
    "readTime": "2 min",
    "author": "Prócion Sistemas",
    "summary": "Essa opção realiza a conferência do recebimento dos materiais comprados com ou sem ordem de compra. Deve - se informar o número referente ao cadastro do documento de entrada feito em '3212 - Cadastro de Documentos de Ent",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/2/conferencia_quantitativa_entrada_de_materiais",
    "content": [
      {
        "type": "p",
        "text": "Essa opção realiza a conferência do recebimento dos materiais comprados com ou sem ordem de compra. Deve - se informar o número referente ao cadastro do documento de entrada feito em '3212 - Cadastro de Documentos de Entrada' , ao pressionar a tecla 'F3' no campo 'Documento'  é possível realizar a busca através do terceiro, serão trazidos o número da nota fiscal, data de emissão e a data de entrada no sistema."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/3219_busca_1.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizada a busca o conferente informará no campo 'Quantidade'  a contagem aferida referente a cada item presente no documento selecionado."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/3219_Aferi%C3%A7%C3%A3o.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "É possível emitir uma relação para que o conferente realize a contagem dos itens que constam no documento, de forma que apresente as quantidades da nota fiscal ou por meio de uma \"conferência cega\", afim de que o operador não saiba os reais valores a serem aferidos. Em contrapartida após a aferição, pode-se emitir uma relação somente com os itens que apresentaram diferença na 'Contagem x Documento original - 3212' , obedecendo o mesmo padrão de exibir ou não as quantidades originais do documento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/3219_Modelos_listagem.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizada uma conferência de maneira incompleta, ou seja, de forma que não atenda o documento original em sua totalidade, ao usar o botão ‘Confirma’ será exibida a mensagem abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/3219_Aviso_Confer.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Por parâmetro é possível estabelecer um número de tentativas possíveis referente a conferência a ser realizada, afim de que limite-se as quantidades de 'tentativas x erros'  e busque uma melhor performance na aferição. Ao tentar exceder esse número de tentativas, será exibida a mensagem abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/3219_doc_satisfeito.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "1111 - Parâmetros Globais Sistema - Aba - Compras - Conferência Quantitativa? - Limite Tentativas."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/1111_Confer_Quant.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizada a contagem dos itens do 'documento x quantidade' de forma correta, ao finalizar é possível realizar a impresão de etiquetas referente aos produtos aferidos através do botão abaixo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/Bot%C3%A3o_etiquetas.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Em seguida abrirá a tela para que sejam inseridas as quantidades de etiquetas a serem impressas e seja escolhido o seu layout de impressão."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/3219_Impress%C3%A3o_etiqueta.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Finalizada a contagem e a impressão das etiquetas para o documento, não é mais possível manipular a informação do mesmo, ao buscar um documento com uma condição já satisfeita as informações serão trazidas, porém, sem nenhum item pendente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Confer%C3%AAncia%20Quantitativa/3219_satisfeita.png",
        "alt": "Imagem do artigo"
      }
    ]
  },
  {
    "id": "AP-8",
    "slug": "cotacao_e_emissao_de_ordem_de_compra",
    "title": "Cotação e emissão de Ordem de Compra",
    "category": "guia",
    "module": "ERP - Compras",
    "tags": [
      "producao"
    ],
    "updatedAt": "2019-12-10",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "Cadastro usado para registrar a necessidade de compra de materiais através da requisição eletrônica. Uma vez lançada uma requisição de suprimentos, está passará por uma análise e aprovação, para que depois, possa ser tra",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/8/cotacao_e_emissao_de_ordem_de_compra",
    "content": [
      {
        "type": "p",
        "text": "3121 – Requisição de Suprimentos"
      },
      {
        "type": "p",
        "text": "Cadastro usado para registrar a necessidade de compra de materiais através da requisição eletrônica. Uma vez lançada uma requisição de suprimentos, está passará por uma análise e aprovação, para que depois, possa ser transformada em uma ordem de compra."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3121_Req.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Na seleção de requisições, o supervisor de cada departamento, deverá aprovar ou não as requisições e, quando aprovadas, efetuar seu processamento. Esta aprovação consiste na análise da requisição, verificando se é realmente necessário e se é viável sua compra. O processamento transformará a requisição aprovada em uma análise de orçamento de compra  (cotação/3124) , onde já será possível inserir os fornecedores participantes da cotação. A aprovação da requisição deve ser feita pelo encarregado de cada departamento, sendo assim, para aprovar as requisições o operador precisa ter grau de senha superior ou igual a 'Encarregado'  no módulo 'Compras' (opção 1116) ."
      },
      {
        "type": "p",
        "text": "Esse procedimento faz-se necessário, pois o encarregado terá condições de avaliar a real necessidade de compra dos materiais e ser responsável pela liberação das requisições que os operadores de seu departamento solicitaram.  O operador deve pressionar o botão 'Aprovar Requisições'  para listar as requisições cadastradas e que necessitam ser aprovadas,  depois de listadas será possível avaliar as quantidades solicitadas e alterá-las. Para isso, deve-se clicar com o botão direito do mouse sobre o campo 'Quantidade' , digitar a quantidade correta, descrever o motivo no campo 'Observação'  e pressionar o botão 'Confirma Alteração'  para gravar ou pressionar o botão 'Cancela Alteração'  para desistir."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3122_Aprov_selec.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "O processamento será possível somente para as requisições que foram anteriormente aprovadas por cada departamento. Este processo será feito pelo departamento de compras, pois transformará as requisições em análises de compra, sendo assim, para processar requisições o operador precisa ter grau de senha superior ou igual a 'Chefe ou Supervisor'  no módulo 'Compras' (opção 1116) ."
      },
      {
        "type": "p",
        "text": "Para efetuar o processamento deve-se pressionar o botão 'Processa Requisições'  para listar as requisições aprovadas e que poderão ser transformadas em análise de compras. Depois de listadas, ainda será possível avaliar as quantidades solicitadas e alterá-las, para isso, deve-se clicar com o botão direito do mouse sobre o campo 'Quantidade' , digitar a quantidade correta, descrever o motivo no campo 'Observação'  e pressionar o botão 'Confirma Alteração'  para gravar ou pressionar o botão 'Cancela Alteração'  para desistir."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3122_Sele%C3%A7%C3%A3o_Process.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Realizado o processamento das requisições abrirá a tela '31QR – Análise de Orçamentos'  que   será responsável por gerar a cotação com os fornecedores participantes para a opção  '3124 – Cadastro de Análise de Compras' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3122_Process.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Nessa opção são cadastradas, alteradas e excluídas as cotações, serão inseridos apenas os produtos e os fornecedores participantes da cotação, ela tem a função de gerar uma planilha para ser enviada ao fornecedor (com os preços em branco) ou preenchida com os preços que já foram cotados anteriormente."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3124_Cotacao.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Botão 'Confirma'  -  Confirma a inclusão do registro deixando a cotação cadastrada;"
      },
      {
        "type": "p",
        "text": "Botão 'Confirma e Lista'  -  Gera uma relação impressa com todos os produtos e fornecedores participantes com o intuito de cotar os preços de maneira direta com cada fornecedor;"
      },
      {
        "type": "p",
        "text": "Botão 'Conf. List. Ter'  - Gera uma listagem para ser enviada individualmente a cada fornecedor com os campos referentes ao valor em branco para que eles preencham e remetam de volta com os preços lançados."
      },
      {
        "type": "p",
        "text": "3125 – Lançamento de Preços"
      },
      {
        "type": "p",
        "text": "Nessa opção serão lançados os preços das cotações já cadastradas na opção '3124 - Cadastro de Análise de Compras' , é possível incluir um lançamento de forma direta para geração de uma ordem de compra, sem que seja necessário uma prévia cotação com vários fornecedores."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3125_lanc_prec.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Pode-se salvar o lançamento com os produtos e seus respectivos preços lançados, para posteriormente emiti-lo através da opção '3141 - Emissão de Ordens de Compra'  pressionando o botão 'Confirma' , ou realizar a emissão diretamente do 'Pedido de Compra'  através do botão 'Emite' ."
      },
      {
        "type": "p",
        "text": "3126 – Visualização de Vencedores"
      },
      {
        "type": "p",
        "text": "Essa tela tem a função de visualizar os vencedores da cotação a cada item, através dela é possível alterar o ganhador geral ou individual por produto cotado, o ganhador é marcado por uma tarja amarela apontando o fornecedor e seu respectivo preço. Há a possibilidade de troca de todos os itens para um mesmo fornecedor, caso seja conveniente a compra de todos os produtos com o mesmo terceiro. A ação é feita através do botão 'Aplicar terceiro a todos os produtos' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3126_visualizacao.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Feito todo o processo de cotação e lançamentos de preços e fornecedores, nessa tela será dada a aprovação por meio de 'Senha Gerente'  para que o registro fique disponível para emissão da ordem de compra. É possível visualizar os produtos e seus respectivos vencedores, após a liberação pode -se  processar a ordem de compra através do botão 'Emite' . Essa tela torna-se obrigatória no processo se habilitado o parâmetro '1111 - Parâmetros Globais Sistema - Aba - Compras - Autorizações 2 - Sim, com bloqueios',  visto que em alguns lugares não há a necessidade de todo o processo."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3129_aprovacao.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3141 – Emissão de Ordens de Compra"
      },
      {
        "type": "h3",
        "text": "Essa opção possui a função de emitir a ordem de compra tendo como referencia o número da cotação (análise de compra)."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3141_Emiss_OC.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3143 – Cancelamento de Ordens"
      },
      {
        "type": "p",
        "text": "Essa opção tem a função de fazer o cancelamento das ordens de compras emitidas, informar o número da cotação referente à ordem de compra e confirmar o cancelamento."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3143_Cancel_Ord.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "3145 – Consulta de Análises"
      },
      {
        "type": "h3",
        "text": "Essa opção faz a consulta das ordens de compra e mostra o status em que ela se encontra."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Manual%20de%20Opera%C3%A7%C3%B5es%20M%C3%B3dulo%20Compras%20%E2%80%93%20Cota%C3%A7%C3%A3o%20e%20emiss%C3%A3o%20de%20Ordem%20de%20Compra/3145_Consul_analise.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Artigos Relacionados"
      },
      {
        "type": "h3",
        "text": "Atualizações Relacionados"
      }
    ]
  },
  {
    "id": "AP-9",
    "slug": "importacao_de_arquivo_xml_para_nfe_de_entrada_de_mercadorias",
    "title": "Importação de Arquivo XML para NFe de Entrada de Mercadorias",
    "category": "guia",
    "module": "NF-e / SPED",
    "tags": [
      "fiscal"
    ],
    "updatedAt": "2019-12-10",
    "readTime": "6 min",
    "author": "Prócion Sistemas",
    "summary": "A importação do arquivo XML para NFe de entrada de mercadorias é um recurso extremamente importante e merece atenção especial ao ser utilizado.",
    "sourceUrl": "https://ajuda.procion.com/artigo/guia/9/importacao_de_arquivo_xml_para_nfe_de_entrada_de_mercadorias",
    "content": [
      {
        "type": "h3",
        "text": "Importação de Arquivo XML para  NFe de Entrada de Mercadorias"
      },
      {
        "type": "p",
        "text": "A importação do arquivo XML para NFe de entrada de mercadorias é um recurso extremamente importante e merece atenção especial ao ser utilizado."
      },
      {
        "type": "p",
        "text": "A atenção é indispensável, pois não se trata apenas de um processo de pré-cadastro de um documento de entrada de mercadorias, onde o operador pressiona um botão e tudo será resolvido, ao iniciar a importação serão feitas várias críticas nos dados que compõem o arquivo XML em relação aos dados que estão gravados no sistema (Cadastros de Terceiros - Fornecedor/Transportador), Cadastro de Produtos, Formas de Tributação, Estoques, entre outras) , é necessário que o operador tenha bom conhecimento sobre as informações que envolvem um documento fiscal de entrada de mercadorias e tudo que será gerado a partir do lançamento desse registro.."
      },
      {
        "type": "p",
        "text": "A cada importação de um arquivo XML, serão criados ou atualizados vínculos entre produtos e terceiros, sendo assim, com o passar do tempo será possível importar um arquivo XML em menos tempo (fazendo apenas uma conferência visual das informações), possuir informações que facilitam a identificação dos produtos pelo fornecedor no momento da compra, atualizar dados cadastrais segundo o que é apresentado no arquivo XML (ex: dados fiscais) , entre outros benefícios."
      },
      {
        "type": "p",
        "text": "3218 - Importação arquivo XML x Compras"
      },
      {
        "type": "p",
        "text": "Recurso utilizado para facilitar e dar mais qualidade ao lançamento do documento fiscal de entrada de mercadorias, partindo da importação do arquivo XML gerado a cada emissão de uma Nota Fiscal Eletrônica. Este programa pode ser acessado pela opção '3218 - Importação XML x Compras' ou pela opção '3212 - Cadastro de Documentos de Entrada' pressionando o botão 'Importa XML da Nota Fiscal Eletrônica - NFe' . "
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/3218_import.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Diretório do arquivo XML – Nota Fiscal Eletrônica: Neste campo deve ser informado o local onde os arquivos XML estão gravados (computador local ou na rede). Para facilitar a busca dos arquivos pode-se clicar no botão 'Abrir Pasta' .  "
      },
      {
        "type": "p",
        "text": "Selecionado o diretório onde estão os arquivos, observe que é apresentado logo abaixo, um quadro contendo informações sobre cada NFe constante no diretório. Note também, que os documentos já importados ficam desabilitados e apresentado o número de seu lançamento na opção  '3212 - Cadastro de Documentos de Entrada' ."
      },
      {
        "type": "p",
        "text": "O quadro de apresentação das NFe's, mostra a quantidade de arquivos XML encontrados, não importados, já importados e que diferem da empresa."
      },
      {
        "type": "p",
        "text": "Para iniciar a importação do arquivo XML, basta selecionar o documento e pressionar o botão 'Processa' . Ao abrir tela '32AP – Ações Prévias'  será iniciado a criação do vínculo entre produtos e terceiros e, junto a esse processo, inicia-se também, as críticas aos dados do arquivo XML em relação aos cadastros do sistema."
      },
      {
        "type": "h3",
        "text": "Tela - 32AP - Ações Prévias"
      },
      {
        "type": "p",
        "text": "Nesta tela são apresentados os dados constantes no arquivo XML (Empresa emitente da NFe e produtos) e sua situação, em relação aos mesmos dados existentes nos cadastros do Sistema Hádron."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/32AP.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Como informado anteriormente, é muito importante que o operador tenha conhecimento sobre as informações que são apresentadas e, principalmente, o que elas irão gerar após a importação. Para auxiliar o operador e aumentar a eficiência desse recurso, foi criada uma listagem para ser preenchida pelo responsável da área fiscal com os detalhes que devem ser seguidos. A listagem serve para fortalecer a comunicação com o departamento fiscal e atribuir mais segurança a quem está importando o arquivo XML. Para ser impressa basta clicar no botão 'Imprime'  ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/List_vinc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/List_s_vinc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Os campos apresentados em cinza representam os dados constantes nos cadastros do sistema e os campos na cor branca os dados importados do arquivo XML. Vejamos abaixo alguns exemplos do que pode ocorrer ao importar os dados do arquivo XML."
      },
      {
        "type": "h3",
        "text": "Empresa Emitente:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/3218_Fornecedor_correto.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto com vínculo sem divergência:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/3218_Produto_vinculo_correto.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto com vínculo e com advertência:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/3218_Produto_vinculo_advertencia.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto com vínculo e com ocorrência que impede a gravação dos dados:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/3218_Produto_vinculo_erro.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "h3",
        "text": "Produto sem vínculo:"
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/3218_Produto_vinculo_sem_vinculo.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "Seguindo o Padrão de trabalho do Sistema Hádron, foram criados botões de acesso aos dados para criar ou atualizar o vínculo e para acertos em cadastros."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/Alter_Vinc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "- Vínculo Realizado sem Divergência : Indica que os dados do arquivo XML em relação aos cadastros do Sistema Hádron não apresentam nenhuma divergência, caso queira -se efetuar alguma alteração em algum vínculo, clicar sobre o ícone para abrir a tela '32TP - Vínculo de Produto x Terceiro' ."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/Corrig_Advert.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "  - Corrigir Advertência : Indica que existe diferença entre os dados do arquivo XML em relação aos cadastros do Sistema Hádron, porém não impede sua gravação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/Corrig_Ocorrenc.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "  - Corrigir Ocorrência : Indica que existe diferença crítica entre os dados do arquivo XML em relação aos cadastros do Sistema Hádron que impedem sua gravação."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/Alter_Cad_Pro.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": " - Altera Cadastro do Produto : Este botão é apresentado na tela 'Vínculo de Produto x Terceiro'  e será usado para acertos no cadastro de produtos baseando-se nos dados do arquivo XML."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/Refaz_Vinc_Prod.png",
        "alt": "Imagem do artigo"
      },
      {
        "type": "p",
        "text": "  - Refaz o Vínculo do Produto : Este botão é apresentado na tela 'Vínculo de Produto x Terceiro'  e será usado quando existir erro no vínculo, pois irá apagar o vínculo existente entre Produto e Fornecedor para que seja refeito (regravado)."
      },
      {
        "type": "h3",
        "text": "Tela - 32TP - Vínculo de Produto Terceiro."
      },
      {
        "type": "p",
        "text": "Compreendendo as funcionalidades e os botões apresentados anteriormente já é possível iniciar a importação. Para qualquer uma das situações descritas será necessário utilizar esta tela para criar, corrigir ou até mesmo desfazer um vínculo de 'Produto x Terceiros' ."
      },
      {
        "type": "p",
        "text": "Para auxiliar o operador a identificar inconsistências entre os dados de seu produto e o que está no arquivo XML, será exibida a tela '3INF – Informações do Produto (Item no XML)'  apresentando detalhes que estão no XML referente ao item que está sendo importado."
      },
      {
        "type": "p",
        "text": "Os campos em amarelo identificam onde ocorre a inconsistência e, através de mensagens, será informado se a forma escolhida para vincular o item será possível ou não. Algumas inconsistências nos dados fiscais impedem a gravação do vínculo e, pode ser, que seja necessário abandonar o lançamento para que operadores responsáveis por tal área acertem os cadastros."
      },
      {
        "type": "image",
        "src": "https://ajuda.procion.com/webroot/file_manager/files/Artigos/Importa%C3%A7%C3%A3o%20Arquivo%20XML/3218_34IN.png",
        "alt": "Imagem do artigo"
      }
    ]
  }
] satisfies KbArticle[];
