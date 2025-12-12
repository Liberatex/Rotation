import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Button, Card, Avatar, Chip, FAB } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchSession, fetchParticipants, leaveSession, createRotation } from '../../store/slices/sessionSlice';
import { useRoute, useNavigation } from '@react-navigation/native';
import { websocketClient } from '../../services/websocketClient';

export default function SessionScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { sessionId } = route.params;
  const dispatch = useAppDispatch();
  const { currentSession, participants, isLoading } = useAppSelector((state) => state.session);
  const { user } = useAppSelector((state) => state.auth);
  const [showRotationDialog, setShowRotationDialog] = useState(false);

  useEffect(() => {
    loadSession();
    websocketClient.joinSession(sessionId);

    return () => {
      websocketClient.leaveSession(sessionId);
    };
  }, [sessionId]);

  const loadSession = async () => {
    await dispatch(fetchSession(sessionId));
    await dispatch(fetchParticipants(sessionId));
  };

  const handleLeave = async () => {
    await dispatch(leaveSession(sessionId));
    navigation.goBack();
  };

  const handleCreateRotation = async () => {
    try {
      const rotation = await dispatch(createRotation({ sessionId })).unwrap();
      navigation.navigate('Rotation', { rotationId: rotation.id, sessionId });
    } catch (error) {
      console.error('Failed to create rotation:', error);
    }
  };

  const isMBA = currentSession?.masterBluntAgentId === user?.id;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Session {currentSession?.code}
          </Text>
          <Chip
            icon={isMBA ? 'crown' : 'account'}
            style={styles.chip}
          >
            {isMBA ? 'Master Blunt Agent' : 'Participant'}
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Participants ({participants.length})
            </Text>
            <FlatList
              data={participants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.participant}>
                  <Avatar.Text
                    size={40}
                    label={item.displayName?.charAt(0).toUpperCase() || 'U'}
                    style={styles.avatar}
                  />
                  <View style={styles.participantInfo}>
                    <Text variant="bodyLarge" style={styles.participantName}>
                      {item.displayName || 'User'}
                    </Text>
                    {item.userId === currentSession?.masterBluntAgentId && (
                      <Text variant="bodySmall" style={styles.mbaLabel}>
                        MBA
                      </Text>
                    )}
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          </Card.Content>
        </Card>

        {isMBA && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Session Controls
              </Text>
              <Button
                mode="contained"
                onPress={handleCreateRotation}
                style={styles.button}
                icon="play-circle"
              >
                Start Rotation
              </Button>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="outlined"
          onPress={handleLeave}
          style={styles.leaveButton}
          textColor="#F44336"
        >
          Leave Session
        </Button>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowRotationDialog(true)}
        label="New Rotation"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#1E1E1E',
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginBottom: 16,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    color: '#FFFFFF',
  },
  mbaLabel: {
    color: '#FF9800',
  },
  button: {
    marginTop: 8,
  },
  leaveButton: {
    marginTop: 32,
    borderColor: '#F44336',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
});

