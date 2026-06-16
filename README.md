# Atividade To-Do List

Aplicativo mobile de lista de tarefas criado com React Native, Expo e SQLite.

## Funcionalidades

- Adicionar tarefas
- Listar tarefas em ordem de criacao
- Editar tarefas ao tocar em uma tarefa da lista
- Excluir tarefas
- Persistir os dados entre sessoes usando banco SQLite local

## Banco de dados

O projeto usa `expo-sqlite`, que cria um banco SQLite local no dispositivo ou emulador.

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

Depois, abra no celular com o aplicativo Expo Go ou rode em um emulador Android.

## Observacao

Ao fechar e abrir o app novamente, as tarefas continuam salvas porque ficam armazenadas no SQLite.
