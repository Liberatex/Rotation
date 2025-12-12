import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Card, FAB, Dialog, Portal, TextInput } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { createSession, joinSession, clearSession } from '../../store/slices/sessionSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { websocketClient } from '../../services/websocketClient';

export default function HomeScreen() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const dispatch = useAppDispatch();
  const { currentSession, isLoading } = useAppSelector((state) => state.session);
  const { user } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Connect WebSocket on mount
    websocketClient.connect();

    return () => {
      // Cleanup on unmount
      if (currentSession) {
        websocketClient.leaveSession(currentSession.id);
      }
    };
  }, []);

  useEffect(() => {
    if (currentSession) {
      websocketClient.joinSession(currentSession.id);
      navigation.navigate('Session', { sessionId: currentSession.id });
    }
  }, [currentSession]);

  const handleCreateSession = async () => {
    try {
      await dispatch(createSession()).unwrap();
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionCode.trim()) {
      return;
    }

    try {
      // Extract session ID from code (in real app, you'd lookup by code)
      // For now, assuming code is the session ID
      await dispatch(joinSession({ sessionId: sessionCode.trim().toUpperCase(), code: sessionCode.trim().toUpperCase() })).unwrap();
      setShowJoinDialog(false);
      setSessionCode('');
    } catch (error) {
      console.error('Failed to join session:', error);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    websocketClient.disconnect();
    dispatch(clearSession());
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => {}} />
        }
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            ROTATION
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Welcome, {user?.email || 'User'}
          </Text>
        </View>

        {currentSession ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Active Session</Text>
              <Text variant="bodyMedium" style={styles.sessionCode}>
                Code: {currentSession.code}
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Session', { sessionId: currentSession.id })}
                style={styles.cardButton}
              >
                Go to Session
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.actions}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  Create Session
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Start a new rotation session and invite friends
                </Text>
                <Button
                  mode="contained"
                  onPress={() => setShowCreateDialog(true)}
                  style={styles.cardButton}
                >
                  Create
                </Button>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  Join Session
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Enter a session code to join
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowJoinDialog(true)}
                  style={styles.cardButton}
                >
                  Join
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        <Button
          mode="text"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </ScrollView>

      {/* Create Session Dialog */}
      <Portal>
        <Dialog visible={showCreateDialog} onDismiss={() => setShowCreateDialog(false)}>
          <Dialog.Title>Create Session</Dialog.Title>
          <Dialog.Content>
            <Text>Create a new rotation session?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onPress={handleCreateSession} loading={isLoading}>
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Join Session Dialog */}
      <Portal>
        <Dialog visible={showJoinDialog} onDismiss={() => setShowJoinDialog(false)}>
          <Dialog.Title>Join Session</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Session Code"
              value={sessionCode}
              onChangeText={setSessionCode}
              mode="outlined"
              autoCapitalize="characters"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowJoinDialog(false)}>Cancel</Button>
            <Button onPress={handleJoinSession} loading={isLoading} disabled={!sessionCode.trim()}>
              Join
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#FFFFFF',
  },
  actions: {
    gap: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#CCCCCC',
    marginBottom: 16,
  },
  cardButton: {
    marginTop: 8,
  },
  sessionCode: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 32,
  },
  dialogInput: {
    backgroundColor: '#1E1E1E',
  },
});

