FROM mcr.microsoft.com/playwright:v1.45.0-jammy

WORKDIR /app

COPY package.json ./
# Browsers are pre-installed in the base image
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install

COPY . .

ENV CI=true

CMD ["npx", "playwright", "test"]
