# Billet Generator e Email Sender

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-%3E%3D4-blue.svg)
![Last Commit](https://img.shields.io/github/last-commit/andersonRocha091/bank-billet-generator.svg)
![Open Issues](https://img.shields.io/github/issues/andersonRocha091/bank-billet-generator.svg)
![PRs](https://img.shields.io/github/issues-pr/andersonRocha091/bank-billet-generator.svg)

## Descrição

Este projeto é uma aplicação serverless que gera boletos e envia e-mails usando serviços de terceiros. Utiliza a biblioteca Pub/Sub para gerenciar as mensagens e a biblioteca Axios para fazer requisições HTTP.

## Funcionalidades

- **Geração de boletos**: Utiliza o serviço [Kobana](https://www.kobana.com.br) para gerar boletos bancários.
- **Envio de e-mails**: Utiliza o serviço [Mailgun](https://www.mailgun.com) para enviar e-mails.
- **Gerenciamento de mensagens**: Utiliza a biblioteca Pub/Sub para gerenciamento de mensagens.

## Requisitos

- **Node.js**: 14 ou superior
- **TypeScript**: 4 ou superior

### Bibliotecas

- [Pub/Sub](https://cloud.google.com/pubsub)
- [Axios](https://axios-http.com)
- [Kobana](https://www.kobana.com.br)
- [Mailgun](https://www.mailgun.com)

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/andersonRocha091/bank-billet-generator.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd bank-billet-generator
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

    ```env
    KOBANA_CLIENT_ID=seu-client-id
    KOBANA_CLIENT_SECRET=seu-client-secret
    KOBANA_API_URL=https://api.kobana.com.br
    KOBANA_AUTH_URL=https://auth.kobana.com.br
    MAILGUN_API_KEY=seu-mailgun-api-key
    MAILGUN_DOMAIN=seu-mailgun-domain
    ```

## Uso

1. Faça deploy de sua aplicacao em sua conta do Google Cloud Platform:

    ```bash
    npm deploy
    ```

2. A aplicação irá gerar boletos e enviar e-mails automaticamente conforme a configuração.

## Arquivos e Pastas

- `tests/`: Pasta contendo os testes unitários do projeto.
- `src/`: Pasta contendo o código fonte da aplicação.
  - `src/handler.ts`: Arquivo com os entrypoints para execução da aplicação (HTTP e Pub/Sub).
  - `src/usecases/`: Pasta contendo a lógica de aplicação (casos de uso), que orquestra as operações do domínio e dos adaptadores.
  - `src/domain/`: Pasta contendo as entidades e objetos de valor do domínio, encapsulando regras de negócio e protegendo seus invariantes.
  - `src/client/`: Clientes para conexão externa à aplicação (ex: cliente HTTP).
  - `src/utils/`: Pasta contendo funções auxiliares e adaptadores de infraestrutura (ex: Pub/Sub, Firestore).
  - `src/interfaces/`: Pasta contendo as interfaces (ports) que definem os contratos do domínio com o mundo externo.
  - `src/services/`: Pasta contendo os adaptadores de saída que implementam as interfaces (ports) para serviços externos (ex: Kobana, Mailgun).
  - `src/factory/`: Pasta contendo classes de fábrica para criar e configurar instâncias dos casos de uso e serviços.
- `package.json`: Arquivo contendo as dependências e scripts do projeto.
- `jest.config.js`: Arquivo de configuração do Jest para os testes unitários.

## Contribuição

Contribuições são bem-vindas! Se você encontrar um bug ou tiver uma sugestão, por favor, abra uma issue ou envie um pull request.

## Licença

Este projeto é licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais informações.

