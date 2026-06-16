# Atividade To-Do List

Aplicativo mobile de lista de tarefas criado com React Native, Expo e SQLite.

## Funcionalidades

- Adicionar tarefas
- Listar tarefas em ordem de criacao
- Editar tarefas pelo botao `Editar`
- Excluir tarefas
- Filtrar tarefas digitando no campo de busca
- Persistir os dados entre sessoes usando banco SQLite local

## Banco de dados

No Android, o projeto usa `expo-sqlite`, que cria um banco SQLite local no dispositivo ou emulador.

Para facilitar testes pelo navegador com a tecla `w` do Expo, a versao web usa `localStorage` como armazenamento local persistente.

A tabela principal e `tasks`, com os campos:

- `id`: identificador automatico
- `title`: texto da tarefa
- `created_at`: data de criacao

## Como rodar

Instale as dependencias:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Depois, pressione:

- `w` para abrir no navegador
- `a` para abrir em um emulador Android
- ou escaneie o QR Code com o Expo Go

## Observacao

Ao fechar e abrir o app novamente, as tarefas continuam salvas no armazenamento local da plataforma usada.
