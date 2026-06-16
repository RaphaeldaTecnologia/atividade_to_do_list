import { StatusBar } from 'expo-status-bar';
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
import {
  addTask,
  deleteTask,
  initializeDatabase,
  listTasks,
  updateTask,
} from './database';
import type { Task } from './database';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    initializeDatabase();
    loadTasks();
  }, []);

  function loadTasks() {
    setTasks(listTasks());
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
      updateTask(editingTaskId, title);
    } else {
      addTask(title);
    }

    clearForm();
    loadTasks();
  }

  function handleEditTask(task: Task) {
    setTaskText(task.title);
    setEditingTaskId(task.id);
  }

  function handleDeleteTask(id: number) {
    deleteTask(id);

    if (editingTaskId === id) {
      clearForm();
    }

    loadTasks();
  }

  const isEditing = editingTaskId !== null;
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchText.trim().toLowerCase())
  );

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

        <View style={styles.searchArea}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Filtrar tarefas"
            placeholderTextColor="#7d8b99"
            style={styles.input}
          />
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={filteredTasks.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {tasks.length === 0 ? 'Nenhuma tarefa cadastrada.' : 'Nenhuma tarefa encontrada.'}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDate}>Criada em ordem de cadastro</Text>
              </View>

              <View style={styles.taskActions}>
                <Pressable style={styles.editButton} onPress={() => handleEditTask(item)}>
                  <Text style={styles.actionButtonText}>Editar</Text>
                </Pressable>

                <Pressable style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
                  <Text style={styles.actionButtonText}>Excluir</Text>
                </Pressable>
              </View>
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
  searchArea: {
    backgroundColor: '#eef3f8',
    borderBottomColor: '#d9e1ea',
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
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
  taskActions: {
    flexDirection: 'row',
    gap: 8,
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
  editButton: {
    backgroundColor: '#1f5f8b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  deleteButton: {
    backgroundColor: '#b42318',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
