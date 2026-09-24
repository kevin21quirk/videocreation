const DID_API_URL = "https://api.d-id.com";

interface CreateTalkOptions {
  script: string;
  sourceUrl?: string;
  avatarUrl?: string;
}

interface TalkResponse {
  id: string;
  status: string;
  result_url?: string;
}

export async function createTalk({
  script,
  sourceUrl,
  avatarUrl,
}: CreateTalkOptions): Promise<TalkResponse> {
  const headers = {
    Authorization: `Basic ${process.env.DID_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Default avatar presenter if none provided
  const presenter = sourceUrl ||
    avatarUrl || {
      type: "talk",
      source_url:
        "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg",
    };

  const body = {
    source_url:
      typeof presenter === "string"
        ? presenter
        : "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg",
    script: {
      type: "text",
      subtitles: false,
      provider: {
        type: "microsoft",
        voice_id: "en-US-JennyNeural",
      },
      input: script,
    },
    config: {
      fluent: true,
      pad_audio: 0,
    },
  };

  const response = await fetch(`${DID_API_URL}/talks`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `D-ID API error: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  return response.json();
}

export async function getTalkStatus(talkId: string): Promise<TalkResponse> {
  const response = await fetch(`${DID_API_URL}/talks/${talkId}`, {
    headers: {
      Authorization: `Basic ${process.env.DID_API_KEY}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`D-ID API error: ${response.status}`);
  }

  return response.json();
}
