import { DdRum } from '@datadog/mobile-react-native';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface FetchResult {
  posts: Post[];
  metadata: {
    postCount: number;
    uniqueUsers: number;
    avgTitleLength: number;
    hasExpectedStructure: boolean;
    payloadValid: boolean;
  };
}

function validatePostStructure(post: unknown): post is Post {
  return (
    typeof post === 'object' &&
    post !== null &&
    typeof (post as Post).userId === 'number' &&
    typeof (post as Post).id === 'number' &&
    typeof (post as Post).title === 'string' &&
    typeof (post as Post).body === 'string'
  );
}

export async function fetchWithRum(): Promise<FetchResult> {
  const resourceKey = `posts-${Date.now()}`;
  const startTime = Date.now();

  await DdRum.startResource(
    resourceKey,
    'GET',
    API_URL,
    {resource_type: 'api_posts'},
    startTime,
  );

  try {
    const response = await fetch(API_URL);
    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Response is not an array');
    }

    const posts = data as Post[];
    const postCount = posts.length;
    const uniqueUsers = new Set(posts.map(p => p.userId)).size;
    const avgTitleLength =
      posts.length > 0
        ? Math.round(
            posts.reduce((sum, p) => sum + p.title.length, 0) / posts.length,
          )
        : 0;
    const hasExpectedStructure =
      posts.length > 0 && posts.every(validatePostStructure);
    const payloadValid = hasExpectedStructure && postCount > 0;

    const customAttributes = {
      post_count: postCount,
      unique_users: uniqueUsers,
      avg_title_length: avgTitleLength,
      has_expected_structure: hasExpectedStructure,
      payload_valid: payloadValid,
    };

    await DdRum.stopResource(
      resourceKey,
      response.status,
      'xhr',
      posts.length * 200, // approximate size
      customAttributes,
      startTime,
    );

    return {
      posts,
      metadata: {
        postCount,
        uniqueUsers,
        avgTitleLength,
        hasExpectedStructure,
        payloadValid,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorType = error instanceof TypeError ? 'network' : 'parse';

    await DdRum.stopResource(
      resourceKey,
      0,
      'xhr',
      0,
      {
        error_type: errorType,
        error_message: errorMessage,
      },
      startTime,
    );

    throw error;
  }
}
