import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/presentations',
  'https://www.googleapis.com/auth/presentations.readonly',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/chat.memberships',
  'https://www.googleapis.com/auth/chat.memberships.readonly',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Auth state listener with in-memory token cache
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google to obtain Workspace access token
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Workspace sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

/* =========================================================================
   1. GOOGLE DOCS API: Export lesson / essay / study notes into a real Doc
   ========================================================================= */
export async function createGoogleDoc(
  title: string,
  content: string
): Promise<{ docId: string; url: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  // Step 1: Create empty document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[Sir Lax] ${title}`,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err?.error?.message || 'Failed to create Google Doc');
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // Step 2: Insert text content
  const fullText = `${title}\n\nChat Sir Lax Study Notes • "Education is the key for change!" 🇵🇭\n\n${content}\n\nCreated: ${new Date().toLocaleDateString()}`;

  await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: fullText,
          },
        },
      ],
    }),
  });

  return {
    docId: documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

/* =========================================================================
   2. GOOGLE SHEETS API: Student 3-Envelope Budget or Food Ledger
   ========================================================================= */
export async function createGoogleSheet(
  title: string,
  rows: (string | number)[][]
): Promise<{ sheetId: string; url: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title: `[Sir Lax] ${title}` },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err?.error?.message || 'Failed to create Google Sheet');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  if (rows && rows.length > 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: rows,
        }),
      }
    );
  }

  return {
    sheetId: spreadsheetId,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/* =========================================================================
   3. GOOGLE TASKS API: Study goals, exam reviews, Dola AI checklists
   ========================================================================= */
export async function createGoogleTask(
  title: string,
  notes?: string,
  dueIsoDate?: string
): Promise<{ taskId: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[Sir Lax] ${title}`,
      notes: notes || 'Created from Chat Sir Lax Study Planner',
      due: dueIsoDate || new Date(Date.now() + 86400000 * 2).toISOString(),
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Failed to create Google Task');
  }

  const data = await res.json();
  return { taskId: data.id };
}

/* =========================================================================
   4. GOOGLE DRIVE API: Save study file directly or list student drive files
   ========================================================================= */
export async function saveTextFileToDrive(
  fileName: string,
  content: string
): Promise<{ fileId: string; webViewLink?: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  const metadata = {
    name: `[Sir Lax] ${fileName}.txt`,
    mimeType: 'text/plain',
    description: 'Saved study notes from Chat Sir Lax educational platform',
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', new Blob([content], { type: 'text/plain' }));

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Failed to save file to Google Drive');
  }

  const data = await res.json();
  return {
    fileId: data.id,
    webViewLink: data.webViewLink,
  };
}

/* =========================================================================
   5. GMAIL API: Send email or draft study report
   ========================================================================= */
export async function sendEmailViaGmail(
  toEmail: string,
  subject: string,
  bodyText: string
): Promise<{ messageId: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  const emailLines = [
    `To: ${toEmail}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: [Sir Lax Education] ${subject}`,
    '',
    bodyText,
    '',
    '---',
    'Sent via Chat Sir Lax - "EDUCATION IS THE KEY FOR CHANGE!" 🇵🇭',
  ];

  const rawMessage = emailLines.join('\r\n');
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Failed to send email via Gmail');
  }

  const data = await res.json();
  return { messageId: data.id };
}

/* =========================================================================
   6. GOOGLE SLIDES API: Create study presentation deck
   ========================================================================= */
export async function createGoogleSlideDeck(
  title: string
): Promise<{ presentationId: string; url: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  const res = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[Sir Lax] ${title}`,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Failed to create Google Slides deck');
  }

  const data = await res.json();
  return {
    presentationId: data.presentationId,
    url: `https://docs.google.com/presentation/d/${data.presentationId}/edit`,
  };
}

/* =========================================================================
   7. GOOGLE FORMS API: Create a student study quiz form
   ========================================================================= */
export async function createGoogleQuizForm(
  title: string
): Promise<{ formId: string; responderUri: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  const res = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: `[Sir Lax Quiz] ${title}`,
        documentTitle: `[Sir Lax Quiz] ${title}`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Failed to create Google Form');
  }

  const data = await res.json();
  return {
    formId: data.formId,
    responderUri: data.responderUri || `https://docs.google.com/forms/d/${data.formId}/viewform`,
  };
}

/* =========================================================================
   8. GOOGLE CHAT API: Send learning message to student space
   ========================================================================= */
export async function listGoogleChatSpaces(): Promise<{ spaces: any[] }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in with Google Workspace');

  const res = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return { spaces: [] };
  }

  const data = await res.json();
  return { spaces: data.spaces || [] };
}
