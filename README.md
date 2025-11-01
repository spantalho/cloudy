# ☁️ cloudy. — Weather Forecast

Website de previsão do tempo simples e open-source, realizado com **React** e **shadcn/ui**. Este repositório fornece apenas o **front-end** — é fundamental ter um **back-end próprio** configurado para fornecer os dados de clima e geolocalização.

## Config.

O projeto consome endpoints REST para previsão e busca de localidades.\
Você precisará configurar seu próprio back-end com tais rotas:

| Método | Endpoint           | Funções                                | Obrigatório |
| ------ | ------------------ | -------------------------------------- | ----------- |
| get    | `/weather/current` | Dados atuais de clima                  | ✅          |
| get    | `/forecast`        | Previsão de clima estendida            | ✅          |
| get    | `/search/`         | Busca de cidades/localizações          | ✅          |
| get    | `/search/ip`       | Detecção de localização via IP/lat/lon | 🔁 Opcional |
| post   | `/session/start`   | Token de sessão (anônima)              | ✅          |

### APIs recomendadas

- Weather: [WeatherAPI ->]()
- Geolocalização [IPInfo.co (IP) ->]()

> 💡 Você pode usar qualquer serviço, desde que mantenha o formato esperado pelas rotas acima.

## Executar

1. **Clone o repositório**

```bash
git clone https://github.com/spantalho/cloudy.git
```

2. **Instale as dependências**

```bash
yarn install
```

3. **Implemente e configure o arquivo `.env`**

```bash
# your back-end url
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts

| Commands       | Função                               |
| -------------- | ------------------------------------ |
| `yarn dev`     | Inicia o ambiente de desenvolvimento |
| `yarn build`   | Gera build de produção               |
| `yarn preview` | Visualiza a build localmente         |
| `lint`         | ...                                  |

## Licença

Distribuído sob a licença © **Apache 2.0**\
Veja o arquivo [LICENSE ->](./LICENSE.txt) para mais detalhes.

## Contribuições

Contribuições são bem vindas!\
Abra uma _issue_ para sugestões, bugs ou melhorias!

### Localizações

- 🇧🇷 [Português ->](/src/i18n/locales/pt/translation.json)
- 🇺🇲 [English ->](/src/i18n/locales/en/translation.json)