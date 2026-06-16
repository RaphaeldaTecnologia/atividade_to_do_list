import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Task = {
  id: number;
  title: string;
  created_at: string;
};

const db = SQLite.openDatabaseSync('todo-list.db');

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    initializeDatabase();
    loadTasks();
  }, []);

  function initializeDatabase() {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  function loadTasks() {
    const savedTasks = db.getAllSync<Task>(
      'SELECT id, title, created_at FROM tasks ORDER BY datetime(created_at) ASC, id ASC;'
    );

    setTasks(savedTasks);
  }

  function clearForm() {
    setTaskText('');
    setEditingTaskId(null);
    Keyboard.dismiss();
  }

  function handleSaveTask() {
    const title = taskText.trim();

    if (!title) {
      Alert.alert('Campo vazio', 'Digite uma tarefa antes de salvar.');
      return;
    }

    if (editingTaskId) {
      db.runSync('UPDATE tasks SET title = ? WHERE id = ?;', [title, editingTaskId]);
    } else {
      db.runSync('INSERT INTO tasks (title, created_at) VALUES (?, ?);', [
        title,
        new Date().toISOString(),
      ]);
    }

    clearForm();
    loadTasks();
  }

  function handleEditTask(task: Task) {
    setTaskText(task.title);
    setEditingTaskId(task.id);
  }

  function handleDeleteTask(id: number) {
    db.runSync('DELETE FROM tasks WHERE id = ?;', [id]);

    if (editingTaskId === id) {
      clearForm();
    }

    loadTasks();
  }

  const isEditing = editingTaskId !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Lista de Tarefas</Text>
          <Text style={styles.subtitle}>CRUD com React Native, Expo e SQLite</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            value={taskText}
            onChangeText={setTaskText}
            placeholder="Digite uma tarefa"
            placeholderTextColor="#7d8b99"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleSaveTask}
          />

          <Pressable style={styles.primaryButton} onPress={handleSaveTask}>
            <Text style={styles.primaryButtonText}>{isEditing ? 'Salvar' : 'Adicionar'}</Text>
          </Pressable>

          {isEditing && (
            <Pressable style={styles.cancelButton} onPress={clearForm}>
              <Text style={styles.cancelButtonText}>Cancelar edicao</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={tasks.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Pressable style={styles.taskContent} onPress={() => handleEditTask(item)}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDate}>Toque para editar</Text>
              </Pressable>

              <Pressable style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </Pressable>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1f5f8b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    backgroundColor: '#1f5f8b',
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 28,
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#d7ebf7',
    fontSize: 15,
    marginTop: 6,
  },
  form: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#d9e1ea',
    borderBottomWidth: 1,
    padding: 18,
  },
  input: {
    backgroundColor: '#f0f4f8',
    borderColor: '#cfd9e4',
    borderRadius: 8,
    borderWidth: 1,
    color: '#152536',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#267a3e',
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#1f5f8b',
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyList: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#5d6a75',
    fontSize: 16,
  },
  taskItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e0e6ee',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 12,
  },
  taskContent: {
    flex: 1,
    paddingRight: 12,
  },
  taskTitle: {
    color: '#172536',
    fontSize: 16,
    fontWeight: '600',
  },
  taskDate: {
    color: '#6d7b88',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#b42318',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
