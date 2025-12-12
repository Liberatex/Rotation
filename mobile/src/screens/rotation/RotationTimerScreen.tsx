import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button, Card, Avatar, ProgressBar } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchRotation, passTurn, pauseRotation, resumeRotation, updateTimer } from '../../store/slices/rotationSlice';
import { useRoute, useNavigation } from '@react-navigation/native';
import { websocketClient } from '../../services/websocketClient';

export default function RotationTimerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { rotationId, sessionId } = route.params;
  const dispatch = useAppDispatch();
  const { currentRotation, timerRemaining, isTimerRunning, turns } = useAppSelector((state) => state.rotation);
  const { user } = useAppSelector((state) => state.auth);
  const participants = useAppSelector((state) => state.session.participants);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadRotation();
    websocketClient.joinSession(sessionId);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [rotationId]);

  useEffect(() => {
    if (currentRotation && currentRotation.status === 'active' && isTimerRunning) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [currentRotation, isTimerRunning]);

  const loadRotation = async () => {
    await dispatch(fetchRotation(rotationId));
  };

  const startTimer = () => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      if (currentRotation && currentRotation.currentTurnStartedAt) {
        const startedAt = new Date(currentRotation.currentTurnStartedAt).getTime();
        const now = Date.now();
        const elapsed = now - startedAt;
        const remaining = Math.max(0, currentRotation.timerDuration * 1000 - elapsed);
        
        dispatch(updateTimer(remaining));

        // Alert at 80% and 100%
        const progress = elapsed / (currentRotation.timerDuration * 1000);
        if (progress >= 0.8 && progress < 0.81) {
          triggerAlert('80%');
        }
        if (progress >= 1.0) {
          triggerAlert('100%');
        }

        if (remaining <= 0) {
          stopTimer();
        }
      }
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const triggerAlert = (type: string) => {
    // Animate pulse
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Play sound (implement sound service)
    // soundService.playAlert(type);
  };

  const handlePass = async () => {
    try {
      await dispatch(passTurn(rotationId)).unwrap();
    } catch (error) {
      console.error('Failed to pass turn:', error);
    }
  };

  const handlePause = async () => {
    try {
      await dispatch(pauseRotation(rotationId)).unwrap();
    } catch (error) {
      console.error('Failed to pause rotation:', error);
    }
  };

  const handleResume = async () => {
    try {
      await dispatch(resumeRotation(rotationId)).unwrap();
    } catch (error) {
      console.error('Failed to resume rotation:', error);
    }
  };

  if (!currentRotation) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const currentTurnUser = participants.find((p) => p.userId === currentRotation.currentTurnUserId);
  const isMyTurn = currentRotation.currentTurnUserId === user?.id;
  const progress = timerRemaining
    ? 1 - timerRemaining / (currentRotation.timerDuration * 1000)
    : 0;
  const secondsRemaining = timerRemaining ? Math.ceil(timerRemaining / 1000) : 0;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Card style={[styles.timerCard, isMyTurn && styles.myTurnCard]}>
          <Card.Content style={styles.timerContent}>
            <Text variant="headlineSmall" style={styles.turnLabel}>
              {isMyTurn ? 'Your Turn!' : 'Current Turn'}
            </Text>

            <Animated.View style={[styles.timerCircle, { transform: [{ scale: scaleAnim }] }]}>
              <Text variant="displayLarge" style={styles.timerText}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </Text>
            </Animated.View>

            <View style={styles.userInfo}>
              <Avatar.Text
                size={60}
                label={currentTurnUser?.displayName?.charAt(0).toUpperCase() || 'U'}
                style={styles.avatar}
              />
              <Text variant="titleLarge" style={styles.userName}>
                {currentTurnUser?.displayName || 'User'}
              </Text>
            </View>

            <ProgressBar
              progress={progress}
              color={progress >= 0.8 ? '#F44336' : '#4CAF50'}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        {isMyTurn && (
          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={handlePass}
              style={styles.passButton}
              icon="hand-wave"
              buttonColor="#4CAF50"
            >
              Pass
            </Button>
          </View>
        )}

        {currentRotation.status === 'active' && (
          <Button
            mode="outlined"
            onPress={isTimerRunning ? handlePause : handleResume}
            style={styles.pauseButton}
            icon={isTimerRunning ? 'pause' : 'play'}
          >
            {isTimerRunning ? 'Pause' : 'Resume'}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  timerCard: {
    backgroundColor: '#1E1E1E',
    marginBottom: 24,
  },
  myTurnCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  timerContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  turnLabel: {
    color: '#FFFFFF',
    marginBottom: 24,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1E1E1E',
    borderWidth: 4,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#4CAF50',
    marginBottom: 8,
  },
  userName: {
    color: '#FFFFFF',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  actions: {
    marginBottom: 16,
  },
  passButton: {
    paddingVertical: 8,
  },
  pauseButton: {
    marginTop: 8,
  },
});

