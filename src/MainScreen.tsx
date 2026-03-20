import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {fetchWithRum, FetchResult} from './fetchWithRum';

const DATADOG_PURPLE = '#632CA6';

export default function MainScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FetchResult | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await fetchWithRum();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datadog RUM Payload Inspection</Text>

      <Pressable
        style={({pressed}) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleFetch}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.buttonText}>FETCH</Text>
        )}
      </Pressable>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {result && (
        <>
          <View style={styles.metadataBox}>
            <Text style={styles.metadataTitle}>Sent to Datadog:</Text>
            <Text style={styles.metadataItem}>
              @context.post_count: {result.metadata.postCount}
            </Text>
            <Text style={styles.metadataItem}>
              @context.unique_users: {result.metadata.uniqueUsers}
            </Text>
            <Text style={styles.metadataItem}>
              @context.avg_title_length: {result.metadata.avgTitleLength}
            </Text>
            <Text style={styles.metadataItem}>
              @context.has_expected_structure:{' '}
              {String(result.metadata.hasExpectedStructure)}
            </Text>
            <Text style={styles.metadataItem}>
              @context.payload_valid: {String(result.metadata.payloadValid)}
            </Text>
          </View>

          <Text style={styles.postsTitle}>
            First 5 posts ({result.metadata.postCount} total):
          </Text>
          <FlatList
            data={result.posts.slice(0, 5)}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <View style={styles.postCard}>
                <Text style={styles.postTitle}>
                  #{item.id} — {item.title}
                </Text>
                <Text style={styles.postBody} numberOfLines={2}>
                  {item.body}
                </Text>
                <Text style={styles.postUser}>User {item.userId}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  button: {
    backgroundColor: DATADOG_PURPLE,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 70,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  errorBox: {
    backgroundColor: '#fee',
    borderColor: '#f66',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
  },
  metadataBox: {
    backgroundColor: '#e8e0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metadataTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: DATADOG_PURPLE,
  },
  metadataItem: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#444',
    marginBottom: 2,
  },
  postsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: DATADOG_PURPLE,
  },
  postTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  postBody: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  postUser: {
    fontSize: 11,
    color: '#999',
  },
});
