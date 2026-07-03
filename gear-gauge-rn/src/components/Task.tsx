
import { StyleSheet, TextInput, View } from 'react-native';

type TaskProps = {
  title: string;
  id: string;
  state: 'TASK_INBOX' | 'TASK_PINNED' | 'TASK_ARCHIVED';
  onArchiveTask: () => void;
  onPinTask: () => void;

};


const Task = ({ title, id, state, onArchiveTask, onPinTask }: TaskProps) => {
  return (
    <View style={styles.listItem} key={id}>
      <TextInput value={title} editable={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Task;   